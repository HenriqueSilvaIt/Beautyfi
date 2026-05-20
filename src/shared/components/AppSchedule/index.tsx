import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AvailableAppointmentsHttpResponse,
  AvailableAppointmentsProps,
  EmployeeOption,
} from "../../interfaces/http/available-appointments";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../styles/colors";
import {
  AppointmentHttpParams,
  AppointmentHttpResponse,
} from "../../interfaces/http/appointment";
import { AppDaySelector } from "../AppDaySelector";
import { AppEmployeeSelector } from "../AppEmployeeSelector";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { AppEmptyList } from "../AppEmptyList";
import { useRef } from "react";

interface AppScheduleProps {
  data: AvailableAppointmentsProps[];
  setDateScheduled: React.Dispatch<React.SetStateAction<string>>;
  setDataBody: React.Dispatch<React.SetStateAction<AppointmentHttpParams>>;
  setEmployeeId: React.Dispatch<
    React.SetStateAction<number | null | undefined>
  >;
  employeeId?: number | null;
  dateScheduled: string;
  dataBody: AppointmentHttpParams;
  createBooking: (
    dataBody: AppointmentHttpParams,
    finalDate: string,
  ) => Promise<void>;
  handleDateSelect: (date: Date) => void;
  currentDate: Date;
  selectedDay: Date | null;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  employeesWithNoPreference: EmployeeOption[];
  employeeIsSelected: boolean | undefined;
  setSelectedDay: (date: Date) => void;
  handleEmployeeSelect: (employeeId?: null | number) => void;
  handleHourSelect: (hourDay: string) => void;
  loadingMore?: boolean;
  initialized?: boolean;
  allEmployeeIsLoading: boolean;
  hoursForEmployee: AvailableAppointmentsProps[];
  createIsLoading?: boolean;
  isHoursLoading?: boolean;
  appointmentRefetch?: (
    options?: RefetchOptions | undefined,
  ) => Promise<
    QueryObserverResult<
      InfiniteData<AvailableAppointmentsHttpResponse, unknown>,
      Error
    >
  >;
  appointmentData:
    | InfiniteData<AvailableAppointmentsHttpResponse, unknown>
    | undefined;
  appointmentHasNextPage?: boolean;
  appointmentIsFetchingNextPage?: boolean;
  appointmentIsLoading?: boolean;
  appointmentIsRefetching: boolean;
  appointmentFetchNextPage?: (
    Options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<AvailableAppointmentsHttpResponse, unknown>,
      Error
    >
  >;
}

export function AppSchedule({
  employeeId,
  employeesWithNoPreference,
  employeeIsSelected,
  handleEmployeeSelect,
  handleHourSelect,
  hoursForEmployee,
  isHoursLoading,
  allEmployeeIsLoading,
  handleDateSelect,
  selectedDay,
  currentDate,
  appointmentHasNextPage,
  appointmentIsFetchingNextPage,
  appointmentIsRefetching,
  appointmentIsLoading,
  createIsLoading,
  appointmentFetchNextPage,
  setCurrentDate,
}: AppScheduleProps) {
  if (appointmentIsLoading || appointmentIsRefetching) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  const handleLoadMore = () => {
    if (appointmentHasNextPage && !appointmentIsFetchingNextPage) {
      appointmentFetchNextPage?.();
    }
  };
  return (
    <View className="flex-1  my-2 p-2">
      <AppDaySelector
        selectedDay={selectedDay}
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        handleDateSelect={handleDateSelect}
      />

      <View className="mt-10 border-b border-gray-300 mb-4 pb-5">
        <Text className="text-font-primary text-center font-bold text-xl mb-4">
          Escolha o Profissional
        </Text>

        <AppEmployeeSelector
          employeeId={employeeId}
          handleEmployeeSelect={handleEmployeeSelect}
          employeeIsSelected={employeeIsSelected}
          employees={employeesWithNoPreference}
          onRefetch={appointmentFetchNextPage}
          hasNextPage={appointmentHasNextPage}
          isFetchingNextPage={appointmentIsFetchingNextPage}
          isLoading={appointmentIsLoading}
          isRefetching={appointmentIsRefetching}
          fetchNextPage={appointmentFetchNextPage}
        />
      </View>

      {employeeIsSelected && !allEmployeeIsLoading ? (
        <View className="flex-1">
          <FlatList
            data={hoursForEmployee}
            nestedScrollEnabled
            numColumns={3}
            contentContainerStyle={{ paddingBottom: 80 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListHeaderComponent={
              <Text className="text-font-primary text-center font-bold text-xl mb-4">
                Horários disponíveis
              </Text>
            }
            ListFooterComponent={() => {
              if (appointmentIsFetchingNextPage) {
                return (
                  <ActivityIndicator
                    size="small"
                    color={colors.white}
                    style={{ marginTop: 16 }}
                  />
                );
              }

              if (appointmentHasNextPage && hoursForEmployee.length > 0) {
                return (
                  <TouchableOpacity
                    onPress={() => appointmentFetchNextPage?.()}
                    className="items-center justify-center mt-4 py-2 bg-app-theme-primary rounded-md"
                  >
                    <Text className="text-font-primary text-sm">Carregar mais</Text>
                  </TouchableOpacity>
                );
              }

              return null;
            }}
            ListEmptyComponent={
              <AppEmptyList
                name="agendamento"
                iconName="cut-outline"
                title="Nenhum horário disponível"
                description=" Não há nenhum horário disponível na agenda deste profissional
                  neste dia. Tente escolher outra data ou entre na lista de
                  espera"
              />
            }
            renderItem={({ item }) => (
              <View className="w-1/3 my-3 items-center">
                <TouchableOpacity
                  onPress={() =>
                    handleHourSelect(format(item.dateBooking, "HH:mm"))
                  }
                >
                  <View className="h-[44px] w-[90px] items-center justify-center rounded-md border border-app-theme-primary">
                    <Text className="text-font-primary text-base font-semibold">
                      {format(item.dateBooking, "HH:mm", { locale: ptBR })}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ) : (
        employeeIsSelected === false &&
        !isHoursLoading && (
          <View className="flex-row items-center px-6 gap-2 bg-background-tertiary rounded-md h-[80px]">
            <Ionicons name="time-outline" color={colors.white} size={20} />
            <Text className="text-gray-600 text-sm flex-1">
              Escolha um profissional para buscar os horários disponíveis.
            </Text>
          </View>
        )
      )}
    </View>
  );
}

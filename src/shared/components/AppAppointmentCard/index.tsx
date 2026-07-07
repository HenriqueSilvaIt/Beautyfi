import {
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  AppointmentHttpResponse,
  AppointmentHttpStatusParams,
  AppointmentProps,
  AppointmentStatus,
} from "../../interfaces/http/appointment";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../styles/colors";
import { useFormatDate } from "../../hooks/useFormatDate";
import { DeleteModal } from "../AppDeleteModal";

import { AppEmptyList } from "../AppEmptyList";
import clsx from "clsx";
import { useCallback, useRef, useState } from "react";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
interface AppointmentCardProps {
  data: AppointmentProps[];
  modalVisible?: boolean;
  iconRight?: boolean;
  isDeleteLoading?: boolean;
  showModal?: (id: number) => void;
  hideModal?: () => void;
  appointmentRefetch?: (
    options?: RefetchOptions | undefined,
  ) => Promise<
    QueryObserverResult<InfiniteData<AppointmentHttpResponse, unknown>, Error>
  >;
  appointmentHasNextPage?: boolean;
  appointmentIsFetchingNextPage?: boolean;
  appointmentIsLoading?: boolean;
  appointmentIsRefetching: boolean;
  handleDeleteAppointment?: (data: AppointmentProps[]) => Promise<void>;
  appointmentFetchNextPage?: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<AppointmentHttpResponse, unknown>,
      Error
    >
  >;
}

export function AppAppointmentCard({
  data,
  iconRight,
  showModal,
  modalVisible,
  hideModal,
  isDeleteLoading,
  appointmentRefetch,
  appointmentHasNextPage,
  appointmentIsFetchingNextPage,
  appointmentIsLoading,
  appointmentIsRefetching,
  appointmentFetchNextPage,
  handleDeleteAppointment,
}: AppointmentCardProps) {
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentProps | null>(null);

  const handleShowModal = (appointment: AppointmentProps) => {
    setSelectedAppointment(appointment);
    showModal?.(appointment.id); // só abre o modal
  };
  const { formatMonthUpper, formatWeekDay } = useFormatDate();

  const dataBody: AppointmentHttpStatusParams = {
    status: AppointmentStatus.CANCELED,
  };

  const statusLabelMap = {
    pt: {
      [AppointmentStatus.CONFIRMED]: "Confirmado",
      [AppointmentStatus.CANCELED]: "Cancelado",
      [AppointmentStatus.AVAILABLE]: "Disponível",
      [AppointmentStatus.SCHEDULED]: "Agendado",
    },
  } as const;

  const statusColorMap: Record<AppointmentStatus, string> = {
    [AppointmentStatus.CONFIRMED]: "bg-accent-blue-dark",
    [AppointmentStatus.CANCELED]: "bg-accent-red",
    [AppointmentStatus.SCHEDULED]: "bg-green-600",
    [AppointmentStatus.AVAILABLE]: "bg-accent-green",
  };

  return (
    <>
      <FlatList
        style={{ flex: 1 }}
        data={data}
        keyExtractor={(item) => `appointment-${item.id}`}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (appointmentHasNextPage && !appointmentIsFetchingNextPage) {
            appointmentFetchNextPage?.();
          }
        }}
        onEndReachedThreshold={0.3}
        initialNumToRender={5} // ajuda na performance
        maxToRenderPerBatch={10} // controla quantos elementos renderizar por vez
        contentContainerStyle={{
          paddingVertical: 16,
          flexGrow: data.length === 0 ? 1 : 0,
          paddingBottom: 24,
        }}
        refreshControl={
          <RefreshControl
            refreshing={appointmentIsRefetching}
            onRefresh={appointmentRefetch}
          />
        }
        ListEmptyComponent={
          appointmentIsLoading ? null : (
            <AppEmptyList
              name="agendamento"
              iconName="cut-outline"
              title="Sem agendamentos"
              description="Não há nenhum agendamento marcado"
            />
          )
        }
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => {
          const employees = item.employee
            ? Array.isArray(item.employee)
              ? item.employee
              : [item.employee]
            : [];

          return (
            <View className="px-3 mt-3">
              <View className="bg-background-quartenary rounded-xl flex-row p-3">
                {/* ================= LEFT ================= */}
                <View className="flex-1 pr-3">
                  {item.services?.map((service) => (
                    <View
                      key={service.service.id}
                      className="flex-row items-center mb-2"
                    >
                      {service.service.imgUrl ? (
                        <Image
                          source={{ uri: service.service.imgUrl }}
                          className="w-[64px] h-[64px] rounded-full mr-3"
                        />
                      ) : (
                        <Image
                          source={require("@assets/images/logo.png")}
                          className="w-[64px] h-[64px] rounded-full mr-3"
                        />
                      )}
                      <View className="flex-1">
                        <Text
                          className="text-font-primary text-base font-semibold"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {service.service.name}
                        </Text>

                        <Text className="text-gray-600 text-sm">
                          {service.service.duration} min
                        </Text>

                        <Text className="text-app-theme-primary font-bold text-base">
                          R$ {service.service.price.toFixed(2)}
                        </Text>
                        {employees.map((employee) => (
                          <Text
                            key={employee.id}
                            className="text-gray-500 text-xs"
                            numberOfLines={1}
                          >
                            Profissional: {employee.name}
                          </Text>
                        ))}

                        <View
                          className={clsx(
                            "mt-2 w-[120px] h-[30px] rounded-2xl flex items-center justify-center",
                            statusColorMap[item.status],
                          )}
                        >
                          <Text className="text-font-primary ">
                            {statusLabelMap.pt[item.status]}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>

                {/* ================= RIGHT ================= */}
                <View
                  className={`border-l border-gray-700 pl-3 w-[96px] items-center justify-between`}
                >
                  <View className="items-center">
                    <Text className="text-font-primary text-xs">
                      {formatWeekDay(item.dateScheduled)}
                    </Text>

                    <Text className="text-font-primary text-lg font-bold">
                      {format(item.dateScheduled, "HH:mm", { locale: ptBR })}
                    </Text>

                    <Text className="text-font-primary text-xs">
                      {format(item.dateScheduled, "dd")} |{" "}
                      {formatMonthUpper(item.dateScheduled)}
                    </Text>
                  </View>
                  {iconRight && (
                    <TouchableOpacity
                      onPress={() => handleShowModal(item)}
                      className="bg-background-primary w-[36px] h-[36px] rounded-md items-center justify-center mt-2"
                    >
                      <Ionicons
                        name="trash"
                        size={20}
                        color={colors["accent-red"]}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        }}
      />

     {modalVisible && (
        <DeleteModal
          loading={isDeleteLoading}
          visible={modalVisible}
          confirmationButtonText="Sim, cancelar"
          cancelbuttonText="Não"
          hideModal={hideModal}
          handleDeleteAppointments={handleDeleteAppointment}
          description="Tem certeza que deseja cancelar este agendamento?"
          title="Cancelar o agendamento?"
          appointments={selectedAppointment ? [selectedAppointment] : []}
        />
      )}
    </>
  );
}

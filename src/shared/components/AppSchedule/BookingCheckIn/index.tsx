import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AvailableAppointmentsProps,
  EmployeeOption,
} from "../../../interfaces/http/available-appointments";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../styles/colors";
import { useFormatDate } from "../../../hooks/useFormatDate";
import { AppointmentHttpParams } from "../../../interfaces/http/appointment";
import { WtSendMensageHttpParams } from "@/shared/interfaces/http/whatsapp";
import { CompanyServicesProps } from "@/shared/interfaces/http/company-services";
import {
  ESubscriptionState,
  PaymentIntentParam,
  UserSubscriptionDTO,
} from "@/shared/interfaces/http/stripe";
import React from "react";

interface BookingCheckingProps {
  hoursForEmployee: AvailableAppointmentsProps[];
  employeesWithNoPreference: EmployeeOption[];
  resolvedEmployeeId?: number | string;
  closeBottomSheet: () => void;
  dataBody: AppointmentHttpParams;
  mySubscription: UserSubscriptionDTO | null | undefined;
  createBooking: (
    dataBody: AppointmentHttpParams,
    finalDate: string,
  ) => Promise<void>;
  serviceId: number | undefined;
  finalDate: string;
  confirmationMessage: WtSendMensageHttpParams;
  sendConfirmationMessage: (data: WtSendMensageHttpParams) => Promise<void>;
  isLoadingMessage?: boolean;
  serviceCheckIn: CompanyServicesProps[];
  handlePaymentIntent: (dataBody: PaymentIntentParam) => Promise<void>;
  createIsLoading?: boolean;
  availableAppointments: AvailableAppointmentsProps[];
}

export function BookingCheckIn({
  hoursForEmployee,
  availableAppointments,
  employeesWithNoPreference,
  resolvedEmployeeId,
  closeBottomSheet,
  dataBody,
  finalDate,
  createBooking,
  isLoadingMessage,
  createIsLoading,
  mySubscription,
  serviceCheckIn,
}: BookingCheckingProps) {
  const dateWeek = format(new Date(), "EE, d", { locale: ptBR });

  const hasSubscriptionCredits =
    mySubscription?.status === ESubscriptionState.ACTIVE &&
    Number(mySubscription?.cutsUsed) < Number(mySubscription?.cutsAllowed);
  const newDateWeek = dateWeek.charAt(0).toUpperCase() + dateWeek.slice(1);

  const bookingCheckIn = Array.from(
    new Map(
      hoursForEmployee
        .flatMap((item) => item.dateBooking)
        .map((e) => [e.toISOString, e]),
    ).values(),
  );

  const { formatDay, formatMonthUpper } = useFormatDate();

  const employeeCheckIn = employeesWithNoPreference.filter(
    (x) => x.id === resolvedEmployeeId,
  );

  return (
    <View className="flex-1 px-5">
      {serviceCheckIn.map((data) => (
        <View key={data.id} className=" ">
          <View className="flex-row justify-between border-b border-gray-300 pb-5 ">
            <View className="flex-row ">
              <Image
                source={{ uri: data.imgUrl }}
                resizeMode="cover"
                className="w-[60px] h-[60px] rounded-full mr-5"
              />

              <View className="max-w-[100%]">
                <Text
                  className="text-font-primary text-xl font-bold"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{ flexShrink: 1 }}
                >
                  {data.name}
                </Text>
                <Text className=" mt-1 text-sm text-gray-600">
                  {" "}
                  {newDateWeek} de {format(new Date(), "MMM", { locale: ptBR })}{" "}
                  {format(new Date(), "yyyy", { locale: ptBR })}
                </Text>
              </View>
            </View>
            <View>
              <TouchableOpacity onPress={() => closeBottomSheet()}>
                <Ionicons name="close" size={26} colors={colors.gray[400]} />
              </TouchableOpacity>
            </View>
          </View>

          <View className="flex-row gap-8 items-center mt-8  bg-background-tertiary border-gray-600  max-h-[100%]  rounded-md p-5">
           {data.imgUrl ? ( 
            <Image
              className="rounded-full h-[100px] w-[100px] border-2 border-gray-800"
              source={{ uri: data.imgUrl }}
              resizeMode="cover"
            />
           ) : (
            <Image
              className="rounded-full h-[100px] w-[100px] border-2 border-gray-800"
              source={require("@assets/images/logo.png")}
              resizeMode="cover"
            />
            )}
            <View className="mr-4">
              <View>
                <Text
                  className="text-font-primary text-base font-bold"
                  numberOfLines={2}
                  ellipsizeMode="clip"
                >
                  {data.name}
                </Text>
                {employeeCheckIn.map((employee) => (
                  <>
                    <Text className="text-gray-600 text-sm ">
                      Duração: {employee.duration} min
                    </Text>

                    {employee.price && (
                      <Text className="text-app-theme-primary  font-bold text-xl">
                        R${" "}
                        {hasSubscriptionCredits
                          ? "0,00"
                          : employee.price.toFixed(2)}
                      </Text>
                    )}
                    <Text key={employee.id} className="text-gray-600  text-sm">
                      Profissional: {employee.name}
                    </Text>
                  </>
                ))}
              </View>
              <View className="items-center justify-center w-[100px] border-l border-gray-200 ml-4">
                {bookingCheckIn.map((booking, index) => (
                  <React.Fragment key={index}>
                    <Text
                      className="text-font-primary font-bold text-center"
                      adjustsFontSizeToFit
                      numberOfLines={1}
                      style={{ fontSize: 18 }}
                    >
                      {formatDay(booking)} | {formatMonthUpper(booking)}
                    </Text>
                  </React.Fragment>
                ))}
                <Text
                  className="text-gray-600 text-center"
                  adjustsFontSizeToFit
                  numberOfLines={1}
                  style={{ fontSize: 16 }}
                >
                  {format(finalDate, "HH:mm", { locale: ptBR })}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-8">
            <TouchableOpacity
              onPress={() => createBooking(dataBody, finalDate)}
              className={`h-[60px] bg-app-theme-primary rounded-md items-center justify-center 
                ${isLoadingMessage ? "justify-between" : ""}`}
            >
              <Text className="text-center text-base text-font-primary font-bold">
                {isLoadingMessage || createIsLoading ? (
                  <ActivityIndicator />
                ) : (
                  "Confirmar agendamento"
                )}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  );
}

import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
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
  PaymentIntentDTO,
  PaymentIntentParam,
  UserSubscriptionDTO,
} from "@/shared/interfaces/http/stripe";
import React, { useState } from "react";

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
  handlePaymentIntent: (dataBody: PaymentIntentParam) => Promise<PaymentIntentDTO | void>;
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
  handlePaymentIntent,
}: BookingCheckingProps) {
  const dateWeek = format(new Date(), "EE, d", { locale: ptBR });

  const [pixModalVisible, setPixModalVisible] = useState(false);
  const [pixData, setPixData] = useState<{
    qrCodeUrl?: string;
    copiaECola?: string;
    amount: number;
  } | null>(null);
  const [isCopied, setIsCopied] = useState(false);

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

  const handleCopyPixCode = async (code?: string) => {
    if (!code) return;
    try {
      const Clipboard = require("expo-clipboard");
      await Clipboard.setStringAsync(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    } catch (e) {
      console.log("Erro ao copiar código PIX:", e);
    }
  };

  const servicesList = serviceCheckIn.length > 0 ? serviceCheckIn : [];
  const primaryService = servicesList[0];
  const serviceNamesText = servicesList.map((s) => s.name).join(" + ") || "Serviço Selecionado";

  const totalServicePrice = servicesList.reduce((acc, s) => acc + (s.price || 0), 0);
  const totalServiceDuration = servicesList.reduce((acc, s) => acc + (s.duration || 0), 0);

  const totalDepositAmount = servicesList.reduce((acc, s) => {
    if (Boolean(s.requiresDeposit) && (s.depositAmount || 0) > 0) {
      const dep =
        s.depositType === "PERCENTAGE"
          ? ((s.price || 0) * (s.depositAmount || 0)) / 100
          : (s.depositAmount || 0);
      return acc + dep;
    }
    return acc;
  }, 0);

  const hasDepositRequired = totalDepositAmount > 0;

  return (
    <View className="flex-1 px-5">
      <View className=" ">
        <View className="flex-row justify-between border-b border-gray-300 pb-5 ">
          <View className="flex-row flex-1 mr-2 items-center">
            {primaryService?.imgUrl ? (
              <Image
                source={{ uri: primaryService.imgUrl }}
                resizeMode="cover"
                className="w-[50px] h-[50px] rounded-full mr-3"
              />
            ) : (
              <Image
                source={require("@assets/images/logo.png")}
                resizeMode="cover"
                className="w-[50px] h-[50px] rounded-full mr-3"
              />
            )}

            <View className="flex-1">
              <Text
                className="text-font-primary text-lg font-bold"
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {serviceNamesText}
              </Text>
              <Text className="mt-1 text-xs text-font-primary">
                {newDateWeek} de {format(new Date(), "MMM yyyy", { locale: ptBR })}
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity onPress={() => closeBottomSheet()}>
              <Ionicons name="close" size={26} color={colors.gray[400]} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-6 bg-background-tertiary border-gray-600 rounded-md p-5">
          <View className="mb-3">
            <Text className="text-font-primary text-sm font-bold border-b border-gray-700/50 pb-2">
              Serviço(s) Selecionado(s):
            </Text>
            {servicesList.map((srv, idx) => (
              <View key={srv.id || idx} className="flex-row justify-between items-center mt-2">
                <View className="flex-1 pr-2">
                  <Text className="text-font-primary text-sm font-semibold">{srv.name}</Text>
                  {srv.duration ? (
                    <Text className="text-font-secondary text-xs">Duração: {srv.duration} min</Text>
                  ) : null}
                </View>
                <Text className="text-app-theme-primary font-bold text-base">
                  R$ {hasSubscriptionCredits ? "0,00" : (srv.price || 0).toFixed(2).replace(".", ",")}
                </Text>
              </View>
            ))}
          </View>

          {employeeCheckIn.map((employee) => (
            <View key={employee.id} className="pt-3 border-t border-gray-700/50 flex-row justify-between items-center">
              <View>
                <Text className="text-font-primary text-sm font-bold">
                  Profissional: {employee.name}
                </Text>
                <Text className="text-font-secondary text-xs mt-0.5">
                  Duração Total: {employee.duration || totalServiceDuration} min
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-font-secondary text-xs">Total do Agendamento</Text>
                <Text className="text-app-theme-primary font-bold text-xl">
                  R$ {hasSubscriptionCredits ? "0,00" : totalServicePrice.toFixed(2).replace(".", ",")}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Card de Sinal PIX (se ALGUNS dos serviços exigir sinal) */}
        {hasDepositRequired ? (
          <View className="mt-4 p-4 rounded-xl bg-accent-gold/15 border border-accent-gold/40 flex-row items-center justify-between">
            <View className="flex-row items-center gap-3">
              <Ionicons name="qr-code-outline" size={24} color="#CBA35D" />
              <View>
                <Text className="text-font-primary font-bold text-sm">
                  Sinal Obrigatório (PIX)
                </Text>
                <Text className="text-font-secondary text-xs mt-0.5">
                  Garante sua reserva e evita no-show
                </Text>
              </View>
            </View>
            <Text className="text-accent-gold font-bold text-base">
              R$ {totalDepositAmount.toFixed(2).replace(".", ",")}
            </Text>
          </View>
        ) : null}

        <View className="mt-6">
          <TouchableOpacity
            onPress={async () => {
              if (hasDepositRequired && totalDepositAmount > 0) {
                try {
                  const res: any = await handlePaymentIntent({
                    amount: totalDepositAmount,
                    productName: `Sinal: ${serviceNamesText}`,
                    productId: String(primaryService?.id || 0),
                    companyId: dataBody.companyId,
                  });

                  if (res?.pixCopiaECola || res?.pixQrCodeUrl) {
                    setPixData({
                      qrCodeUrl: res.pixQrCodeUrl,
                      copiaECola: res.pixCopiaECola,
                      amount: totalDepositAmount,
                    });
                    setPixModalVisible(true);
                    return;
                  }
                } catch (e: any) {
                  console.error("Erro no pagamento PIX do sinal:", e);
                  const msg =
                    e?.message ||
                    "Não foi possível concluir o pagamento do sinal.";
                  Alert.alert("Pagamento do Sinal", msg);
                  return;
                }
              }

              await createBooking(dataBody, finalDate);
            }}
            className={`h-[60px] bg-app-theme-primary rounded-md items-center justify-center 
              ${isLoadingMessage ? "justify-between" : ""}`}
          >
            <Text className="text-center text-base text-font-secundary font-bold">
              {isLoadingMessage || createIsLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : hasDepositRequired ? (
                "Pagar Sinal via PIX e Agendar"
              ) : (
                "Confirmar agendamento"
              )}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal PIX Copia e Cola + QR Code */}
      <Modal
        animationType="slide"
        transparent
        visible={pixModalVisible}
        onRequestClose={() => setPixModalVisible(false)}
      >
        <View className="flex-1 bg-black/70 justify-end">
          <View className="bg-white rounded-t-3xl p-6 w-full max-h-[85%]">
            <View className="flex-row justify-between items-center pb-4 border-b border-gray-100">
              <View className="flex-row items-center gap-2">
                <Ionicons name="qr-code-outline" size={24} color="#092D5D" />
                <Text className="text-[#092D5D] text-lg font-black">
                  Pagamento do Sinal (PIX)
                </Text>
              </View>
              <TouchableOpacity onPress={() => setPixModalVisible(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ alignItems: "center", paddingVertical: 20 }}
            >
              <Text className="text-gray-500 text-xs text-center mb-1">
                Valor do Sinal Obrigatório:
              </Text>
              <Text className="text-[#092D5D] text-2xl font-black mb-4">
                R$ {(pixData?.amount || 0).toFixed(2).replace(".", ",")}
              </Text>

              {/* QR Code Image */}
              {pixData?.qrCodeUrl ? (
                <View className="p-3 bg-white border border-gray-200 rounded-2xl mb-4 shadow-sm">
                  <Image
                    source={{ uri: pixData.qrCodeUrl }}
                    style={{ width: 190, height: 190 }}
                    resizeMode="contain"
                  />
                </View>
              ) : null}

              {/* Copia e Cola Box */}
              {pixData?.copiaECola ? (
                <View className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4">
                  <Text className="text-gray-400 text-[10px] font-bold uppercase mb-1">
                    Código PIX Copia e Cola
                  </Text>
                  <Text
                    className="text-slate-800 text-xs font-mono"
                    numberOfLines={3}
                    ellipsizeMode="middle"
                  >
                    {pixData.copiaECola}
                  </Text>
                </View>
              ) : null}

              {/* Copiar Botão */}
              {pixData?.copiaECola ? (
                <TouchableOpacity
                  onPress={() => handleCopyPixCode(pixData.copiaECola)}
                  activeOpacity={0.85}
                  className={`w-full py-3.5 rounded-xl flex-row justify-center items-center gap-2 mb-3 ${
                    isCopied ? "bg-emerald-600" : "bg-[#092D5D]"
                  }`}
                >
                  <Ionicons
                    name={isCopied ? "checkmark-circle" : "copy-outline"}
                    size={18}
                    color="#fff"
                  />
                  <Text className="text-white font-extrabold text-xs uppercase tracking-wide">
                    {isCopied ? "Código PIX Copiado!" : "Copiar Código PIX"}
                  </Text>
                </TouchableOpacity>
              ) : null}

              <Text className="text-gray-400 text-[11px] text-center mb-5">
                Abra o app do seu banco, escolha PIX Copia e Cola e conclua o pagamento.
              </Text>

              {/* Confirmar Agendamento */}
              <TouchableOpacity
                onPress={async () => {
                  setPixModalVisible(false);
                  await createBooking(dataBody, finalDate);
                }}
                activeOpacity={0.85}
                className="w-full bg-[#CBA35D] py-3.5 rounded-xl items-center shadow-sm"
              >
                <Text className="text-[#092D5D] font-black text-xs uppercase tracking-wide">
                  Já Paguei / Confirmar Agendamento
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

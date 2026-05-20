import { createElement, useEffect, useMemo, useRef, useState } from "react";
import { CompanyServicesProps } from "../../shared/interfaces/http/company-services";
import {
  AvailableAppointmentsHttpParams,
  AvailableAppointmentsProps,
  AvailableEmployeesProps,
} from "../../shared/interfaces/http/available-appointments";
import {
  AppointmentHttpParams,
  AppointmentStatus,
} from "../../shared/interfaces/http/appointment";
import { useBookingMutation } from "../../shared/queries/company/use-booking.mutation";
import { addDays, format, isBefore, startOfDay, startOfWeek } from "date-fns";
import { Alert } from "react-native";
import { useBottomSheetContext } from "../../shared/hooks/useBotttomSheetApp";
import { BookingCheckIn } from "../../shared/components/AppSchedule/BookingCheckIn";
import { router } from "expo-router";
import { useSnackbarContext } from "../../shared/hooks/snackbar.context";
import { useWhatsAppMutation } from "@/shared/queries/zap/use-wt-send-message.mutation";
import { WtSendMensageHttpParams } from "@/shared/interfaces/http/whatsapp";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useHomeViewModel } from "../Home/useHomeViewModel";
import { moneyMapper } from "@/utils/moneyMapper";
import { useUserStore } from "@/shared/store/user-store";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useUserUserUpdatePreferences } from "@/shared/queries/user/use-user-logged.mutation";
import { localNotificationService } from "@/shared/services/local-notifications.service";
import { useStripe } from "@stripe/stripe-react-native";
import { useStripeMutation } from "@/shared/queries/stripe/use-stripe-mutataion";
import {
  ESubscriptionState,
  PaymentIntentParam,
} from "@/shared/interfaces/http/stripe";
import { useAdvertisementMutation } from "@/shared/queries/company/use-advertisement.mutation";
import { useAppointmentMutation } from "@/shared/queries/company/use-appointment.mutation";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";

export function useScheduleViewModel(serviceIds: number[]) {
    const [serviceIdList, setServiceIdList] = useState<number[]>(() => serviceIds);

  const [services, setServices] = useState<CompanyServicesProps>();

  const { setUser, user } = useUserStore();
  const { handleError } = useErrorHandler();

  const [bookingStatus, setBookingStatus] = useState<AppointmentStatus>(
    AppointmentStatus.AVAILABLE,
  );

  const localDate = format(new Date().toISOString(), "yyyy-MM-dd");

  const [dateScheduled, setDateScheduled] = useState<string>(localDate);
  const [dateBooking, setDateBooking] = useState<string>(localDate);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());

  const [formattedDateTime, setFormattedDateTime] = useState("");

  const [isCreated, setIsCreated] = useState<boolean>(false);

  const [allEmployeeIsLoading, setAllEmployeeIsLoading] = useState(false);

  const [employeeIsSelected, setEmployeeIsSelected] = useState<boolean>(false);

  const [employeeId, setEmployeeId] = useState<number | null | undefined>(null);

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [dataBody, setDataBody] = useState<AppointmentHttpParams>({
    dateScheduled: dateScheduled,
    services: serviceIdList.map((id) => ({ serviceId: id })),
    status: bookingStatus,
    employeeId: employeeId,
  });

  const data: AvailableAppointmentsHttpParams = {
    date: dateBooking,
    employeeId: employeeId,
    serviceIds: serviceIdList,
  };

  const [confirmationMessage, setConfirmationMessage] =
    useState<WtSendMensageHttpParams>({
      number: "",
      text: "",
      delay: 1200,
    });

  const {sendMessageMutation} = useWhatsAppMutation();
  const { useGetAvailableAppointmentMutation, useGetAppointmentMutation } =
    useAppointmentMutation();
  const {
    data: appointmentData,
    error: appointmentError,
    refetch: appointmentRefetch,
    isRefetching: appointmentIsRefetching,
    isLoading: appointmentIsLoading,
    fetchNextPage: appointmentFetchNextPage,
    hasNextPage: appointmentHasNextPage,
    isFetchingNextPage: appointmentIsFetchingNextPage,
  } = useGetAvailableAppointmentMutation({
    employeeId: null,
    serviceIds: serviceIdList.length > 0 ? serviceIdList : serviceIds, // fallback para prop
    date: dateBooking,
  });
  const { refetch: appointmentSheduledRefetch } = useGetAppointmentMutation();
  const availableAppointments = useMemo(() => {
    const all = appointmentData?.pages.flatMap((page) => page.content) ?? [];

    // 🔥 dedupe só por horário (mais simples e performático)
    return Array.from(
      new Map(
        all.map((item) => [
          `${item.dateBooking}-${item.availableEmployees.length}`, // chave mais única
          item,
        ]),
      ).values(),
    );
  }, [appointmentData]);
 
  const { createBookingMutation } = useBookingMutation();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();
  const [isHoursLoading, setIsHoursLoading] = useState(false);
  const [showWhatsappModal, setShowWhatsappModal] = useState(false);

  const [createIsLoading, setCreateisLoading] = useState(false);

  const { useGetMySubscriptionPlanQuery } = useStripeMutation();
  const {
    data: mySubscription,
    isLoading: isMySubscriptionLoading,
    error: mySubscriptionError,
    refetch: refetchMySubscription,
  } = useGetMySubscriptionPlanQuery();

  const mySubscriptionIsActive =
    mySubscription?.status === ESubscriptionState.ACTIVE;
  const { notify } = useSnackbarContext();

  const { formatDate, formatHour, formatDateTimeToBR } = useFormatDate();
  const creatingRef = useRef(false);

  const { paymentIntentMutation } = useStripeMutation();
const { getCompanyByIdMutation } = useCompanyDetailsMutation();

  async function handlePaymentIntent(dataBody: PaymentIntentParam) {
    const amountCaculated = dataBody.amount * 100;
    const response = await paymentIntentMutation.mutateAsync({
      customerId: "cus_U9JOBIf4GXihBt",
      amount: amountCaculated,
      productName: dataBody.productName,
      productId: dataBody.productId,
    });

    const clientSecret = response.clientSecret;

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: "Dom Palagani",
    });

    if (error) {
      console.log(error);
      return;
    }

    await presentPaymentSheet();
  }

  const uniqueEmployees = Array.from(
    new Map(
      availableAppointments
        .flatMap((item) => item.availableEmployees)
        .map((e) => [e.id, e]),
    ).values(),
  );

  const employeesForDay = useMemo(() => {
    return Array.from(
      new Map(
        availableAppointments
          .flatMap((item) => item.availableEmployees)
          .map((e) => [e.id, e]),
      ).values(),
    );
  }, [availableAppointments]);
  const sortedEmployees = useMemo(() => {
    return [...employeesForDay].sort((a, b) =>
      a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
    );
  }, [employeesForDay]);

  const { userUpdatePreferencesMutation } = useUserUserUpdatePreferences();

  const employeesWithNoPreference = useMemo(
    () => [
      {
        id: null,
        name: "Sem preferência",
        avatarUrl: "",
        commissionFee: 0,
        duration: 0,
        price: 0,
      },
      ...sortedEmployees,
    ],
    [sortedEmployees],
  );

  function handleDateSelect(date: Date) {
    if (isBefore(startOfDay(new Date(date)), startOfDay(new Date()))) {
      Alert.alert("Ops!", "Essa data já passou, tente agendar outra data.");
      return;
    }
    setInitialized(true);
    setEmployeeIsSelected(false);
    setEmployeeId(null); // limpa profissional
    setCurrentDate(date);
    setSelectedDay(date);
    setDateBooking(format(date.toISOString(), "yyyy-MM-dd"));
  }

  function handleEmployeeSelect(employeeId?: number | null) {
    setEmployeeId(employeeId);
    setInitialized(true);
    setDataBody((prev) => ({ ...prev, employeeId }));
    setEmployeeIsSelected(true);
  }

  function handleHourSelect(hourString: string) {
    try {
      if (!selectedDay) return;

      const [hour, minute] = hourString.split(":"); // "09:30" -> ["09",
      const dateTime = new Date(selectedDay);
      dateTime.setHours(Number(hour), Number(minute), 0, 0);
      const finalDate =
        format(dateTime, "yyyy-MM-dd") + "T" + format(dateTime, "HH:mm:ss");

      // Agora SIM — usa a data correta
      setFormattedDateTime(finalDate);
      setDateScheduled(finalDate);

      const slotForHour = availableAppointments.find(
        (item) =>
          format(new Date(item.dateBooking), "yyyy-MM-dd HH:mm") ===
          format(dateTime, "yyyy-MM-dd HH:mm"),
      );

      if (!slotForHour || slotForHour.availableEmployees.length === 0) {
        Alert.alert(
          "Indisponível",
          "Nenhum profissional disponível para esse horário.",
        );
        return;
      }

      // resolve o profissional APENAS para o payload
      const resolvedEmployeeId =
        employeeId !== null
          ? employeeId
          : slotForHour.availableEmployees[
              Math.floor(Math.random() * slotForHour.availableEmployees.length)
            ].id;

      // mantém o estado consistente
      setEmployeeId(resolvedEmployeeId);

      const payload: AppointmentHttpParams = {
        dateScheduled: finalDate,
        services: serviceIdList.map((id) => ({ serviceId: id })),
        status: AppointmentStatus.SCHEDULED,
        employeeId: resolvedEmployeeId,
        usingSubscription: mySubscriptionIsActive,
      };

      setDataBody(payload);

      openBottomSheet(
        createElement(BookingCheckIn, {
          employeesWithNoPreference: employeesWithNoPreference,
          hoursForEmployee: hoursForEmployee,
          availableAppointments: availableAppointments,
          resolvedEmployeeId: resolvedEmployeeId,
          closeBottomSheet: closeBottomSheet,
          dataBody: payload,
          serviceId: serviceIdList[0],
          createBooking: createBooking,
          finalDate: finalDate,
          sendConfirmationMessage: () => sendConfirmationMessage(finalDate),
          confirmationMessage,
          createIsLoading,
          isLoadingMessage,
          mySubscription: mySubscription,
          serviceCheckIn,
          handlePaymentIntent,
        }),
        1,
      );
    } catch (error) {
      handleError(error, "Erro ao selecionar horário");
    }
  }

  // Função para enviar  mensagem de confirmação de agendamento

  async function sendConfirmationMessage(dateTimeString: string) {
    try {
      setIsLoadingMessage(true);

      // ✅ todos os serviços
      const serviceNames = serviceCheckIn.map((s) => s.name).join(", ");
      const totalPrice = serviceCheckIn.reduce(
        (sum, s) => sum + Number(s.price),
        0,
      );

      const selectedEmployee = employeesForDay.find((e) => e.id === employeeId);
      const barberName = selectedEmployee?.name ?? "Sem preferência";
      const userPhone = user?.phone.trim();

      const finalDateObj = new Date(dateTimeString);
      const payload: WtSendMensageHttpParams = {
        number: `55${userPhone}`,
        text: `
💈 Agendamento Confirmado ✅

Olá ${user?.firstName}
🔥 Seu horário tá confirmadíssimo com a gente!

📅 Data: ${formatDate(finalDateObj)}
⏰ Horário: ${formatHour(finalDateObj)}
💇 Serviço${serviceCheckIn.length > 1 ? "s" : ""}: ${serviceNames}
👤 Barbeiro: ${barberName}
💵 Preço: R$ ${moneyMapper(totalPrice)}

Chegue uns 10 min antes pra já entrar no clima e aproveitar aquele ☕ café expresso pra começar o dia no estilo.

⏳ Tolerância máxima: 10 min de atraso.
🤝 Dom Pagalani agradece pela confiança!`,
        delay: 60,
      };

      await sendMessageMutation.mutateAsync(payload);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMessage(false);
    }
  }
  // refs para guardar os dados temporários
  const tempDataBody = useRef<AppointmentHttpParams | null>(null);
  const tempFinalDate = useRef<string | null>(null);



  // função chamada pelo botão do modal
  async function handleEnableWhatsapp() {
    try {
      setIsLoadingMessage(true);

      setShowWhatsappModal(false);

      /* await updateUserPreferences({
    allowWhatsappNotifications: true,
    whatsappAskedOnce: true,
  });*/

      const updatedUser = await userUpdatePreferencesMutation.mutateAsync({
        allowWhatsAppNotifications: true,
        askWhatsappConfirmation: true,
        whatsappAskedOnce: true,
      });


      if (!user) return;

      setUser({
        ...user,
        allowWhatsAppNotifications: updatedUser.allowWhatsAppNotifications,
        whatsappAskedOnce: true,
      });

await continuarCreate(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingMessage(false);
    }
  }

  async function handleDisableWhatsapp() {
    setShowWhatsappModal(false);
    if (!user?.id) return;

    /* await updateUserPreferences({
    allowWhatsappNotifications: false,
    whatsappAskedOnce: true,
  });*/

    const updatedUser = await userUpdatePreferencesMutation.mutateAsync({
      allowWhatsAppNotifications: false,
      whatsappAskedOnce: true,
    });
    if (!user) return;

    setUser({
      ...user,
      allowWhatsAppNotifications: updatedUser.allowWhatsAppNotifications,
      whatsappAskedOnce: true,
    });

    await continuarCreate(false);
  }

  async function continuarCreate(sendWhatApp = false) {
  try {
    if (tempDataBody.current && tempFinalDate.current) {
      await createBookingConfirmed(
        tempDataBody.current,
        tempFinalDate.current,
        sendWhatApp,
      );

      tempDataBody.current = null;
      tempFinalDate.current = null;
    }
  } catch (error) {
    console.log(error);
  }
}
    // função original chamada pelo BottomSheet
  async function createBooking(
    dataBody: AppointmentHttpParams,
    finalDate: string,
  ) {
    try {
      setCreateisLoading(true);
      setIsLoadingMessage(true);
      // guarda para usar depois que o usuário clicar no modal
      tempDataBody.current = dataBody;
      tempFinalDate.current = finalDate;

      // se o usuário AINDA NÃO escolheu, pergunta
      if (user?.whatsappAskedOnce !== true) {
        closeBottomSheet(); // importante
        requestAnimationFrame(() => setShowWhatsappModal(true));
        return;
      }

      // se já escolheu antes, segue direto sem modal
      await createBookingConfirmed(
        dataBody,
        finalDate,
        user?.allowWhatsAppNotifications ?? false,
      );
      closeBottomSheet();

      await appointmentSheduledRefetch();
      await appointmentRefetch();
    } catch (error) {
      console.log(error);
      closeBottomSheet();
    } finally {
      setIsLoadingMessage(false);
      setCreateisLoading(false);
    }
  }

  // Função para agendar serviço

  async function createBookingConfirmed(
    dataBody: AppointmentHttpParams,
    finalDate: string,
    shouldSendWhatsApp: boolean,
  ) {
    try {
      if (creatingRef.current) return;
      creatingRef.current = true;

      // Caso já tenha habilitado, envia a mensagem
      if (shouldSendWhatsApp) {
        await sendConfirmationMessage(finalDate);
      }

      const data = await createBookingMutation.mutateAsync(dataBody);

      setIsCreated(true);

      notify({
        message: "Agendamento realizado com sucesso",
        type: "SUCCESS",
      });

      const serviceName = data.data.services[0].service.name;

      localNotificationService.scheduleBookingReminder({
        appointmentId: data.data.id,
        dateScheduled: data.data.dateScheduled,
        employeeName: data.data.employee.name,
        serviceName: serviceName,
        delayInMinutes: 30,
      });

      router.replace("/(private)/(tabs)/(client-tabs)/bookings");
    } catch (error) {
      handleError(error, "Falha ao realizar agendamento, tente novamente");
    } finally {
      creatingRef.current = false;
    }
  }


  // Função para buscar agendamentos disponíveis

  const hoursForEmployee = useMemo(() => {
    return availableAppointments.filter((item) => {
      const matchesEmployee =
        employeeId === null
          ? true
          : item.availableEmployees.some((e) => e.id === employeeId);

      const isFuture =
        new Date(item.dateBooking).getTime() >
        new Date(dateBooking + "T00:00:00").getTime();

      return matchesEmployee && isFuture;
    });
  }, [availableAppointments, employeeId, dateBooking]);

  const serviceCheckIn = useMemo(() => {
    return Array.from(
      new Map(
        hoursForEmployee.flatMap((item) => item.service).map((e) => [e.id, e]),
      ).values(),
    );
  }, [hoursForEmployee]);

  /*  useEffect(() => {
    if (!dateBooking || !bodyServiceId) return;
    employeesForDay();
  }, [dateBooking, bodyServiceId]);
*/
  useEffect(() => {
    const today = new Date();
    setSelectedDay(today);
    setCurrentDate(today);
    setDateBooking(format(today, "yyyy-MM-dd"));
    setEmployeeId(null);
  }, []);

  /*useEffect(() => {
    if (!dateBooking || !bodyServiceId || employeeId === undefined) return;

    setAvailableAppointments([]);
    setHasMore(true);

    loadAvailable(0, true); // 🔥 BUSCA IMEDIATA
  }, [dateBooking, employeeId, bodyServiceId]);
*/
  useEffect(() => {
    if (!serviceIds?.length) return;
    setServiceIdList(serviceIds);
    setDataBody((prev) => ({
      ...prev,
      services: serviceIds.map((id) => ({ serviceId: id })),
    }));
  }, [serviceIds.join(",")]); // join evita re-render infinito com array

  return {
    services,
    serviceIdList,
    setEmployeeId,
    setDateScheduled,
    employeeId,
    dateScheduled,
    dataBody,
    setDataBody,
    createBooking,
    currentDate,
    setCurrentDate,
    selectedDay,
    setSelectedDay,
    employeesWithNoPreference,
    employeeIsSelected,
    handleDateSelect,
    handleEmployeeSelect,
    handleHourSelect,
    hoursForEmployee,
    initialized,
    localDate,
    setDateBooking,
    isCreated,
    sendConfirmationMessage,
    showWhatsappModal,
    handleDisableWhatsapp,
    setShowWhatsappModal,
    handleEnableWhatsapp,
    isLoadingMessage,
    allEmployeeIsLoading,
    isHoursLoading,
    availableAppointments,
    appointmentRefetch,
    appointmentData,
    appointmentError,
    appointmentHasNextPage,
    appointmentIsFetchingNextPage,
    appointmentIsLoading,
    appointmentIsRefetching,
    createIsLoading,
    appointmentFetchNextPage,
  };
}

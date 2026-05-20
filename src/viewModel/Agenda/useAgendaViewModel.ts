import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useAgenda } from "@/shared/hooks/useAgenda";
import { useAppModal } from "@/shared/hooks/useAppModal";
import { useCurrentTime } from "@/shared/hooks/useCurrentTime";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useTime } from "@/shared/hooks/useTime";
import {
  AppointmentHttpParams,
  AppointmentHttpStatusParams,
  AppointmentProps,
  AppointmentStatus,
} from "@/shared/interfaces/http/appointment";
import {
  DAYS_WEEK,
  EDayWeek,
  EmployeeProps,
} from "@/shared/interfaces/http/employee";
import { useAppointmentMutation } from "@/shared/queries/company/use-appointment.mutation";
import { useBookingMutation } from "@/shared/queries/company/use-booking.mutation";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { useModalStore } from "@/shared/store/modal-store";
import { useUserStore } from "@/shared/store/user-store";
import { format } from "date-fns";
import { router, useFocusEffect, useSegments } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { queryClient } from "../../../queryClient";

export function useAgendaViewModel() {
  const {
    cancelAppointmentByIdMutation,
    useGetAppointmentMutation,
    getAppointmentAgenda,
    deletAppointmentById,
  } = useAppointmentMutation();

  const {
    data: appointmentData,
    error: appointmentError,
    refetch: appointmentRefetch,
    isRefetching: appointmentIsRefetching,
    isLoading: appointmentIsLoading,
    hasNextPage: appointmentHasNextPage,
    isFetchingNextPage: appointmentIsFetchingNextPage,
  } = useGetAppointmentMutation();

  const appointmentDataPagged =
    appointmentData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const [currentDate, setCurrentDate] = useState(new Date());

  const [dayIsSelected, setDayIsSelected] = useState(false);
  const segments = useSegments();
  const isAgendaRoute = segments.includes("agenda");
  const [isLoading, setIsLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user } = useUserStore();

  const { close } = useModalStore();

  const modals = useAppModal();

  const [employeeIsSelected, setEmployeeIsSelected] = useState(false);
  const [appointments, setAppointments] = useState<AppointmentProps[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const { useGetEmployeeMutation } = useEmployeeMutation();
  const isAdmin =
    user?.roles?.some((role) => role.authority === "ROLE_ADMIN") ?? false;

  const employeeSearchId = isAdmin ? undefined : Number(user?.employeeId);

  const {
    data: employeeData,
    error: employeeError,
    refetch: employeeRefetch,
    isRefetching: employeeIsRefetching,
    isLoading: employeeIsLoading,
    fetchNextPage: employeeFetchNextPage,
    hasNextPage: employeeHasNextPage,
    isFetchingNextPage: employeeIsFetchingNextPage,
  } = useGetEmployeeMutation({
    employeeId: employeeSearchId,
  });
  const { refetch: appointmentSheduledRefetch } = useGetAppointmentMutation();
  const {
    data: employeeUpdated
  } = useGetEmployeeMutation();

  const allEmployees =
    employeeData?.pages.flatMap((page) => page.content ?? []) ?? [];

  const employeeDataPagged = allEmployees;

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [agendaLoading, setAgendaLoading] = useState(false);

  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    number | undefined
  >();

  const { createBookingAdminMutation } = useBookingMutation();

  const employee = useAgendaStore((e) => e.employee);
  const employeeId = useAgendaStore((e) => e.employeeId);

  const setClient = useAgendaStore((s) => s.setClient);
  const clientId = useAgendaStore((s) => s.clientId);

  const setService = useAgendaStore((s) => s.setService);
  const serviceId = useAgendaStore((s) => s.serviceId);

  const setDay = useAgendaStore((s) => s.setDay);
  const selectedDay = useAgendaStore((d) => d.selectedDay);
  const setTime = useAgendaStore((s) => s.setTime);
  const setEmployee = useAgendaStore((s) => s.setEmployee);
  const time = useAgendaStore((s) => s.time);

  const setEmployeeId = useAgendaStore((s) => s.setEmployeeId);

  const setDayBlockStart = useAgendaStore((s) => s.setDayBlockStart);
  const setDayBlockEnd = useAgendaStore((s) => s.setDayBlockEnd);

  const employeeTimes = useAgendaStore((e) => e.employeeTimes);

  const { fitIn, setFitIn } = useAgendaStore();

  const { safeReplace } = useSafeNavigation();

  const [openMenu, setOpenMenu] = useState(false);
  const localDate = format(new Date().toISOString(), "yyyy-MM-dd");
  const [dateScheduled, setDateScheduled] = useState<string>(localDate);
  const [dataBody, setDataBody] = useState<AppointmentHttpParams>({
    dateScheduled: dateScheduled,
    services: [{ serviceId: serviceId }],
    status: AppointmentStatus.SCHEDULED,
    employeeId: employeeId,
    clientId: clientId,
    schedulingFitIn: fitIn,
  });
  const { formatIsoToLocalDate, formatDateToBR } = useFormatDate();

  const { handleError } = useErrorHandler();

  const selectedIndex = selectedDay
    ? selectedDay.getDay()
    : new Date().getDay();
  const selectedEDay: EDayWeek =
    DAYS_WEEK[selectedIndex === 0 ? 6 : selectedIndex - 1];

  const {
    overlapsAppointment,
    isWorkingTime,
    getEmployeeOffHourRanges,
    getCurrentTimePosition,
    SLOT_HEIGHT,
  } = useAgenda();

  const { timeToTop } = useTime();

  const {
    groupOverlappingAppointments,
    getAppointmentStart,
    getAppointmentDuration,
  } = useAgenda();

  // 🔹 Slots 24h (00:00 → 23:50)
  const slots = useMemo(() => {
    const list: { key: string; time: string; showLabel: boolean }[] = [];

    for (let t = 0; t < 24 * 60; t += 10) {
      const h = Math.floor(t / 60);
      const m = t % 60;

      list.push({
        key: `${h}-${m}`,
        time: `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
        showLabel: m === 0,
      });
    }

    return list;
  }, []);

  const CONTENT_HEIGHT = slots.length * SLOT_HEIGHT;

  const scrollRef = useRef<ScrollView>(null);

  // 🔹 Scroll automático para horário atual
  useEffect(() => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    const offset = Math.floor(minutes / 10) * SLOT_HEIGHT;

    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: offset, animated: true });
    }, 300);
  }, []);

  const [selectedAppointmentCancelId, setSelectedCancelAppointmentId] =
    useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { notify } = useSnackbarContext();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  function showModal(id: number) {
    setSelectedCancelAppointmentId(id);
    setModalVisible(true);
  }

  function hideModal() {
    setModalVisible(false);
    setSelectedCancelAppointmentId(null);
  }

  async function handleDeleteAppointment(data: AppointmentProps[]) {
    if (!selectedAppointmentCancelId) return;
    console.log(selectedAppointmentCancelId);
    try {
      setIsDeleteLoading(true);

      const isCancelled = data.some(
        (item) =>
          item.id === selectedAppointmentCancelId &&
          item.status === AppointmentStatus.CANCELED,
      );

      if (isCancelled) {
        notify({
          message: "Agendamento já está cancelado",
          type: "WARNING",
        });
        hideModal();

        return;
      }
      await cancelAppointmentByIdMutation.mutateAsync(
        selectedAppointmentCancelId,
      );

      notify({
        message: "Agendamento cancelado com sucesso",
        type: "SUCCESS",
      });
      hideModal();
      await appointmentRefetch();
    } catch (error) {
      handleError(error, "Falha ao cancelar agendamento");
    } finally {
      setIsDeleteLoading(false);
    }
  }

  function formateTimeAndDateToDate(time: string | null, selectedDay: Date) {
    if (time === null) return;
    const [hours, minutes] = time.split(":").map(Number);

    const dateWithTime = new Date(selectedDay);
    dateWithTime.setHours(hours);
    dateWithTime.setMinutes(minutes);
    dateWithTime.setSeconds(0);
    dateWithTime.setMilliseconds(0);

    return dateWithTime;
  }

  function handleBookingModalClose() {
    router.push({
      pathname: "/(private)/(tabs)/(admin-tabs)/agenda/new-booking",
    });

    close();
  }

  function handleBlockModalClose(date: Date, time: string) {
    router.push({
      pathname: "/(private)/(tabs)/(admin-tabs)/agenda/block-agenda",
    });

    const newStartDay = formateTimeAndDateToDate(time, date);
    if (newStartDay) {
      setDayBlockStart(newStartDay);
      const newEndDay = new Date(newStartDay);
      newEndDay.setMinutes(newEndDay.getMinutes() + 10);
      setDayBlockEnd(newEndDay);
    }

    close();
  }

  function handleSlotPress(time: string) {
    setTime(time);

    setSelectedTime(time); // Atualiza o estado
    const dateFormmated = formatDateToBR(selectedDay);
    modals.showSelection({
      title: ` ${dateFormmated} - ${time}`,
      message: "Escolha uma opção:",
      options: [
        {
          text: "Agendar horário",
          icon: "calendar-clear",
          variant: "primary",
          onPress: () => handleBookingModalClose(),
        },
        {
          text: "Bloquear horário",
          icon: "alert-circle-outline",
          variant: "primary",
          onPress: () => handleBlockModalClose(selectedDay, time),
        },
      ],
    });
    console.log(selectedTime);
    //onCreate?.({ time, duration });
  }

  // 🔹 Off-hours calculados por regra (não por slot)
  const blockedRanges = useMemo(() => {
    return getEmployeeOffHourRanges(employee, selectedEDay);
  }, [employee, selectedEDay]);

  function handleDateSelect(date: Date) {
    setEmployeeIsSelected(false);
    setCurrentDate(date);
    setDay(date);
    console.log(selectedDay);
    // setDateBooking(format(date.toISOString(), "yyyy-MM-dd"));
    setDayIsSelected(false);
  }

  function handleEmployeeSelect(id?: number | null) {
    setEmployeeIsSelected(true);

    const selected = employeeDataPagged.find((e) => e.id === id);

    if (!selected) return;
    setEmployeeId(selected.id);
    setEmployee(selected); // seta objeto + id
    console.log(`Employee Afte` + JSON.stringify(employee));
  }

  // Função para criar agendamento

  async function createBooking() {
    try {
      console.log(dataBody);

      if (!employeeId || !clientId || !serviceId || !time) {
        notify({
          message: "Preencha todos os dados do agendamento",
          type: "ERROR",
        });
        return;
      }

      const [hour, minute] = time.split(":"); // "09:30" -> ["09",
      const dateTime = new Date(selectedDay);
      dateTime.setHours(Number(hour), Number(minute), 0, 0);
      const finalDate =
        format(dateTime, "yyyy-MM-dd") + "T" + format(dateTime, "HH:mm:ss");

      const payload: AppointmentHttpParams = {
        dateScheduled: finalDate,
        services: [{ serviceId }],
        status: AppointmentStatus.SCHEDULED,
        employeeId: employee.id,
        clientId,
        schedulingFitIn: fitIn,
      };

      const data = await createBookingAdminMutation.mutateAsync(payload);

      notify({
        message: "Agendamento realizado com sucesso",
        type: "SUCCESS",
      });

      setService(undefined); // ou null
      setClient(undefined); // ou null
      setTime("");
      setDay(new Date());
      await getAppointment();
      await appointmentSheduledRefetch();

      safeReplace("/(private)/(tabs)/(admin-tabs)/agenda");
    } catch (error) {
      handleError(error, "Falha ao realizar agendamento, tente novamente");
    }
  }

  // Função para deletar agendamento (usado apenar para agendamento bloqueao)

  async function deleteAppointmentBlocked(id: number) {
    try {
      setIsDeleting(true);
      await deletAppointmentById.mutateAsync(id);
      notify({
        message: "Horário desbloqueado com sucesso",
        type: "SUCCESS",
      });
      await getAppointment();
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  }

  //Admin cancelar agendamento

  async function onDeleteAppointment(data: AppointmentProps[]) {
    await handleDeleteAppointment(data);
    await getAppointment(); // Atualiza agenda local do VM
  }

  //Função para retornar agendamentos

  async function getAppointment() {
    if (!employeeId || !selectedDay) return;
    if (!initialized) {
      setAgendaLoading(true);
    } else {
      setAgendaLoading(false);
    }

    try {
      const newDate = formatIsoToLocalDate(selectedDay);
      const newEmployeeId = employeeId;
      console.log(newDate);
      const data = await getAppointmentAgenda.mutateAsync({
        date: newDate,
        employeeId: newEmployeeId,
      });

      const response = data?.content ?? [];
      if (response.length > 0) {
        console.log(`Appointment information ${response}`);
      }

      console.log(`Retorno` + JSON.stringify(response));
      setAppointments(response);
    } catch (error) {
      handleError(error, "Falha ao buscar agendamentos");
    } finally {
      setAgendaLoading(false);
    }
  }

  const appointmentGroups = useMemo(() => {
    return groupOverlappingAppointments(
      appointments,
      (a) => timeToTop(getAppointmentStart(a)),
      (a) =>
        timeToTop(getAppointmentStart(a)) +
        (getAppointmentDuration(a.services) / 10) * SLOT_HEIGHT,
    );
  }, [appointments]);

  function getEndTime(startTime: string, duration: number): string {
    const [h, m] = startTime.split(":").map(Number);
    const totalMinutes = h * 60 + m + duration;

    const endHour = Math.floor(totalMinutes / 60) % 24;
    const endMinute = totalMinutes % 60;

    return `${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;
  }

  function handleSetToday() {
    const today = new Date();

    // Comparando apenas ano, mês e dia
    if (
      currentDate.getFullYear() !== today.getFullYear() ||
      currentDate.getMonth() !== today.getMonth() ||
      currentDate.getDate() !== today.getDate()
    ) {
      selectTodayAsDefault();
    }
  }

  function selectTodayAsDefault() {
    const today = new Date();

    setDay(today);
    setCurrentDate(today);
  }

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      selectTodayAsDefault();
    }
  }, []);

  useEffect(() => {
    if (user?.employeeId) {
      setEmployeeId(user.employeeId);
      setEmployeeIsSelected(true);
      const selected = employeeDataPagged.find((e) => e.id === user.employeeId);
      if (selected) {
        setEmployee(selected);
      }
    }
  }, [user?.employeeId]);

  const lastFetchRef = useRef<{ employeeId?: number; day?: string }>({});

  useFocusEffect(
    useCallback(() => {
      if (!employeeId || !selectedDay) return;

      // limpa seleção sempre que volta pra agenda
      setSelectedAppointmentId(undefined);

      if (!initialized) {
        setEmployeeId(user?.employeeId);
        setInitialized(true);
      }

      getAppointment();

      // opcional: cleanup ao sair da agenda
      return () => {
        setSelectedAppointmentId(undefined);
      };
    }, [employeeId, selectedDay, initialized, user?.employeeId, employeeTimes, employeeUpdated]),
  );

  const currentTime = useCurrentTime();

  const currentY = useMemo(() => {
    return getCurrentTimePosition(
      currentTime,
      SLOT_HEIGHT,
      10, // minutos por slot
    );
  }, [currentTime, SLOT_HEIGHT]);

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }

    scrollRef.current.scrollTo({
      y: Math.max(currentY - 200, 0),
      animated: true,
    });
  }, [currentY]);
  const employeesFetchedRef = useRef(false);

  useEffect(() => {
    if (!scrollRef.current) return;

    const today = new Date();
    const isToday =
      selectedDay.getFullYear() === today.getFullYear() &&
      selectedDay.getMonth() === today.getMonth() &&
      selectedDay.getDate() === today.getDate();

    if (isToday) {
      const minutes = today.getHours() * 60 + today.getMinutes();
      const offset = Math.floor(minutes / 10) * SLOT_HEIGHT;
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: offset, animated: true });
      }, 300);
    }
  }, [selectedDay, employee]);

  useEffect(() => {
    if (employeesFetchedRef.current) return;

    employeesFetchedRef.current = true;
    employeeRefetch();
  }, []);


  return {
    setCurrentDate,
    getCurrentTimePosition,
    fitIn,
    deleteAppointmentBlocked,
    setFitIn,
    getAppointment,
    currentDate,
    setDay,
    appointments,
    selectedDay,
    createBooking,
    employeeDataPagged,
    employeeIsSelected,
    employeeId,
    handleDateSelect,
    handleEmployeeSelect,
    employee,
    scrollRef,
    isWorkingTime,
    handleSlotPress,
    overlapsAppointment,
    handleSetToday,
    CONTENT_HEIGHT,
    SLOT_HEIGHT,
    blockedRanges,
    slots,
    selectedTime,
    appointmentGroups,
    agendaLoading,
    openMenu,
    setOpenMenu,
    currentY,
    selectedAppointmentId,
    setSelectedAppointmentId,
    getEndTime,
    onDeleteAppointment,
    selectedAppointmentCancelId,
    setSelectedCancelAppointmentId,
    modalVisible,
    showModal,
    hideModal,
    isDeleteLoading,
    isLoading,
    isDeleting,
    employeeRefetch,
    employeeIsRefetching,
    employeeIsLoading,
    employeeFetchNextPage,
    employeeHasNextPage,
    employeeIsFetchingNextPage,
  };
}

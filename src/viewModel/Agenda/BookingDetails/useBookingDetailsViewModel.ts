import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useAppModal } from "@/shared/hooks/useAppModal";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { queryClient } from "../../../../queryClient";
import {
  AppointmentProps,
  AppointmentStatus,
  AppointmentUpdateHttpParams,
} from "@/shared/interfaces/http/appointment";
import { ClientInterface } from "@/shared/interfaces/http/client";
import { useAppointmentMutation } from "@/shared/queries/company/use-appointment.mutation";
import { useBookingMutation } from "@/shared/queries/company/use-booking.mutation";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { useClientMutation } from "@/shared/queries/company/use.client.mutation";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { useModalStore } from "@/shared/store/modal-store";
import { format } from "date-fns";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export function useBookingDetailsViewModel(appointmentId?: number) {
  const {
    useGetAppointmentById,
    cancelAppointmentByIdMutation,
    updateAppointmentMutation,
    useGetAppointmentMutation,
  } = useAppointmentMutation();

  const {
    data: appointment,
    isLoading: appointmentDetailsLoading,
    refetch: appointmentByIdRefetch,
  } = useGetAppointmentById(appointmentId!);

  const {
    data: appointmentData,
    refetch: appointmentRefetch,
    isRefetching: appointmentIsRefetching,
    isLoading: appointmentIsLoading,
    hasNextPage: appointmentHasNextPage,
    isFetchingNextPage: appointmentIsFetchingNextPage,
  } = useGetAppointmentMutation();

  // 🔹 Store
  const setClient = useAgendaStore((s) => s.setClient);
  const setClientId = useAgendaStore((s) => s.setClientId);
  const service = useAgendaStore((s) => s.service);

  const setService = useAgendaStore((s) => s.setService);
  const setServiceId = useAgendaStore((s) => s.setServiceId);
  const employee = useAgendaStore((e) => e.employee);
  const clientId = useAgendaStore((c) => c.clientId);
  const serviceId = useAgendaStore((s) => s.serviceId);
  const time = useAgendaStore((t) => t.time);
  const setTime = useAgendaStore((s) => s.setTime);
  const selectedDay = useAgendaStore((d) => d.selectedDay);
  const setDay = useAgendaStore((d) => d.setDay);
  const additionalInfo = useAgendaStore((a) => a.additionalInfo);
  const fitIn = useAgendaStore((f) => f.fitIn);
  const setFitIn = useAgendaStore((f) => f.setFitIn);

  const { formatDateToBR, timeStringToDate, dateToTimeString } = useFormatDate();

  // Hook form
  const { control, getValues, reset } = useForm({
    defaultValues: {
      additionalInfo: additionalInfo,
    },
  });

  useEffect(() => {
    if (!appointment) return;

    if (appointment.client) {
      setClient(appointment.client);
      setClientId(appointment.client.id);
    }

    const rawService = appointment.services?.[0]?.service ?? appointment.services?.[0];
    if (rawService) {
      const serviceObj = {
        ...rawService,
        id: (rawService as any).id ?? (rawService as any).serviceId,
        name: (rawService as any).name ?? (rawService as any).service?.name,
        imgUrl: (rawService as any).imgUrl ?? (rawService as any).service?.imgUrl,
        price: (rawService as any).price ?? (rawService as any).priceAtMoment ?? (rawService as any).service?.price,
      };
      setService(serviceObj as any);
      setServiceId(serviceObj.id);
    }

    if (appointment.dateScheduled) {
      const scheduledDate = new Date(appointment.dateScheduled);
      setDay(scheduledDate);
      setTime(format(scheduledDate, "HH:mm"));
    }

    if (appointment.schedulingFitIn !== undefined) {
      setFitIn(appointment.schedulingFitIn);
    }

    if (appointment.additionalInfo !== undefined) {
      reset({ additionalInfo: appointment.additionalInfo });
    }
  }, [
    appointment,
    setClient,
    setClientId,
    setService,
    setServiceId,
    setDay,
    setTime,
    setFitIn,
    reset,
  ]);

  // 🔹 UI / Infra
  const { handleError } = useErrorHandler();

  // 🔹 API
  const { useGetClientMutation } = useClientMutation();

  const {
    data: clientData,
    refetch: clientRefetch,
    isRefetching: clientIsRefetching,
    fetchNextPage: clientFetchNextPage,
    isLoading: clientIsLoading,
    hasNextPage: clientHasNextPage,
    isFetchingNextPage: clientIsFetchingNextPage,
  } = useGetClientMutation();

  const clientDataPagged =
    clientData?.pages.flatMap((page) => page.content ?? []) ?? [];

  const { useGetServiceMutation } = useCompanyServicesMutation();
  const {
    data: serviceData,
    refetch: serviceRefetch,
    isFetchingNextPage: serviceIsFetchingNextPage,
    hasNextPage: serviceHasNextPage,
    fetchNextPage: serviceFetchNextPage,
    isLoading: serviceIsLoading,
    isRefetching: serviceIsRefetching,
  } = useGetServiceMutation();

  const serviceDataPagged =
    serviceData?.pages.flatMap((page) => page.content ?? []) ?? [];

  const modal = useAppModal();
  const { close } = useModalStore();

  const [clients, setClients] = useState<ClientInterface[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);

  // ======================
  // CLIENTES
  // ======================
  async function handleOpenClientList() {
    try {
      setIsListLoading(true);
      setClients(clientDataPagged);
      const formatted = clientDataPagged.map((c) => ({
        id: c.id,
        title: c.name,
        description: c.lastName,
        imgUrl: c.profileUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,
        fetchNextPage: clientFetchNextPage,
        hasNextPage: clientHasNextPage,
        isRefetching: clientIsRefetching,
        isLoading: clientIsLoading,
        onRefetch: clientRefetch,
        getList: clientRefetch,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = clientDataPagged.find((c) => c.id === item.id);
          if (!selected) return;
          setClient(selected);
          setClientId(selected.id);
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
    }
  }

  // ======================
  // SERVIÇOS
  // ======================
  async function handleOpenServiceList() {
    try {
      setIsListLoading(true);
      const formatted = serviceDataPagged.map((s) => ({
        id: s.id,
        title: s.name,
        description: s.description,
        imgUrl: s.imgUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,
        isRefetching: serviceIsRefetching,
        fetchNextPage: serviceFetchNextPage,
        hasNextPage: serviceHasNextPage,
        isFetchingNextPage: serviceIsFetchingNextPage,
        isLoading: serviceIsLoading,
        getList: serviceRefetch,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = serviceDataPagged.find((c) => c.id === item.id);
          if (!selected) return;
          setServiceId(selected.id);
          setService(selected);
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar serviços");
    } finally {
      setIsListLoading(false);
    }
  }

  const [selectedAppointmentCancelId, setSelectedCancelAppointmentId] =
    useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { notify } = useSnackbarContext();
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  async function handleDeleteAppointment(data: AppointmentProps) {
    if (!selectedAppointmentCancelId) return;
    try {
      setIsDeleteLoading(true);

      const isCancelled =
        data.id === selectedAppointmentCancelId &&
        data.status === AppointmentStatus.CANCELED;

      if (isCancelled) {
        notify({ message: "Agendamento já está cancelado", type: "WARNING" });
        hideModal();
        return;
      }

      await cancelAppointmentByIdMutation.mutateAsync(selectedAppointmentCancelId);

      notify({ message: "Agendamento cancelado com sucesso", type: "SUCCESS" });
      hideModal();
      await appointmentRefetch();
      router.back();
    } catch (error) {
      handleError(error, "Falha ao cancelar agendamento");
    } finally {
      setIsDeleteLoading(false);
    }
  }

  async function updateBooking() {
    try {
      if (!employee.id || !clientId || !serviceId || !time || !selectedDay) {
        notify({
          message: "Preencha todos os dados do agendamento",
          type: "ERROR",
        });
        return;
      }

      const [hour, minute] = time.split(":");
      const dateTime = new Date(selectedDay);
      dateTime.setHours(Number(hour), Number(minute), 0, 0);

      const payload: AppointmentUpdateHttpParams = {
        dateScheduled:
          format(dateTime, "yyyy-MM-dd") + "T" + format(dateTime, "HH:mm:ss"),
        services: [
          {
            serviceId: serviceId ?? appointment?.services?.[0]?.serviceId,
          },
        ],
        status: AppointmentStatus.SCHEDULED,
        employeeId: employee.id,
        additionalInfo: getValues("additionalInfo"),
        clientId: clientId ?? appointment?.client?.id,
        schedulingFitIn: fitIn,
      };

      await updateAppointmentMutation.mutateAsync({
        id: appointmentId!,
        dataBody: payload,
      });

      await queryClient.invalidateQueries({ queryKey: ["appointments", appointmentId] });
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["agenda"] });
      await queryClient.invalidateQueries({ queryKey: ["available-appointments"] });
      await appointmentByIdRefetch();
      await appointmentRefetch();

      router.back();
      notify({ message: "Agendamento atualizado com sucesso", type: "SUCCESS" });
    } catch (err) {
      handleError(err, "Falha ao atualizar agendamento");
    }
  }

  async function handleMarkNoShow() {
    try {
      if (!appointmentId) return;

      const payload: AppointmentUpdateHttpParams = {
        status: AppointmentStatus.NO_SHOW,
      };

      await updateAppointmentMutation.mutateAsync({
        id: appointmentId,
        dataBody: payload,
      });

      await queryClient.invalidateQueries({ queryKey: ["appointments", appointmentId] });
      await queryClient.invalidateQueries({ queryKey: ["appointments"] });
      await queryClient.invalidateQueries({ queryKey: ["agenda"] });
      await queryClient.invalidateQueries({ queryKey: ["available-appointments"] });

      notify({ message: "Agendamento marcado como Não Compareceu (No-Show)", type: "WARNING" });
      router.back();
    } catch (err) {
      handleError(err, "Falha ao marcar como Não Compareceu");
    }
  }

  function showModal(id: number) {
    setSelectedCancelAppointmentId(id);
    setModalVisible(true);
  }

  function hideModal() {
    setModalVisible(false);
    setSelectedCancelAppointmentId(null);
  }

  return {
    appointment,
    hideModal,
    showModal,
    selectedAppointmentCancelId,
    modalVisible,
    selectedDay,
    formatDateToBR,
    timeStringToDate,
    dateToTimeString,
    setTime,
    time,
    fitIn,
    control,
    handleOpenClientList,
    handleOpenServiceList,
    isListLoading,
    isDeleteLoading,
    handleDeleteAppointment,
    handleMarkNoShow,
    setIsDeleteLoading,
    updateBooking,
    service,
    detailsLoading: appointmentDetailsLoading,
  };
}

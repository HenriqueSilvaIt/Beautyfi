import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import {
  AppointmentHttpStatusParams,
  AppointmentProps,
  AppointmentStatus,
} from "@/shared/interfaces/http/appointment";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useAppointmentMutation } from "@/shared/queries/company/use-appointment.mutation";

export function useBookingViewModel() {
  const { cancelAppointmentByIdMutation, useGetAppointmentMutation } =
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
  } = useGetAppointmentMutation();

  useFocusEffect(
    useCallback(() => {
      appointmentRefetch();
    }, [appointmentRefetch]),
  );

  const appointmentDataPagged = Array.from(
    new Map(
      (appointmentData?.pages.flatMap((page) => page.content ?? []) ?? []).map(
        (item) => [item.id, item],
      ),
    ).values(),
  );
  const [appointmentStatus, setAppointmentStatus] =
    useState<AppointmentStatus>();

  const [selectedAppointmentCancelId, setSelectedCancelAppointmentId] =
    useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { notify } = useSnackbarContext();

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const dataBody: AppointmentHttpStatusParams = {
    status: AppointmentStatus.CANCELED,
  };

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

  const { handleError } = useErrorHandler();

  // 🔹 Filtra localmente se quiser (opcional)
  const scheduledData = appointmentDataPagged.filter(
    (item) =>
      item.status === AppointmentStatus.SCHEDULED &&
      new Date(item.dateScheduled) >= new Date(),
  );
  return {
    appointmentDataPagged,
    appointmentRefetch,
    appointmentError,
    appointmentHasNextPage,
    appointmentIsFetchingNextPage,
    appointmentIsLoading,
    appointmentIsRefetching,
    scheduledData,
    modalVisible,
    handleDeleteAppointment,
    setAppointmentStatus,
    hideModal,
    showModal,
    isDeleteLoading,
    handleError,
    appointmentFetchNextPage,
  };
}

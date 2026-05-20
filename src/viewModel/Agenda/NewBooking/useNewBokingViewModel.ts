import { createElement, useCallback, useState } from "react";
import { format } from "date-fns";

import { AppCardBooking } from "@/shared/components/AppCardBooking";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useClientMutation } from "@/shared/queries/company/use.client.mutation";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { useBookingMutation } from "@/shared/queries/company/use-booking.mutation";
import {
  AppointmentHttpParams,
  AppointmentStatus,
} from "@/shared/interfaces/http/appointment";
import { ClientInterface } from "@/shared/interfaces/http/client";
import { CompanyServicesInterface } from "@/shared/interfaces/http/company-services";
import { router, useFocusEffect } from "expo-router";
import { useForm } from "react-hook-form";
import { useAppModal } from "@/shared/hooks/useAppModal";
import { useModalStore } from "@/shared/store/modal-store";

export function useNewBookingViewModel() {
  // 🔹 Store
  const setClient = useAgendaStore((s) => s.setClient);
  const setClientId = useAgendaStore((s) => s.setClientId);
  const setService = useAgendaStore((s) => s.setService);
  const setServiceId = useAgendaStore((s) => s.setServiceId);
  const employee = useAgendaStore((e) => e.employee);
  const clientId = useAgendaStore((c) => c.clientId);
  const serviceId = useAgendaStore((s) => s.serviceId);
  const time = useAgendaStore((t) => t.time);
  const selectedDay = useAgendaStore((d) => d.selectedDay);
  const additionalInfo = useAgendaStore((a) => a.additionalInfo);
  const fitIn = useAgendaStore((f) => f.fitIn);
  const client = useAgendaStore((s) => s.client);

  // Hook form com apenas 1 campo
  const { control, getValues } = useForm({
    defaultValues: {
      additionalInfo: additionalInfo,
    },
  });

  // 🔹 UI / Infra
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();
  const { notify } = useSnackbarContext();
  const { handleError } = useErrorHandler();

  // 🔹 API
  const { useGetClientMutation } = useClientMutation();

  const {
    data: clientData,
    error: clientError,
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
  const { createBookingAdminMutation } = useBookingMutation();

  const modal = useAppModal();
  const { close } = useModalStore();

  // 🔹 Cache local (evita refetch)
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
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
    }
  }
  const selectClient = (id: number) => {
    const selected = clients.find((c) => c.id === id);
    if (!selected) return;

    setClient(selected);
    setClientId(id);
    closeBottomSheet();
  };

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
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
    }
  }

  // ======================
  // CREATE BOOKING
  // ======================
  async function createBooking() {
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

      const payload: AppointmentHttpParams = {
        dateScheduled:
          format(dateTime, "yyyy-MM-dd") + "T" + format(dateTime, "HH:mm:ss"),
        services: [{ serviceId }],
        status: AppointmentStatus.SCHEDULED,
        employeeId: employee.id,
        additionalInfo: getValues("additionalInfo"),
        clientId: clientId,
        schedulingFitIn: fitIn,
      };
      console.log(payload);
      console.log(`Antes DO create`, payload);

      const data = await createBookingAdminMutation.mutateAsync(payload);
      console.log(`DEPOIS DO PAYLOAD`, data);

      setClient(undefined);
      setService(undefined);

      router.back();
      notify({
        message: "Agendamento realizado com sucesso",
        type: "SUCCESS",
      });
    } catch (err) {
      handleError(err, "Falha ao realizar agendamento");
    }
  }

  useFocusEffect(
    useCallback(() => {
      async function loadClients() {
        try {
          setClients(clientDataPagged);

          const defaultClient = clientDataPagged.find(
            (c) => c.name?.toLowerCase() === "sem cadastro",
          );

          if (defaultClient) {
            setClient(defaultClient);
            setClientId(defaultClient.id);
          }
        } catch (error) {
          handleError(error, "Falha ao carregar clientes");
        }
      }

      loadClients();
    }, []),
  );

  return {
    // state
    selectedDay,
    time,
    fitIn,
    control,
    // actions
    handleOpenClientList,
    handleOpenServiceList,
    createBooking,
    isListLoading,
  };
}

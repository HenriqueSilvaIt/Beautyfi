import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  cancelAppointmentById,
  deleteAppointment,
  getAppointmentAdmin,
  getAppointments,
  getAvailableAppointments,
} from "../../services/appointment.service";
import { AppointmentHttpStatusParams } from "@/shared/interfaces/http/appointment";
import { queryClient } from "../../../../queryClient";
import { AvailableAppointmentsHttpParams } from "@/shared/interfaces/http/available-appointments";
export interface AppointmentsAgendaProps {
  date: string;
  employeeId?: null | number;
}

export function useAppointmentMutation() {
  function useGetAppointmentMutation() {
    return useInfiniteQuery({
      queryKey: ["appointments"],
      queryFn: ({ pageParam = 0 }) => getAppointments(pageParam, 10),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 1000 * 60 * 3, // 5 minutos em cache, evita refetch imediato
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }

  function useGetAvailableAppointmentMutation(
    params: AvailableAppointmentsHttpParams,
  ) {
    return useInfiniteQuery({
      queryKey: [
        "available-appointments",
        params.employeeId,
        params.serviceIds?.join(","), // ✅ stable key
        params.date,
      ],
      queryFn: ({ pageParam = 0 }) =>
        getAvailableAppointments({ ...params }, pageParam, 10),
      initialPageParam: 0,
      enabled: !!params.serviceIds?.length && !!params.date, // ✅ não dispara sem serviceIds
      getNextPageParam: (lastPage) =>
        lastPage.last ? undefined : lastPage.number + 1,
      staleTime: 0,
      refetchOnWindowFocus: false,
    });
  }

  function useGetAgendaQuery(date: string, employeeId?: number | null) {
    return useQuery({
      queryKey: ["agenda", employeeId, date],
      queryFn: () => getAppointmentAdmin(date, employeeId),
      enabled: !!employeeId && !!date,
      staleTime: 0, // ✅ sempre considera dado stale — notifica mudanças
      gcTime: 1000 * 60 * 5, // ✅ mantém no cache por 5 min sem refetch desnecessário
      refetchOnWindowFocus: false,
    });
  }

  const getAppointmentAgenda = useMutation({
    mutationFn: ({ date, employeeId }: AppointmentsAgendaProps) =>
      getAppointmentAdmin(date, employeeId),
    onSuccess: (response) => {},
    onError: (error) => {
      console.log(error);
    },
  });

  const deletAppointmentById = useMutation({
    mutationFn: (appointmentId: number) => deleteAppointment(appointmentId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });

      queryClient.invalidateQueries({
        queryKey: ["available-appointments"],
        exact: false,
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });
  const cancelAppointmentByIdMutation = useMutation({
    mutationFn: (id: number) => cancelAppointmentById(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["available-appointments"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    getAppointmentAgenda,
    useGetAgendaQuery,
    deletAppointmentById,
    cancelAppointmentById,
    useGetAppointmentMutation,
    useGetAvailableAppointmentMutation,
    cancelAppointmentByIdMutation,
  };
}

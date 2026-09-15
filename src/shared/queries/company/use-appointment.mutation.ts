import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  cancelAppointmentById,
  deleteAppointment,
  getAppointmentAdmin,
  getAppointmentById,
  getAppointments,
  getAvailableAppointments,
  udpdateAppointment,
  getMonthlyAppointments,
} from "../../services/appointment.service";
import { AppointmentHttpStatusParams, AppointmentProps, AppointmentUpdateHttpParams } from "@/shared/interfaces/http/appointment";
import { queryClient } from "../../../../queryClient";
import { AvailableAppointmentsHttpParams } from "@/shared/interfaces/http/available-appointments";
export interface AppointmentsAgendaProps {
  date?: string;
  employeeId?: null | number;
  companyId?: number;
  startDate?: string;
  endDate?: string;
}

export function useAppointmentMutation() {
  function useGetAppointmentMutation(companyId?: number) {
    return useInfiniteQuery({
      queryKey: ["appointments", companyId],
      queryFn: ({ pageParam = 0 }) => getAppointments(pageParam, 10, companyId),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 0, // 5 minutos em cache, evita refetch imediato
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }


    function useGetAppointmentById(id: number) {
      return useQuery<AppointmentProps>({
        queryKey: ["appointments", id],
        queryFn: () => {
          if (!id) throw new Error("Id is required");
          return getAppointmentById(id);
        },
  
        enabled: Number.isFinite(id) && id > 0,
        staleTime: 0, // ✅ sempre considera dado stale — notifica mudanças
        gcTime: 1000 * 60 * 5, // ✅ mantém no cache por 5 min sem refetch desnecessário
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

  function useGetMonthlyAppointmentsQuery(startDate: string, endDate: string, companyId?: number) {
    return useQuery({
      queryKey: ["appointments-monthly", startDate, endDate, companyId],
      queryFn: () => getMonthlyAppointments(startDate, endDate, companyId),
      enabled: !!startDate && !!endDate,
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  }

  const getAppointmentAgenda = useMutation({
    mutationFn: ({ date, employeeId, companyId, startDate, endDate }: AppointmentsAgendaProps) =>
      getAppointmentAdmin(date, employeeId, companyId, startDate, endDate),
    onSuccess: (response) => {},
    onError: (error) => {
      console.log(error);
    },
  });

  const updateAppointmentMutation = useMutation({
    mutationFn: ({ id, dataBody }: { id: number; dataBody: AppointmentUpdateHttpParams }) =>
      udpdateAppointment(id, dataBody),
    onSuccess: (_response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["agenda"] });
      queryClient.invalidateQueries({ queryKey: ["available-appointments"] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ["appointments", variables.id] });
      }
    },
    onError: (error) => {
      console.error(error);
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
    useGetAppointmentById,
    cancelAppointmentByIdMutation,
    updateAppointmentMutation,
    useGetMonthlyAppointmentsQuery,
  };
}

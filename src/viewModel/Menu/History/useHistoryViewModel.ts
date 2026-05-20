import { useAppointmentMutation } from "@/shared/queries/company/use-appointment.mutation";
import { useFocusEffect } from "expo-router";

export function useHistoryViewModel() {

    const {  useGetAppointmentMutation } =
      useAppointmentMutation();
  
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
      
  return {
    appointmentDataPagged,
    appointmentRefetch,
    appointmentError,
    appointmentHasNextPage,
    appointmentIsFetchingNextPage,
    appointmentIsLoading,
    appointmentIsRefetching,
  };
}

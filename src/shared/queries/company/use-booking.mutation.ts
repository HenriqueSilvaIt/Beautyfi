import { useMutation } from "@tanstack/react-query";
import {
  AppointmentBlockHttpParams,
  AppointmentHttpParams,
} from "../../interfaces/http/appointment";
import {
  blockBookingAdmin,
  booking,
  bookingAdmin,
} from "../../services/booking.service";
import { queryClient } from "../../../../queryClient";

export function useBookingMutation() {
  const createBookingMutation = useMutation({
    mutationFn: (dataBody: AppointmentHttpParams) => booking(dataBody),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["available-appointments"] });

      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const createBookingAdminMutation = useMutation({
    mutationFn: (dataBody: AppointmentHttpParams) => bookingAdmin(dataBody),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["available-appointments"] });

      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const blockBookingAdminMutation = useMutation({
    mutationFn: (dataBody: AppointmentBlockHttpParams) =>
      blockBookingAdmin(dataBody),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
      queryClient.invalidateQueries({ queryKey: ["available-appointments"] });

      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    createBookingMutation,
    blockBookingAdminMutation,
    createBookingAdminMutation,
  };
}

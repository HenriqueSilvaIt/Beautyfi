import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import {
  AppointmentBlockHttpParams,
  AppointmentStatus,
} from "@/shared/interfaces/http/appointment";
import { useBookingMutation } from "@/shared/queries/company/use-booking.mutation";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { router } from "expo-router";
import { useAppointmentMutation } from "@/shared/queries/company/use-appointment.mutation";

export function useBlockAgendaViewModel() {
  const employee = useAgendaStore((e) => e.employee);
  const startDate = useAgendaStore((s) => s.selectedDayBlockStart);
  const endDate = useAgendaStore((e) => e.selectedDayBlockEnd);

  const { formatDateToDateTimeIso } = useFormatDate();


  const { notify } = useSnackbarContext();

  const { handleError } = useErrorHandler();

  const { blockBookingAdminMutation } = useBookingMutation();

  async function blockBooking() {
    try {
      if (!employee.id) {
        notify({
          message: "Preencha todos os dados do agendamento",
          type: "ERROR",
        });

        return;
      }

      const payload: AppointmentBlockHttpParams = {
        dateScheduled: formatDateToDateTimeIso(startDate),
        dateEnd: formatDateToDateTimeIso(endDate),
        status: AppointmentStatus.SCHEDULED,
        employeeId: employee.id,
        blocked: true,
      };
      console.log(payload);
      console.log(`Antes DO create`, payload);

      const data = await blockBookingAdminMutation.mutateAsync(payload);
      console.log(`DEPOIS DO PAYLOAD`, data);

      router.back();
      notify({
        message: "Agendamento realizado com sucesso",
        type: "SUCCESS",
      });
    } catch (err) {
      handleError(err, "Falha ao realizar agendamento");
    }
  }

  return {
    employee,
    blockBooking,
  };
}

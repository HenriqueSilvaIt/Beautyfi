import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppAppointmentCard } from "@/shared/components/AppAppointmentCard";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { ScrollView, View } from "react-native";
import { useHistoryViewModel } from "./useHistoryViewModel";
import { SafeAreaView } from "react-native-safe-area-context";

export function HistoryView({
 appointmentDataPagged,
    appointmentRefetch,
    appointmentError,
    appointmentHasNextPage,
    appointmentIsFetchingNextPage,
    appointmentIsLoading,
    appointmentIsRefetching,
}: ReturnType<typeof useHistoryViewModel>) {

  return (
    <SafeAreaView edges={['top']} className="flex-1">
          <AppAdminHeader
            title="Histórico de agendamentos"
            iconRightName={undefined}
            iconRight={{
              icon: true,
              path: "",
            }}
          />

          <AppAppointmentCard
             data={appointmentDataPagged}
          appointmentRefetch={appointmentRefetch}
          appointmentHasNextPage={appointmentHasNextPage}
          appointmentIsFetchingNextPage={appointmentIsFetchingNextPage}
          appointmentIsLoading={appointmentIsLoading}
          appointmentIsRefetching={appointmentIsRefetching}

          />
    </SafeAreaView>
  );
}

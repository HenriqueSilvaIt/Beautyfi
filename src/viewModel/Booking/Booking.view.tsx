import { Image, Text, TouchableOpacity } from "react-native";
import { useBookingViewModel } from "./useBookingViewModel";
import { View } from "react-native";
import { AppHeader } from "../../shared/components/AppHeader";
import { useUserStore } from "../../shared/store/user-store";
import { KeyboardContainer } from "../../shared/components/KeyboardContainer";
import { AppAppointmentCard } from "../../shared/components/AppAppointmentCard";
import { useHomeViewModel } from "../Home/useHomeViewModel";
import { SafeAreaView } from "react-native-safe-area-context";

export function BookingView({
  scheduledData,
  isDeleteLoading,
  showModal,
  modalVisible,
  hideModal,
  handleDeleteAppointment,
  appointmentDataPagged,
  appointmentRefetch,
appointmentFetchNextPage,
  appointmentHasNextPage,
  appointmentIsFetchingNextPage,
  appointmentIsLoading,
  appointmentIsRefetching,
}: ReturnType<typeof useBookingViewModel>) {
  const { user, access_token } = useUserStore();
  const { company } = useHomeViewModel();

  return (
    <>
      <SafeAreaView edges={["top"]} className="flex-1 bg-background-primary">
        <AppHeader user={user} token={access_token} company={company} />

        <View className="mt-2 px-2 items-center mb-5">
          <Text className="text-2xl text-font-primary font-bold">Agendamentos</Text>
        </View>

        <AppAppointmentCard
          data={scheduledData}
          handleDeleteAppointment={handleDeleteAppointment}
          iconRight={true}
          modalVisible={modalVisible}
          hideModal={hideModal}
          appointmentRefetch={appointmentRefetch}
          appointmentHasNextPage={appointmentHasNextPage}
          appointmentIsFetchingNextPage={appointmentIsFetchingNextPage}
          appointmentIsLoading={appointmentIsLoading}
          appointmentFetchNextPage={appointmentFetchNextPage}
          appointmentIsRefetching={appointmentIsRefetching}
          isDeleteLoading={isDeleteLoading}
          showModal={showModal}
        />
      </SafeAreaView>
    </>
  );
}

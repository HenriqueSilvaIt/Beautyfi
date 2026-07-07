import { AppDaySelector } from "@/shared/components/AppDaySelector";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useAgendaViewModel } from "./useAgendaViewModel";
import { AppEmployeeSelector } from "@/shared/components/AppEmployeeSelector";
import { AppAgenda } from "@/shared/components/AppAgenda";
import { Loading } from "@/shared/components/Loading";
import { colors } from "@/styles/colors";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { SafeAreaView } from "react-native-safe-area-context";

export function AgendaView({
  employeeDataPagged,
  agendaLoading,
  employeeId,
  employee,
  setCurrentDate,
  currentDate,
  handleSetToday,
  selectedDay,
  handleEmployeeSelect,
  handleDateSelect,
  scrollRef,
  isWorkingTime,
  getCurrentTimePosition,
  handleSlotPress,
  overlapsAppointment,
  CONTENT_HEIGHT,
  SLOT_HEIGHT,
  blockedRanges,
  getEndTime,
  appointmentGroups,
  slots,
  selectedTime,
  isDeleting,
  deleteAppointmentBlocked,
  setSelectedAppointmentId,
  selectedAppointmentId,
  selectedAppointmentCancelId,
  setSelectedCancelAppointmentId,
  appointments,
  currentY,
  openMenu,
  setOpenMenu,
  onDeleteAppointment,
  modalVisible,
  isLoading,
  showModal,
  employeeRefetch,
  employeeIsRefetching,
  employeeIsLoading,
  employeeFetchNextPage,
  employeeHasNextPage,
  employeeIsFetchingNextPage,
  hideModal,
  isDeleteLoading,
}: ReturnType<typeof useAgendaViewModel>) {
  const { safePush } = useSafeNavigation();

  function handleBlockAgendaButton() {
    setOpenMenu(false);
    safePush("/(private)/(tabs)/(admin-tabs)/agenda/block-agenda");
  }

  function handleNewBookingButton() {
    setOpenMenu(false);
    safePush("/(private)/(tabs)/(admin-tabs)/agenda/new-booking");
  }

  if (agendaLoading) {
    return <Loading />;
  }
  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-agenda">
      <StatusBar
        barStyle="dark-content" // ícones escuros, bom para fundo branco
        backgroundColor={colors["background-primary"]} // funciona só no Android
      />
      <View className=" pt-3 justify-center pb-3 bg-background-primary">
        <AppDaySelector
          selectedDay={selectedDay}
          setCurrentDate={setCurrentDate}
          currentDate={currentDate}
          handleDateSelect={handleDateSelect}
        />
      </View>

      {employeeDataPagged && (
        <View className="mb-4 items-center  py-2 border-t bg-background-primary border-gray-600">
          <AppEmployeeSelector
            employeeId={employeeId}
            employeeIsSelected
            employees={employeeDataPagged}
            handleEmployeeSelect={handleEmployeeSelect}
            type="admin"
            onRefetch={employeeRefetch}
            hasNextPage={employeeHasNextPage}
            isFetchingNextPage={employeeIsFetchingNextPage}
            isLoading={employeeIsLoading}
            isRefetching={employeeIsRefetching}
            fetchNextPage={employeeFetchNextPage}
          />
        </View>
      )}
      {appointments && (
        <View className="flex-1 bg-background-agenda">
          <AppAgenda
            appointments={appointments}
            safeEmployee={employee}
            CONTENT_HEIGHT={CONTENT_HEIGHT}
            SLOT_HEIGHT={SLOT_HEIGHT}
            blockedRanges={blockedRanges}
            getCurrentTimePosition={getCurrentTimePosition}
            slots={slots}
            scrollRef={scrollRef}
            selectedTime={selectedTime}
            overlapsAppointment={overlapsAppointment}
            isWorkingTime={isWorkingTime}
            currentY={currentY}
            getEndTime={getEndTime}
            appointmentGroups={appointmentGroups}
            handleSlotPress={handleSlotPress}
            isDeleting={isDeleting}
            hideModal={hideModal}
            showModal={showModal}
            isDeleteLoading={isDeleteLoading}
            modalVisible={modalVisible}
            handleDeleteAppointment={onDeleteAppointment}
            setSelectedAppointmentId={setSelectedAppointmentId}
            selectedAppointmentCancelId={selectedAppointmentCancelId}
            setSelectedCancelAppointmentId={setSelectedCancelAppointmentId}
            selectedAppointmentId={selectedAppointmentId}
            deleteAppointmentBlocked={deleteAppointmentBlocked}
          />
        </View>
      )}

      {/* BOTÃO FLUTUANTE */}
      {openMenu && (
        <TouchableOpacity
          className="absolute inset-0 bg-black/50"
          activeOpacity={1}
          onPress={() => setOpenMenu(false)}
        >
          <View className="absolute right-4 bottom-32 ">
            <TouchableOpacity
              onPressIn={handleNewBookingButton}
              className="bg-app-theme-primary px-4 py-3 rounded-xl mb-2 shadow"
              onPress={() => {}}
            >
              <Text className="text-font-secundary font-semibold">Novo agendamento</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white px-4 py-3 rounded-xl mb-2 shadow"
              onPress={handleBlockAgendaButton}
            >
              <Text className="text-font-primary font-semibold">Bloquear horário</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}

      <View className="absolute right-4 bottom-10">
        <TouchableOpacity
          className="w-[60px] h-[60px] rounded-full bg-background-tertiary justify-center items-center shadow"
          onPress={() => setOpenMenu(!openMenu)}
        >
          <Text className="text-font-primary text-3xl">+</Text>
        </TouchableOpacity>
      </View>
      {!isToday(currentDate) && (
        <View className="absolute left-14 bottom-10">
          <TouchableOpacity
            className="p-3 rounded-md bg-app-theme-primary justify-center items-center"
            onPress={handleSetToday}
          >
            <Text className="text-font-secundary -600 text-sm">Hoje</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

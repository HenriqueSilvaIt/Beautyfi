import { ActivityIndicator, View } from "react-native";
import { useScheduleViewModel } from "./useSchedule.viewModel";
import { AppSchedule } from "../../shared/components/AppSchedule";
import { KeyboardContainer } from "../../shared/components/KeyboardContainer";
import { DeleteModal } from "@/shared/components/AppDeleteModal";
import { colors } from "@/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Loading } from "@/shared/components/Loading";

export function ScheduleView({
  setEmployeeId,

  setDateScheduled,
  employeeId,
  dateScheduled,
  dataBody,
  setDataBody,
  createBooking,
  employeesWithNoPreference,
  employeeIsSelected,
  handleDateSelect,
  handleEmployeeSelect,
  handleHourSelect,
  localDate,
  selectedDay,
  setSelectedDay,
  currentDate,
  initialized,
  setCurrentDate,
  handleEnableWhatsapp,
  showWhatsappModal,
  handleDisableWhatsapp,
  isHoursLoading,
  isLoadingMessage,
  availableAppointments,
  appointmentRefetch,
  appointmentError,
  appointmentHasNextPage,
  appointmentIsFetchingNextPage,
  appointmentIsLoading,
  appointmentIsRefetching,
  appointmentFetchNextPage,
  allEmployeeIsLoading,
  appointmentData,
  createIsLoading,
  hoursForEmployee,
}: ReturnType<typeof useScheduleViewModel>) {

  if (createIsLoading) {
    return <Loading/>
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppSchedule
        data={availableAppointments}
        appointmentData={appointmentData}
        setDateScheduled={setDateScheduled}
        setEmployeeId={setEmployeeId}
        employeeId={employeeId}
        dateScheduled={dateScheduled}
        dataBody={dataBody}
        setDataBody={setDataBody}
        createBooking={createBooking}
        setCurrentDate={setCurrentDate}
        currentDate={currentDate}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        createIsLoading={createIsLoading}
        employeesWithNoPreference={employeesWithNoPreference}
        employeeIsSelected={employeeIsSelected}
        handleEmployeeSelect={handleEmployeeSelect}
        handleHourSelect={handleHourSelect}
        handleDateSelect={handleDateSelect}
        hoursForEmployee={hoursForEmployee}
        allEmployeeIsLoading={allEmployeeIsLoading}
        appointmentRefetch={appointmentRefetch}
        appointmentFetchNextPage={appointmentFetchNextPage}
        appointmentHasNextPage={appointmentHasNextPage}
        appointmentIsFetchingNextPage={appointmentIsFetchingNextPage}
        appointmentIsLoading={appointmentIsLoading}
        appointmentIsRefetching={appointmentIsRefetching}
        initialized={initialized}
        isHoursLoading={isHoursLoading}

      />

      <DeleteModal
        visible={showWhatsappModal}
        hideModal={handleDisableWhatsapp} // não ativ
        handleDelete={() => handleEnableWhatsapp()} // ativa WhatsApp
        loading={isLoadingMessage}
        title="Confirmação por WhatsApp"
        description="Deseja receber  lembretes e confirmações de agendamentos pelo WhatsApp?"
        confirmationButtonText="Sim"
        cancelbuttonText="Não"
        confirmationButtonColor={true} // laranja
      />
    </SafeAreaView>
  );
}

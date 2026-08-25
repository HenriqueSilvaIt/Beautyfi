import { AppDaySelector } from "@/shared/components/AppDaySelector";
import { StatusBar, Text, TouchableOpacity, View } from "react-native";
import { useAgendaViewModel } from "./useAgendaViewModel";
import { AppEmployeeSelector } from "@/shared/components/AppEmployeeSelector";
import { AppAgenda } from "@/shared/components/AppAgenda";
import { AppWeeklyAgenda } from "@/shared/components/AppWeeklyAgenda";
import { AppMonthlyAgenda } from "@/shared/components/AppMonthlyAgenda";
import { Loading } from "@/shared/components/Loading";
import { colors } from "@/styles/colors";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "@/shared/components/AppHeader";
import { useUserStore } from "@/shared/store/user-store";
import { useState } from "react";

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
  employeeIsSelected,
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
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");

  function handleBlockAgendaButton() {
    setOpenMenu(false);
    safePush("/(private)/(tabs)/(admin-tabs)/agenda/block-agenda");
  }

  function handleNewBookingButton() {
    setOpenMenu(false);
    safePush("/(private)/(tabs)/(admin-tabs)/agenda/new-booking");
  }
  const { user, access_token } = useUserStore();

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

  const handleAppointmentPress = (id: number) => {
    safePush(`/(private)/(tabs)/(admin-tabs)/agenda/booking-details/${id}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#FFFFFF"
      />
      
      <AppHeader user={user} token={access_token} />

      {/* View Mode Selector: Dia / Semana / Mês */}
      <View className="flex-row items-center justify-between px-4 py-2.5 bg-white border-b border-slate-200 shadow-xs">
        <Text className="text-slate-900 text-xs font-black uppercase tracking-wider">
          Visualização
        </Text>
        <View className="flex-row bg-slate-100 rounded-xl p-1 gap-1 border border-slate-200/80">
          <TouchableOpacity
            onPress={() => setViewMode("day")}
            activeOpacity={0.8}
            className={`px-3.5 py-1.5 rounded-lg ${
              viewMode === "day" ? "bg-[#092D5D] shadow-xs" : ""
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                viewMode === "day" ? "text-white" : "text-slate-600"
              }`}
            >
              Dia
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewMode("week")}
            activeOpacity={0.8}
            className={`px-3.5 py-1.5 rounded-lg ${
              viewMode === "week" ? "bg-[#092D5D] shadow-xs" : ""
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                viewMode === "week" ? "text-white" : "text-slate-600"
              }`}
            >
              Semana
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewMode("month")}
            activeOpacity={0.8}
            className={`px-3.5 py-1.5 rounded-lg ${
              viewMode === "month" ? "bg-[#092D5D] shadow-xs" : ""
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                viewMode === "month" ? "text-white" : "text-slate-600"
              }`}
            >
              Mês
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* RENDERIZADO CONFORME O MODO DE VISUALIZAÇÃO */}
      {viewMode === "day" && (
        <>
          <View className="pt-3 justify-center pb-3 bg-background-primary">
            <AppDaySelector
              selectedDay={selectedDay}
              setCurrentDate={setCurrentDate}
              currentDate={currentDate}
              handleDateSelect={handleDateSelect}
            />
          </View>

          {employeeDataPagged && (
            <View className="mb-4 items-center py-2 border-t bg-background-primary border-gray-600">
              <AppEmployeeSelector
                employeeId={employeeId}
                employeeIsSelected={employeeIsSelected}
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
        </>
      )}

      {viewMode === "week" && (
        <AppWeeklyAgenda
          currentDate={currentDate}
          appointments={appointments || []}
          onAppointmentPress={handleAppointmentPress}
          onSelectDay={(date) => {
            handleDateSelect(date);
            setViewMode("day");
          }}
        />
      )}

      {viewMode === "month" && (
        <AppMonthlyAgenda
          currentDate={currentDate}
          appointments={appointments || []}
          onAppointmentPress={handleAppointmentPress}
          onSelectDay={(date) => {
            handleDateSelect(date);
            setViewMode("day");
          }}
        />
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
              <Text className="text-font-secundary font-semibold">
                Novo agendamento
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white px-4 py-3 rounded-xl mb-2 shadow"
              onPress={handleBlockAgendaButton}
            >
              <Text className="text-font-primary font-semibold">
                Bloquear horário
              </Text>
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
      {viewMode === "day" && !isToday(currentDate) && (
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

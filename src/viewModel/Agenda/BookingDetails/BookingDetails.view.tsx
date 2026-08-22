import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useBookingDetailsViewModel } from "./useBookingDetailsViewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { AppInputController } from "@/shared/components/AppInputControler";
import { useState } from "react";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { moneyMapper } from "@/utils/moneyMapper";
import { DeleteModal } from "@/shared/components/AppDeleteModal";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { Loading } from "@/shared/components/Loading";
import { AppTimeSelector } from "@/shared/components/AppTimeSelector";
import { AppDateSelector } from "@/shared/components/AppDateSelector";
import { AppointmentStatus } from "@/shared/interfaces/http/appointment";

export function BookingDetailsView({
  appointment,
  selectedDay,
  setTime,
  time,
  fitIn,
  control,
  service,
  detailsLoading,
  handleOpenClientList,
  isDeleteLoading,
  handleDeleteAppointment,
  handleOpenServiceList,
  handleMarkNoShow,
  formatDateToBR,
  timeStringToDate,
  dateToTimeString,
  hideModal,
  showModal,
  modalVisible,
  updateBooking,
}: ReturnType<typeof useBookingDetailsViewModel>) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { setFitIn } = useAgendaStore();
  const { safePush } = useSafeNavigation();

  const setDate = useAgendaStore((s) => s.setDay);
  const employee = useAgendaStore((s) => s.employee);
  const client = useAgendaStore((s) => s.client);

  const themeGold = colors["app-theme-secundary"] || "#CBA35D";

  if (detailsLoading) {
    return <Loading />;
  }

  const isConfirmationSent = appointment?.confirmationSent ?? false;
  const isReminderSent = appointment?.reminderSent ?? false;
  const isNoShow = appointment?.status === AppointmentStatus.NO_SHOW;

  return (
    <KeyboardContainer>
      <ScrollView className="bg-background-primary flex-1">
        <AppAdminHeader
          title={`Comanda Nº ${appointment?.orderNumber || appointment?.id || ""}`}
          iconRightName="trash"
          iconRight={{
            icon: true,
            path: "",
          }}
          action={() => showModal(appointment!.id)}
        />

        <View className="px-4 py-3 gap-4 pb-12">
          {/* Banner Status No-Show */}
          {isNoShow && (
            <View className="bg-red-500/15 border border-red-500/40 p-3.5 rounded-2xl flex-row items-center gap-3">
              <Ionicons name="alert-circle" size={22} color="#EF4444" />
              <View className="flex-1">
                <Text className="text-red-400 font-bold text-sm">
                  Não Compareceu (No-Show)
                </Text>
                <Text className="text-font-secondary text-xs mt-0.5">
                  Este cliente faltou ao agendamento agendado.
                </Text>
              </View>
            </View>
          )}

          {/* Status das Notificações WhatsApp */}
          <View className="bg-background-quartenary rounded-2xl p-4 border border-white/5 shadow-md">
            <View className="flex-row items-center gap-2 mb-3">
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <Text className="text-font-primary text-base font-bold">
                Notificações WhatsApp
              </Text>
            </View>

            <View className="gap-2.5">
              {/* Confirmação */}
              <View className="flex-row items-center justify-between bg-background-tertiary px-3.5 py-2.5 rounded-xl">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name={isConfirmationSent ? "checkmark-circle" : "time-outline"}
                    size={18}
                    color={isConfirmationSent ? "#25D366" : "#F59E0B"}
                  />
                  <Text className="text-font-primary text-xs font-semibold">
                    Confirmação
                  </Text>
                </View>
                <View
                  className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${
                    isConfirmationSent
                      ? "bg-emerald-500/15 border border-emerald-500/30"
                      : "bg-amber-500/15 border border-amber-500/30"
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      isConfirmationSent ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {isConfirmationSent ? "Enviada" : "Pendente"}
                  </Text>
                </View>
              </View>

              {/* Lembrete */}
              <View className="flex-row items-center justify-between bg-background-tertiary px-3.5 py-2.5 rounded-xl">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name={isReminderSent ? "checkmark-circle" : "time-outline"}
                    size={18}
                    color={isReminderSent ? "#25D366" : "#F59E0B"}
                  />
                  <Text className="text-font-primary text-xs font-semibold">
                    Lembrete Automático
                  </Text>
                </View>
                <View
                  className={`px-2.5 py-1 rounded-full flex-row items-center gap-1 ${
                    isReminderSent
                      ? "bg-emerald-500/15 border border-emerald-500/30"
                      : "bg-amber-500/15 border border-amber-500/30"
                  }`}
                >
                  <Text
                    className={`text-[11px] font-bold ${
                      isReminderSent ? "text-emerald-400" : "text-amber-400"
                    }`}
                  >
                    {isReminderSent ? "Enviado" : "Pendente"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Data e Hora */}
          <View className="bg-background-quartenary rounded-2xl p-4 border border-white/5 shadow-md gap-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={18} color={themeGold} />
              <Text className="text-font-primary text-base font-bold">
                Data e Horário
              </Text>
            </View>

            <View className="flex-row gap-3 items-center justify-center bg-background-tertiary p-3 rounded-xl">
              <AppDateSelector
                selectedDay={selectedDay}
                setShowDatePicker={setShowDatePicker}
                formatDateToBR={formatDateToBR}
                setDate={setDate}
                showDatePicker={showDatePicker}
              />
              <AppTimeSelector
                showTimePicker={showTimePicker}
                setShowTimePicker={setShowTimePicker}
                time={time}
                setTime={setTime}
                timeStringToDate={timeStringToDate}
                dateToTimeString={dateToTimeString}
              />
            </View>

            {/* Toggle Encaixe */}
            <View className="bg-background-tertiary p-3 rounded-xl">
              <View className="flex-row items-center justify-between">
                <View className="flex-1 pr-2">
                  <Text className="text-font-primary text-sm font-semibold">
                    Encaixe
                  </Text>
                  <Text className="text-font-secondary text-[11px] mt-0.5">
                    Permite agendar ignorando conflitos na agenda
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setFitIn(!fitIn)}
                  activeOpacity={0.8}
                >
                  <MaterialCommunityIcons
                    name={
                      fitIn ? "toggle-switch" : "toggle-switch-off-outline"
                    }
                    size={38}
                    color={fitIn ? "#10B981" : "#6B7280"}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Cliente */}
          <View className="bg-background-quartenary rounded-2xl p-4 border border-white/5 shadow-md gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="person-outline" size={18} color={themeGold} />
                <Text className="text-font-primary text-base font-bold">
                  Cliente
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleOpenClientList()}>
                <Text className="text-accent-gold text-xs font-semibold">Alterar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleOpenClientList()}
              className="flex-row items-center gap-3 bg-background-tertiary p-3.5 rounded-xl"
            >
              {client?.profileUrl ? (
                <Image
                  source={{ uri: client.profileUrl }}
                  resizeMode="cover"
                  className="h-[40px] w-[40px] rounded-full border-2 border-accent-gold"
                />
              ) : (
                <View className="w-[40px] h-[40px] rounded-full bg-accent-gold/20 items-center justify-center border border-accent-gold/40">
                  <Ionicons name="person" size={28} color={themeGold} />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-font-primary font-bold text-base">
                  {client ? client.name : "Selecione um cliente"}
                </Text>
                {client?.phone && (
                  <Text className="text-font-secondary text-xs mt-1">
                    {client.phone}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Profissional */}
          {employee && (
            <View className="bg-background-quartenary rounded-2xl p-4 border border-white/5 shadow-md gap-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="cut-outline" size={18} color={themeGold} />
                <Text className="text-font-primary text-base font-bold">
                  Profissional
                </Text>
              </View>

              <View className="flex-row items-center gap-3 bg-background-tertiary p-3.5 rounded-xl">
                {employee.avatarUrl ? (
                  <Image
                    source={{ uri: employee.avatarUrl }}
                    resizeMode="cover"
                    className="h-[40px] w-[40px] rounded-full border-2 border-white/10"
                  />
                ) : (
                  <View className="w-[40px] h-[40px] rounded-full bg-background-primary items-center justify-center border border-white/10">
                    <Ionicons name="person" size={28} color="#9CA3AF" />
                  </View>
                )}
                <Text className="text-font-primary font-bold text-base">
                  {employee.name}
                </Text>
              </View>
            </View>
          )}

          {/* Serviço */}
          <View className="bg-background-quartenary rounded-2xl p-4 border border-white/5 shadow-md gap-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <Ionicons name="sparkles-outline" size={18} color={themeGold} />
                <Text className="text-font-primary text-base font-bold">
                  Serviço
                </Text>
              </View>
              <TouchableOpacity onPress={handleOpenServiceList}>
                <Text className="text-accent-gold text-xs font-semibold">Alterar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenServiceList}
              className="flex-row items-center gap-3 bg-background-tertiary p-3.5 rounded-xl"
            >
              {(() => {
               service?.imgUrl ? (
                  <Image
                    source={{ uri: service.imgUrl }}
                    resizeMode="cover"
                    className="h-[44px] w-[44px] rounded-xl border border-white/10"
                  />
                ) : (
                  <View className="w-[44px] h-[44px] rounded-xl bg-accent-gold/20 items-center justify-center border border-accent-gold/40">
                    <Ionicons name="cut" size={24} color={themeGold} />
                  </View>
                );
              })()}
              <View className="flex-1">
                <Text className="text-font-primary font-bold text-base">
                  {service ? service.name : "Selecione um serviço"}
                </Text>
                {service && (
                  <Text className="text-accent-gold font-bold text-sm mt-1">
                    R$ {moneyMapper(service.price)}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Informações adicionais */}
          <View className="bg-background-quartenary rounded-2xl p-4 border border-white/5 shadow-md">
            <AppInputController
              leftIcon="information-circle-outline"
              label="Informações adicionais"
              control={control}
              name="additionalInfo"
              placeholder="Adicionar observações..."
              className="w-full"
              placeholderTextColor={colors.gray[600]}
              multiline={true}
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>

      {/* Botões de Ação */}
      <View className="p-4 bg-background-quartenary border-t border-white/5 gap-2.5">
        <View className="flex-row items-center justify-between gap-2.5">
          <TouchableOpacity
            onPress={() => {
              hideModal();
              safePush(
                `/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${appointment?.orderId ?? appointment?.id}`,
              );
            }}
            activeOpacity={0.8}
            className="flex-1 bg-background-tertiary py-3.5 px-3 rounded-xl items-center border border-white/10"
          >
            <Text className="text-font-primary font-bold text-xs">
              Comanda
            </Text>
          </TouchableOpacity>

          {!isNoShow && (
            <TouchableOpacity
              onPress={handleMarkNoShow}
              activeOpacity={0.8}
              className="flex-1 bg-red-500/15 py-3.5 px-3 rounded-xl items-center border border-red-500/30"
            >
              <Text className="text-red-400 font-bold text-xs">
                Não compareceu
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={updateBooking}
            activeOpacity={0.8}
            className="flex-1 py-3.5 px-3 bg-app-theme-primary rounded-xl items-center"
          >
            <Text className="text-font-secundary font-bold text-xs">
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal de confirmação de cancelamento */}
      {modalVisible && (
        <DeleteModal
          loading={isDeleteLoading}
          visible={modalVisible}
          confirmationButtonText="Confirmar"
          confirmationButtonColor
          cancelbuttonText="Não cancelar"
          hideModal={hideModal}
          appointment={appointment}
          handleDeleteAppointment={async (appointmentsToDelete) => {
            const appointmentToDelete = Array.isArray(appointmentsToDelete)
              ? appointmentsToDelete[0]
              : appointmentsToDelete;

            if (appointmentToDelete) {
              await handleDeleteAppointment(appointmentToDelete);
            }

            hideModal();
          }}
          description="Tem certeza que deseja cancelar o agendamento?"
          title="Cancelar agendamento"
        />
      )}
    </KeyboardContainer>
  );
}

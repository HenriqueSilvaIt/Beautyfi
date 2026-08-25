import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useBookingDetailsViewModel } from "./useBookingDetailsViewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { Image, Text, TouchableOpacity, View, ScrollView, Linking } from "react-native";
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

  if (detailsLoading) {
    return <Loading />;
  }

  const isConfirmationSent = appointment?.confirmationSent ?? false;
  const isReminderSent = appointment?.reminderSent ?? false;
  const isNoShow = appointment?.status === AppointmentStatus.NO_SHOW;

  return (
    <KeyboardContainer>
      <View className="bg-slate-50 flex-1">
        <AppAdminHeader
          title={`Comanda Nº ${appointment?.orderNumber || appointment?.id || ""}`}
          iconRightName="trash"
          iconRight={{
            icon: true,
            path: "",
          }}
          action={() => showModal(appointment!.id)}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Banner Status No-Show */}
          {isNoShow ? (
            <View className="bg-red-50 border border-red-200 p-5 rounded-2xl flex-row items-center gap-3.5 mb-4 shadow-sm">
              <View className="w-12 h-12 rounded-full bg-red-100 items-center justify-center">
                <Ionicons name="alert-circle" size={24} color="#EF4444" />
              </View>
              <View className="flex-1">
                <Text className="text-red-700 font-black text-sm">
                  Não Compareceu (No-Show)
                </Text>
                <Text className="text-red-600 text-xs font-medium mt-0.5">
                  Este cliente faltou ao agendamento agendado.
                </Text>
              </View>
            </View>
          ) : (
            <View className="bg-white border border-gray-200/80 p-5 rounded-2xl flex-row items-center justify-between mb-4 shadow-sm">
              <View className="flex-row items-center gap-3.5">
                <View className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 items-center justify-center">
                  <Ionicons name="checkmark-circle" size={24} color="#10B981" />
                </View>
                <View>
                  <Text className="text-gray-900 font-black text-sm">
                    Agendamento Ativo
                  </Text>
                  <Text className="text-gray-600 text-xs font-semibold mt-0.5">
                    Comanda Nº {appointment?.orderNumber || appointment?.id || "—"}
                  </Text>
                </View>
              </View>
              <View className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                <Text className="text-emerald-700 font-black text-[10px] uppercase">Confirmado</Text>
              </View>
            </View>
          )}

          {/* Status das Notificações WhatsApp */}
          <View className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm mb-4">
            <View className="flex-row items-center gap-2 border-b border-gray-100 pb-3.5 mb-3.5">
              <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
              <Text className="text-gray-900 text-sm font-black flex-1">
                Notificações WhatsApp
              </Text>
            </View>

            <View className="gap-2.5">
              {/* Confirmação */}
              <View className="flex-row items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl border border-gray-200">
                <View className="flex-row items-center gap-2.5">
                  <Ionicons
                    name={isConfirmationSent ? "checkmark-circle" : "time-outline"}
                    size={20}
                    color={isConfirmationSent ? "#25D366" : "#F59E0B"}
                  />
                  <Text className="text-gray-900 text-xs font-bold">
                    Confirmação de Agendamento
                  </Text>
                </View>
                <View
                  className={`px-2.5 py-1 rounded-full border ${
                    isConfirmationSent
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-black ${
                      isConfirmationSent ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {isConfirmationSent ? "Enviada" : "Pendente"}
                  </Text>
                </View>
              </View>

              {/* Lembrete */}
              <View className="flex-row items-center justify-between bg-slate-50 px-4 py-3 rounded-2xl border border-gray-200">
                <View className="flex-row items-center gap-2.5">
                  <Ionicons
                    name={isReminderSent ? "checkmark-circle" : "time-outline"}
                    size={20}
                    color={isReminderSent ? "#25D366" : "#F59E0B"}
                  />
                  <Text className="text-gray-900 text-xs font-bold">
                    Lembrete Automático
                  </Text>
                </View>
                <View
                  className={`px-2.5 py-1 rounded-full border ${
                    isReminderSent
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <Text
                    className={`text-[10px] font-black ${
                      isReminderSent ? "text-emerald-700" : "text-amber-700"
                    }`}
                  >
                    {isReminderSent ? "Enviado" : "Pendente"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Data e Hora */}
          <View className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm mb-4 gap-4">
            <View className="flex-row items-center gap-2 border-b border-gray-100 pb-3.5">
              <Ionicons name="calendar-outline" size={20} color="#092D5D" />
              <Text className="text-gray-900 text-sm font-black">
                Data e Horário
              </Text>
            </View>

            <View className="flex-row gap-3 items-center justify-center bg-slate-50 p-4 rounded-2xl border border-gray-200">
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
            <View className="bg-slate-50 p-4 rounded-2xl border border-gray-200 flex-row items-center justify-between">
              <View className="flex-1 pr-2">
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Text className="text-gray-900 text-xs font-black">
                    Modo Encaixe
                  </Text>
                  {fitIn && (
                    <View className="px-2 py-0.5 rounded-md bg-emerald-100 border border-emerald-200">
                      <Text className="text-emerald-700 text-[9px] font-extrabold uppercase">Ativo</Text>
                    </View>
                  )}
                </View>
                <Text className="text-gray-600 text-xs font-medium leading-4">
                  Permite agendar mesmo em horários com conflitos na agenda.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setFitIn(!fitIn)}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons
                  name={fitIn ? "toggle-switch" : "toggle-switch-off-outline"}
                  size={42}
                  color={fitIn ? "#10B981" : "#9CA3AF"}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Cliente */}
          <View className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm mb-4 gap-3.5">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3.5">
              <View className="flex-row items-center gap-2">
                <Ionicons name="person-outline" size={20} color="#092D5D" />
                <Text className="text-gray-900 text-sm font-black">
                  Cliente
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => handleOpenClientList()}
                className="px-3.5 py-1.5 rounded-full bg-[#CBA35D]/15 border border-[#CBA35D]/40"
              >
                <Text className="text-[#CBA35D] text-xs font-black">Alterar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handleOpenClientList()}
              className="flex-row items-center gap-3.5 bg-slate-50 p-4 rounded-2xl border border-gray-200"
            >
              {client?.profileUrl ? (
                <Image
                  source={{ uri: client.profileUrl }}
                  resizeMode="cover"
                  className="h-14 w-14 rounded-full border-2 border-[#CBA35D]"
                />
              ) : (
                <View className="w-14 h-14 rounded-full bg-[#CBA35D]/20 items-center justify-center border border-[#CBA35D]/40">
                  <Ionicons name="person" size={26} color="#CBA35D" />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-gray-900 font-extrabold text-sm">
                  {client ? client.name : "Selecione o cliente"}
                </Text>
                {client?.phone && (
                  <Text className="text-gray-600 text-xs font-semibold mt-0.5">
                    {client.phone}
                  </Text>
                )}
              </View>
              {client?.phone ? (
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`https://api.whatsapp.com/send?phone=55${(client.phone ?? "").replace(/\D/g, "")}`)
                  }
                  className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200"
                >
                  <Ionicons name="logo-whatsapp" size={22} color="#25D366" />
                </TouchableOpacity>
              ) : null}
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Profissional */}
          {employee && (
            <View className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm mb-4 gap-3.5">
              <View className="flex-row items-center gap-2 border-b border-gray-100 pb-3.5">
                <Ionicons name="cut-outline" size={20} color="#092D5D" />
                <Text className="text-gray-900 text-sm font-black">
                  Profissional Atendente
                </Text>
              </View>

              <View className="flex-row items-center gap-3.5 bg-slate-50 p-4 rounded-2xl border border-gray-200">
                {employee.avatarUrl ? (
                  <Image
                    source={{ uri: employee.avatarUrl }}
                    resizeMode="cover"
                    className="h-14 w-14 rounded-full border-2 border-[#092D5D]/20"
                  />
                ) : (
                  <View className="w-14 h-14 rounded-full bg-[#092D5D]/10 items-center justify-center border border-[#092D5D]/20">
                    <Ionicons name="person" size={26} color="#092D5D" />
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-gray-900 font-extrabold text-sm">
                    {employee.name}
                  </Text>
                  <Text className="text-gray-600 text-xs font-semibold mt-0.5">
                    Profissional responsável
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Serviço */}
          <View className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm mb-4 gap-3.5">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3.5">
              <View className="flex-row items-center gap-2">
                <Ionicons name="sparkles-outline" size={20} color="#092D5D" />
                <Text className="text-gray-900 text-sm font-black">
                  Serviço Contratado
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleOpenServiceList}
                className="px-3.5 py-1.5 rounded-full bg-[#CBA35D]/15 border border-[#CBA35D]/40"
              >
                <Text className="text-[#CBA35D] text-xs font-black">Alterar</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleOpenServiceList}
              className="flex-row items-center gap-3.5 bg-slate-50 p-4 rounded-2xl border border-gray-200"
            >
              {service?.imgUrl ? (
                <Image
                  source={{ uri: service.imgUrl }}
                  resizeMode="cover"
                  className="h-14 w-14 rounded-2xl border border-gray-200"
                />
              ) : (
                <View className="w-14 h-14 rounded-2xl bg-[#092D5D]/10 items-center justify-center border border-[#092D5D]/20">
                  <Ionicons name="cut" size={26} color="#092D5D" />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-gray-900 font-extrabold text-sm">
                  {service ? service.name : "Selecione o serviço"}
                </Text>
                {service && (
                  <Text className="text-[#092D5D] font-extrabold text-xs mt-0.5">
                    R$ {moneyMapper(service.price)}
                  </Text>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Informações Adicionais */}
          <View className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm mb-4">
            <AppInputController
              leftIcon="information-circle-outline"
              label="Informações Adicionais"
              control={control}
              name="additionalInfo"
              placeholder="Adicionar observações..."
              className="w-full"
              placeholderTextColor="#9CA3AF"
              multiline={true}
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        {/* Botões de Ação Fixos no Rodapé */}
        <View className="p-4 bg-white border-t border-gray-100 shadow-lg gap-2.5">
          <View className="flex-row items-center justify-between gap-2.5">
            <TouchableOpacity
              onPress={() => {
                hideModal();
                safePush(
                  `/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${appointment?.orderId ?? appointment?.id}`,
                );
              }}
              activeOpacity={0.85}
              className="flex-1 bg-slate-100 h-13 py-3 px-3 rounded-2xl items-center justify-center border border-gray-200"
            >
              <Text className="text-gray-800 font-extrabold text-xs">
                Ver Comanda
              </Text>
            </TouchableOpacity>

            {!isNoShow && (
              <TouchableOpacity
                onPress={handleMarkNoShow}
                activeOpacity={0.85}
                className="flex-1 bg-red-50 h-13 py-3 px-3 rounded-2xl items-center justify-center border border-red-200"
              >
                <Text className="text-red-600 font-extrabold text-xs">
                  Não Compareceu
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={updateBooking}
              activeOpacity={0.85}
              className="flex-1 bg-[#092D5D] h-13 py-3 px-3 rounded-2xl items-center justify-center shadow-md"
            >
              <Text className="text-white font-extrabold text-xs">
                Salvar Alterações
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Modal de Confirmação de Cancelamento */}
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
      </View>
    </KeyboardContainer>
  );
}

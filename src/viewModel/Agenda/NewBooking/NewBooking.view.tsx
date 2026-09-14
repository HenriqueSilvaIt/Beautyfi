import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { Image, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useNewBookingViewModel } from "./useNewBokingViewModel";
import { useState } from "react";
import { AppInputController } from "@/shared/components/AppInputControler";
import { AppDate } from "@/shared/components/AppDate";
import { AppTime } from "@/shared/components/AppTime";
import { moneyMapper } from "@/utils/moneyMapper";

export function NewBookingView() {
  const {
    handleOpenClientList,
    handleOpenServiceList,
    createBooking,
    isListLoading,
    control,
  } = useNewBookingViewModel();

  const { formatDateToBR, timeStringToDate, dateToTimeString } =
    useFormatDate();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { fitIn, setFitIn } = useAgendaStore();

  const selectedDay = useAgendaStore((s) => s.selectedDay);
  const setDate = useAgendaStore((s) => s.setDay);

  const time = useAgendaStore((s) => s.time);
  const setTime = useAgendaStore((s) => s.setTime);
  const employee = useAgendaStore((s) => s.employee);
  const client = useAgendaStore((s) => s.client);
  const service = useAgendaStore((s) => s.service);

  return (
    <KeyboardContainer>
      <View className="bg-slate-50 flex-1">
        <AppAdminHeader
          title="Novo Agendamento"
          iconRightName={undefined}
          iconRight={{
            icon: true,
            path: "",
          }}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Summary / Header Info Card */}
          <View className="mb-4 p-5 rounded-2xl bg-white border border-gray-200/80 shadow-sm flex-row items-center gap-3.5">
            <View className="w-12 h-12 rounded-2xl bg-[#092D5D]/10 border border-[#092D5D]/20 items-center justify-center">
              <Ionicons name="calendar-number" size={24} color="#092D5D" />
            </View>
            <View className="flex-1">
              <Text className="text-gray-900 font-black text-sm">
                Agendamento de Serviço
              </Text>
              <Text className="text-gray-600 text-xs font-semibold mt-0.5">
                Preencha os detalhes abaixo para agendar o atendimento.
              </Text>
            </View>
          </View>

          {/* Data e Horário */}
          <View className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm mb-4 gap-4">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3.5">
              <View className="flex-row items-center gap-2">
                <Ionicons name="time-outline" size={20} color="#092D5D" />
                <Text className="text-gray-900 text-sm font-black">
                  Data e Horário
                </Text>
              </View>
              <View className="px-2.5 py-1 rounded-full bg-[#092D5D]/10">
                <Text className="text-[#092D5D] text-[10px] font-black uppercase">
                  Obrigatório
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
                className="flex-1 flex-row items-center gap-2.5 p-4 rounded-2xl bg-slate-50 border border-gray-200"
              >
                <Ionicons name="calendar" size={20} color="#092D5D" />
                <View className="flex-1">
                  <Text className="text-gray-600 text-[10px] font-extrabold uppercase">Data</Text>
                  <Text className="text-gray-900 font-bold text-xs">
                    {selectedDay ? formatDateToBR(selectedDay) : "Selecione a data"}
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.8}
                className="flex-1 flex-row items-center gap-2.5 p-4 rounded-2xl bg-slate-50 border border-gray-200"
              >
                <Ionicons name="time" size={20} color="#092D5D" />
                <View className="flex-1">
                  <Text className="text-gray-600 text-[10px] font-extrabold uppercase">Horário</Text>
                  <Text className="text-gray-900 font-bold text-xs">
                    {time ?? "Selecione a hora"}
                  </Text>
                </View>
              </TouchableOpacity>
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
                    className="h-[40px] w-[40px] rounded-full border-2 border-[#092D5D]/20"
                  />
                ) : (
                  <View className="w-[40px] h-[40px] rounded-full bg-[#092D5D]/10 items-center justify-center border border-[#092D5D]/20">
                    <Ionicons name="person" size={26} color="#092D5D" />
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-gray-900 font-extrabold text-sm">
                    {employee.name}
                  </Text>
                  <Text className="text-gray-600 text-xs font-semibold mt-0.5">
                    Profissional selecionado
                  </Text>
                </View>
              </View>
            </View>
          )}

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
                <Text className="text-[#CBA35D] text-xs font-black">
                  {client ? "Alterar" : "+ Selecionar"}
                </Text>
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
                  className="h-[40px] w-[40px] rounded-full border-2 border-[#CBA35D]"
                />
              ) : (
                <View className="w-[40px] h-[40px] rounded-full bg-[#CBA35D]/20 items-center justify-center border border-[#CBA35D]/40">
                  <Ionicons name="person" size={26} color="#CBA35D" />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-gray-900 font-extrabold text-sm">
                  {client ? client.name : "Selecione o cliente"}
                </Text>
                <Text className="text-gray-600 text-xs font-semibold mt-0.5">
                  {client?.phone ? client.phone : "Clique para pesquisar na lista de clientes"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Serviço */}
          <View className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-sm mb-4 gap-3.5">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3.5">
              <View className="flex-row items-center gap-2">
                <Ionicons name="sparkles-outline" size={20} color="#092D5D" />
                <Text className="text-gray-900 text-sm font-black">
                  Serviço Desejado
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleOpenServiceList}
                className="px-3.5 py-1.5 rounded-full bg-[#CBA35D]/15 border border-[#CBA35D]/40"
              >
                <Text className="text-[#CBA35D] text-xs font-black">
                  {service ? "Alterar" : "+ Selecionar"}
                </Text>
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
                  className="h-[40px] w-[40px] rounded-2xl border border-gray-200"
                />
              ) : (
                <View className="w-[40px] h-[40px] rounded-2xl bg-[#092D5D]/10 items-center justify-center border border-[#092D5D]/20">
                  <Ionicons name="cut" size={26} color="#092D5D" />
                </View>
              )}
              <View className="flex-1">
                <Text className="text-gray-900 font-extrabold text-sm">
                  {service ? service.name : "Selecione o serviço"}
                </Text>
                {service ? (
                  <Text className="text-[#092D5D] font-extrabold text-xs mt-0.5">
                    R$ {moneyMapper(service.price)}
                  </Text>
                ) : (
                  <Text className="text-gray-600 text-xs font-semibold mt-0.5">
                    Clique para escolher o serviço a ser realizado
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
              placeholder="Adicione observações ou preferências do cliente..."
              className="w-full"
              placeholderTextColor="#9CA3AF"
              multiline={true}
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        {/* Botão de Confirmação Fixo no Rodapé com Largura Ajustada */}
        <View className="p-4 bg-white border-t border-gray-200/80 shadow-xl items-center">
          <TouchableOpacity
            onPress={createBooking}
            activeOpacity={0.85}
            className="w-[90%] max-w-[400px] h-14 rounded-2xl bg-[#092D5D] items-center justify-center shadow-md flex-row gap-2"
          >
            <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
            <Text className="text-white font-extrabold text-sm uppercase tracking-wider">
              Confirmar Agendamento
            </Text>
          </TouchableOpacity>
        </View>

        {showDatePicker && (
          <AppDate
            open={showDatePicker}
            date={selectedDay || new Date()}
            onConfirm={(date) => {
              setDate(date);
              setShowDatePicker(false);
            }}
            onCancel={() => setShowDatePicker(false)}
          />
        )}

        {showTimePicker && (
          <AppTime
            open={showTimePicker}
            date={timeStringToDate(time)}
            onConfirm={(date) => {
              setTime(dateToTimeString(date));
              setShowTimePicker(false);
            }}
            onCancel={() => setShowTimePicker(false)}
          />
        )}
      </View>
    </KeyboardContainer>
  );
}

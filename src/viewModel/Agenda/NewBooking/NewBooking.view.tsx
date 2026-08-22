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

  const themeGold = colors["app-theme-secundary"] || "#CBA35D";

  return (
    <KeyboardContainer>
      <ScrollView className="bg-background-primary flex-1" keyboardShouldPersistTaps="handled">
        <AppAdminHeader
          title="Novo agendamento"
          iconRightName={undefined}
          iconRight={{
            icon: true,
            path: "",
          }}
        />

        <View className="px-4 py-3 gap-4 pb-12">
          {/* Data e Hora */}
          <View className="bg-background-quartenary rounded-2xl p-4 border border-white/5 shadow-md gap-3">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar-outline" size={18} color={themeGold} />
              <Text className="text-font-primary text-base font-bold">
                Data e Horário
              </Text>
            </View>

            <View className="flex-row gap-3 items-center justify-center bg-background-tertiary p-3 rounded-xl">
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}
                className="flex-1 flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-background-primary/50"
              >
                <Ionicons name="calendar" size={18} color={themeGold} />
                <Text className="text-font-primary font-bold text-sm">
                  {selectedDay ? formatDateToBR(selectedDay) : "Data"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowTimePicker(true)}
                activeOpacity={0.8}
                className="flex-1 flex-row items-center justify-center gap-2 py-2.5 px-3 rounded-lg bg-background-primary/50"
              >
                <Ionicons name="time" size={18} color={themeGold} />
                <Text className="text-font-primary font-bold text-sm">
                  {time ?? "Horário"}
                </Text>
              </TouchableOpacity>
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
                <Text className="text-accent-gold text-xs font-semibold">
                  {client ? "Alterar" : "Selecionar"}
                </Text>
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
                <Text className="text-accent-gold text-xs font-semibold">
                  {service ? "Alterar" : "Selecionar"}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenServiceList}
              className="flex-row items-center gap-3 bg-background-tertiary p-3.5 rounded-xl"
            >
              {service?.imgUrl ? (
                <Image
                  source={{ uri: service.imgUrl }}
                  resizeMode="cover"
                  className="h-[40px] w-[40px] rounded-2xl border border-white/10"
                />
              ) : (
                <View className="w-[40px] h-[40px] rounded-2xl bg-accent-gold/20 items-center justify-center border border-accent-gold/40">
                  <Ionicons name="cut" size={28} color={themeGold} />
                </View>
              )}
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

      {/* Botão de confirmação */}
      <View className="p-4 bg-background-quartenary border-t border-white/5">
        <TouchableOpacity
          onPress={createBooking}
          activeOpacity={0.8}
          className="w-full py-4 rounded-xl bg-app-theme-primary items-center shadow-lg"
        >
          <Text className="text-font-secundary font-bold text-base">
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
    </KeyboardContainer>
  );
}

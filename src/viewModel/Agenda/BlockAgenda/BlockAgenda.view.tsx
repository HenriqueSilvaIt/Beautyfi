import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useBlockAgendaViewModel } from "./useBlockAgendaViewModel";
import { AppDateTimePicker } from "@/shared/components/AppDateTimePicker";
import { SafeAreaView } from "react-native-safe-area-context";

export function BlockAgendaView() {
  const employee = useAgendaStore((e) => e.employee);

  // Correção: setDayBlockEnd estava pegando o setDayBlockStart
  const setDayBlockStart = useAgendaStore((s) => s.setDayBlockStart);
  const setDayBlockEnd = useAgendaStore((s) => s.setDayBlockEnd);

  const { blockBooking } = useBlockAgendaViewModel();

  const dayStart = useAgendaStore((s) => s.selectedDayBlockStart);
  const dayEnd = useAgendaStore((d) => d.selectedDayBlockEnd);

  const { formatDateTimeToBR } = useFormatDate();

  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);

  return (
    <SafeAreaView className="flex-1">
      <AppAdminHeader
        title="Bloquear horário"
        iconRightName={undefined}
        iconRight={{
          icon: true,
          path: "",
        }}
      />
      <View className="items-center justify-center my-5 bg-background-tertiary w-full max-h-[150px] rounded-md ">
        <View className="items-center justify-center mb-5">
          <Text className="text-font-primary text-xl text-center border-b-2 font-semibold border-app-theme-primary">
            Profissional
          </Text>
        </View>

        {employee && (
          <View className="gap-2 items-center justify-center mb-5 bg-background-tertiary w-full h-[80px] rounded-md">
            <Image
              source={{ uri: employee.avatarUrl }}
              resizeMode="cover"
              className="h-[40px] w-[40px] rounded-full"
            />

            <Text className="text-base text-font-primary">{employee.name}</Text>
          </View>
        )}
      </View>
      <View className="gap-4 justify-center items-center mt-10">
        <Text className="text-font-primary text-xl text-center border-b-2 semi-bold border-app-theme-primary">
          Data e Hora
        </Text>
        <View className="flex-row gap-4 mt-10">
          <TouchableOpacity
            onPress={() => setOpenStartPicker(true)}
            activeOpacity={0.8}
            className="flex-1"
          >
            <View className="flex-row items-center gap-3 mx-2 p-3 rounded-xl bg-background-secondary border border-white/20 shadow">
              <Ionicons name="calendar" size={22} color={colors.white} />

              <View className="flex-1">
                <Text className="text-font-primary text-xs opacity-70">Início</Text>
                <Text
                  className="text-font-primary font-semibold text-[12px]"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dayStart ? formatDateTimeToBR(dayStart) : "Selecione"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setOpenEndPicker(true)}
            activeOpacity={0.8}
            className="flex-1"
          >
            <View className="flex-row items-center gap-3 mx-2 p-3 rounded-xl bg-background-secondary border border-white/20 shadow">
              <Ionicons name="calendar" size={22} color={colors.white} />

              <View className="flex-1">
                <Text className="text-font-primary text-xs opacity-70">Fim</Text>
                <Text
                  className="text-font-primary font-semibold text-[12px]"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {dayEnd ? formatDateTimeToBR(dayEnd) : "Selecione"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View className="justify-center items-center px-6  mt-10">
          <TouchableOpacity
            onPress={blockBooking}
            activeOpacity={0.8}
            className=" h-[40px]  items-center justify-center w-[200px] rounded-md  bg-app-theme-primary"
          >
            <Text className="text-font-primary text-center text-base font-bold ">
              Bloquear Período
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* PICKERS */}
      <AppDateTimePicker
        open={openStartPicker}
        date={dayStart}
        onConfirm={(date) => {
          setOpenStartPicker(false);
          setDayBlockStart(date);
        }}
        onCancel={() => setOpenStartPicker(false)}
      />

      <AppDateTimePicker
        open={openEndPicker}
        date={dayEnd}
        minimumDate={dayStart}
        onConfirm={(date) => {
          setOpenEndPicker(false);
          setDayBlockEnd(date);
        }}
        onCancel={() => setOpenEndPicker(false)}
      />
    </SafeAreaView>
  );
}

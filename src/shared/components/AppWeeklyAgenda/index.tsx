import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { AppointmentProps } from "@/shared/interfaces/http/appointment";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { addDays, format, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { moneyMapper } from "@/utils/moneyMapper";

interface AppWeeklyAgendaProps {
  currentDate: Date;
  appointments: AppointmentProps[];
  onAppointmentPress: (id: number) => void;
  onSelectDay: (date: Date) => void;
}

export function AppWeeklyAgenda({
  currentDate,
  appointments,
  onAppointmentPress,
  onSelectDay,
}: AppWeeklyAgendaProps) {
  const themeNavy = "#092D5D";
  const themeGold = colors["app-theme-secundary"] || "#CBA35D";

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  // Métricas Semanais
  const weekAppointments = appointments.filter((app) => {
    if (!app.dateScheduled) return false;
    const appDate = new Date(app.dateScheduled);
    return daysOfWeek.some((d) => isSameDay(d, appDate));
  });

  const weekTotalRevenue = weekAppointments.reduce((acc, app) => {
    const price = app.services?.[0]?.priceAtMoment || 0;
    return acc + Number(price);
  }, 0);

  return (
    <ScrollView className="flex-1 bg-slate-50 px-3 pt-3">
      {/* Top Banner de Resumo da Semana (White Theme) */}
      <View className="bg-white rounded-3xl p-5 border border-slate-100 mb-4 shadow-sm">
        <View className="flex-row items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={20} color={themeNavy} />
            <Text className="text-slate-900 text-base font-extrabold">
              Semana ({format(weekStart, "dd/MM", { locale: ptBR })} - {format(daysOfWeek[6], "dd/MM", { locale: ptBR })})
            </Text>
          </View>
        </View>

        {/* Faixa de Métricas Rápidas da Semana */}
        <View className="flex-row items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <View className="items-center flex-1 border-r border-slate-200">
            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Agendamentos
            </Text>
            <Text className="text-slate-900 text-base font-extrabold mt-0.5">
              {weekAppointments.length}
            </Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Previsão Semana
            </Text>
            <Text className="text-emerald-600 text-base font-extrabold mt-0.5">
              R$ {moneyMapper(weekTotalRevenue)}
            </Text>
          </View>
        </View>
      </View>

      {/* Lista dos 7 Dias da Semana */}
      <View className="gap-3.5 pb-28">
        {daysOfWeek.map((day) => {
          const isToday = isSameDay(day, new Date());
          const dayAppointments = appointments.filter((app) => {
            if (!app.dateScheduled) return false;
            const appDate = new Date(app.dateScheduled);
            return isSameDay(appDate, day);
          });

          const dayRevenue = dayAppointments.reduce((acc, app) => {
            const price = app.services?.[0]?.priceAtMoment || 0;
            return acc + Number(price);
          }, 0);

          return (
            <View
              key={day.toISOString()}
              className={`rounded-3xl p-4 border transition-all ${
                isToday
                  ? "bg-white border-2 border-[#092D5D] shadow-md"
                  : dayAppointments.length > 0
                  ? "bg-white border border-slate-200/90 shadow-sm"
                  : "bg-slate-50/80 border border-slate-100"
              }`}
            >
              {/* Day Header */}
              <TouchableOpacity
                onPress={() => onSelectDay(day)}
                activeOpacity={0.75}
                className="flex-row items-center justify-between border-b border-slate-100 pb-3 mb-3"
              >
                <View className="flex-row items-center gap-3">
                  <View
                    className={`w-9 h-9 rounded-xl items-center justify-center ${
                      isToday ? "bg-[#092D5D]" : "bg-slate-100 border border-slate-200"
                    }`}
                  >
                    <Text
                      className={`text-sm font-black ${
                        isToday ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {format(day, "dd")}
                    </Text>
                  </View>
                  <View>
                    <View className="flex-row items-center gap-2">
                      <Text className="text-slate-900 font-extrabold text-sm capitalize">
                        {format(day, "EEEE", { locale: ptBR })}
                      </Text>
                      {isToday && (
                        <View className="px-2.5 py-0.5 rounded-full bg-[#092D5D]/10 border border-[#092D5D]/20">
                          <Text className="text-[#092D5D] text-[9px] font-black uppercase">HOJE</Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-slate-500 text-[11px] font-medium mt-0.5">
                      {dayAppointments.length} agendamento(s) • R$ {moneyMapper(dayRevenue)}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                  <Text className="text-slate-700 text-xs font-bold">Ver dia</Text>
                  <Ionicons name="chevron-forward" size={13} color="#092D5D" />
                </View>
              </TouchableOpacity>

              {/* Day Appointments */}
              {dayAppointments.length === 0 ? (
                <Text className="text-slate-400 text-xs italic text-center py-2">
                  Nenhum agendamento para este dia
                </Text>
              ) : (
                <View className="gap-2.5">
                  {dayAppointments.map((app) => {
                    const appDate = new Date(app.dateScheduled);
                    const timeStr = format(appDate, "HH:mm");
                    const clientName = app.client?.name || app.user?.firstName || "Cliente";
                    const serviceName = app.services?.[0]?.service?.name || "Serviço";
                    const price = app.services?.[0]?.priceAtMoment || 0;
                    const clientInitial = clientName.charAt(0).toUpperCase();

                    return (
                      <TouchableOpacity
                        key={app.id}
                        onPress={() => onAppointmentPress(app.id)}
                        activeOpacity={0.85}
                        className="bg-slate-50 p-3.5 rounded-2xl flex-row items-center justify-between border-l-4 border-[#CBA35D] border border-slate-200/80 shadow-xs"
                      >
                        <View className="flex-row items-center gap-3 flex-1 pr-2">
                          <View className="w-8 h-8 rounded-full bg-[#092D5D]/10 border border-[#092D5D]/20 items-center justify-center">
                            <Text className="text-[#092D5D] font-extrabold text-xs">
                              {clientInitial}
                            </Text>
                          </View>

                          <View className="flex-1">
                            <View className="flex-row items-center gap-2 mb-0.5">
                              <View className="bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                <Text className="text-slate-900 text-[11px] font-bold">
                                  {timeStr}
                                </Text>
                              </View>
                              <Text
                                className="text-slate-900 font-extrabold text-xs flex-1"
                                numberOfLines={1}
                              >
                                {clientName}
                              </Text>
                            </View>
                            <Text
                              className="text-slate-500 text-[11px]"
                              numberOfLines={1}
                            >
                              {serviceName} • <Text className="text-emerald-600 font-extrabold">R$ {moneyMapper(price)}</Text>
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row items-center gap-2">
                          {(app.confirmationSent || app.reminderSent) && (
                            <View className="p-1 rounded-full bg-emerald-50 border border-emerald-200">
                              <Ionicons name="logo-whatsapp" size={14} color="#25D366" />
                            </View>
                          )}
                          <Ionicons name="chevron-forward" size={14} color="#9CA3AF" />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

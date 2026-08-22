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
  const themeGold = colors["app-theme-secundary"] || "#CBA35D";

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const daysOfWeek = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <ScrollView className="flex-1 bg-background-agenda px-3 pt-3">
      <View className="flex-row items-center justify-between mb-3 px-1">
        <Text className="text-font-primary text-base font-bold">
          Visão Semanal ({format(weekStart, "dd/MM", { locale: ptBR })} - {format(daysOfWeek[6], "dd/MM", { locale: ptBR })})
        </Text>
      </View>

      <View className="gap-3 pb-24">
        {daysOfWeek.map((day) => {
          const isToday = isSameDay(day, new Date());
          const dayAppointments = appointments.filter((app) => {
            if (!app.dateScheduled) return false;
            const appDate = new Date(app.dateScheduled);
            return isSameDay(appDate, day);
          });

          return (
            <View
              key={day.toISOString()}
              className={`rounded-2xl p-4 border ${
                isToday
                  ? "bg-background-quartenary border-accent-gold/40 shadow-lg"
                  : "bg-background-quartenary border-white/5"
              }`}
            >
              {/* Day Header */}
              <TouchableOpacity
                onPress={() => onSelectDay(day)}
                activeOpacity={0.7}
                className="flex-row items-center justify-between border-b border-white/5 pb-2 mb-3"
              >
                <View className="flex-row items-center gap-2">
                  <View
                    className={`w-7 h-7 rounded-full items-center justify-center ${
                      isToday ? "bg-accent-gold" : "bg-background-tertiary"
                    }`}
                  >
                    <Text
                      className={`text-xs font-bold ${
                        isToday ? "text-black" : "text-font-primary"
                      }`}
                    >
                      {format(day, "dd")}
                    </Text>
                  </View>
                  <Text className="text-font-primary font-bold text-sm capitalize">
                    {format(day, "EEEE", { locale: ptBR })}
                  </Text>
                </View>

                <View className="flex-row items-center gap-1.5">
                  <View className="px-2 py-0.5 rounded-full bg-background-tertiary">
                    <Text className="text-font-secondary text-[11px] font-semibold">
                      {dayAppointments.length} agendamento(s)
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={14} color="#6B7280" />
                </View>
              </TouchableOpacity>

              {/* Day Appointments */}
              {dayAppointments.length === 0 ? (
                <Text className="text-font-secondary text-xs italic text-center py-2">
                  Nenhum agendamento para este dia
                </Text>
              ) : (
                <View className="gap-2">
                  {dayAppointments.map((app) => {
                    const appDate = new Date(app.dateScheduled);
                    const timeStr = format(appDate, "HH:mm");
                    const serviceName = app.services?.[0]?.service?.name || "Serviço";
                    const price = app.services?.[0]?.priceAtMoment || 0;

                    return (
                      <TouchableOpacity
                        key={app.id}
                        onPress={() => onAppointmentPress(app.id)}
                        activeOpacity={0.8}
                        className="bg-background-tertiary p-3 rounded-xl flex-row items-center justify-between border-l-4 border-accent-gold"
                      >
                        <View className="flex-row items-center gap-3 flex-1 pr-2">
                          <View className="bg-background-primary px-2 py-1 rounded-md">
                            <Text className="text-font-primary text-xs font-bold">
                              {timeStr}
                            </Text>
                          </View>
                          <View className="flex-1">
                            <Text
                              className="text-font-primary font-bold text-xs"
                              numberOfLines={1}
                            >
                              {app.client?.name || app.user?.firstName || "Cliente"}
                            </Text>
                            <Text
                              className="text-font-secondary text-[11px] mt-0.5"
                              numberOfLines={1}
                            >
                              {serviceName} • R$ {moneyMapper(price)}
                            </Text>
                          </View>
                        </View>

                        <View className="flex-row items-center gap-2">
                          {(app.confirmationSent || app.reminderSent) && (
                            <Ionicons name="logo-whatsapp" size={14} color="#25D366" />
                          )}
                          <Ionicons name="chevron-forward" size={14} color="#6B7280" />
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

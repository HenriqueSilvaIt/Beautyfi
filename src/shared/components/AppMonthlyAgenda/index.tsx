import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { AppointmentProps } from "@/shared/interfaces/http/appointment";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { moneyMapper } from "@/utils/moneyMapper";

interface AppMonthlyAgendaProps {
  currentDate: Date;
  appointments: AppointmentProps[];
  onAppointmentPress: (id: number) => void;
  onSelectDay: (date: Date) => void;
}

export function AppMonthlyAgenda({
  currentDate,
  appointments,
  onAppointmentPress,
  onSelectDay,
}: AppMonthlyAgendaProps) {
  const themeGold = colors["app-theme-secundary"] || "#CBA35D";

  const [activeMonth, setActiveMonth] = useState(currentDate);
  const [selectedDay, setSelectedDay] = useState(currentDate);

  const monthStart = startOfMonth(activeMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days: Date[] = [];
  let day = startDate;
  while (day <= endDate) {
    days.push(day);
    day = addDays(day, 1);
  }

  const prevMonth = () => setActiveMonth(subMonths(activeMonth, 1));
  const nextMonth = () => setActiveMonth(addMonths(activeMonth, 1));

  const selectedDayAppointments = appointments.filter((app) => {
    if (!app.dateScheduled) return false;
    const appDate = new Date(app.dateScheduled);
    return isSameDay(appDate, selectedDay);
  });

  return (
    <ScrollView className="flex-1 bg-background-agenda px-3 pt-3">
      {/* Month Navigation */}
      <View className="bg-background-quartenary rounded-2xl p-4 border border-white/5 mb-4 shadow-md">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={prevMonth}
            className="w-8 h-8 rounded-full bg-background-tertiary items-center justify-center"
          >
            <Ionicons name="chevron-back" size={18} color="#FFF" />
          </TouchableOpacity>

          <Text className="text-font-primary text-base font-bold capitalize">
            {format(activeMonth, "MMMM yyyy", { locale: ptBR })}
          </Text>

          <TouchableOpacity
            onPress={nextMonth}
            className="w-8 h-8 rounded-full bg-background-tertiary items-center justify-center"
          >
            <Ionicons name="chevron-forward" size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Days of week header */}
        <View className="flex-row justify-between border-b border-white/5 pb-2 mb-2">
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d, idx) => (
            <Text key={idx} className="text-font-secondary text-xs font-bold text-center w-[13%]">
              {d}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View className="flex-row flex-wrap justify-between">
          {days.map((d, index) => {
            const isSelected = isSameDay(d, selectedDay);
            const isCurrentMonth = isSameMonth(d, activeMonth);
            const isToday = isSameDay(d, new Date());

            const dayCount = appointments.filter((app) => {
              if (!app.dateScheduled) return false;
              return isSameDay(new Date(app.dateScheduled), d);
            }).length;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDay(d)}
                activeOpacity={0.7}
                className={`w-[13%] aspect-square my-1 rounded-xl items-center justify-center border ${
                  isSelected
                    ? "bg-accent-gold border-accent-gold"
                    : isToday
                    ? "bg-background-tertiary border-accent-gold/50"
                    : "bg-background-tertiary/40 border-transparent"
                } ${!isCurrentMonth ? "opacity-30" : ""}`}
              >
                <Text
                  className={`text-xs font-bold ${
                    isSelected ? "text-black" : isToday ? "text-accent-gold" : "text-font-primary"
                  }`}
                >
                  {format(d, "d")}
                </Text>

                {dayCount > 0 && (
                  <View
                    className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                      isSelected ? "bg-black" : "bg-accent-gold"
                    }`}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Selected Day Appointments */}
      <View className="bg-background-quartenary rounded-2xl p-4 border border-white/5 mb-24 shadow-md">
        <View className="flex-row items-center justify-between border-b border-white/5 pb-3 mb-3">
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" size={18} color={themeGold} />
            <Text className="text-font-primary text-sm font-bold capitalize">
              {format(selectedDay, "EEEE, dd 'de' MMMM", { locale: ptBR })}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onSelectDay(selectedDay)}
            className="flex-row items-center gap-1 bg-accent-gold/15 px-2.5 py-1 rounded-full"
          >
            <Text className="text-accent-gold text-xs font-semibold">Ver no dia</Text>
            <Ionicons name="arrow-forward" size={12} color={themeGold} />
          </TouchableOpacity>
        </View>

        {selectedDayAppointments.length === 0 ? (
          <Text className="text-font-secondary text-xs italic text-center py-4">
            Nenhum agendamento para este dia
          </Text>
        ) : (
          <View className="gap-2.5">
            {selectedDayAppointments.map((app) => {
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
                    <View className="bg-background-primary px-2.5 py-1.5 rounded-lg">
                      <Text className="text-font-primary text-xs font-bold">
                        {timeStr}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="text-font-primary font-bold text-xs" numberOfLines={1}>
                        {app.client?.name || app.user?.firstName || "Cliente"}
                      </Text>
                      <Text className="text-font-secondary text-[11px] mt-0.5" numberOfLines={1}>
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
    </ScrollView>
  );
}

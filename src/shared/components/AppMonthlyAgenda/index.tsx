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
import { getAppointmentPrice } from "@/shared/hooks/useAgenda";

interface AppMonthlyAgendaProps {
  currentDate: Date;
  activeMonth?: Date;
  onMonthChange?: (date: Date) => void;
  appointments: AppointmentProps[];
  onAppointmentPress: (id: number) => void;
  onSelectDay: (date: Date) => void;
}

export function AppMonthlyAgenda({
  currentDate,
  activeMonth: controlledActiveMonth,
  onMonthChange,
  appointments,
  onAppointmentPress,
  onSelectDay,
}: AppMonthlyAgendaProps) {
  const themeNavy = "#092D5D";
  const themeGold = colors["app-theme-secundary"] || "#CBA35D";

  const [localActiveMonth, setLocalActiveMonth] = useState(currentDate);
  const activeMonth = controlledActiveMonth || localActiveMonth;
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

  const prevMonth = () => {
    const newM = subMonths(activeMonth, 1);
    setLocalActiveMonth(newM);
    onMonthChange?.(newM);
  };
  const nextMonth = () => {
    const newM = addMonths(activeMonth, 1);
    setLocalActiveMonth(newM);
    onMonthChange?.(newM);
  };
  const goToToday = () => {
    const today = new Date();
    setLocalActiveMonth(today);
    setSelectedDay(today);
    onMonthChange?.(today);
  };

  // Agendamentos do mês ativo (Apenas agendamentos reais com serviços, excluindo bloqueios de horário)
  const monthAppointments = appointments.filter((app) => {
    if (!app.dateScheduled || app.blocked) return false;
    const appDate = new Date(app.dateScheduled);
    return isSameMonth(appDate, activeMonth);
  });

  // Métricas do Mês
  const monthTotalRevenue = monthAppointments.reduce((acc, app) => {
    return acc + getAppointmentPrice(app);
  }, 0);

  const occupiedDaysCount = days.filter((d) => {
    if (!isSameMonth(d, activeMonth)) return false;
    return appointments.some(
      (app) => app.dateScheduled && !app.blocked && isSameDay(new Date(app.dateScheduled), d)
    );
  }).length;

  // Agendamentos do dia selecionado
  const selectedDayAppointments = appointments.filter((app) => {
    if (!app.dateScheduled || app.blocked) return false;
    const appDate = new Date(app.dateScheduled);
    return isSameDay(appDate, selectedDay);
  });

  const selectedDayRevenue = selectedDayAppointments.reduce((acc, app) => {
    return acc + getAppointmentPrice(app);
  }, 0);

  return (
    <ScrollView className="flex-1 bg-slate-50 px-3 pt-3">
      {/* CARD PRINCIPAL DO MÊS (White Theme) */}
      <View className="bg-white rounded-3xl p-5 border border-slate-100 mb-4 shadow-sm">
        {/* Top Header: Mês e Ações */}
        <View className="flex-row items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity
              onPress={prevMonth}
              activeOpacity={0.8}
              className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center border border-slate-200"
            >
              <Ionicons name="chevron-back" size={18} color={themeNavy} />
            </TouchableOpacity>

            <Text className="text-slate-900 text-base font-extrabold capitalize tracking-wide">
              {format(activeMonth, "MMMM yyyy", { locale: ptBR })}
            </Text>

            <TouchableOpacity
              onPress={nextMonth}
              activeOpacity={0.8}
              className="w-9 h-9 rounded-xl bg-slate-100 items-center justify-center border border-slate-200"
            >
              <Ionicons name="chevron-forward" size={18} color={themeNavy} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={goToToday}
            activeOpacity={0.85}
            className="px-3 py-1.5 rounded-full bg-[#092D5D]/10 border border-[#092D5D]/20 flex-row items-center gap-1.5"
          >
            <Ionicons name="today-outline" size={14} color={themeNavy} />
            <Text className="text-[#092D5D] text-xs font-bold">Hoje</Text>
          </TouchableOpacity>
        </View>

        {/* Faixa de Métricas Rápidas do Mês */}
        <View className="flex-row items-center justify-between bg-slate-50 p-3 rounded-2xl mb-4 border border-slate-100">
          <View className="items-center flex-1 border-r border-slate-200">
            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Agendamentos
            </Text>
            <Text className="text-slate-900 text-base font-extrabold mt-0.5">
              {monthAppointments.length}
            </Text>
          </View>

          <View className="items-center flex-1 border-r border-slate-200">
            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Dias Ocupados
            </Text>
            <Text className="text-[#092D5D] text-base font-extrabold mt-0.5">
              {occupiedDaysCount} dias
            </Text>
          </View>

          <View className="items-center flex-1">
            <Text className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">
              Previsão Mês
            </Text>
            <Text className="text-emerald-600 text-base font-extrabold mt-0.5">
              R$ {moneyMapper(monthTotalRevenue)}
            </Text>
          </View>
        </View>

        {/* Dias da semana (Header do Calendário) */}
        <View className="flex-row justify-between border-b border-slate-100 pb-2 mb-2">
          {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d, idx) => (
            <Text
              key={idx}
              className="text-slate-400 text-xs font-bold text-center w-[13.5%]"
            >
              {d}
            </Text>
          ))}
        </View>

        {/* Grid dos Dias do Mês */}
        <View className="flex-row flex-wrap justify-between">
          {days.map((d, index) => {
            const isSelected = isSameDay(d, selectedDay);
            const isCurrentMonth = isSameMonth(d, activeMonth);
            const isToday = isSameDay(d, new Date());

            const dayCount = appointments.filter((app) => {
              if (!app.dateScheduled || app.blocked) return false;
              return isSameDay(new Date(app.dateScheduled), d);
            }).length;

            const hasAppointments = dayCount > 0;

            return (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDay(d)}
                activeOpacity={0.75}
                className={`w-[13.5%] h-12 my-1 rounded-xl items-center justify-between py-1 border relative ${
                  isSelected
                    ? "bg-[#092D5D] border-[#092D5D] shadow-md z-10"
                    : hasAppointments
                    ? "bg-[#092D5D]/10 border-[#092D5D]/40 shadow-xs"
                    : isToday
                    ? "bg-amber-50 border-[#CBA35D]"
                    : "bg-slate-50 border-slate-100"
                } ${!isCurrentMonth ? "opacity-30" : ""}`}
              >
                {/* Indicador de Hoje se não estiver selecionado */}
                {isToday && !isSelected && (
                  <View className="absolute top-0.5 right-1 w-1.5 h-1.5 rounded-full bg-[#CBA35D]" />
                )}

                {/* Número do Dia */}
                <Text
                  className={`text-xs font-black ${
                    isSelected
                      ? "text-white"
                      : hasAppointments
                      ? "text-[#092D5D]"
                      : isToday
                      ? "text-[#B45309]"
                      : "text-slate-700"
                  }`}
                >
                  {format(d, "d")}
                </Text>

                {/* Pílula Numérica Visualmente Destacada para Agendamentos */}
                {hasAppointments ? (
                  <View
                    className={`px-1.5 py-0.2 rounded-full items-center justify-center ${
                      isSelected
                        ? "bg-[#CBA35D]"
                        : "bg-[#092D5D]"
                    }`}
                  >
                    <Text
                      className={`text-[9px] font-black leading-tight ${
                        isSelected ? "text-slate-900" : "text-white"
                      }`}
                    >
                      {dayCount}
                    </Text>
                  </View>
                ) : (
                  <View className="h-1.5" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legenda do Calendário em Fundo Claro */}
        <View className="flex-row items-center justify-around pt-3 mt-3 border-t border-slate-100">
          <View className="flex-row items-center gap-1.5">
            <View className="w-3.5 h-3.5 rounded-md bg-[#092D5D]/10 border border-[#092D5D]/40 items-center justify-center">
              <Text className="text-[#092D5D] text-[8px] font-black">1</Text>
            </View>
            <Text className="text-slate-600 text-[11px] font-semibold">Com Agendamento</Text>
          </View>

          <View className="flex-row items-center gap-1.5">
            <View className="w-3.5 h-3.5 rounded-md bg-[#092D5D] items-center justify-center">
              <Text className="text-white text-[8px] font-bold">✓</Text>
            </View>
            <Text className="text-slate-600 text-[11px] font-semibold">Selecionado</Text>
          </View>
        </View>
      </View>

      {/* DETALHAMENTO DO DIA SELECIONADO (White Theme) */}
      <View className="bg-white rounded-3xl p-5 border border-slate-100 mb-28 shadow-sm">
        <View className="flex-row items-center justify-between border-b border-slate-100 pb-3 mb-3">
          <View className="flex-1 pr-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="calendar" size={18} color={themeNavy} />
              <Text className="text-slate-900 text-sm font-extrabold capitalize">
                {format(selectedDay, "EEEE, dd 'de' MMMM", { locale: ptBR })}
              </Text>
            </View>

            <Text className="text-slate-500 text-xs mt-0.5 font-medium">
              {selectedDayAppointments.length} agendamento(s) • Total: R$ {moneyMapper(selectedDayRevenue)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onSelectDay(selectedDay)}
            activeOpacity={0.85}
            className="flex-row items-center gap-1 bg-[#092D5D] px-3.5 py-2 rounded-xl shadow-sm"
          >
            <Text className="text-white text-xs font-extrabold">Ver no dia</Text>
            <Ionicons name="arrow-forward" size={13} color="#FFF" />
          </TouchableOpacity>
        </View>

        {selectedDayAppointments.length === 0 ? (
          <View className="py-8 items-center justify-center">
            <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center mb-2 border border-slate-200">
              <Ionicons name="calendar-clear-outline" size={24} color="#9CA3AF" />
            </View>
            <Text className="text-slate-900 font-bold text-sm text-center">
              Nenhum agendamento para este dia
            </Text>
            <Text className="text-slate-500 text-xs text-center mt-0.5">
              Clique em "Ver no dia" para navegar na linha do tempo ou adicionar um agendamento.
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {selectedDayAppointments.map((app) => {
              const appDate = new Date(app.dateScheduled);
              const timeStr = format(appDate, "HH:mm");
              const clientName = app.client?.name || app.user?.firstName || "Cliente";
              const serviceName =
                app.services && app.services.length > 1
                  ? app.services.map((s) => s.service?.name).filter(Boolean).join(", ")
                  : app.services?.[0]?.service?.name || "Serviço";
              const price = getAppointmentPrice(app);
              const clientInitial = clientName.charAt(0).toUpperCase();

              return (
                <TouchableOpacity
                  key={app.id}
                  onPress={() => onAppointmentPress(app.id)}
                  activeOpacity={0.85}
                  className="bg-slate-50 p-3.5 rounded-2xl flex-row items-center justify-between border-l-4 border-[#CBA35D] border border-slate-200/70 shadow-xs"
                >
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    {/* Avatar do Cliente */}
                    <View className="w-10 h-10 rounded-full bg-[#092D5D]/10 border border-[#092D5D]/20 items-center justify-center">
                      <Text className="text-[#092D5D] font-extrabold text-sm">
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
                        <Text className="text-slate-900 font-extrabold text-sm flex-1" numberOfLines={1}>
                          {clientName}
                        </Text>
                      </View>

                      <Text className="text-slate-500 text-xs" numberOfLines={1}>
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
                    <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
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

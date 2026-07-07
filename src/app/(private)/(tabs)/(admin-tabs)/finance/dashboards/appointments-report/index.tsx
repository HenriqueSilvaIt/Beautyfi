import React, { useState, useMemo, useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, addDays } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAppointmentMutation } from "@/shared/queries/company/use-appointment.mutation";
import { colors } from "@/styles/colors";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppEmptyList } from "@/shared/components/AppEmptyList";

export default function AppointmentsReportScreen() {
  const [startDate] = useState<Date>(new Date(new Date().getFullYear(), 0, 1)); // início do ano
  const [endDate] = useState<Date>(new Date(new Date().getFullYear(), 11, 31)); // fim do ano

  const startStr = format(startDate, "yyyy-MM-dd");
  const endStr = format(endDate, "yyyy-MM-dd");

  const { useGetMonthlyAppointmentsQuery, useGetAppointmentMutation } = useAppointmentMutation();
  const { data: monthlyData, isLoading: monthlyLoading } = useGetMonthlyAppointmentsQuery(startStr, endStr);

  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  function formatMonthYear(monthYear: string) {
    const [year, month] = monthYear.split("-");
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    return `${months[Number(month) - 1]}/${year.slice(2)}`;
  }

  const barData = useMemo(() => {
    return (monthlyData ?? []).map((item: any) => ({
      value: item.count,
      label: formatMonthYear(item.monthYear),
      rawMonthYear: item.monthYear,
    }));
  }, [monthlyData]);

  const [highlightValue, setHighlightValue] = useState(0);

  useEffect(() => {
    if (barData.length > 0 && selectedBar === null) {
      setSelectedBar(barData.length - 1);
      setHighlightValue(barData[barData.length - 1].value);
    }
  }, [barData]);

  useEffect(() => {
    if (selectedBar !== null && barData[selectedBar]) {
      setHighlightValue(barData[selectedBar].value);
    }
  }, [selectedBar]);

  const maxBarValue = Math.max(...barData.map((b: any) => b.value), 1);

  // Lista detalhada dos agendamentos
  const { data: appointmentsData } = useGetAppointmentMutation();
const appointmentsList = useMemo(() => {
  const all =
    appointmentsData?.pages.flatMap((page) => page.content ?? []) ?? [];

  if (selectedBar !== null && barData[selectedBar]) {
    const selectedMonthStr = barData[selectedBar].rawMonthYear; // "2026-06"

    const [year, month] = selectedMonthStr.split('-').map(Number);

    return all.filter((app) => {
      if (!app.dateScheduled) return false;

      const date = new Date(app.dateScheduled);

      return (
        date.getFullYear() === year &&
        date.getMonth() + 1 === month
      );
    });
  }

  return all;
}, [appointmentsData, selectedBar, barData]);

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-4">
      {/* Header */}
      <AppAdminHeader
        title="Relatório de Agendamentos"
        iconRight={{ icon: false, path: "" }}
      />

      {/* KPI Card */}
      <View className="mt-4 bg-background-quartenary p-5 rounded-xl border border-gray-700">
        <Text className="text-app-theme-primary text-sm mb-1 font-semibold uppercase">Total de Agendamentos</Text>
        <Text className="text-font-primary text-5xl font-bold">{highlightValue}</Text>
      </View>

      {/* Gráfico Estilo Nubank (Pure Views) */}
      <View className="mt-8 h-[220px]">
        <Text className="text-gray-600 text-xs mb-3 font-semibold">VOLUME MENSAL</Text>
        {monthlyLoading ? (
          <ActivityIndicator size="large" color={colors["app-theme-primary"]} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "flex-end", paddingRight: 20 }}
          >
            {barData.map((item: any, index: number) => {
              const isSelected = selectedBar === index;
              const barHeight = (item.value / maxBarValue) * 130 + 10;

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => setSelectedBar(index)}
                  className="items-center mr-6 justify-end"
                >
                  {isSelected && (
                    <Text className="text-font-primary text-[10px] font-bold mb-1">
                      {item.value} agend.
                    </Text>
                  )}
                  <View
                    style={{ height: barHeight }}
                    className={`w-8 rounded-t-md ${
                      isSelected ? "bg-app-theme-primary" : "bg-app-theme-primary/30"
                    }`}
                  />
                  <Text className={`text-xs mt-2 ${isSelected ? "text-font-primary font-bold" : "text-gray-600"}`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* Detalhe dos Agendamentos */}
      <View className="flex-1 mt-6 border-t border-gray-800 pt-4">
        <Text className="text-gray-600 text-xs mb-4 font-semibold">DETALHE DOS AGENDAMENTOS</Text>

        <FlatList
          data={appointmentsList}
          keyExtractor={(item) => item.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => {
            const dateStr = item.dateScheduled ? format(new Date(item.dateScheduled), "dd MMM HH:mm") : "";
            return (
              <View className="flex-row items-center justify-between py-4 border-b border-gray-800">
                <View className="flex-row items-center gap-3">
                  <View className="bg-gray-800 p-2 rounded-full">
                    <Ionicons name="calendar" color="white" size={18} />
                  </View>
                  <View>
                    <Text className="text-font-primary font-semibold text-sm">
                      {item.services?.[0]?.service.name || "Serviço"}
                    </Text>
                    <Text className="text-gray-600 text-xs">
                      {dateStr} • {item.user?.firstName || "Cliente"}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-font-primary font-bold text-sm">
                    {item.employee?.name || "Profissional"}
                  </Text>
                  <Text className="text-app-theme-primary text-xs">
                    {item.status === "SCHEDULED" ? "Agendado" : item.status === "CONFIRMED" ? "Confirmado" : item.status}
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <AppEmptyList
              name="agenda"
              iconName="calendar-outline"
              title="Sem agendamentos"
              description="Nenhum agendamento encontrado para o período."
            />
          }
        />
      </View>
    </SafeAreaView>
  );
}

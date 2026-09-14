import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { usePeakHoursReportViewModel } from "./usePeakHoursReportViewModel";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { moneyMapper } from "@/utils/moneyMapper";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { AppDate } from "@/shared/components/AppDate";

// Subcomponente de Seleção de Profissional
function EmployeeSelectorForm({
  employees,
  selectedId,
  onSelect,
  onClose,
  themeColor,
}: {
  employees: any[];
  selectedId: number | null;
  onSelect: (id: number | null, name: string) => void;
  onClose: () => void;
  themeColor: string;
}) {
  return (
    <View className="p-6 gap-4 bg-white flex-1 rounded-t-3xl border-t border-slate-200">
      <View className="flex-row justify-between items-center border-b border-slate-100 pb-3 mb-2">
        <Text className="text-slate-900 font-bold text-lg">Filtrar por Profissional</Text>
        <TouchableOpacity onPress={onClose} className="p-1">
          <Ionicons name="close" size={24} color="#092D5D" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          className="py-4 border-b border-slate-100"
          onPress={() => onSelect(null, "Todos")}
        >
          <Text className="text-slate-900 text-sm font-semibold">Todos os Profissionais</Text>
        </TouchableOpacity>
        {employees.map((emp) => (
          <TouchableOpacity
            key={emp.id}
            className="py-4 border-b border-slate-100"
            onPress={() => onSelect(emp.id ?? null, emp.name)}
          >
            <Text
              style={{
                color: selectedId === emp.id ? themeColor : "#1e293b",
                fontWeight: selectedId === emp.id ? "700" : "400",
              }}
              className="text-sm"
            >
              {emp.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function PeakHoursReportView() {
  const {
    loading,
    stats,
    selectedDayIndex,
    setSelectedDayIndex,
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedEmployeeName,
    setSelectedEmployeeName,
    employeeList,
    showAll,
  } = usePeakHoursReportViewModel();

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();
  const themeColor = colors["app-theme-primary"];

  const handleOpenEmployeeSheet = () => {
    openBottomSheet(
      <EmployeeSelectorForm
        employees={employeeList}
        selectedId={selectedEmployeeId}
        onSelect={(id, name) => {
          setSelectedEmployeeId(id);
          setSelectedEmployeeName(name);
          closeBottomSheet();
        }}
        onClose={closeBottomSheet}
        themeColor={themeColor}
      />,
      0
    );
  };

  const selectedDay =
    selectedDayIndex !== null ? stats.daysList.find((d) => d.dayIndex === selectedDayIndex) : null;

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4">
      <AppAdminHeader
        title="Dias & Horários Nobres"
        iconRight={{ icon: false, path: "" }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Gráfico de Barras Semanal */}
        <View className="mt-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider">
              Movimento por Dia da Semana
            </Text>
            {selectedDayIndex !== null && (
              <TouchableOpacity onPress={() => setSelectedDayIndex(null)}>
                <Text className="text-[#CBA35D] text-xs font-bold">Ver todos</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Destaque do Dia Selecionado ou Geral */}
          <View className="my-2">
            <Text className="text-slate-900 text-2xl font-black">
              {selectedDay
                ? `R$ ${moneyMapper(selectedDay.revenue)}`
                : `R$ ${moneyMapper(stats.totalRevenue)}`}
            </Text>
            <Text className="text-gray-600 text-xs font-semibold mt-0.5">
              {selectedDay
                ? `${selectedDay.name} • ${selectedDay.count} atendimentos (${selectedDay.percentage.toFixed(1)}%)`
                : `${stats.totalAppointments} atendimentos totais no período`}
            </Text>
          </View>

          {/* Barras Verticais dos 7 Dias da Semana */}
          <View className="h-[130px] flex-row items-end justify-between px-2 mt-4 pt-2 border-t border-slate-100">
            {stats.daysList.map((day) => {
              const isSelected = selectedDayIndex === day.dayIndex;
              const barHeight = stats.maxDayRevenue > 0 ? (day.revenue / stats.maxDayRevenue) * 80 + 10 : 10;

              return (
                <TouchableOpacity
                  key={day.dayIndex}
                  onPress={() => setSelectedDayIndex(isSelected ? null : day.dayIndex)}
                  activeOpacity={0.8}
                  className="items-center flex-1"
                >
                  <View
                    style={{
                      height: barHeight,
                      backgroundColor: isSelected
                        ? "#CBA35D"
                        : day.revenue > 0
                        ? "#092D5D"
                        : "#e2e8f0",
                    }}
                    className="w-7 rounded-t-lg items-center justify-start pt-1"
                  />
                  <Text
                    className={`text-[11px] mt-2 font-bold ${
                      isSelected
                        ? "text-[#CBA35D]"
                        : day.count > 0
                        ? "text-slate-700"
                        : "text-gray-600"
                    }`}
                  >
                    {day.shortName}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ─── Insights Estratégicos Automatizados ─────────────── */}
        <View className="mt-4 gap-2.5">
          {stats.bestDay && (
            <View className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex-row items-start gap-3 shadow-xs">
              <View className="w-9 h-9 rounded-xl bg-emerald-100 items-center justify-center shrink-0">
                <Ionicons name="trophy" size={18} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-emerald-800 font-bold text-xs uppercase tracking-wider">
                  Dia Campeão de Faturamento
                </Text>
                <Text className="text-slate-900 font-extrabold text-sm mt-0.5">
                  {stats.bestDay.name} lidera com R$ {moneyMapper(stats.bestDay.revenue)}
                </Text>
                <Text className="text-emerald-700 text-xs mt-0.5 font-medium">
                  Representa {stats.bestDay.percentage.toFixed(1)}% de todo o seu faturamento ({stats.bestDay.count} atendimentos).
                </Text>
              </View>
            </View>
          )}

          {stats.lowestDay && stats.lowestDay.dayIndex !== stats.bestDay?.dayIndex && (
            <View className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex-row items-start gap-3 shadow-xs">
              <View className="w-9 h-9 rounded-xl bg-amber-100 items-center justify-center shrink-0">
                <Ionicons name="bulb-outline" size={18} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text className="text-amber-800 font-bold text-xs uppercase tracking-wider">
                  Oportunidade para Promoções
                </Text>
                <Text className="text-slate-900 font-extrabold text-sm mt-0.5">
                  {stats.lowestDay.name} tem menor ocupação
                </Text>
                <Text className="text-amber-700 text-xs mt-0.5 font-medium">
                  Excelente dia para criar combos, descontos de horários alternativos e fidelização.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ─── Filtros ─────────────────────────────────────────── */}
        <View className="mt-5 gap-2">
          <Text className="text-gray-600 text-xs font-semibold uppercase tracking-wider">FILTROS</Text>
          <View className="flex-row gap-2 flex-wrap">
            {showAll && (
              <TouchableOpacity
                onPress={handleOpenEmployeeSheet}
                className="flex-row items-center gap-1.5 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm"
              >
                <Ionicons name="person-outline" size={14} color={themeColor} />
                <Text className="text-slate-800 text-xs font-semibold">{selectedEmployeeName}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              className="flex-row items-center gap-1.5 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm"
            >
              <Ionicons name="calendar-outline" size={14} color={themeColor} />
              <Text className="text-slate-800 text-xs font-semibold">
                {format(dateStart, "dd/MM/yy")}
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-600 self-center text-xs">→</Text>
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              className="flex-row items-center gap-1.5 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm"
            >
              <Ionicons name="calendar-outline" size={14} color={themeColor} />
              <Text className="text-slate-800 text-xs font-semibold">
                {format(dateEnd, "dd/MM/yy")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Divisão por Turno (Manhã, Tarde, Noite) ─────────── */}
        <View className="mt-6">
          <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">
            MOVIMENTO POR TURNO
          </Text>

          <View className="gap-2.5">
            {stats.shiftList.map((shift) => {
              const iconName: any =
                shift.id === "morning"
                  ? "sunny-outline"
                  : shift.id === "afternoon"
                  ? "partly-sunny-outline"
                  : "moon-outline";

              return (
                <View
                  key={shift.id}
                  className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2.5">
                      <View
                        style={{ backgroundColor: shift.color + "20" }}
                        className="w-9 h-9 rounded-xl items-center justify-center"
                      >
                        <Ionicons
                          name={iconName}
                          size={18}
                          color={shift.color}
                        />
                      </View>
                      <View>
                        <Text className="text-slate-900 font-bold text-sm">{shift.label}</Text>
                        <Text className="text-gray-600 text-[11px] font-medium">{shift.hours}</Text>
                      </View>
                    </View>

                    <View className="items-end">
                      <Text className="text-slate-900 font-black text-base">
                        R$ {moneyMapper(shift.revenue)}
                      </Text>
                      <Text className="text-gray-600 text-[11px] font-semibold">
                        {shift.count} clientes ({shift.percentage.toFixed(1)}%)
                      </Text>
                    </View>
                  </View>

                  {/* Barra de Progresso */}
                  <View className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                    <View
                      style={{ width: `${shift.percentage}%`, backgroundColor: shift.color }}
                      className="h-full rounded-full"
                    />
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ─── Horários de Pico Mais Movimentados ───────────────── */}
        {stats.peakHoursList.length > 0 && (
          <View className="mt-6">
            <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">
              TOP HORÁRIOS DE PICO
            </Text>

            <View className="flex-row flex-wrap gap-2">
              {stats.peakHoursList.map((h, i) => (
                <View
                  key={h.hour}
                  className="bg-white px-4 py-3 rounded-2xl border border-slate-200 flex-row items-center gap-2.5 flex-1 min-w-[140px] shadow-sm"
                >
                  <View className="w-7 h-7 rounded-full bg-[#CBA35D]/15 items-center justify-center">
                    <Text className="text-[#CBA35D] font-bold text-xs">{i + 1}º</Text>
                  </View>
                  <View>
                    <Text className="text-slate-900 font-black text-sm">{h.hour}:00h</Text>
                    <Text className="text-gray-600 text-[10px] font-medium">
                      {h.count} atend. • R$ {moneyMapper(h.revenue)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modais de Date Picker */}
      {showStartPicker && (
        <AppDate
          open={showStartPicker}
          date={dateStart}
          onConfirm={(d) => {
            if (d) setDateStart(d);
            setShowStartPicker(false);
          }}
          onCancel={() => setShowStartPicker(false)}
        />
      )}
      {showEndPicker && (
        <AppDate
          open={showEndPicker}
          date={dateEnd}
          onConfirm={(d) => {
            if (d) setDateEnd(d);
            setShowEndPicker(false);
          }}
          onCancel={() => setShowEndPicker(false)}
        />
      )}
    </SafeAreaView>
  );
}

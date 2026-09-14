import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { useTicketMetricsReportViewModel } from "./useTicketMetricsReportViewModel";
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

export function TicketMetricsReportView() {
  const {
    loading,
    metrics,
    selectedBar,
    setSelectedBar,
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
  } = useTicketMetricsReportViewModel();

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

  const selectedMonth =
    selectedBar !== null && metrics.monthlyStatsList[selectedBar]
      ? metrics.monthlyStatsList[selectedBar]
      : null;

  const getRankBadgeStyle = (index: number) => {
    if (index === 0) return { bg: "bg-amber-50 border-amber-300", text: "text-amber-700", label: "1º 🥇" };
    if (index === 1) return { bg: "bg-slate-100 border-slate-300", text: "text-slate-700", label: "2º 🥈" };
    if (index === 2) return { bg: "bg-amber-100/60 border-amber-400/60", text: "text-amber-800", label: "3º 🥉" };
    return { bg: "bg-slate-50 border-slate-200", text: "text-slate-600", label: `${index + 1}º` };
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4">
      <AppAdminHeader
        title="Ticket Médio & Métricas"
        iconRight={{ icon: false, path: "" }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* KPI Hero Cards */}
        <View className="mt-4 gap-2.5">
          {/* Card Principal: Ticket Médio */}
          <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[#CBA35D] text-xs font-bold uppercase tracking-wider">
                Ticket Médio por Comanda
              </Text>
              <View className="w-8 h-8 rounded-xl bg-[#CBA35D]/10 items-center justify-center">
                <Ionicons name="pricetag-outline" size={16} color="#CBA35D" />
              </View>
            </View>
            <Text className="text-slate-900 text-4xl font-black">
              R$ {moneyMapper(metrics.averageTicket)}
            </Text>
            <Text className="text-gray-600 text-xs mt-1">
              Média gasta por cliente em {metrics.totalPeriodOrders} atendimentos
            </Text>
          </View>

          {/* Grid com 3 Cards Secundários */}
          <View className="flex-row gap-2.5">
            {/* Venda Casada / Média de Itens */}
            <View className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
              <View className="flex-row items-center gap-1 mb-1">
                <Ionicons name="cart-outline" size={14} color="#0284c7" />
                <Text className="text-sky-700 font-bold text-[10px] uppercase">Cross-Selling</Text>
              </View>
              <Text className="text-slate-900 font-black text-xl">
                {metrics.averageItemsPerOrder.toFixed(1)} <Text className="text-xs text-gray-600 font-normal">itens</Text>
              </Text>
              <Text className="text-gray-600 text-[10px] mt-0.5">
                Média por comanda
              </Text>
            </View>

            {/* Clientes Únicos */}
            <View className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
              <View className="flex-row items-center gap-1 mb-1">
                <Ionicons name="people-outline" size={14} color="#059669" />
                <Text className="text-emerald-700 font-bold text-[10px] uppercase">Clientes</Text>
              </View>
              <Text className="text-slate-900 font-black text-xl">
                {metrics.uniqueClientsCount}
              </Text>
              <Text className="text-gray-600 text-[10px] mt-0.5">
                Clientes atendidos
              </Text>
            </View>

            {/* Gorjetas Totais */}
            <View className="flex-1 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
              <View className="flex-row items-center gap-1 mb-1">
                <Ionicons name="heart-outline" size={14} color="#e11d48" />
                <Text className="text-rose-700 font-bold text-[10px] uppercase">Gorjetas</Text>
              </View>
              <Text className="text-slate-900 font-black text-xl">
                R$ {moneyMapper(metrics.totalTips)}
              </Text>
              <Text className="text-gray-600 text-[10px] mt-0.5">
                Equipe
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Gráfico de Evolução do Ticket Médio Mensal ──────── */}
        {metrics.monthlyStatsList.length > 0 && (
          <View className="mt-5 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider">
                Evolução Mensal do Ticket Médio
              </Text>
              {selectedBar !== null && (
                <TouchableOpacity onPress={() => setSelectedBar(null)}>
                  <Text className="text-[#CBA35D] text-xs font-bold">Ver todos</Text>
                </TouchableOpacity>
              )}
            </View>

            {selectedMonth && (
              <View className="my-2 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <Text className="text-slate-900 text-xl font-black">
                  R$ {moneyMapper(selectedMonth.ticketAverage)}
                </Text>
                <Text className="text-gray-600 text-xs mt-0.5 font-medium">
                  {selectedMonth.label} • {selectedMonth.totalOrders} comandas • Faturamento: R$ {moneyMapper(selectedMonth.totalRevenue)}
                </Text>
              </View>
            )}

            <View className="h-[140px] mt-3">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ alignItems: "flex-end", paddingRight: 20 }}
              >
                {metrics.monthlyStatsList.map((item, index) => {
                  const isSelected = selectedBar === index;
                  const barHeight = (item.ticketAverage / metrics.maxMonthlyTicket) * 75 + 10;

                  return (
                    <TouchableOpacity
                      key={item.monthYear}
                      activeOpacity={0.8}
                      onPress={() => setSelectedBar(index)}
                      className="items-center mr-6 justify-end"
                    >
                      {isSelected && (
                        <Text className="text-slate-900 text-[10px] font-bold mb-1">
                          R$ {moneyMapper(item.ticketAverage)}
                        </Text>
                      )}
                      <View
                        style={{
                          height: barHeight,
                          backgroundColor: isSelected ? "#CBA35D" : "#092D5D",
                        }}
                        className="w-8 rounded-t-md"
                      />
                      <Text
                        className={`text-xs mt-2 ${
                          isSelected ? "text-slate-900 font-bold" : "text-gray-600"
                        }`}
                      >
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        )}

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

        {/* ─── Top Clientes VIP (Maior Volume Gasto) ────────────── */}
        <View className="mt-6">
          <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">
            TOP CLIENTES VIP (MAIOR CONSUMO NO PERÍODO)
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={themeColor} className="py-8" />
          ) : metrics.vipClientsList.length > 0 ? (
            metrics.vipClientsList.map((client, index) => {
              const badge = getRankBadgeStyle(index);
              return (
                <View
                  key={client.id}
                  className="bg-white p-4 rounded-2xl mb-3 border border-slate-200 flex-row items-center justify-between shadow-sm"
                >
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    {/* Badge de Posição */}
                    <View className={`px-2 py-1 rounded-lg border ${badge.bg}`}>
                      <Text className={`font-black text-xs ${badge.text}`}>
                        {badge.label}
                      </Text>
                    </View>

                    {/* Avatar do Cliente */}
                    <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center overflow-hidden border border-slate-200">
                      {client.avatarUrl ? (
                        <Image
                          source={{ uri: client.avatarUrl }}
                          style={{ width: 40, height: 40, borderRadius: 20 }}
                          resizeMode="cover"
                        />
                      ) : (
                        <Ionicons name="person" size={18} color="#092D5D" />
                      )}
                    </View>

                    {/* Informações do Cliente */}
                    <View className="flex-1">
                      <Text className="text-slate-900 font-bold text-sm" numberOfLines={1}>
                        {client.name}
                      </Text>
                      <Text className="text-gray-600 text-[11px] mt-0.5 font-medium">
                        {client.ordersCount} {client.ordersCount === 1 ? "visita" : "visitas"} • R$ {moneyMapper(client.averageTicket)}/visita
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text className="text-emerald-700 font-black text-base">
                      R$ {moneyMapper(client.totalSpent)}
                    </Text>
                    <Text className="text-gray-600 text-[10px] font-semibold">
                      Total Gasto
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="bg-white p-8 rounded-2xl border border-slate-200 items-center justify-center my-4">
              <Ionicons name="people-outline" size={40} color="#94a3b8" />
              <Text className="text-gray-600 font-bold text-sm text-center mt-2">
                Nenhum cliente registrado no período.
              </Text>
            </View>
          )}
        </View>
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

import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { useCashFlowReportViewModel } from "./useCashFlowReportViewModel";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { moneyMapper } from "@/utils/moneyMapper";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { AppDate } from "@/shared/components/AppDate";
import Svg, { Circle, G, Text as SvgText } from "react-native-svg";

// ─── Subcomponente de Gráfico de Pizza SVG ──────────────────────────────
function PieChart({
  depositPercent,
  withdrawPercent,
  netBalance,
}: {
  depositPercent: number;
  withdrawPercent: number;
  netBalance: number;
}) {
  const size = 180;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const depositDash = (depositPercent / 100) * circumference;
  const withdrawDash = (withdrawPercent / 100) * circumference;

  return (
    <View className="items-center justify-center py-4">
      <View style={{ width: size, height: size, position: "relative" }} className="items-center justify-center">
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Saídas (Vermelho) - Fundo de Base */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#fecdd3"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={`${circumference}`}
            />
            {/* Entradas (Verde) - Sobreposição */}
            {depositPercent > 0 && (
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#10b981"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${depositDash} ${circumference}`}
                strokeLinecap="round"
              />
            )}
          </G>
        </Svg>
        {/* Texto do Centro */}
        <View className="absolute items-center justify-center">
          <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-wider">
            Saldo Líquido
          </Text>
          <Text
            className={`text-lg font-black ${
              netBalance >= 0 ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            R$ {moneyMapper(netBalance)}
          </Text>
        </View>
      </View>
    </View>
  );
}

// ─── Subcomponente de Seleção de Profissional ─────────────────────────────
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

export function CashFlowReportView() {
  const {
    loading,
    consolidatedTransactions,
    totals,
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
  } = useCashFlowReportViewModel();

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
      0,
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4">
      <AppAdminHeader
        title="Relatório de Fluxo de Caixa"
        iconRight={{ icon: false, path: "" }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Gráfico de Pizza + Resumo Geral */}
        <View className="mt-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-2 text-center">
            Proporção de Entradas vs Saídas
          </Text>

          <PieChart
            depositPercent={totals.depositPercentage}
            withdrawPercent={totals.withdrawPercentage}
            netBalance={totals.netBalance}
          />

          {/* Legenda dos Valores */}
          <View className="flex-row justify-between gap-2.5 mt-4 pt-4 border-t border-slate-100">
            {/* Card de Entradas */}
            <View className="flex-1 bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 shadow-xs">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Ionicons name="arrow-down-circle" size={16} color="#059669" />
                <Text className="text-emerald-800 font-extrabold text-xs">Entradas</Text>
              </View>
              <Text className="text-slate-900 font-black text-lg">
                R$ {moneyMapper(totals.totalDeposit)}
              </Text>
              <Text className="text-emerald-700 text-[10px] mt-0.5 font-medium">
                {totals.depositPercentage.toFixed(1)}% do total
              </Text>
            </View>

            {/* Card de Saídas */}
            <View className="flex-1 bg-rose-50 p-3.5 rounded-2xl border border-rose-200 shadow-xs">
              <View className="flex-row items-center gap-1.5 mb-1">
                <Ionicons name="arrow-up-circle" size={16} color="#e11d48" />
                <Text className="text-rose-800 font-extrabold text-xs">Saídas</Text>
              </View>
              <Text className="text-slate-900 font-black text-lg">
                R$ {moneyMapper(totals.totalWithdraw)}
              </Text>
              <Text className="text-rose-700 text-[10px] mt-0.5 font-medium">
                {totals.withdrawPercentage.toFixed(1)}% do total
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Filtros ─────────────────────────────────────────── */}
        <View className="mt-5 gap-2">
          <Text className="text-gray-600 text-xs font-semibold uppercase tracking-wider">FILTROS</Text>
          <View className="flex-row gap-2 flex-wrap">
            {/* Profissional */}
            {showAll && (
              <TouchableOpacity
                onPress={handleOpenEmployeeSheet}
                className="flex-row items-center gap-1.5 bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-sm"
              >
                <Ionicons name="person-outline" size={14} color={themeColor} />
                <Text className="text-slate-800 text-xs font-semibold">{selectedEmployeeName}</Text>
              </TouchableOpacity>
            )}

            {/* Data início */}
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
            {/* Data fim */}
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

        {/* ─── Detalhamento das Transações ─────────────────────── */}
        <View className="mt-6 border-t border-slate-100 pt-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider">
              DETALHAMENTO DE ENTRADAS E SAÍDAS ({consolidatedTransactions.length})
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={themeColor} className="py-8" />
          ) : consolidatedTransactions.length > 0 ? (
            consolidatedTransactions.map((t) => {
              const isDeposit = t.type === "DEPOSIT";
              const dateStr = t.dateTime
                ? format(new Date(t.dateTime), "dd/MM/yy HH:mm")
                : "";

              return (
                <View
                  key={t.id}
                  className="bg-white p-4 rounded-2xl mb-2.5 flex-row justify-between items-center border border-slate-200 shadow-sm"
                >
                  <View className="flex-row items-center gap-3 flex-1 pr-2">
                    <View
                      className={`p-2.5 rounded-xl border ${
                        isDeposit
                          ? "bg-emerald-50 border-emerald-200"
                          : "bg-rose-50 border-rose-200"
                      }`}
                    >
                      <Ionicons
                        name={isDeposit ? "arrow-down" : "arrow-up"}
                        size={18}
                        color={isDeposit ? "#059669" : "#e11d48"}
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-slate-900 font-bold text-sm" numberOfLines={1}>
                        {t.description}
                      </Text>
                      <Text className="text-gray-600 text-[11px] mt-0.5 font-medium">
                        {dateStr} {t.employeeName ? `• 👤 ${t.employeeName}` : ""}
                      </Text>
                    </View>
                  </View>

                  <View className="items-end">
                    <Text
                      className={`font-black text-base ${
                        isDeposit ? "text-emerald-700" : "text-rose-700"
                      }`}
                    >
                      {isDeposit ? "+" : "-"} R$ {moneyMapper(t.value)}
                    </Text>
                    <View
                      className={`px-2 py-0.5 rounded-md mt-1 border ${
                        t.source === "ORDER"
                          ? "bg-slate-100 border-slate-200"
                          : "bg-amber-50 border-amber-200"
                      }`}
                    >
                      <Text
                        className={`text-[9px] font-bold ${
                          t.source === "ORDER" ? "text-slate-700" : "text-amber-800"
                        }`}
                      >
                        {t.source === "ORDER" ? "Comanda" : "Caixa Manual"}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="bg-white p-8 rounded-2xl border border-slate-200 items-center justify-center my-4">
              <Ionicons name="swap-vertical-outline" size={40} color="#94a3b8" />
              <Text className="text-gray-600 font-bold text-sm text-center mt-2">
                Nenhuma transação encontrada para o período.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Pickers de data */}
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

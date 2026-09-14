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
import { usePaymentMethodsReportViewModel, PaymentMethodItem } from "./usePaymentMethodsReportViewModel";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { moneyMapper } from "@/utils/moneyMapper";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { AppDate } from "@/shared/components/AppDate";
import Svg, { Circle, G } from "react-native-svg";

const PALETTE = ["#059669", "#0284c7", "#CBA35D", "#9333ea", "#e11d48", "#ea580c", "#475569"];

// Subcomponente de Gráfico Donut SVG para Formas de Pagamento
function PaymentDonutChart({
  items,
  totalRevenue,
}: {
  items: PaymentMethodItem[];
  totalRevenue: number;
}) {
  const size = 180;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedDash = 0;

  return (
    <View className="items-center justify-center py-3">
      <View style={{ width: size, height: size, position: "relative" }} className="items-center justify-center">
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {items.map((item, index) => {
              const dash = (item.percentage / 100) * circumference;
              const offset = -accumulatedDash;
              accumulatedDash += dash;
              const color = PALETTE[index % PALETTE.length];

              if (item.percentage <= 0) return null;

              return (
                <Circle
                  key={item.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={color}
                  strokeWidth={strokeWidth}
                  fill="transparent"
                  strokeDasharray={`${dash} ${circumference}`}
                  strokeDashoffset={offset}
                />
              );
            })}
          </G>
        </Svg>
        <View className="absolute items-center justify-center px-4">
          <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-wider text-center">
            Total Recebido
          </Text>
          <Text className="text-slate-900 text-base font-black text-center mt-0.5" numberOfLines={1}>
            R$ {moneyMapper(totalRevenue)}
          </Text>
        </View>
      </View>
    </View>
  );
}

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

export function PaymentMethodsReportView() {
  const {
    loading,
    reportData,
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
  } = usePaymentMethodsReportViewModel();

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

  const getMethodIcon = (name: string, isCard: boolean) => {
    const lower = name.toLowerCase();
    if (lower.includes("pix")) return "qr-code-outline";
    if (lower.includes("dinheiro") || lower.includes("espécie")) return "cash-outline";
    if (lower.includes("assinatura") || lower.includes("clube")) return "ribbon-outline";
    if (isCard || lower.includes("cartão") || lower.includes("cartao") || lower.includes("crédito") || lower.includes("débito")) {
      return "card-outline";
    }
    return "wallet-outline";
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4">
      <AppAdminHeader
        title="Meios de Pagamento & Taxas"
        iconRight={{ icon: false, path: "" }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Gráfico Donut de Meios de Pagamento */}
        <View className="mt-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1 text-center">
            Distribuição por Forma de Pagamento
          </Text>

          <PaymentDonutChart
            items={reportData.paymentMethodsList}
            totalRevenue={reportData.totalGrossRevenue}
          />

          {/* Cards KPI Resumo (Bruto, Taxas, Líquido) */}
          <View className="gap-2.5 mt-3 pt-3 border-t border-slate-100">
            <View className="flex-row gap-2.5">
              <View className="flex-1 bg-slate-50 p-3 rounded-2xl border border-slate-200 shadow-xs">
                <Text className="text-gray-600 text-[10px] font-bold uppercase">Total Bruto</Text>
                <Text className="text-slate-900 font-black text-base mt-0.5">
                  R$ {moneyMapper(reportData.totalGrossRevenue)}
                </Text>
                <Text className="text-gray-600 text-[10px] mt-0.5 font-medium">
                  {reportData.totalTransactionsCount} pagamentos
                </Text>
              </View>

              <View className="flex-1 bg-rose-50 p-3 rounded-2xl border border-rose-200 shadow-xs">
                <Text className="text-rose-800 text-[10px] font-bold uppercase">Taxas Maquininha</Text>
                <Text className="text-rose-700 font-black text-base mt-0.5">
                  - R$ {moneyMapper(reportData.totalFeeDeductions)}
                </Text>
                <Text className="text-rose-600 text-[10px] mt-0.5 font-medium">
                  Média: {reportData.averageFeePercentage.toFixed(2)}%
                </Text>
              </View>
            </View>

            <View className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex-row items-center justify-between shadow-xs">
              <View>
                <Text className="text-emerald-800 text-xs font-bold uppercase">Líquido em Conta</Text>
                <Text className="text-slate-900 font-black text-xl mt-0.5">
                  R$ {moneyMapper(reportData.totalNetRevenue)}
                </Text>
              </View>
              <View className="bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                <Text className="text-emerald-800 font-extrabold text-xs">
                  {reportData.totalGrossRevenue > 0
                    ? ((reportData.totalNetRevenue / reportData.totalGrossRevenue) * 100).toFixed(1)
                    : 100}
                  % Real
                </Text>
              </View>
            </View>
          </View>
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

        {/* ─── Listagem Detalhada das Formas de Pagamento ───────── */}
        <View className="mt-6">
          <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-3">
            DETALHAMENTO POR MODALIDADE ({reportData.paymentMethodsList.length})
          </Text>

          {loading ? (
            <ActivityIndicator size="large" color={themeColor} className="py-8" />
          ) : reportData.paymentMethodsList.length > 0 ? (
            reportData.paymentMethodsList.map((method, index) => {
              const color = PALETTE[index % PALETTE.length];
              const iconName = getMethodIcon(method.name, method.isCard);
              const flagsList = Object.values(method.flags);

              return (
                <View
                  key={method.id}
                  className="bg-white p-4 rounded-2xl mb-3 border border-slate-200 shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                      <View
                        style={{ backgroundColor: color + "15", borderColor: color + "30" }}
                        className="p-2 rounded-xl border"
                      >
                        <Ionicons name={iconName as any} size={18} color={color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-slate-900 font-bold text-sm" numberOfLines={1}>
                          {method.name}
                        </Text>
                        <Text className="text-gray-600 text-[11px] font-medium">
                          {method.count} {method.count === 1 ? "transação" : "transações"} ({method.percentage.toFixed(1)}%)
                        </Text>
                      </View>
                    </View>

                    <View className="items-end">
                      <Text className="text-slate-900 font-black text-base">
                        R$ {moneyMapper(method.totalGross)}
                      </Text>
                      {method.totalFee > 0 ? (
                        <Text className="text-rose-700 text-[11px] font-semibold">
                          Taxas: - R$ {moneyMapper(method.totalFee)}
                        </Text>
                      ) : (
                        <Text className="text-emerald-700 text-[11px] font-semibold">
                          Sem taxa descontada
                        </Text>
                      )}
                    </View>
                  </View>

                  {/* Barra de Progresso Horizontal */}
                  <View className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                    <View
                      style={{ width: `${method.percentage}%`, backgroundColor: color }}
                      className="h-full rounded-full"
                    />
                  </View>

                  {/* Sub-itens de Bandeiras de Cartão */}
                  {flagsList.length > 0 && (
                    <View className="mt-3 pt-2.5 border-t border-slate-100 gap-1.5">
                      <Text className="text-gray-600 text-[10px] font-bold uppercase">
                        Bandeiras Utilizadas:
                      </Text>
                      <View className="flex-row flex-wrap gap-1.5">
                        {flagsList.map((flag) => (
                          <View
                            key={flag.name}
                            className="bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 flex-row items-center gap-1.5"
                          >
                            <Text className="text-slate-800 font-bold text-xs">
                              {flag.name}
                            </Text>
                            <Text className="text-gray-600 text-[10px] font-medium">
                              R$ {moneyMapper(flag.gross)} {flag.feePercent > 0 ? `(${flag.feePercent}%)` : ""}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              );
            })
          ) : (
            <View className="bg-white p-8 rounded-2xl border border-slate-200 items-center justify-center my-4">
              <Ionicons name="card-outline" size={40} color="#94a3b8" />
              <Text className="text-gray-600 font-bold text-sm text-center mt-2">
                Nenhum pagamento registrado no período.
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

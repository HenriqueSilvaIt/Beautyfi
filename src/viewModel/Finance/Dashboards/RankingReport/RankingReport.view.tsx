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
import { useRankingReportViewModel, RankingItem } from "./useRankingReportViewModel";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { moneyMapper } from "@/utils/moneyMapper";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { AppDate } from "@/shared/components/AppDate";
import Svg, { Circle, G } from "react-native-svg";

// Subcomponente de Gráfico Donut SVG Triplo (Serviços / Produtos / Clube)
function MixDonutChart({
  servicePercent,
  productPercent,
  subscriptionPercent,
  totalRevenue,
}: {
  servicePercent: number;
  productPercent: number;
  subscriptionPercent: number;
  totalRevenue: number;
}) {
  const size = 180;
  const strokeWidth = 22;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calcula fatias do círculo
  const sDash = (servicePercent / 100) * circumference;
  const pDash = (productPercent / 100) * circumference;
  const subDash = (subscriptionPercent / 100) * circumference;

  const sOffset = 0;
  const pOffset = -sDash;
  const subOffset = -(sDash + pDash);

  return (
    <View className="items-center justify-center py-3">
      <View style={{ width: size, height: size, position: "relative" }} className="items-center justify-center">
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Base vazia cinza */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Fatias */}
            {servicePercent > 0 && (
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#CBA35D"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${sDash} ${circumference}`}
                strokeDashoffset={sOffset}
              />
            )}
            {productPercent > 0 && (
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#0284c7"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${pDash} ${circumference}`}
                strokeDashoffset={pOffset}
              />
            )}
            {subscriptionPercent > 0 && (
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#9333ea"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={`${subDash} ${circumference}`}
                strokeDashoffset={subOffset}
              />
            )}
          </G>
        </Svg>
        <View className="absolute items-center justify-center px-4">
          <Text className="text-gray-600 text-[10px] font-bold uppercase tracking-wider text-center">
            Faturamento Mix
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

export function RankingReportView() {
  const {
    loading,
    rankingData,
    activeTab,
    setActiveTab,
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
  } = useRankingReportViewModel();

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

  const currentList: RankingItem[] =
    activeTab === "SERVICES" ? rankingData.rankedServices : rankingData.rankedProducts;

  const maxRevenue = currentList.length > 0 ? currentList[0].totalRevenue : 1;

  const getRankBadge = (index: number) => {
    if (index === 0) return { label: "1º 🥇", bg: "bg-amber-50", border: "border-amber-300", text: "text-amber-700" };
    if (index === 1) return { label: "2º 🥈", bg: "bg-slate-100", border: "border-slate-300", text: "text-slate-700" };
    if (index === 2) return { label: "3º 🥉", bg: "bg-amber-100/60", border: "border-amber-400/60", text: "text-amber-800" };
    return { label: `${index + 1}º`, bg: "bg-slate-50", border: "border-slate-200", text: "text-slate-600" };
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 px-4">
      <AppAdminHeader
        title="Ranking de Serviços & Produtos"
        iconRight={{ icon: false, path: "" }}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Gráfico Donut de Mix de Vendas */}
        <View className="mt-4 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
          <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-1 text-center">
            Composição do Faturamento (Mix de Vendas)
          </Text>

          <MixDonutChart
            servicePercent={rankingData.servicePercent}
            productPercent={rankingData.productPercent}
            subscriptionPercent={rankingData.subscriptionPercent}
            totalRevenue={rankingData.totalGeneralRevenue}
          />

          {/* Legenda dos Segmentos */}
          <View className="flex-row justify-between gap-2 mt-2 pt-3 border-t border-slate-100">
            {/* Serviços */}
            <View className="flex-1 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200">
              <View className="flex-row items-center gap-1.5 mb-0.5">
                <View className="w-2.5 h-2.5 rounded-full bg-[#CBA35D]" />
                <Text className="text-amber-800 font-bold text-[11px]">Serviços</Text>
              </View>
              <Text className="text-slate-900 font-black text-sm">
                R$ {moneyMapper(rankingData.totalServicesRevenue)}
              </Text>
              <Text className="text-amber-700 text-[10px] mt-0.5 font-medium">
                {rankingData.servicePercent.toFixed(1)}% ({rankingData.totalServicesCount} un)
              </Text>
            </View>

            {/* Produtos */}
            <View className="flex-1 bg-sky-50/80 p-2.5 rounded-xl border border-sky-200">
              <View className="flex-row items-center gap-1.5 mb-0.5">
                <View className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <Text className="text-sky-800 font-bold text-[11px]">Produtos</Text>
              </View>
              <Text className="text-slate-900 font-black text-sm">
                R$ {moneyMapper(rankingData.totalProductsRevenue)}
              </Text>
              <Text className="text-sky-700 text-[10px] mt-0.5 font-medium">
                {rankingData.productPercent.toFixed(1)}% ({rankingData.totalProductsCount} un)
              </Text>
            </View>

            {/* Assinaturas */}
            <View className="flex-1 bg-purple-50/80 p-2.5 rounded-xl border border-purple-200">
              <View className="flex-row items-center gap-1.5 mb-0.5">
                <View className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                <Text className="text-purple-800 font-bold text-[11px]">Clube</Text>
              </View>
              <Text className="text-slate-900 font-black text-sm">
                R$ {moneyMapper(rankingData.totalSubscriptionRevenue)}
              </Text>
              <Text className="text-purple-700 text-[10px] mt-0.5 font-medium">
                {rankingData.subscriptionPercent.toFixed(1)}% ({rankingData.totalSubscriptionCount} un)
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

        {/* ─── Tab Switcher: Serviços vs Produtos Responsivo ───── */}
        <View className="mt-5 flex-row bg-slate-200/80 p-1.5 rounded-2xl border border-slate-300/60">
          <TouchableOpacity
            onPress={() => setActiveTab("SERVICES")}
            activeOpacity={0.8}
            className={`flex-1 py-2.5 px-2 rounded-xl items-center flex-row justify-center gap-1.5 ${
              activeTab === "SERVICES" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Ionicons
              name="cut-outline"
              size={15}
              color={activeTab === "SERVICES" ? "#092D5D" : "#64748b"}
            />
            <Text
              numberOfLines={1}
              className={`text-xs ${
                activeTab === "SERVICES" ? "text-slate-900 font-black" : "text-slate-600 font-semibold"
              }`}
            >
              Serviços ({rankingData.rankedServices.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("PRODUCTS")}
            activeOpacity={0.8}
            className={`flex-1 py-2.5 px-2 rounded-xl items-center flex-row justify-center gap-1.5 ${
              activeTab === "PRODUCTS" ? "bg-white shadow-sm" : ""
            }`}
          >
            <Ionicons
              name="bag-handle-outline"
              size={15}
              color={activeTab === "PRODUCTS" ? "#092D5D" : "#64748b"}
            />
            <Text
              numberOfLines={1}
              className={`text-xs ${
                activeTab === "PRODUCTS" ? "text-slate-900 font-black" : "text-slate-600 font-semibold"
              }`}
            >
              Produtos ({rankingData.rankedProducts.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── Lista de Ranking ─────────────────────────────────── */}
        <View className="mt-4">
          {loading ? (
            <ActivityIndicator size="large" color={themeColor} className="py-8" />
          ) : currentList.length > 0 ? (
            currentList.map((item, index) => {
              const badge = getRankBadge(index);
              const progressWidth = maxRevenue > 0 ? (item.totalRevenue / maxRevenue) * 100 : 0;

              return (
                <View
                  key={item.id}
                  className="bg-white p-4 rounded-2xl mb-3 border border-slate-200 shadow-sm"
                >
                  <View className="flex-row items-center justify-between mb-2">
                    <View className="flex-row items-center gap-2.5 flex-1 pr-2">
                      <View className={`px-2 py-1 rounded-lg border ${badge.bg} ${badge.border}`}>
                        <Text className={`text-xs font-black ${badge.text}`}>
                          {badge.label}
                        </Text>
                      </View>
                      <Text className="text-slate-900 font-bold text-sm flex-1" numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>

                    <View className="items-end">
                      <Text className="text-emerald-700 font-black text-base">
                        R$ {moneyMapper(item.totalRevenue)}
                      </Text>
                      <Text className="text-gray-600 text-[11px] font-semibold">
                        {item.quantity} {item.quantity === 1 ? "venda" : "vendas"}
                      </Text>
                    </View>
                  </View>

                  {/* Barra de Progresso Horizontal Proporcional */}
                  <View className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-1">
                    <View
                      style={{ width: `${progressWidth}%` }}
                      className={`h-full rounded-full ${
                        activeTab === "SERVICES" ? "bg-[#CBA35D]" : "bg-sky-500"
                      }`}
                    />
                  </View>

                  <View className="flex-row justify-between items-center mt-1.5">
                    <Text className="text-gray-600 text-[10px] font-medium">
                      Ticket médio: R$ {moneyMapper(item.quantity > 0 ? item.totalRevenue / item.quantity : 0)}
                    </Text>
                    <Text className="text-gray-600 text-[10px] font-bold">
                      {item.percentage.toFixed(1)}% do setor
                    </Text>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="bg-white p-8 rounded-2xl border border-slate-200 items-center justify-center my-4">
              <Ionicons name="stats-chart-outline" size={40} color="#94a3b8" />
              <Text className="text-gray-600 font-bold text-sm text-center mt-2">
                Nenhum {activeTab === "SERVICES" ? "serviço" : "produto"} registrado no período.
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

import { useTotalMonthlyViewModel } from "./useTotalMonthlyViewModel";
import { colors } from "@/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SellingHeader } from "./SellingHeader";
import { useEffect, useMemo, useState } from "react";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";
import { moneyMapper } from "@/utils/moneyMapper";
import { Ionicons } from "@expo/vector-icons";
import { format, startOfMonth, endOfMonth, subMonths, startOfDay, endOfDay } from "date-fns";
import { AppDate } from "@/shared/components/AppDate";
import { router } from "expo-router";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";

// Subcomponente de seleção de profissional para o BottomSheet
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
    <View className="p-6 gap-4 bg-background-quartenary flex-1 rounded-t-3xl border-t border-slate-800">
      <View className="flex-row justify-between items-center border-b border-slate-800 pb-3 mb-2">
        <Text className="text-font-primary font-bold text-lg">
          Filtrar por profissional
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          className="py-4 border-b border-slate-800"
          onPress={() => {
            onSelect(null, "Todos");
          }}
        >
          <Text className="text-font-primary text-sm font-semibold">Todos</Text>
        </TouchableOpacity>
        {employees.map((emp) => (
          <TouchableOpacity
            key={emp.id}
            className="py-4 border-b border-slate-800"
            onPress={() => {
              onSelect(emp.id ?? null, emp.name);
            }}
          >
            <Text
              style={{
                color: selectedId === emp.id ? themeColor : colors["font-primary"],
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

export function TotalMonthlyView({
  totalMonthly,
}: ReturnType<typeof useTotalMonthlyViewModel>) {
  function formatMonthYear(monthYear: string) {
    const [year, month] = monthYear.split("-");
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ];
    return `${months[Number(month) - 1]}/${year.slice(2)}`;
  }

  const [selectedBar, setSelectedBar] = useState<number | null>(null);
  const [highlightValue, setHighlightValue] = useState(0);

  // ─── Filtros ─────────────────────────────────────────────
  const [dateStart, setDateStart] = useState<Date>(startOfMonth(subMonths(new Date(), 5)));
  const [dateEnd, setDateEnd] = useState<Date>(endOfMonth(new Date()));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>("Todos");

  const currentUser = useUserStore((s) => s.user);
  const selectedCompanyId = useCompanyStore((s) => s.selectedCompanyId);
  const companyId = currentUser?.companyId ?? selectedCompanyId ?? 1;

  const isAdmin = currentUser?.roles?.some((role) => role.authority === "ROLE_ADMIN") ?? false;
  const myEmployeeId = currentUser?.employeeId ?? null;

  const { useGetCompanyPreferencesQuery } = useCompanyDetailsMutation();
  const companyPreferencesQuery = useGetCompanyPreferencesQuery?.();
  const { data: preferencesData } = companyPreferencesQuery ?? { data: undefined };

  const showAll = isAdmin || (preferencesData?.showAllEmployeeDashboardsToEmployees === true);

  // Carrega profissionais
  const { useGetEmployeeMutation } = useEmployeeMutation();
  const { data: employeeData } = useGetEmployeeMutation({ companyId: String(companyId) });
  const employeeList = useMemo(
    () => employeeData?.pages.flatMap((p) => p.content ?? []) ?? [],
    [employeeData],
  );

  useEffect(() => {
    if (preferencesData) {
      const showAllPref = isAdmin || (preferencesData.showAllEmployeeDashboardsToEmployees === true);
      if (!showAllPref && myEmployeeId !== null) {
        setSelectedEmployeeId(myEmployeeId);
        const emp = employeeList.find(e => e.id === myEmployeeId);
        setSelectedEmployeeName(emp ? emp.name : "Meu Perfil");
      }
    }
  }, [preferencesData, isAdmin, myEmployeeId, employeeList]);

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
          setSelectedBar(null);
          closeBottomSheet();
        }}
        onClose={closeBottomSheet}
        themeColor={themeColor}
      />,
      0
    );
  };

  // ─── Comandas (carrega TODAS as páginas) ─────────────────
  const { useGetOrdersMutation } = useOrderMutation();
  const {
    data: ordersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetOrdersMutation(companyId);

  // Auto-load all pages
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, ordersData]);

  const allOrders = useMemo(
    () => ordersData?.pages.flatMap((page) => page.content ?? []) ?? [],
    [ordersData],
  );

  const calculateOrderValue = (order: any) => {
    if (order.totalSold && Number(order.totalSold) > 0) {
      return Number(order.totalSold);
    }
    if (order.total && Number(order.total) > 0) {
      return Number(order.total);
    }
    if (order.totalOrder && Number(order.totalOrder) > 0) {
      return Number(order.totalOrder);
    }
    if (order.items && order.items.length > 0) {
      return order.items.reduce((acc: number, item: any) => {
        let price = 0;
        if (item.appointmentServices && item.appointmentServices.length > 0) {
          price = item.appointmentServices.reduce(
            (sum: number, aps: any) => sum + Number(aps.priceAtMoment ?? aps.service?.price ?? 0),
            0
          );
        } else {
          price = Number(item.servicePrice || item.price || 0);
        }
        const q = Number(item.quantity ?? 1);
        return acc + price * q;
      }, 0);
    }
    return 0;
  };

  // 1. Todas as comandas filtradas por período e profissional
  const periodFilteredOrders = useMemo(() => {
    let filtered = allOrders;
    const sDate = startOfDay(dateStart);
    const eDate = endOfDay(dateEnd);

    filtered = filtered.filter((order) => {
      if (!order.moment) return false;
      const d = new Date(order.moment);
      return d >= sDate && d <= eDate;
    });

    if (selectedEmployeeId !== null) {
      filtered = filtered.filter(
        (order) => order.employee?.id === selectedEmployeeId,
      );
    }

    return filtered;
  }, [allOrders, selectedEmployeeId, dateStart, dateEnd]);

  // Total acumulado do Período Filtrado
  const periodTotal = useMemo(() => {
    return periodFilteredOrders.reduce(
      (acc, order) => acc + calculateOrderValue(order),
      0,
    );
  }, [periodFilteredOrders]);

  // 2. Gráfico de barras montado a partir do agrupamento mensal
  const barData = useMemo(() => {
    const grouped: Record<string, number> = {};

    periodFilteredOrders.forEach((order) => {
      if (!order.moment) return;
      const monthStr = order.moment.substring(0, 7); // "YYYY-MM"
      grouped[monthStr] = (grouped[monthStr] || 0) + calculateOrderValue(order);
    });

    // Combina os meses vindos da API com os meses das comandas para garantir que Agosto sempre apareça
    const apiMonths = totalMonthly?.map((t) => t.monthYear) ?? [];
    const orderMonths = Object.keys(grouped);
    const monthsKeys = Array.from(new Set([...apiMonths, ...orderMonths])).sort();

    return monthsKeys.map((monthYear) => ({
      value: grouped[monthYear] || 0,
      label: formatMonthYear(monthYear),
      rawMonthYear: monthYear,
    }));
  }, [totalMonthly, periodFilteredOrders]);

  useEffect(() => {
    if (selectedBar !== null && barData[selectedBar]) {
      setHighlightValue(barData[selectedBar].value);
    }
  }, [selectedBar, barData]);

  const maxBarValue = useMemo(() => {
    return Math.max(...barData.map((b) => b.value), 1);
  }, [barData]);

  // Lista final de comandas (se barra/mês selecionada, filtra pelo mês da barra)
  const ordersList = useMemo(() => {
    if (selectedBar !== null && barData[selectedBar]) {
      const selectedMonthStr = barData[selectedBar].rawMonthYear;
      return periodFilteredOrders.filter(
        (order) => order.moment && order.moment.startsWith(selectedMonthStr),
      );
    }
    return periodFilteredOrders;
  }, [periodFilteredOrders, selectedBar, barData]);

  const selectedMonthLabel =
    selectedBar !== null && barData[selectedBar]
      ? barData[selectedBar].label
      : null;

  const currentDisplayValue =
    selectedBar !== null ? highlightValue : periodTotal;

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader title="Faturamento" iconRight={{ icon: false, path: "" }} />

      {/* Header com Total Vendido no Período ou Mês Selecionado */}
      <SellingHeader
        value={currentDisplayValue}
        periodTotal={periodTotal}
        selectedMonthLabel={selectedMonthLabel}
      />

      {/* Gráfico Estilo Nubank */}
      <View className="mt-8 px-4 h-[150px]">
        <Text className="text-gray-600 text-xs mb-3 font-semibold">EVOLUÇÃO MENSAL</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "flex-end", paddingRight: 20 }}
        >
          {barData.map((item, index) => {
            const isSelected = selectedBar === index;
            const barHeight = (item.value / maxBarValue) * 80 + 10;
            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.8}
                onPress={() => setSelectedBar(index)}
                className="items-center mr-6 justify-end"
              >
                {isSelected && (
                  <Text className="text-font-primary text-[10px] font-bold mb-1">
                    R$ {moneyMapper(item.value)}
                  </Text>
                )}
                <View
                  style={{
                    height: barHeight,
                    backgroundColor: isSelected ? themeColor : themeColor + "40",
                  }}
                  className="w-8 rounded-t-md"
                />
                <Text
                  className={`text-xs mt-2 ${
                    isSelected ? "text-font-primary font-bold" : "text-gray-600"
                  }`}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ─── Filtros ─────────────────────────────────────────── */}
      <View className="px-4 mt-4 gap-2">
        <Text className="text-gray-600 text-xs font-semibold">FILTROS</Text>
        <View className="flex-row gap-2 flex-wrap">
          {/* Profissional */}
          {showAll && (
            <TouchableOpacity
              onPress={handleOpenEmployeeSheet}
              className="flex-row items-center gap-1 bg-background-tertiary px-3 py-2 rounded-lg"
            >
              <Ionicons name="person-outline" size={14} color={themeColor} />
              <Text className="text-font-primary text-xs">{selectedEmployeeName}</Text>
            </TouchableOpacity>
          )}

          {/* Data início */}
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="flex-row items-center gap-1 bg-background-tertiary px-3 py-2 rounded-lg"
          >
            <Ionicons name="calendar-outline" size={14} color={themeColor} />
            <Text className="text-font-primary text-xs">
              {format(dateStart, "dd/MM/yy")}
            </Text>
          </TouchableOpacity>
          <Text className="text-gray-400 self-center text-xs">→</Text>
          {/* Data fim */}
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="flex-row items-center gap-1 bg-background-tertiary px-3 py-2 rounded-lg"
          >
            <Ionicons name="calendar-outline" size={14} color={themeColor} />
            <Text className="text-font-primary text-xs">
              {format(dateEnd, "dd/MM/yy")}
            </Text>
          </TouchableOpacity>

          {/* Limpar seleção de barra */}
          {selectedBar !== null && (
            <TouchableOpacity
              onPress={() => setSelectedBar(null)}
              className="flex-row items-center gap-1 bg-red-900/40 px-3 py-2 rounded-lg"
            >
              <Ionicons name="close-circle-outline" size={14} color="red" />
              <Text className="text-red-400 text-xs">Limpar mês</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Pickers de data */}
      {showStartPicker && (
        <AppDate
          open={showStartPicker}
          date={dateStart}
          onConfirm={(d) => {
            if (d) { setDateStart(d); setSelectedBar(null); }
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
            if (d) { setDateEnd(d); setSelectedBar(null); }
            setShowEndPicker(false);
          }}
          onCancel={() => setShowEndPicker(false)}
        />
      )}

      {/* ─── Lista de Comandas ─────────────────────────────────── */}
      <View className="flex-1 px-4 mt-4 border-t border-gray-800 pt-4">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-gray-600 text-xs font-semibold">
            HISTÓRICO DE COMANDAS ({ordersList.length})
          </Text>
        </View>

        <FlatList
          data={ordersList}
          keyExtractor={(item) => item.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => {
            const dateStr = item.moment
              ? format(new Date(item.moment), "dd MMM")
              : "";
            const itemVal = calculateOrderValue(item);

            return (
              <TouchableOpacity
                onPress={() =>
                  router.push(
                    `/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${item.id}`,
                  )
                }
                activeOpacity={0.8}
              >
                <View className="flex-row items-center justify-between py-4 border-b border-gray-800">
                  <View className="flex-row items-center gap-3">
                    <View className="bg-gray-800 p-2 rounded-full">
                      <Ionicons name="receipt-outline" color="white" size={18} />
                    </View>
                    <View>
                      <Text className="text-font-primary font-semibold text-sm">
                        Comanda Nº {item.orderNumber || item.id}
                      </Text>
                      <Text className="text-gray-600 text-xs">
                        {dateStr} • {item.user?.name || "Cliente Final"}
                      </Text>
                      {item.employee?.name && (
                        <Text className="text-gray-500 text-xs">
                          👤 {item.employee.name}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-font-primary font-bold text-sm">
                      R$ {moneyMapper(itemVal)}
                    </Text>
                    {item.status === "CLOSED" && (
                      <View className="bg-green-900/50 px-2 py-0.5 rounded-full mt-1">
                        <Text className="text-green-400 text-[10px]">Fechada</Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text className="text-gray-600 text-xs text-center mt-6">
              Nenhuma comanda neste período.
            </Text>
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <Text className="text-gray-600 text-xs text-center py-4">
                Carregando mais...
              </Text>
            ) : null
          }
        />
      </View>
    </SafeAreaView>
  );
}

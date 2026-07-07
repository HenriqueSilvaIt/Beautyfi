import { useTotalMonthlyViewModel } from "./useTotalMonthlyViewModel";
import { colors } from "@/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import { SellingHeader } from "./SellingHeader";
import { useEffect, useMemo, useState } from "react";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { moneyMapper } from "@/utils/moneyMapper";
import { Ionicons } from "@expo/vector-icons";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { AppDate } from "@/shared/components/AppDate";
import { router } from "expo-router";

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

  const barData = useMemo(() => {
    return totalMonthly.map((item) => ({
      value: item.totalSold,
      label: formatMonthYear(item.monthYear),
      rawMonthYear: item.monthYear,
    }));
  }, [totalMonthly]);

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

  const maxBarValue = Math.max(...barData.map((b) => b.value), 1);

  // ─── Filtros ─────────────────────────────────────────────
  const [dateStart, setDateStart] = useState<Date>(startOfMonth(new Date()));
  const [dateEnd, setDateEnd] = useState<Date>(endOfMonth(new Date()));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>("Todos");
  const [showEmployeePicker, setShowEmployeePicker] = useState(false);

  // Carrega profissionais
  const { useGetEmployeeMutation } = useEmployeeMutation();
  const { data: employeeData } = useGetEmployeeMutation();
  const employeeList = useMemo(
    () => employeeData?.pages.flatMap((p) => p.content ?? []) ?? [],
    [employeeData],
  );

  // ─── Comandas (carrega TODAS as páginas) ─────────────────
  const { useGetOrdersMutation } = useOrderMutation();
  const {
    data: ordersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetOrdersMutation();

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

  // Filtra comandas pelo bar selecionado + filtros de data e profissional
  const ordersList = useMemo(() => {
    let filtered = allOrders;

    // Filtro por barra do gráfico (mês)
    if (selectedBar !== null && barData[selectedBar]) {
      const selectedMonthStr = barData[selectedBar].rawMonthYear;
      filtered = filtered.filter(
        (order) => order.moment && order.moment.startsWith(selectedMonthStr),
      );
    } else {
      // Filtro por intervalo de datas
      filtered = filtered.filter((order) => {
        if (!order.moment) return false;
        const d = new Date(order.moment);
        return d >= dateStart && d <= dateEnd;
      });
    }

    // Filtro por profissional
    if (selectedEmployeeId !== null) {
      filtered = filtered.filter(
        (order) => order.employee?.id === selectedEmployeeId,
      );
    }

    return filtered;
  }, [allOrders, selectedBar, barData, dateStart, dateEnd, selectedEmployeeId]);

  const themeColor = colors["app-theme-primary"];

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader title="Faturamento" iconRight={{ icon: false, path: "" }} />
      <SellingHeader value={highlightValue} />

      {/* Gráfico Estilo Nubank */}
      <View className="mt-8 px-4 h-[220px]">
        <Text className="text-gray-600 text-xs mb-3 font-semibold">EVOLUÇÃO MENSAL</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "flex-end", paddingRight: 20 }}
        >
          {barData.map((item, index) => {
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
          <TouchableOpacity
            onPress={() => setShowEmployeePicker(true)}
            className="flex-row items-center gap-1 bg-background-tertiary px-3 py-2 rounded-lg"
          >
            <Ionicons name="person-outline" size={14} color={themeColor} />
            <Text className="text-font-primary text-xs">{selectedEmployeeName}</Text>
          </TouchableOpacity>

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
          <Text className="text-gray-600 self-center text-xs">→</Text>
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

      {/* Modal seleção de profissional */}
      <Modal
        visible={showEmployeePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEmployeePicker(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-background-primary rounded-t-2xl p-4 max-h-[60%]">
            <Text className="text-font-primary font-semibold text-base mb-3">
              Filtrar por profissional
            </Text>
            <ScrollView>
              <TouchableOpacity
                className="py-3 border-b border-gray-800"
                onPress={() => {
                  setSelectedEmployeeId(null);
                  setSelectedEmployeeName("Todos");
                  setShowEmployeePicker(false);
                }}
              >
                <Text className="text-font-primary">Todos</Text>
              </TouchableOpacity>
              {employeeList.map((emp) => (
                <TouchableOpacity
                  key={emp.id}
                  className="py-3 border-b border-gray-800"
                  onPress={() => {
                    setSelectedEmployeeId(emp.id ?? null);
                    setSelectedEmployeeName(emp.name);
                    setShowEmployeePicker(false);
                  }}
                >
                  <Text
                    style={{
                      color:
                        selectedEmployeeId === emp.id
                          ? themeColor
                          : colors["font-primary"],
                      fontWeight:
                        selectedEmployeeId === emp.id ? "700" : "400",
                    }}
                  >
                    {emp.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowEmployeePicker(false)}
              className="mt-4 bg-gray-800 py-3 rounded-xl items-center"
            >
              <Text className="text-font-primary">Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
                      R$ {moneyMapper(item.total)}
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

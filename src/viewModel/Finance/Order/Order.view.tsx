import { SafeAreaView } from "react-native-safe-area-context";
import { useOrderViewModel } from "./useOrderViewModel";
import { AppOrderCard } from "@/shared/components/AppOrderCard";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppSearchBar } from "@/shared/components/AppSearchBar";
import { AppDate } from "@/shared/components/AppDate";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";

export function OrderView({
  orderDataPagged,
  safePush,
  orderRefetch,
  orderIsRefetching,
  orderIsLoading,
  orderIsFetchingNextPage,
  orderFetchNextPage,
  getOrderTotal,
  orderHasNextPage,
  formatIsoDateAndTimeToBR,
  // New props
  searchText,
  setSearchText,
  selectedDate,
  setSelectedDate,
  showDatePicker,
  setShowDatePicker,
  clearFilters,
  selectedStatus,
  setSelectedStatus,
}: ReturnType<typeof useOrderViewModel>) {
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  const handleOpenStatusBottomSheet = () => {
    openBottomSheet(
      <View className="flex-1 px-5 pt-2 pb-8">
        <View className="flex-row items-center justify-between pb-3 border-b border-gray-700/60 mb-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name="funnel-outline" size={20} color="#CBA35D" />
            <Text className="text-font-primary font-bold text-lg">
              Filtrar por status
            </Text>
          </View>
          <TouchableOpacity onPress={closeBottomSheet} className="p-1">
            <Ionicons name="close" size={22} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <TouchableOpacity
            className={`py-3.5 px-3 rounded-xl flex-row items-center justify-between border-b border-gray-800/60 ${
              selectedStatus === null ? "bg-white/5" : ""
            }`}
            onPress={() => {
              setSelectedStatus(null);
              closeBottomSheet();
            }}
          >
            <Text
              className={`text-base ${
                selectedStatus === null
                  ? "text-[#CBA35D] font-bold"
                  : "text-font-primary font-medium"
              }`}
            >
              Todos os status
            </Text>
            {selectedStatus === null && (
              <Ionicons name="checkmark-circle" size={20} color="#CBA35D" />
            )}
          </TouchableOpacity>

          {[
            { value: "OPEN", label: "Aberta", icon: "time-outline", color: "#38bdf8" },
            { value: "CLOSED", label: "Fechada", icon: "checkmark-done-outline", color: "#22c55e" },
            { value: "WAITING_PAYMENT", label: "Aguardando pagamento", icon: "hourglass-outline", color: "#f59e0b" },
            { value: "PAID", label: "Pago", icon: "cash-outline", color: "#10b981" },
            { value: "CANCELED", label: "Cancelada", icon: "close-circle-outline", color: "#ef4444" },
          ].map((st) => (
            <TouchableOpacity
              key={st.value}
              className={`py-3.5 px-3 rounded-xl flex-row items-center justify-between border-b border-gray-800/60 ${
                selectedStatus === st.value ? "bg-white/5" : ""
              }`}
              onPress={() => {
                setSelectedStatus(st.value);
                closeBottomSheet();
              }}
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name={st.icon as any} size={18} color={st.color} />
                <Text
                  className={`text-base ${
                    selectedStatus === st.value
                      ? "text-[#CBA35D] font-bold"
                      : "text-font-primary font-medium"
                  }`}
                >
                  {st.label}
                </Text>
              </View>
              {selectedStatus === st.value && (
                <Ionicons name="checkmark-circle" size={20} color="#CBA35D" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>,
      0
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader title="Comandas" iconRight={{ icon: false, path: "" }} />

      {/* Filter Toolbar */}
      <View className="px-4 py-3 gap-3">
        {/* Search Input bar */}
        <AppSearchBar
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Buscar por cliente ou nº comanda..."
        />

        {/* Date, Status Filter Buttons & Clear Button */}
        <View className="flex-row items-center justify-between flex-wrap gap-2">
          <View className="flex-row gap-2 flex-wrap flex-1">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm"
            >
              <Ionicons name="calendar-outline" size={16} color="#cba35d" style={{ marginRight: 8 }} />
              <Text className="text-gray-700 text-xs font-semibold">
                {selectedDate
                  ? selectedDate.toLocaleDateString("pt-BR")
                  : "Filtrar por data..."}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleOpenStatusBottomSheet}
              className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm"
            >
              <Ionicons name="funnel-outline" size={16} color="#cba35d" style={{ marginRight: 8 }} />
              <Text className="text-gray-700 text-xs font-semibold">
                {selectedStatus ? {
                  OPEN: "Aberta",
                  CLOSED: "Fechada",
                  WAITING_PAYMENT: "Aguardando pagamento",
                  PAID: "Pago",
                  CANCELED: "Cancelada",
                }[selectedStatus] || selectedStatus : "Filtrar por status..."}
              </Text>
            </TouchableOpacity>
          </View>

          {(selectedDate !== undefined || searchText.length > 0 || selectedStatus !== null) && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={clearFilters}
              className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2.5"
            >
              <Text className="text-gray-600 text-xs font-semibold">Limpar Filtros</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List content */}
      <AppOrderCard
        data={orderDataPagged}
        getOrderTotal={getOrderTotal}
        formatIsoDateAndTimeToBR={formatIsoDateAndTimeToBR}
        refreshing={orderIsLoading}
        onRefresh={orderRefetch}
        orderIsRefetching={orderIsRefetching}
        orderIsLoading={orderIsLoading}
        orderIsFetchingNextPage={orderIsFetchingNextPage}
        orderHasNextPage={orderHasNextPage}
        orderFetchNextPage={orderFetchNextPage}
      />

      {/* Floating Create Button */}
      <View className="absolute right-4 bottom-10">
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-[60px] h-[60px] rounded-full bg-background-tertiary justify-center items-center shadow"
          onPress={() => safePush("/(private)/(tabs)/(admin-tabs)/finance/order/new-order")}
        >
          <Text className="text-font-primary text-3xl">+</Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <AppDate
        open={showDatePicker}
        date={selectedDate || new Date()}
        onConfirm={(date) => {
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </SafeAreaView>
  );
}

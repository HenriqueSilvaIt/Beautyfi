import { SafeAreaView } from "react-native-safe-area-context";
import { useOrderViewModel } from "./useOrderViewModel";
import { AppOrderCard } from "@/shared/components/AppOrderCard";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppSearchBar } from "@/shared/components/AppSearchBar";
import { AppDate } from "@/shared/components/AppDate";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
}: ReturnType<typeof useOrderViewModel>) {
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

        {/* Date Filter Button & Clear Button */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowDatePicker(true)}
            className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-2.5 shadow-sm"
          >
            <Ionicons name="calendar-outline" size={16} color="#cba35d" style={{ marginRight: 8 }} />
            <Text className="text-gray-700 text-xs font-semibold">
              {selectedDate
                ? `Filtrando por: ${selectedDate.toLocaleDateString("pt-BR")}`
                : "Filtrar por data..."}
            </Text>
          </TouchableOpacity>

          {(selectedDate !== undefined || searchText.length > 0) && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={clearFilters}
              className="flex-row items-center bg-gray-100 rounded-xl px-4 py-2.5"
            >
              <Text className="text-gray-500 text-xs font-semibold">Limpar Filtros</Text>
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

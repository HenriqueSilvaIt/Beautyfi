import { SafeAreaView } from "react-native-safe-area-context";
import { useOrderViewModel } from "./useOrderViewModel";
import { AppOrderCard } from "@/shared/components/AppOrderCard";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppSearchBar } from "@/shared/components/AppSearchBar";
import { AppDate } from "@/shared/components/AppDate";
import { Text, TouchableOpacity, View, Modal, ScrollView } from "react-native";
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
  selectedStatus,
  setSelectedStatus,
  showStatusPicker,
  setShowStatusPicker,
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
              onPress={() => setShowStatusPicker(true)}
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
      {/* Modal seleção de status */}
      <Modal
        visible={showStatusPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowStatusPicker(false)}
      >
        <View className="flex-1 bg-black/60 justify-end">
          <View className="bg-background-primary rounded-t-2xl p-4 max-h-[60%] border-t border-slate-800">
            <Text className="text-font-primary font-semibold text-base mb-3">
              Filtrar por status
            </Text>
            <ScrollView>
              <TouchableOpacity
                className="py-3 border-b border-slate-800"
                onPress={() => {
                  setSelectedStatus(null);
                  setShowStatusPicker(false);
                }}
              >
                <Text className="text-font-primary">Todos</Text>
              </TouchableOpacity>
              {[
                { value: "OPEN", label: "Aberta" },
                { value: "CLOSED", label: "Fechada" },
                { value: "WAITING_PAYMENT", label: "Aguardando pagamento" },
                { value: "PAID", label: "Pago" },
                { value: "CANCELED", label: "Cancelada" },
              ].map((st) => (
                <TouchableOpacity
                  key={st.value}
                  className="py-3 border-b border-slate-800"
                  onPress={() => {
                    setSelectedStatus(st.value);
                    setShowStatusPicker(false);
                  }}
                >
                  <Text
                    className={`text-font-primary ${
                      selectedStatus === st.value ? "font-bold text-accent-orange" : ""
                    }`}
                  >
                    {st.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowStatusPicker(false)}
              className="mt-4 bg-slate-800 py-3 rounded-xl items-center"
            >
              <Text className="text-font-primary">Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

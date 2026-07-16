import { SafeAreaView } from "react-native-safe-area-context";
import { useDashboardComandasViewModel } from "./useDashboardComandasViewModel";
import { FlatList, Text, TouchableOpacity, View, Modal } from "react-native";
import { moneyMapper } from "@/utils/moneyMapper";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppDate } from "@/shared/components/AppDate";
import { useCallback } from "react";
import { OrderInterface } from "@/shared/interfaces/http/order";

export function DashboardComandasView({
  orders,
  employees,
  selectedEmployeeId,
  setSelectedEmployeeId,
  totals,
  showStartDatePicker,
  showEndDatePicker,
  showEmployeeModal,
  setShowStartDatePicker,
  setShowEndDatePicker,
  setShowEmployeeModal,
  DateIsoToBR,
  formatDateToISO,
  onGetReportData,
  dateParam,
  setDateParam,
}: ReturnType<typeof useDashboardComandasViewModel>) {
  const startDate = DateIsoToBR(dateParam.startDate ?? "");
  const endDate = DateIsoToBR(dateParam.endDate ?? "");
  
  const selectedEmployeeName = selectedEmployeeId
    ? employees.find(e => e.id === selectedEmployeeId)?.name
    : "Todos os profissionais";

  const renderOrderItem = useCallback(
    ({ item }: { item: OrderInterface }) => {
      const hasSubscription = item.items?.some(i => i.usingSubscription);
      const isCard = item.payment?.paymentMethodDTO?.card;
      const cardFlag = item.payment?.paymentCardFlagDto?.name || "—";
      const paymentMethod = item.payment?.paymentMethodDTO?.name || "Sem pagamento";

      return (
        <View className="p-4 mb-2 bg-white gap-2 border border-gray-600 rounded-xl shadow-sm">
          <View className="flex-row justify-between w-full border-b border-gray-600 pb-1 mb-1">
            <Text className="text-font-primary text-xs">Comanda: #{item.orderNumber || item.id}</Text>
            <Text className="text-font-primary text-xs">
              {item.moment ? new Date(item.moment).toLocaleDateString("pt-BR") : ""}
            </Text>
          </View>

          <View className="flex-row justify-between w-full">
            <Text className="text-font-primary text-xs">Cliente:</Text>
            <Text className="text-font-primary text-xs font-semibold">{item.user?.name || "Não informado"}</Text>
          </View>

          <View className="flex-row justify-between w-full">
            <Text className="text-font-primary text-xs">Profissional:</Text>
            <Text className="text-font-primary text-xs font-semibold">{item.employee?.name || "Não informado"}</Text>
          </View>

          <View className="flex-row justify-between w-full">
            <Text className="text-font-primary text-xs">Método de pagamento:</Text>
            <Text className="text-font-primary text-xs font-semibold">
              {paymentMethod} {isCard ? `(${cardFlag})` : ""}
            </Text>
          </View>

          <View className="flex-row justify-between w-full">
            <Text className="text-font-primary text-xs">Assinatura?</Text>
            <Text className="text-font-primary text-xs font-semibold">{hasSubscription ? "Sim" : "Não"}</Text>
          </View>

          <View className="flex-row justify-between w-full">
            <Text className="text-font-primary text-xs">Desconto / Gorjeta:</Text>
            <Text className="text-font-primary text-xs font-semibold">
              {item.discountPercent > 0 ? `${item.discountPercent}%` : "0%"} • R$ {moneyMapper(Number(item.tip))}
            </Text>
          </View>

          <View className="flex-row justify-between w-full pt-1 border-t border-gray-600 mt-1">
            <Text className="text-font-primary text-xs">Total Comanda:</Text>
            <Text className="text-font-primary text-xs font-bold">R$ {moneyMapper(Number(item.total))}</Text>
          </View>

          <View className="flex-row justify-between w-full">
            <Text className="text-app-theme-primary text-xs font-semibold">Total Profissional:</Text>
            <Text className="text-app-theme-primary text-xs font-bold">R$ {moneyMapper(Number(item.totalEmployee))}</Text>
          </View>

          <View className="flex-row justify-between w-full">
            <Text className="text-font-primary text-xs font-semibold">Total Empresa:</Text>
            <Text className="text-font-primary text-xs font-bold">R$ {moneyMapper(Number(item.totalCompany))}</Text>
          </View>
        </View>
      );
    },
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-3">
      <AppAdminHeader title="Relatório de Comandas" iconRight={{ icon: false, path: "" }} />

      {/* Filtros de data e profissional */}
      <View className="gap-3 mb-4">
        <View className="flex-row justify-between w-full gap-2">
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            activeOpacity={0.8}
            className="flex-1 bg-white border border-gray-600 rounded-xl p-2 items-center shadow-sm"
          >
            <Text className="text-font-primary text-xs font-semibold mb-1">Início</Text>
            <Text className="text-font-primary text-sm font-bold">{startDate}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            activeOpacity={0.8}
            className="flex-1 bg-white border border-gray-600 rounded-xl p-2 items-center shadow-sm"
          >
            <Text className="text-font-primary text-xs font-semibold mb-1">Fim</Text>
            <Text className="text-font-primary text-sm font-bold">{endDate}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setShowEmployeeModal(true)}
          activeOpacity={0.8}
          className="bg-white border border-gray-600 rounded-xl p-3 items-center w-full shadow-sm"
        >
          <Text className="text-font-primary text-xs font-semibold mb-1">Filtrar por Profissional</Text>
          <Text className="text-font-primary text-sm font-bold">{selectedEmployeeName}</Text>
        </TouchableOpacity>
      </View>

      {/* Cartão de Totais Consolidados */}
      <View className="p-4 mb-4 bg-white rounded-xl gap-2 border border-gray-600 shadow-sm">
        <Text className="text-font-primary font-bold text-sm mb-1 border-b border-gray-600 pb-1">Totais do Período</Text>
        
        <View className="flex-row justify-between">
          <Text className="text-font-primary text-xs">Total Vendido (Bruto):</Text>
          <Text className="text-font-primary text-xs font-bold">R$ {moneyMapper(Number(totals.totalSold))}</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-font-primary text-xs">Total do Profissional (Bruto):</Text>
          <Text className="text-font-primary text-xs font-bold">R$ {moneyMapper(Number(totals.totalEmployee))}</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-font-primary text-xs">Total do Profissional (Líquido):</Text>
          <Text className="text-app-theme-primary text-xs font-bold">R$ {moneyMapper(Number(totals.totalEmployeeNet))}</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-font-primary text-xs">Total da Empresa:</Text>
          <Text className="text-font-primary text-xs font-bold">R$ {moneyMapper(Number(totals.totalCompany))}</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-font-primary text-xs">Total de Assinaturas:</Text>
          <Text className="text-font-primary text-xs font-bold">R$ {moneyMapper(Number(totals.totalSubscription))}</Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-font-primary text-xs">Total de Gorjetas:</Text>
          <Text className="text-font-primary text-xs font-bold">R$ {moneyMapper(Number(totals.tips))}</Text>
        </View>
      </View>

      {/* Listagem de comandas */}
      <Text className="text-font-primary font-bold text-sm mb-2">Comandas Realizadas ({orders.length})</Text>
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="py-10 items-center">
            <Text className="text-font-primary text-sm">Nenhuma comanda encontrada para este filtro.</Text>
          </View>
        }
      />

      {/* Modais de Date Picker */}
      {showStartDatePicker && (
        <AppDate
          open={showStartDatePicker}
          date={new Date()}
          onConfirm={(date) => {
            setDateParam({ ...dateParam, startDate: formatDateToISO(date) });
            setShowStartDatePicker(false);
          }}
          onCancel={() => setShowStartDatePicker(false)}
        />
      )}

      {showEndDatePicker && (
        <AppDate
          open={showEndDatePicker}
          date={dateParam.endDate ? new Date(dateParam.endDate) : new Date()}
          onConfirm={(date) => {
            setDateParam({ ...dateParam, endDate: formatDateToISO(date) });
            setShowEndDatePicker(false);
          }}
          onCancel={() => setShowEndDatePicker(false)}
        />
      )}

      {/* Modal para seleção de Profissionais */}
      <Modal visible={showEmployeeModal} transparent animationType="slide">
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white p-6 rounded-t-[28px] max-h-[70%] border-t border-gray-600 shadow-2xl">
            <Text className="text-[#12294A] font-bold text-lg mb-4 text-center">Selecionar Profissional</Text>
            
            <TouchableOpacity
              onPress={() => {
                setSelectedEmployeeId(undefined);
                setShowEmployeeModal(false);
              }}
              className="py-3 border-b border-gray-600"
            >
              <Text className="text-app-theme-primary font-bold text-sm text-center">Todos os profissionais</Text>
            </TouchableOpacity>

            <FlatList
              data={employees}
              keyExtractor={(item) => item.id!.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setSelectedEmployeeId(item.id);
                    setShowEmployeeModal(false);
                  }}
                  className="py-3 border-b border-gray-600"
                >
                  <Text className="text-font-primary text-sm text-center">{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setShowEmployeeModal(false)}
              className="mt-4 py-3.5 bg-[#12294A] rounded-xl"
            >
              <Text className="text-white text-center text-sm font-bold">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

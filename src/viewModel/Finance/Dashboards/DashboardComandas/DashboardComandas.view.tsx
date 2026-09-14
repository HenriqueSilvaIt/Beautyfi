import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useDashboardComandasViewModel } from "./useDashboardComandasViewModel";
import { FlatList, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from "react-native";
import { moneyMapper } from "@/utils/moneyMapper";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppDate } from "@/shared/components/AppDate";
import { useCallback } from "react";
import { OrderInterface } from "@/shared/interfaces/http/order";
import { Ionicons } from "@expo/vector-icons";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";

export function DashboardComandasView({
  orders,
  employees,
  selectedEmployeeId,
  setSelectedEmployeeId,
  totals,
  showStartDatePicker,
  showEndDatePicker,
  setShowStartDatePicker,
  setShowEndDatePicker,
  DateIsoToBR,
  formatDateToISO,
  onGetReportData,
  dateParam,
  setDateParam,
  isLoading,
}: ReturnType<typeof useDashboardComandasViewModel>) {
  const insets = useSafeAreaInsets();
  const startDate = DateIsoToBR(dateParam.startDate ?? "");
  const endDate = DateIsoToBR(dateParam.endDate ?? "");
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  const selectedEmployeeName = selectedEmployeeId
    ? employees.find((e) => e.id === selectedEmployeeId)?.name
    : "Todos os profissionais";

  const handleOpenEmployeeBottomSheet = () => {
    openBottomSheet(
      <View className="flex-1 px-5 pt-2 pb-8">
        <View className="flex-row items-center justify-between pb-3 border-b border-gray-700/60 mb-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name="person-outline" size={20} color="#CBA35D" />
            <Text className="text-font-primary font-bold text-lg">
              Filtrar por Profissional
            </Text>
          </View>
          <TouchableOpacity onPress={closeBottomSheet} className="p-1">
            <Ionicons name="close" size={22} color="#9ca3af" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          <TouchableOpacity
            className={`py-3.5 px-3 rounded-xl flex-row items-center justify-between border-b border-gray-800/60 ${
              selectedEmployeeId === undefined ? "bg-white/5" : ""
            }`}
            onPress={() => {
              setSelectedEmployeeId(undefined);
              closeBottomSheet();
            }}
          >
            <Text
              className={`text-base ${
                selectedEmployeeId === undefined
                  ? "text-[#CBA35D] font-bold"
                  : "text-font-primary font-medium"
              }`}
            >
              Todos os profissionais
            </Text>
            {selectedEmployeeId === undefined && (
              <Ionicons name="checkmark-circle" size={20} color="#CBA35D" />
            )}
          </TouchableOpacity>

          {employees.map((emp) => (
            <TouchableOpacity
              key={emp.id}
              className={`py-3.5 px-3 rounded-xl flex-row items-center justify-between border-b border-gray-800/60 ${
                selectedEmployeeId === emp.id ? "bg-white/5" : ""
              }`}
              onPress={() => {
                setSelectedEmployeeId(emp.id);
                closeBottomSheet();
              }}
            >
              <Text
                className={`text-base ${
                  selectedEmployeeId === emp.id
                    ? "text-[#CBA35D] font-bold"
                    : "text-font-primary font-medium"
                }`}
              >
                {emp.name}
              </Text>
              {selectedEmployeeId === emp.id && (
                <Ionicons name="checkmark-circle" size={20} color="#CBA35D" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>,
      0
    );
  };

  const renderOrderItem = useCallback(
    ({ item }: { item: OrderInterface }) => {
      const hasSubscription = item.items?.some((i) => i.usingSubscription);
      const isCard = item.payment?.paymentMethodDTO?.card;
      const cardFlag = item.payment?.paymentCardFlagDto?.name;
      const paymentMethod = item.payment?.paymentMethodDTO?.name || "Sem pagamento";

      const orderTotal = Number(item.total || item.totalSold || item.totalOrder || 0);
      const empTotal = Number(item.totalEmployee || 0);
      const compTotal = Number(item.totalCompany || 0);

      return (
        <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm mb-4">
          {/* Header da Comanda */}
          <View className="flex-row items-center justify-between pb-3.5 mb-3 border-b border-slate-100">
            <View className="flex-row items-center gap-2.5">
              <View className="w-10 h-10 rounded-2xl bg-[#092D5D]/10 items-center justify-center border border-[#092D5D]/20">
                <Ionicons name="receipt-outline" size={20} color="#092D5D" />
              </View>
              <View>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Comanda
                </Text>
                <Text className="text-slate-900 font-extrabold text-base">
                  #{item.orderNumber || item.id}
                </Text>
              </View>
            </View>

            <View className="items-end gap-1">
              <View className="flex-row items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full">
                <Ionicons name="calendar-outline" size={12} color="#64748b" />
                <Text className="text-slate-700 text-xs font-semibold">
                  {item.moment ? new Date(item.moment).toLocaleDateString("pt-BR") : ""}
                </Text>
              </View>
              <View className="bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                <Text className="text-emerald-700 font-black text-[10px] uppercase">
                  {item.status === "CLOSED"
                    ? "Fechada"
                    : item.status === "PAID"
                    ? "Paga"
                    : item.status === "OPEN"
                    ? "Aberta"
                    : item.status === "WAITING_PAYMENT"
                    ? "Aguardando"
                    : item.status === "CANCELED"
                    ? "Cancelada"
                    : item.status || "Aberta"}
                </Text>
              </View>
            </View>
          </View>

          {/* Dados do Cliente e Profissional */}
          <View className="gap-2 mb-3">
            <View className="flex-row items-center justify-between bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
              <View className="flex-row items-center gap-2">
                <Ionicons name="person-outline" size={15} color="#092D5D" />
                <Text className="text-slate-500 text-xs font-medium">Cliente:</Text>
              </View>
              <Text className="text-slate-900 text-xs font-bold max-w-[200px]" numberOfLines={1}>
                {item.user?.name || "Cliente Final"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100">
              <View className="flex-row items-center gap-2">
                <Ionicons name="cut-outline" size={15} color="#CBA35D" />
                <Text className="text-slate-500 text-xs font-medium">Profissional:</Text>
              </View>
              <Text className="text-slate-900 text-xs font-bold max-w-[200px]" numberOfLines={1}>
                {item.employee?.name || "Não informado"}
              </Text>
            </View>
          </View>

          {/* Pagamento e Detalhes */}
          <View className="flex-row flex-wrap gap-2 mb-3">
            <View className="bg-slate-100 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 border border-slate-200/60">
              <Ionicons name="card-outline" size={14} color="#092D5D" />
              <Text className="text-slate-700 text-xs font-semibold">
                {paymentMethod} {isCard && cardFlag ? `(${cardFlag})` : ""}
              </Text>
            </View>

            {hasSubscription && (
              <View className="bg-amber-50 px-3 py-1.5 rounded-xl flex-row items-center gap-1.5 border border-amber-200">
                <Ionicons name="ribbon-outline" size={14} color="#d97706" />
                <Text className="text-amber-800 text-xs font-bold">
                  Clube Assinatura
                </Text>
              </View>
            )}

            {Number(item.discountPercent) > 0 && (
              <View className="bg-rose-50 px-3 py-1.5 rounded-xl flex-row items-center gap-1 border border-rose-200">
                <Text className="text-rose-700 text-xs font-bold">
                  Desconto: {item.discountPercent}%
                </Text>
              </View>
            )}

            {Number(item.tip) > 0 && (
              <View className="bg-emerald-50 px-3 py-1.5 rounded-xl flex-row items-center gap-1 border border-emerald-200">
                <Text className="text-emerald-700 text-xs font-bold">
                  Gorjeta: R$ {moneyMapper(Number(item.tip))}
                </Text>
              </View>
            )}
          </View>

          {/* Breakdown Financeiro da Comanda */}
          <View className="bg-slate-900 p-4 rounded-2xl gap-2 mt-1">
            <View className="flex-row justify-between items-center pb-2 border-b border-slate-800">
              <Text className="text-slate-400 text-xs font-semibold">Total da Comanda</Text>
              <Text className="text-white font-black text-base">
                R$ {moneyMapper(orderTotal)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-[#CBA35D]" />
                <Text className="text-slate-300 text-xs font-medium">Repasse Profissional:</Text>
              </View>
              <Text className="text-[#CBA35D] font-bold text-sm">
                R$ {moneyMapper(empTotal)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <View className="flex-row items-center gap-1.5">
                <View className="w-2 h-2 rounded-full bg-emerald-400" />
                <Text className="text-slate-300 text-xs font-medium">Líquido Empresa:</Text>
              </View>
              <Text className="text-emerald-400 font-bold text-sm">
                R$ {moneyMapper(compTotal)}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader title="Relatório de Comandas" iconRight={{ icon: false, path: "" }} />

      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View className="gap-4 mb-4">
            {/* Painel de Seleção de Datas e Profissional */}
            <View className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs gap-3">
              <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                Filtros do Relatório
              </Text>

              <View className="flex-row items-center gap-3">
                <TouchableOpacity
                  onPress={() => setShowStartDatePicker(true)}
                  activeOpacity={0.8}
                  className="flex-1 bg-white p-3 rounded-xl border border-slate-200 flex-row items-center justify-between shadow-xs"
                >
                  <View>
                    <Text className="text-slate-400 text-[10px] font-bold">DE</Text>
                    <Text className="text-slate-900 font-bold text-sm">{startDate}</Text>
                  </View>
                  <Ionicons name="calendar-outline" size={18} color="#092D5D" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowEndDatePicker(true)}
                  activeOpacity={0.8}
                  className="flex-1 bg-white p-3 rounded-xl border border-slate-200 flex-row items-center justify-between shadow-xs"
                >
                  <View>
                    <Text className="text-slate-400 text-[10px] font-bold">ATÉ</Text>
                    <Text className="text-slate-900 font-bold text-sm">{endDate}</Text>
                  </View>
                  <Ionicons name="calendar-outline" size={18} color="#092D5D" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={handleOpenEmployeeBottomSheet}
                activeOpacity={0.8}
                className="bg-white border border-slate-200 rounded-xl p-3 flex-row items-center justify-between shadow-xs"
              >
                <View>
                  <Text className="text-slate-400 text-[10px] font-bold">PROFISSIONAL</Text>
                  <Text className="text-slate-900 font-bold text-sm">{selectedEmployeeName}</Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#092D5D" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onGetReportData}
                disabled={isLoading}
                activeOpacity={0.85}
                className="h-12 bg-[#092D5D] rounded-xl items-center justify-center flex-row gap-2 shadow-sm disabled:opacity-50 mt-1"
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <>
                    <Ionicons name="search" size={16} color="#ffffff" />
                    <Text className="text-white text-sm font-bold uppercase tracking-wide">
                      Filtrar Comandas
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Cartões de Totais Consolidados */}
            <View className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm gap-3">
              <View className="flex-row items-center justify-between pb-3 border-b border-slate-100">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="stats-chart-outline" size={18} color="#092D5D" />
                  <Text className="text-slate-900 font-extrabold text-sm uppercase tracking-wider">
                    Totais Consolidados
                  </Text>
                </View>
                <View className="bg-slate-100 px-3 py-1 rounded-full">
                  <Text className="text-slate-700 text-xs font-bold">
                    {orders.length} comanda(s)
                  </Text>
                </View>
              </View>

              <View className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                <Text className="text-emerald-700 text-xs font-bold uppercase">Total Vendido (Bruto)</Text>
                <Text className="text-emerald-950 font-black text-2xl mt-0.5">
                  R$ {moneyMapper(Number(totals.totalSold))}
                </Text>
              </View>

              <View className="flex-row gap-2.5">
                <View className="flex-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <Text className="text-slate-500 text-[10px] font-bold uppercase">Profissional (Bruto)</Text>
                  <Text className="text-slate-900 font-extrabold text-base mt-0.5">
                    R$ {moneyMapper(Number(totals.totalEmployee))}
                  </Text>
                </View>

                <View className="flex-1 bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100">
                  <Text className="text-blue-700 text-[10px] font-bold uppercase">Profissional (Líquido)</Text>
                  <Text className="text-blue-950 font-extrabold text-base mt-0.5">
                    R$ {moneyMapper(Number(totals.totalEmployeeNet))}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-2.5">
                <View className="flex-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <Text className="text-slate-500 text-[10px] font-bold uppercase">Empresa (Líquido)</Text>
                  <Text className="text-slate-900 font-extrabold text-base mt-0.5">
                    R$ {moneyMapper(Number(totals.totalCompany))}
                  </Text>
                </View>

                <View className="flex-1 bg-amber-50/60 p-3.5 rounded-2xl border border-amber-100">
                  <Text className="text-amber-700 text-[10px] font-bold uppercase">Assinaturas</Text>
                  <Text className="text-amber-950 font-extrabold text-base mt-0.5">
                    R$ {moneyMapper(Number(totals.totalSubscription))}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row justify-between items-center px-1 pt-2">
              <Text className="text-slate-900 font-extrabold text-base">
                Comandas do Período ({orders.length})
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="p-8 items-center justify-center">
              <ActivityIndicator size="large" color="#092D5D" />
              <Text className="text-slate-500 text-xs mt-3">Carregando comandas...</Text>
            </View>
          ) : (
            <View className="p-8 bg-white rounded-3xl border border-slate-200 items-center justify-center my-4 shadow-sm">
              <Ionicons name="receipt-outline" size={40} color="#94a3b8" className="mb-2" />
              <Text className="text-slate-800 font-bold text-sm text-center">
                Nenhuma comanda encontrada
              </Text>
              <Text className="text-slate-500 text-xs text-center mt-1">
                Tente ajustar os filtros de período ou profissional acima.
              </Text>
            </View>
          )
        }
      />

      {/* Modais de Date Picker */}
      {showStartDatePicker && (
        <AppDate
          open={showStartDatePicker}
          date={dateParam.startDate ? new Date(dateParam.startDate) : new Date()}
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
    </SafeAreaView>
  );
}

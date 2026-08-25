import { SafeAreaView } from "react-native-safe-area-context";
import { useDashboardEmployeeViewModel } from "./useDashboardEmployeeViewModel";
import { 
  ActivityIndicator, 
  FlatList, 
  Text, 
  TouchableOpacity, 
  View 
} from "react-native";
import { moneyMapper } from "@/utils/moneyMapper";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppDate } from "@/shared/components/AppDate";
import { useCallback } from "react";
import { DashboardEmployeeDTO } from "@/shared/interfaces/http/finance";
import { Ionicons } from "@expo/vector-icons";

export function DashboardEmployeeView({
  reportData,
  setShowStartDatePicker,
  setShowEndDatePicker,
  showStartDatePicker,
  showEndDatePicker,
  DateIsoToBR,
  formatDateToISO,
  onGetReportData,
  dateParam,
  setDateParam,
  isLoading,
}: ReturnType<typeof useDashboardEmployeeViewModel>) {
  const startDate = DateIsoToBR(dateParam.startDate ?? "");
  const endDate = DateIsoToBR(dateParam.endDate ?? "");

  const renderItem = useCallback(
    ({ item }: { item: DashboardEmployeeDTO }) => {
      const splitFeeDiscount = Math.max(0, Number(item.totalEmployee) - Number(item.totalEmployeeNet));
      const fullFeeDiscount = Math.max(0, Number(item.totalEmployee) - Number(item.totalEmployeeDiscount));

      return (
        <View className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm mb-4">
          {/* Cabeçalho do Profissional */}
          <View className="flex-row items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-2xl bg-[#092D5D]/10 items-center justify-center border border-[#092D5D]/20">
                <Ionicons name="person" size={20} color="#092D5D" />
              </View>
              <View>
                <Text className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  Profissional
                </Text>
                <Text className="text-slate-900 font-extrabold text-base">
                  {item.employeeName}
                </Text>
              </View>
            </View>

            <View className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200">
              <Text className="text-emerald-700 font-black text-xs">
                R$ {moneyMapper(Number(item.totalSold))}
              </Text>
              <Text className="text-emerald-600 text-[9px] font-bold text-center">
                Vendido
              </Text>
            </View>
          </View>

          {/* Seção 1: Desempenho de Vendas */}
          <View className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 gap-2 mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-slate-600 text-xs font-semibold">Total Realizado / Vendido</Text>
              <Text className="text-slate-900 font-bold text-sm">
                R$ {moneyMapper(Number(item.totalSold))}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-slate-600 text-xs font-semibold">Total Comandas do Profissional</Text>
              <Text className="text-slate-900 font-bold text-sm">
                R$ {moneyMapper(Number(item.totalOrderEmployee))}
              </Text>
            </View>

            {Number(item.totalSubscription) > 0 && (
              <View className="flex-row justify-between items-center pt-1 border-t border-slate-200/60">
                <Text className="text-amber-700 text-xs font-semibold">Total em Assinaturas (Clube)</Text>
                <Text className="text-amber-700 font-bold text-sm">
                  R$ {moneyMapper(Number(item.totalSubscription))}
                </Text>
              </View>
            )}
          </View>

          {/* Seção 2: Comissões e Bonificações */}
          <View className="bg-blue-50/60 p-3.5 rounded-2xl border border-blue-100 gap-2 mb-3">
            <View className="flex-row justify-between items-center">
              <Text className="text-blue-900 text-xs font-semibold">Comissão Gerada</Text>
              <Text className="text-blue-900 font-bold text-sm">
                R$ {moneyMapper(Number(item.totalCommission))}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-blue-900 text-xs font-semibold">Gorjetas / Bonificações</Text>
              <Text className="text-blue-900 font-bold text-sm">
                R$ {moneyMapper(Number(item.tips))}
              </Text>
            </View>

            <View className="flex-row justify-between items-center pt-2 border-t border-blue-200/60">
              <Text className="text-[#092D5D] text-xs font-black uppercase">Total Bruto do Profissional</Text>
              <Text className="text-[#092D5D] font-black text-base">
                R$ {moneyMapper(Number(item.totalEmployee))}
              </Text>
            </View>
          </View>

          {/* Seção 3: Detalhamento de Taxas & Líquido */}
          <View className="gap-2 px-1">
            {/* Split 50/50 */}
            <View className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-slate-500 text-[11px] font-medium">Desc. Taxa Cartão (Split 50%)</Text>
                <Text className="text-red-500 text-[11px] font-semibold">
                  - R$ {moneyMapper(splitFeeDiscount)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-800 text-xs font-bold">Líquido Profissional (Split 50%)</Text>
                <Text className="text-[#092D5D] font-extrabold text-sm">
                  R$ {moneyMapper(Number(item.totalEmployeeNet))}
                </Text>
              </View>
            </View>

            {/* 100% Profissional */}
            <View className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-slate-500 text-[11px] font-medium">Desc. Taxa Cartão (100% Prof.)</Text>
                <Text className="text-red-500 text-[11px] font-semibold">
                  - R$ {moneyMapper(fullFeeDiscount)}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-slate-800 text-xs font-bold">Líquido Profissional (100% Prof.)</Text>
                <Text className="text-emerald-700 font-extrabold text-sm">
                  R$ {moneyMapper(Number(item.totalEmployeeDiscount))}
                </Text>
              </View>
            </View>

            {/* Total Empresa */}
            <View className="flex-row justify-between items-center pt-2.5 mt-1 border-t border-slate-100 px-1">
              <View className="flex-row items-center gap-1.5">
                <Ionicons name="business-outline" size={14} color="#64748b" />
                <Text className="text-slate-700 text-xs font-bold">Total da Empresa</Text>
              </View>
              <Text className="text-slate-900 font-black text-sm">
                R$ {moneyMapper(Number(item.totalCompany))}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppAdminHeader
        title="Resumo por Profissional"
        iconRight={{ icon: false, path: "" }}
      />

      <FlatList
        data={reportData}
        renderItem={renderItem}
        keyExtractor={(item) => item.employeeId?.toString() ?? Math.random().toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        ListHeaderComponent={
          <View className="gap-4 mb-4">
            {/* Banner Informativo Exclusivo: Apenas Comandas Fechadas */}
            <View className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex-row items-start gap-3 shadow-xs">
              <View className="w-8 h-8 rounded-full bg-amber-500/10 items-center justify-center shrink-0 border border-amber-500/20">
                <Ionicons name="information-circle" size={20} color="#d97706" />
              </View>
              <View className="flex-1">
                <Text className="text-amber-900 font-bold text-xs uppercase tracking-wide">
                  Aviso Importante
                </Text>
                <Text className="text-amber-800 text-xs leading-relaxed mt-0.5 font-medium">
                  Este relatório contabiliza exclusivamente comandas com status <Text className="font-extrabold text-amber-950 uppercase">FECHADA</Text>. Comandas em aberto ou canceladas não são somadas.
                </Text>
              </View>
            </View>

            {/* Painel de Seleção de Datas */}
            <View className="p-4 bg-slate-50 rounded-2xl border border-slate-200 shadow-xs gap-3">
              <Text className="text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                Período do Relatório
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
                      Filtrar Relatório
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <View className="p-8 items-center justify-center">
              <ActivityIndicator size="large" color="#092D5D" />
              <Text className="text-slate-500 text-xs mt-3">Carregando relatório...</Text>
            </View>
          ) : (
            <View className="p-8 bg-slate-50 rounded-2xl border border-slate-200 items-center justify-center my-4">
              <Ionicons name="document-text-outline" size={40} color="#94a3b8" className="mb-2" />
              <Text className="text-slate-800 font-bold text-sm text-center">
                Nenhum resultado encontrado
              </Text>
              <Text className="text-slate-500 text-xs text-center mt-1">
                Não há comandas fechadas para os profissionais no período selecionado.
              </Text>
            </View>
          )
        }
      />

      {showStartDatePicker && (
        <AppDate
          open={showStartDatePicker}
          date={dateParam.startDate ? new Date(dateParam.startDate) : new Date()}
          onConfirm={(date) => {
            const formattedDate = formatDateToISO(date);
            setDateParam((prev) => ({
              ...prev,
              startDate: formattedDate,
            }));
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
            const formattedDate = formatDateToISO(date);
            setDateParam((prev) => ({
              ...prev,
              endDate: formattedDate,
            }));
            setShowEndDatePicker(false);
          }}
          onCancel={() => setShowEndDatePicker(false)}
        />
      )}
    </SafeAreaView>
  );
}

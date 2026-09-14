import React from "react";
import {
  ActivityIndicator,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { useCompanySubscriptionViewModel } from "./useCompanySubscriptionViewModel";
import { colors } from "@/styles/colors";

const INCLUDED_FEATURES = [
  "Agendamentos online ilimitados",
  "Lembretes e disparos automáticos por WhatsApp",
  "Gestão financeira completa, comandas e fluxo de caixa",
  "Múltiplos profissionais e controle de comissões",
  "Relatórios analíticos e métricas de faturamento",
  "Histórico detalhado e lista de espera de clientes",
  "Suporte prioritário via WhatsApp",
];

export function CompanySubscriptionView({
  mySubscription,
  matchedPlan,
  planName,
  planDescription,
  planPriceFormatted,
  periodStartFormatted,
  periodEndFormatted,
  isActive,
  isCancelScheduled,
  isCanceled,
  isPastDue,
  isTrial,
  isLoading,
  isRefetching,
  isCancelling,
  isReactivating,
  showCancelModal,
  setShowCancelModal,
  showReactivateModal,
  setShowReactivateModal,
  handleCancelSubscription,
  handleReactivateSubscription,
  handleContactSupport,
  refetch,
}: ReturnType<typeof useCompanySubscriptionViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Minha Assinatura"
        leftIconShown={false}
        iconRight={{
          icon: false,
          path: "",
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors["app-theme-secundary"] || "#CBA35D"}
            colors={[colors["app-theme-secundary"] || "#CBA35D"]}
          />
        }
      >
        {isLoading && !isRefetching ? (
          <View className="py-20 items-center justify-center">
            <ActivityIndicator
              size="large"
              color={colors["app-theme-secundary"] || "#CBA35D"}
            />
            <Text className="text-gray-500 text-sm mt-3 font-medium">
              Carregando dados da assinatura...
            </Text>
          </View>
        ) : (
          <>
            {/* Card Principal do Plano */}
            <View className="mt-2 rounded-2xl bg-white border border-gray-200/80 p-5 shadow-sm">
              {/* Header do Card */}
              <View className="flex-row items-center justify-between pb-4 border-b border-gray-100">
                <View className="flex-row items-center gap-3">
                  <View className="w-12 h-12 rounded-xl bg-[#092D5D]/10 items-center justify-center border border-[#092D5D]/20">
                    <Ionicons name="shield-checkmark" size={24} color="#092D5D" />
                  </View>
                  <View>
                    <Text className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                      Plano Atual
                    </Text>
                    <Text className="text-xl font-bold text-gray-900">
                      {planName}
                    </Text>
                  </View>
                </View>

                {/* Status Badge */}
                {isActive && (
                  <View className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex-row items-center gap-1.5">
                    <View className="w-2 h-2 rounded-full bg-emerald-500" />
                    <Text className="text-emerald-700 text-xs font-bold">
                      Ativo
                    </Text>
                  </View>
                )}

                {isCancelScheduled && (
                  <View className="bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex-row items-center gap-1.5">
                    <View className="w-2 h-2 rounded-full bg-amber-500" />
                    <Text className="text-amber-700 text-xs font-bold">
                      Cancelamento Agendado
                    </Text>
                  </View>
                )}

                {isTrial && (
                  <View className="bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex-row items-center gap-1.5">
                    <View className="w-2 h-2 rounded-full bg-blue-500" />
                    <Text className="text-blue-700 text-xs font-bold">
                      Período de Teste
                    </Text>
                  </View>
                )}

                {isPastDue && (
                  <View className="bg-red-50 border border-red-200 px-3 py-1 rounded-full flex-row items-center gap-1.5">
                    <View className="w-2 h-2 rounded-full bg-red-500" />
                    <Text className="text-red-700 text-xs font-bold">
                      Pendente
                    </Text>
                  </View>
                )}

                {isCanceled && (
                  <View className="bg-gray-100 border border-gray-300 px-3 py-1 rounded-full flex-row items-center gap-1.5">
                    <View className="w-2 h-2 rounded-full bg-gray-400" />
                    <Text className="text-gray-600 text-xs font-bold">
                      Cancelado
                    </Text>
                  </View>
                )}
              </View>

              {/* Valor e Periodicidade */}
              <View className="mt-4 flex-row items-baseline justify-between">
                <View>
                  <Text className="text-xs text-gray-500 font-medium">
                    Valor da assinatura
                  </Text>
                  <View className="flex-row items-baseline mt-0.5">
                    <Text className="text-3xl font-extrabold text-[#092D5D]">
                      {planPriceFormatted}
                    </Text>
                    <Text className="text-sm font-medium text-gray-500 ml-1">
                      / mês
                    </Text>
                  </View>
                </View>

                {periodEndFormatted ? (
                  <View className="items-end">
                    <Text className="text-xs text-gray-500 font-medium">
                      {isCancelScheduled ? "Acesso até" : "Próxima renovação"}
                    </Text>
                    <Text className="text-sm font-bold text-gray-900 mt-0.5">
                      {periodEndFormatted}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Alerta de Cancelamento Agendado */}
              {isCancelScheduled && (
                <View className="mt-4 bg-amber-50 border border-amber-200/80 p-3.5 rounded-xl flex-row items-start gap-2.5">
                  <Ionicons
                    name="information-circle"
                    size={20}
                    color="#D97706"
                    className="mt-0.5"
                  />
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-amber-900">
                      Cancelamento programado
                    </Text>
                    <Text className="text-xs text-amber-800 mt-0.5 leading-4">
                      Você continuará com acesso a todas as ferramentas até{" "}
                      <Text className="font-bold">{periodEndFormatted || "o fim do período"}</Text>.
                      Nenhuma nova cobrança será realizada.
                    </Text>
                  </View>
                </View>
              )}

              {/* Alerta de Pagamento Pendente */}
              {isPastDue && (
                <View className="mt-4 bg-red-50 border border-red-200/80 p-3.5 rounded-xl flex-row items-start gap-2.5">
                  <Ionicons
                    name="alert-circle"
                    size={20}
                    color="#DC2626"
                    className="mt-0.5"
                  />
                  <View className="flex-1">
                    <Text className="text-xs font-bold text-red-900">
                      Pagamento pendente
                    </Text>
                    <Text className="text-xs text-red-800 mt-0.5 leading-4">
                      Houve uma falha ao tentar debitar a última mensalidade. Entre em contato com o suporte para regularizar.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Ações Rápidas (Reativar / Cancelar) */}
            <View className="mt-4">
              {isCancelScheduled ? (
                <TouchableOpacity
                  onPress={() => setShowReactivateModal(true)}
                  activeOpacity={0.8}
                  disabled={isReactivating}
                  className="bg-[#092D5D] py-4 px-5 rounded-2xl flex-row items-center justify-center shadow-sm"
                >
                  {isReactivating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons
                        name="refresh-circle-outline"
                        size={22}
                        color="#FFFFFF"
                        className="mr-2"
                      />
                      <Text className="text-white font-bold text-base ml-2">
                        Reativar Assinatura
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : isActive ? (
                <TouchableOpacity
                  onPress={() => setShowCancelModal(true)}
                  activeOpacity={0.7}
                  disabled={isCancelling}
                  className="bg-white border border-gray-300 py-3.5 px-4 rounded-2xl flex-row items-center justify-center"
                >
                  {isCancelling ? (
                    <ActivityIndicator size="small" color="#EF4444" />
                  ) : (
                    <>
                      <Ionicons
                        name="close-circle-outline"
                        size={18}
                        color="#6B7280"
                        className="mr-2"
                      />
                      <Text className="text-gray-600 font-semibold text-sm ml-1.5">
                        Cancelar Assinatura
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Recursos Inclusos no Plano */}
            <View className="mt-6 bg-white border border-gray-200/80 p-5 rounded-2xl shadow-sm">
              <View className="flex-row items-center gap-2 mb-4">
                <Ionicons name="sparkles" size={18} color="#CBA35D" />
                <Text className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Recursos inclusos no plano
                </Text>
              </View>

              <View className="gap-3">
                {INCLUDED_FEATURES.map((feature, idx) => (
                  <View key={idx} className="flex-row items-center gap-3">
                    <View className="w-5 h-5 rounded-full bg-emerald-500/10 items-center justify-center border border-emerald-500/30">
                      <Ionicons name="checkmark" size={12} color="#10B981" />
                    </View>
                    <Text className="flex-1 text-xs text-gray-700 font-medium">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Card de Suporte / Dúvidas */}
            <TouchableOpacity
              onPress={handleContactSupport}
              activeOpacity={0.8}
              className="mt-4 bg-emerald-50 border border-emerald-200/80 p-4 rounded-2xl flex-row items-center justify-between"
            >
              <View className="flex-row items-center flex-1 pr-3">
                <View className="w-10 h-10 rounded-xl bg-emerald-500 items-center justify-center mr-3 shadow-sm">
                  <Ionicons name="logo-whatsapp" size={22} color="#FFFFFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-emerald-950">
                    Precisa de ajuda ou suporte?
                  </Text>
                  <Text className="text-xs text-emerald-800 mt-0.5">
                    Fale com nosso time de atendimento no WhatsApp
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#059669" />
            </TouchableOpacity>

            {/* Informação de Segurança Stripe */}
            <View className="mt-4 flex-row items-center justify-center gap-1.5 px-4">
              <Ionicons name="lock-closed" size={14} color="#9CA3AF" />
              <Text className="text-[11px] text-gray-400 font-medium text-center">
                Pagamentos e faturamento protegidos via Stripe
              </Text>
            </View>
          </>
        )}
      </ScrollView>

      {/* Modal de Confirmação de Cancelamento */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCancelModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="w-full bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            {/* Ícone de Aviso */}
            <View className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 items-center justify-center mx-auto mb-4">
              <Ionicons name="alert-circle-outline" size={32} color="#D97706" />
            </View>

            <Text className="text-xl font-bold text-gray-900 text-center">
              Deseja cancelar o plano?
            </Text>

            <Text className="text-sm text-gray-600 text-center mt-3 leading-5">
              Você continuará com acesso total aos recursos do Beautyfi até o fim do período já pago
              {periodEndFormatted ? ` (${periodEndFormatted})` : ""}. Após essa data, nenhuma nova cobrança será realizada.
            </Text>

            {/* Ações do Modal */}
            <View className="mt-6 gap-3">
              <TouchableOpacity
                onPress={() => setShowCancelModal(false)}
                activeOpacity={0.8}
                className="w-full bg-[#092D5D] py-3.5 rounded-xl items-center justify-center"
              >
                <Text className="text-white font-bold text-sm">
                  Continuar com meu plano
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCancelSubscription}
                activeOpacity={0.7}
                disabled={isCancelling}
                className="w-full bg-red-50 border border-red-200 py-3.5 rounded-xl items-center justify-center"
              >
                {isCancelling ? (
                  <ActivityIndicator size="small" color="#DC2626" />
                ) : (
                  <Text className="text-red-600 font-bold text-sm">
                    Confirmar cancelamento
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Confirmação de Reativação */}
      <Modal
        visible={showReactivateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReactivateModal(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
          <View className="w-full bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
            {/* Ícone de Sucesso */}
            <View className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center mx-auto mb-4">
              <Ionicons name="checkmark-circle-outline" size={32} color="#10B981" />
            </View>

            <Text className="text-xl font-bold text-gray-900 text-center">
              Reativar Assinatura?
            </Text>

            <Text className="text-sm text-gray-600 text-center mt-3 leading-5">
              Ao reativar, a renovação automática voltará a ficar ativa e seu estabelecimento continuará aproveitando todas as ferramentas sem interrupções.
            </Text>

            {/* Ações do Modal */}
            <View className="mt-6 gap-3">
              <TouchableOpacity
                onPress={handleReactivateSubscription}
                activeOpacity={0.8}
                disabled={isReactivating}
                className="w-full bg-[#092D5D] py-3.5 rounded-xl items-center justify-center"
              >
                {isReactivating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text className="text-white font-bold text-sm">
                    Confirmar Reativação
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowReactivateModal(false)}
                activeOpacity={0.7}
                className="w-full bg-gray-100 border border-gray-200 py-3.5 rounded-xl items-center justify-center"
              >
                <Text className="text-gray-700 font-bold text-sm">
                  Voltar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

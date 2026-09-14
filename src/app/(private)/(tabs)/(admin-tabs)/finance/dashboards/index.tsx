import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppButton } from "@/shared/components/AppButton";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardPage() {
  const { safePush } = useSafeNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader title="Relatórios & Gestão" iconRight={{ icon: false, path: "" }} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 40, paddingTop: 4 }}
      >
        {/* Seção 1: Financeiro & Caixa */}
        <View className="mb-4">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">
            Financeiro & Caixa
          </Text>
          <View className="gap-2">
            <AppButton
              leftIcon="receipt-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Detalhamento de comandas fechadas, repasses e faturamento"
              onPress={() =>
                safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/comandas-report")
              }
            >
              Dashboard de Comandas
            </AppButton>

            <AppButton
              leftIcon="stats-chart"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Evolução mensal do faturamento e vendas totais"
              onPress={() =>
                safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/total-monthly")
              }
            >
              Relatório de Vendas (Faturamento)
            </AppButton>

            <AppButton
              leftIcon="pie-chart-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Gráfico de pizza comparativo de entradas vs saídas e saldo líquido"
              onPress={() =>
                safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/cash-flow-report")
              }
            >
              Fluxo de Caixa (Entradas vs Saídas)
            </AppButton>

            <AppButton
              leftIcon="card-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Distribuição por PIX, Cartões e impacto das taxas de maquininha"
              onPress={() =>
                safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/payment-methods-report")
              }
            >
              Meios de Pagamento & Taxas
            </AppButton>
          </View>
        </View>

        {/* Seção 2: Estratégico & Operacional */}
        <View className="mb-4">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">
            Estratégico & Operacional
          </Text>
          <View className="gap-2">
            <AppButton
              leftIcon="trophy-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Serviços mais lucrativos e produtos de maior saída (Curva ABC)"
              onPress={() =>
                safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/ranking-report")
              }
            >
              Ranking de Serviços & Produtos
            </AppButton>

            <AppButton
              leftIcon="time-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Dias da semana mais movimentados, turnos e horários de pico"
              onPress={() =>
                safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/peak-hours-report")
              }
            >
              Dias & Horários Nobres (Picos)
            </AppButton>

            <AppButton
              leftIcon="storefront-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Desempenho por profissional, comissões, gorjetas e repasses"
              onPress={() =>
                safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/employee-report")
              }
            >
              Dashboard Profissional
            </AppButton>

            <AppButton
              leftIcon="calendar-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Volume mensal, agendamentos confirmados e taxa de ocupação"
              onPress={() =>
                safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/appointments-report")
              }
            >
              Relatório de Agendamentos
            </AppButton>
          </View>
        </View>

        {/* Seção 3: Clientes & Fidelização */}
        <View className="mb-4">
          <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2 px-1">
            Clientes & Eficiência de Venda
          </Text>
          <View className="gap-2">
            <AppButton
              leftIcon="pricetag-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Ticket médio por comanda, venda cruzada (cross-selling) e clientes VIP"
              onPress={() =>
                safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/ticket-metrics-report")
              }
            >
              Ticket Médio & Métricas de Clientes
            </AppButton>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

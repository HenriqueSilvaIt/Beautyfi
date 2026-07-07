import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppButton } from "@/shared/components/AppButton";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FinanceiroPage() {
  const { safePush } = useSafeNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="">
        {/*Cabeçalho */}
        <AppAdminHeader
          title="Financeiro"
          leftIconShown
          iconRight={{ icon: false, path: "" }}
        />

        <View className="mt-8 items-center justify-center gap-6 px-2">
          <AppButton
            className="shadow-current" /*tem que passar como prop o className */
            leftIcon="menu-outline"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Visualize  e administre comandas."
            onPress={() => safePush("/(private)/(tabs)/(admin-tabs)/finance/order")}
          >
            Comandas
          </AppButton>

          <AppButton
            className=""
            leftIcon="wallet-outline"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Acompanhe entradas e saídas do caixa"
            onPress={() => safePush("/(private)/(tabs)/(admin-tabs)/cashflow")}
          >
            Fluxo de Caixa
          </AppButton>

          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="stats-chart"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Visualize relatórios de estabelecimento, profissionais e agendamentos"
            onPress={() => safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards")}
          >
            Relatórios
          </AppButton>
        </View>
      </View>
    </SafeAreaView>
  );
}


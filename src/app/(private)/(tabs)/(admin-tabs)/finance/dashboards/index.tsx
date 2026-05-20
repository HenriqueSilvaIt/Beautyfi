import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppButton } from "@/shared/components/AppButton";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DashboardPage() {
  const { safePush } = useSafeNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Relatórios"
        iconRight={{ icon: true, path:""}}
      />
      <View className="">
        {/*Cabeçalho */}

        <View className="mt-8 items-center justify-center gap-6 px-2">
          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="storefront-outline"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Visualize o relatório do fluxo de caixa"
            onPress={() =>
              safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/employee-report")
            }
          >
            Dashboard Profissional
          </AppButton>
            {/*
          <AppButton
            className="" 
            leftIcon="stats-chart"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Visualize relatórios de estabelecimento, profissionais e agendendamentos"
            onPress={() =>
              safePush("/(private)/(tabs)/(admin-tabs)/finance/dashboards/total-monthly")
            }
          >
            Vendas
          </AppButton>*/ }
        </View>
      </View>
    </SafeAreaView>
  );
}

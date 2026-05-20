import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppButton } from "@/shared/components/AppButton";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Subscription() {
  const { safePush } = useSafeNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="">
        {/*Cabeçalho */}
        <AppAdminHeader
          title="Assinaturas"
          leftIconShown
          iconRight={{ icon: false, path: "" }}
        />

        <View className="mt-8 items-center justify-center gap-6 px-2">
          <AppButton
            className="invoice" /*tem que passar como prop o className */
            leftIcon="trending-up"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Veja os planos de assinatura disponíveis e assine já o seu!"
            onPress={() =>
              safePush("/(private)/(tabs)/(client-tabs)/subscription/subscriptions")
            }
          >
            Planos de assinatura
          </AppButton>

          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="document-outline"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Veja todas as faturas geradas pelas suas assinaturas"
            onPress={() =>
              safePush(
                "/(private)/(tabs)/(client-tabs)/subscription/subscription-invoice",
              )
            }
          >
            Faturas
          </AppButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

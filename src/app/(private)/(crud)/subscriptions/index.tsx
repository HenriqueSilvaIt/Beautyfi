import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppButton } from "@/shared/components/AppButton";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SubscriptionAdmin() {
  const { safePush } = useSafeNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="">
        {/*Cabeçalho */}
        <AppAdminHeader
          customPath=""
          title="Assinaturas"
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
            description="Gerencie e crie planos de  assinatura"
            onPress={() =>
              safePush(
                "/(private)/(crud)/subscriptions/subscription-admin-list",
              )
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
            description="Visualize o(s) assinante(s) de seus plano(s) de assinatura"
            onPress={() =>
              safePush("/(private)/(crud)/subscriptions/subscribers")
            }
          >
            Assinantes
          </AppButton>
        </View>
      </View>
    </SafeAreaView>
  );
}

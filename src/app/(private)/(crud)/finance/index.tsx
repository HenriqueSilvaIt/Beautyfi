import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppButton } from "@/shared/components/AppButton";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FinanceMenuScreen() {
  const { safePush } = useSafeNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <KeyboardContainer>
        <View className="flex-1">
          <AppAdminHeader
            title="Financeiro"
            iconRight={{ icon: false, path: "" }}
          />

          <View className="mt-8 items-center justify-center gap-6 px-4">
            <AppButton
              leftIcon="cash-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Gerencie as formas de pagamento aceitas (Ex: Dinheiro, Pix, Cartão)."
              onPress={() => safePush("/(private)/(crud)/finance/payment-methods")}
            >
              Métodos de Pagamento
            </AppButton>

            <AppButton
              leftIcon="card-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Gerencie as bandeiras de cartão aceitas e suas respectivas taxas."
              onPress={() => safePush("/(private)/(crud)/finance/card-flags")}
            >
              Bandeiras de Cartão
            </AppButton>
          </View>
        </View>
      </KeyboardContainer>
    </SafeAreaView>
  );
}

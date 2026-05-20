import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppButton } from "@/shared/components/AppButton";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { useUserStore } from "@/shared/store/user-store";
import {  View } from "react-native";

export function CrudView() {
  const { user } = useUserStore();

  const { safePush } = useSafeNavigation();

  const { setIsBooking } = useAgendaStore();

  function handleClientClick() {
    setIsBooking(false);
    safePush("/(private)/(crud)/clients");
  }

  function handleServiceClick() {
    setIsBooking(false);
    safePush("/(private)/(crud)/services");
  }
  return (
    <KeyboardContainer>
      <View className="">
        {/*Cabeçalho */}
        <AppAdminHeader
          title="Cadastros"
          iconRightName="add"
          iconRight={{ icon: false, path: "" }}
        />

        <View className="mt-8 items-center justify-center gap-6 px-2">
          <AppButton
            className="shadow-current" /*tem que passar como prop o className */
            leftIcon="people-outline"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Cadastre e atualize os dados de seus clientes."
            onPress={handleClientClick}
          >
            Clientes
          </AppButton>

          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="person-add"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Cadastre e atualize profissionais."
            onPress={() => safePush("/(private)/(crud)/employees")}
          >
            Profissionais
          </AppButton>

          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="reorder-four"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Cadastre e atualize seus serviços.."
            onPress={handleServiceClick}
          >
            Serviços
          </AppButton>

          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="storefront-outline"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Cadastre e atualize produtos"
            onPress={() => safePush("/(private)/(crud)/products")}
          >
            Produtos
          </AppButton>

          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="cash-outline"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Cadastre e gerencie seus planos de assinatura"
            onPress={() => safePush("/(private)/(crud)/subscriptions")}
          >
            Assinaturas
          </AppButton>
          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="trending-up"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Cadastre e atualize imagens para divulgação no app"
            onPress={() => safePush("/(private)/(crud)/advertisements")}
          >
            Divulgação
          </AppButton>
        </View>
      </View>
    </KeyboardContainer>
  );
}

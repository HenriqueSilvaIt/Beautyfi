import { AppButton } from "@/shared/components/AppButton";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { Text, View } from "react-native";
import { useAdminViewModel } from "./useAdminViewModel";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";

export function AdminView({
  control,
  onUpdate,
  errors,
}: ReturnType<typeof useAdminViewModel>) {

    const {safePush} = useSafeNavigation();
  
  return (
    <KeyboardContainer>
      <View className="flex-1 ">
        {/*Cabeçalho */}
        <View className=" p-5 border-b border-gray-600 ">
          <Text className="text-font-primary text-2xl font-bold">Gerenciamento</Text>
        </View>

        <View className="mt-8 items-center justify-center gap-6 px-2">
        
        {/*
          <AppButton
            className="shadow-current" /*tem que passar como prop o className 
            leftIcon="person-outline"
            rightIcon="arrow-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Cadastre seus clientes, profissionais, serviços"
          >
            Dados Pessoais
          </AppButton> */}

         {/*  <AppButton
            className="" /*tem que passar como prop o className 
            leftIcon="information-circle-outline"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Altere os dados de sua empresa facilmente"
            onPress={() => safePush("/(private)/company/[id]")}
          >
            Empresa
          </AppButton> */}

          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="reorder-four"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Cadastre seus clientes, profissionais, serviços..  "
            onPress={() => safePush("/(private)/(crud)")}
          >
            Cadastros
          </AppButton>

        
        </View>
      </View>
    </KeyboardContainer>
  );
}

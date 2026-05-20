import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AppInputController } from "../AppInputControler";
import { KeyboardContainer } from "../KeyboardContainer";
import { colors } from "@/styles/colors";
import { AppButton } from "../AppButton";
import { useAdminViewModel } from "@/viewModel/Admin/useAdminViewModel";
import { AppAdminHeader } from "../AppAdminHeader";

export function AppCompanyInfo() {
  const { control, onUpdate } = useAdminViewModel();

  if (!control) {
    <View className="flex-1 bg-background-primary justify-center items-center">
      <ActivityIndicator size={24} color={colors.white} />
    </View>;
  }

  return (
    <KeyboardContainer>
      <View className="p-2">
        <AppAdminHeader
          title="Empresa"
          iconRightName={undefined}
          iconRight={{
            icon: false,
            path: "",
          }}
        />

        <View className="px-5 mt-5 justify-center">
          <AppInputController
            control={control}
            name="name"
            leftIcon="person"
            label="Nome da Empresa:"
            placeholder="Digite o nome da empresa"
          />
          <AppInputController
            control={control}
            name="description"
            leftIcon="reader"
            label="Sobre a empresa:"
            placeholder="Somos especialista em..."
          />
          <AppInputController
            control={control}
            name="cnpj"
            leftIcon="document"
            label="CNPJ:"
            placeholder="CompanyName"
          />

          <AppInputController
            control={control}
            name="phone"
            label="Contato:"
            leftIcon="phone-portrait-outline"
            placeholder="(DDD) 00000-0000"
          />
          <AppButton
            className=""
            rightIcon="arrow-forward"
            variant="field"
            onPress={onUpdate}
          >
            Atualizar
          </AppButton>
        </View>
      </View>
    </KeyboardContainer>
  );
}

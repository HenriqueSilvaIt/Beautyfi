import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { View } from "react-native";
import { useUserPasswordViewModel } from "./useUserPassword.viewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppInputController } from "@/shared/components/AppInputControler";
import { AppButton } from "@/shared/components/AppButton";

export function UserPasswordView({
  onChangePassword,
  control,
  isLoading,
}: ReturnType<typeof useUserPasswordViewModel>) {
  return (
    <KeyboardContainer>
      <View className="px-5">
        <AppAdminHeader
          title="Altere sua senha"
          iconRightName={ undefined}
          iconRight={{
            icon: true,
            path: "",
          }}
        />

        <AppInputController
          leftIcon="lock-closed-outline"
          label="SENHA ATUAL"
          control={control}
          name="currentPassword"
          secureTextEntry
          placeholder="Sua senha"
        />

        <AppInputController
          leftIcon="lock-closed-outline"
          label="NOVA SENHA"
          control={control}
          name="password"
          secureTextEntry
          placeholder="Sua senha"
        />

        <AppInputController
          leftIcon="lock-closed-outline"
          label="CONFIRMAR NOVA SENHA"
          control={control}
          name="confirmPassword"
          secureTextEntry
          placeholder="Confirme sua senha"
        />

        <AppButton
          className=""
          rightIcon="arrow-forward"
          variant="field"
          onPress={onChangePassword}
        >
          Salvar nova senha
        </AppButton>
      </View>
    </KeyboardContainer>
  );
}

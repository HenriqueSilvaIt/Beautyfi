import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { View } from "react-native";
import { useGoogleSignUpViewModel } from "./useGoogleSignUp.viewModel";
import { AppFormHeader } from "@/shared/components/AppFormHeader";
import { AppButton } from "@/shared/components/AppButton";
import { AppInputController } from "@/shared/components/AppInputControler";
import { colors } from "@/styles/colors";

export function GoogleSignUpView({
  control,
  reset,
  onSubmit,
  maskDate,
  maskPhone,
  safeReplace,
  isLoading,
  user,
}: ReturnType<typeof useGoogleSignUpViewModel>) {
  return (
    <KeyboardContainer>
      <View className=" pt-20 px-[40px]">
        <View className="w-full">
          <AppFormHeader
            title="Finalize seu cadastro"
            subTitle="Informe seu o número do seu telefone (whatsapp) e data de nascimento para completar seu cadastro"
          />

          {!user?.phone && (
            <AppInputController
              leftIcon="call-outline"
              label="TELEFONE"
              control={control}
              name="phone"
              transform={maskPhone}
              placeholder="(00) 00000-0000"
              placeholderTextColor={colors.gray[600]}
            />
          )}

          {!user?.birthDate && (
            <AppInputController
              control={control}
              name="birthDate"
              label="Data de nascimento"
              leftIcon="calendar"
              placeholder="DD/MM/AAAA"
              transform={maskDate}
              className="mb-2"
            />
          )}

          <AppButton
            rightIcon="arrow-forward"
            variant="field"
            onPress={onSubmit}
            isLoading={isLoading}
            className="mb-4"
          >
            Continuar
          </AppButton>
        </View>
      </View>
    </KeyboardContainer>
  );
}

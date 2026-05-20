import { AppFormHeader } from "@/shared/components/AppFormHeader";
import { AppInputController } from "@/shared/components/AppInputControler";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { colors } from "@/styles/colors";
import { TouchableOpacity, View } from "react-native";
import { usePasswordRecoverViewModel } from "./usePasswordRecoverViewModel";
import { AppButton } from "@/shared/components/AppButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export function PasswordRecoverView({
  control,
  isLoading,
  onSubmit,
}: ReturnType<typeof usePasswordRecoverViewModel>) {
  return (
    <KeyboardContainer>
      <View className={`ml-5 pt-5 h-[80px] `}>
        <TouchableOpacity onPress={() => router.push("/(public)/login")}>
          <Ionicons name="chevron-back" size={30} color={colors.white} />
        </TouchableOpacity>
      </View>
      <View className="flex-1 bg-background-primary px-[40px]  pt-20">
        <View className="w-full ">
          <AppFormHeader
            title="Recuperar senha"
            subTitle="Informe seu email para recuperar senha"
          />

          <AppInputController
            control={control}
            name="email"
            leftIcon="mail-outline"
            label="EMAIL"
            placeholder="mail@exemple.com.br"
            placeholderTextColor={colors.gray[600]}
          />

          <AppButton variant="field" onPress={onSubmit} isLoading={isLoading}>
            Enviar
          </AppButton>
        </View>
      </View>
    </KeyboardContainer>
  );
}

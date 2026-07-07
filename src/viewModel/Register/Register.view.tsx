import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRegisterViewModel } from "./useRegister.viewModel";
import { KeyboardContainer } from "../../shared/components/KeyboardContainer";
import { AppFormHeader } from "../../shared/components/AppFormHeader";
import { AppInputController } from "../../shared/components/AppInputControler";
import { AppButton } from "../../shared/components/AppButton";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { colors } from "@/styles/colors";
import { useMask } from "@/shared/hooks/useMask";
import { Ionicons } from "@expo/vector-icons";

export function RegisterView({
  onSubmit,
  control,
}: ReturnType<typeof useRegisterViewModel>) {
  const { safeReplace, safePush } = useSafeNavigation();
  const { maskPhone } = useMask();
  return (
    <KeyboardContainer>
      <ScrollView className="flex-1  pt-10 px-[40px]">
        <AppFormHeader
          title="Crie sua conta"
          subTitle="Informe seus dados pessoais e de acesso"
        />

        <Text className="text-base mt-3 font-bold text-gray-500">
          Dados Pessoais
        </Text>

        <AppInputController
          leftIcon="person-outline"
          label="NOME"
          control={control}
          name="firstName"
          placeholder="Seu nome"
          placeholderTextColor={colors.gray[600]}
        />

        <AppInputController
          leftIcon="call-outline"
          label="TELEFONE"
          control={control}
          name="phone"
          transform={maskPhone}
          placeholder="(00) 00000-0000"
          placeholderTextColor={colors.gray[600]}
        />

        <Text className="text-base mt-6 font-bold text-gray-500">Acesso</Text>

        <AppInputController
          control={control}
          name="email"
          leftIcon="mail-outline"
          label="E-MAIL"
          placeholder="mail@exemple.com.br"
          placeholderTextColor={colors.gray[600]}
        />

        <AppInputController
          leftIcon="lock-closed-outline"
          label="SENHA"
          control={control}
          name="password"
          secureTextEntry
          placeholder="Sua senha"
          placeholderTextColor={colors.gray[600]}
        />

        <AppButton className="mt-6" onPress={onSubmit}>
          Registrar
        </AppButton>

        <View className="mt-8">
          <Text className="text-base text-gray-500 mb-4 text-center">
            Já tem uma conta?
          </Text>
          <AppButton
            className="mt-6"
            onPress={() => safeReplace("/(public)/login")}
          >
            Login
          </AppButton>
        </View>

        {/* CTA Cadastro de Empresa */}
        <TouchableOpacity
          onPress={() => safePush("/(public)/company-register")}
          activeOpacity={0.85}
          className="mt-8 mb-12 rounded-2xl overflow-hidden border border-app-theme-primary/40 bg-background-tertiary"
        >
          <View className="p-5 gap-3">
            <View className="flex-row items-center gap-3">
              <View
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: colors["app-theme-primary"] + "25" }}
              >
                <Ionicons
                  name="storefront-outline"
                  size={22}
                  color={colors["app-theme-primary"]}
                />
              </View>
              <View className="flex-1">
                <Text className="text-font-primary font-bold text-base">
                  Tem um negócio?
                </Text>
                <Text className="text-font-primary text-xs mt-0.5">
                  Crie sua empresa gratuitamente
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors["app-theme-primary"]} />
            </View>
            <Text className="text-font-primary text-xs leading-4">
              Cadastre sua empresa em minutos e comece a receber agendamentos
              online. Experimente 14 dias grátis.
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardContainer>
  );
}

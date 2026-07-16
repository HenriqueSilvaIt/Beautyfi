import { Platform, Text, Touchable, TouchableOpacity, View } from "react-native";
import { useLoginViewModel } from "./useLogin.viewModel";
import { KeyboardContainer } from "../../shared/components/KeyboardContainer";
import { AppInputController } from "../../shared/components/AppInputControler";
import { AppFormHeader } from "../../shared/components/AppFormHeader";
import { AppButton } from "../../shared/components/AppButton";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
import * as AppleAuthentication from "expo-apple-authentication";
import { Ionicons } from "@expo/vector-icons";

export function LoginView({
  control,
  isLoading,
  onSubmit,
  handleGoogleSignin,
  handleAppleSignin,
  isAuthenticating,
}: ReturnType<typeof useLoginViewModel>) {
  const { safePush } = useSafeNavigation();

  return (
    <KeyboardContainer>
      <View className=" pt-20 px-[40px]">
        <View className="w-full">
          <AppFormHeader
            title="Acesse sua conta para continuar"
            subTitle="Informe seu email e senha para realizar agendamento"
          />

          <AppInputController
            control={control}
            name="email"
            leftIcon="mail-outline"
            label="EMAIL"
            placeholder="mail@exemple.com.br"
            placeholderTextColor={colors.gray[600]}
          />

          <AppInputController
            control={control}
            name="password"
            leftIcon="lock-closed-outline"
            label="SENHA"
            placeholder="Sua senha"
            placeholderTextColor={colors.gray[600]}
            secureTextEntry
            className="mb-2"
          />

          <TouchableOpacity
            onPress={() => router.push("/(public)/password-recover")}
            className="pb-4"
          >
            <Text className="text-sm mb-4 text-app-theme-primary">
              Esqueci a senha?
            </Text>
          </TouchableOpacity>
          <AppButton
            rightIcon="arrow-forward"
            variant="field"
            onPress={onSubmit}
            isLoading={isLoading}
            className="mb-4"
          >
            Login
          </AppButton>

          <AppButton
            rightIcon="logo-google"
            variant="outlined"
            onPress={handleGoogleSignin}
            isLoading={isAuthenticating}
            className="mb-4"
          >
            Entrar com o Google
          </AppButton>

          {Platform.OS === "ios" && (
            <View className="mb-4">
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={
                  AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                }
                buttonStyle={
                  AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                }
                cornerRadius={10}
                style={{
                  width: "100%",
                  height: 50,
                }}
                onPress={handleAppleSignin}
              />
            </View>
          )}

          <View className="flex-2 pb-2">
            <Text className="text-base my-3 text-gray-600 text-center">
              Ainda não tem uma conta?
            </Text>
          </View>
          <AppButton variant="outlined" onPress={() => safePush("/register")}>
            Registro
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
      </View>
    </KeyboardContainer>
  );
}

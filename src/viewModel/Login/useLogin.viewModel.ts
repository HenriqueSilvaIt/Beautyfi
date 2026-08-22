import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useLoginMutation } from "../../shared/queries/auth/use-login.mutation";
import { LoginFormData, loginScheme } from "./login.scheme";
import { useUserStore } from "../../shared/store/user-store";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import {
  useAppleAuthMutation,
  useGoogleAuthMutation,
  useUserLoggedQuery,
} from "@/shared/queries/user/use-user-logged.mutation";
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from "@env";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";
import { LoginHttpResponse } from "@/shared/interfaces/http/login";
import * as AppleAuthentication from "expo-apple-authentication";
import { getUserLogged } from "@/shared/services/user.service";
import { queryClient } from "../../../queryClient";
const webClientId =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  GOOGLE_WEB_CLIENT_ID ||
  "666853975186-n7kgnfi8vggt49bn1o9tbkqjq8bu8k2n.apps.googleusercontent.com";

const iosClientId =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
  GOOGLE_IOS_CLIENT_ID ||
  "666853975186-0jlnben8a2i3d82v5qqe2qufnb5bqv89.apps.googleusercontent.com";

if (webClientId && iosClientId) {
  GoogleSignin.configure({
    scopes: ["email", "profile"],
    webClientId: webClientId,
    iosClientId: iosClientId,
  });
} else {
  console.warn("⚠️ Google Client IDs não definidos");
}

export function useLoginViewModel() {
  // ✅ Todos os hooks no topo
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const hasNavigated = useRef(false); // ← agora no topo

  const { control, reset, handleSubmit } = useForm<LoginFormData>({
    resolver: yupResolver(loginScheme),
    defaultValues: { email: "", password: "" },
  });

  const { setSession, user, setUser } = useUserStore();
  const { handleError } = useErrorHandler();
  const { safeReplace } = useSafeNavigation();
  const { refetch } = useUserLoggedQuery({ enabled: false });
  const loginMutation = useLoginMutation();
  const googleAuthMutation = useGoogleAuthMutation();
  const appleAuthMutation = useAppleAuthMutation();
  useEffect(() => {
    if (user && !isLoading && !isAuthenticating && !hasNavigated.current) {
      hasNavigated.current = true;

      const isAdmin =
        user.roles?.some(
          (role) =>
            role.authority === "ROLE_ADMIN" ||
            role.authority === "ROLE_MODERATOR",
        ) ?? false;

      safeReplace(
        isAdmin
          ? "/(private)/(tabs)/(admin-tabs)/agenda"
          : "/(private)/(tabs)/(client-tabs)/home",
      );
    }
  }, [user, isLoading, isAuthenticating]);

  // ✅ Um único useFocusEffect
  useFocusEffect(
    useCallback(() => {
      reset({ email: "", password: "" });

      return () => {
        hasNavigated.current = false;
      };
    }, [reset]),
  );

  // Funções depois dos hooks
  async function handleLoginSuccess(data: LoginHttpResponse) {
    // 1. Limpa qualquer cache e estado anterior
    queryClient.removeQueries({ queryKey: ["user-logged"] });
    queryClient.clear();

    setSession({
      access_token: data.access_token,
      token_type: data.token_type,
      expires_in: data.expires_in,
    });

    await new Promise((resolve) => setTimeout(resolve, 50));
    console.log(
      "🔑 Token na store:",
      useUserStore.getState().access_token?.slice(0, 20),
    );

    // 2. Busca direta na API (sem usar cache do cliente anterior)
    const userLogged = await getUserLogged();
    console.log("👤 userLogged atualizado da API:", userLogged);

    if (!userLogged) {
      handleError(new Error("Sem dados de usuário"), "Erro ao carregar perfil");
      return;
    }

    setUser(userLogged);
    queryClient.setQueryData(["user-logged"], userLogged);
    useUserStore.getState().setAuthReady(true);
    // ✅ Determina a rota correta pela role e limpa o histórico
    const isAdmin =
      userLogged.roles?.some(
        (role) =>
          role.authority === "ROLE_ADMIN" ||
          role.authority === "ROLE_MODERATOR",
      ) ?? false;

    // Enviar para rota de cadastro se falta phone, birthDate ou firstName (Google/Apple)
    if (!userLogged.phone || !userLogged.birthDate || !userLogged.firstName) {
      safeReplace("/(private)/google-signup");
      return;
    }
    safeReplace(
      isAdmin
        ? "/(private)/(tabs)/(admin-tabs)/agenda"
        : "/(private)/(tabs)/(client-tabs)/home",
    );
  }

  const onSubmit = handleSubmit(async (userFormData) => {
    try {
      setIsLoading(true);
      const userData = await loginMutation.mutateAsync(userFormData);
      setIsLoading(false);
      await handleLoginSuccess(userData);
    } catch (error) {
      handleError(error, "Falha ao logar");
    } finally {
      setIsLoading(false);
    }
  });

  async function handleAppleSignin() {
    try {
      setIsAuthenticating(true);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      credential.fullName?.givenName;
      credential.fullName?.familyName;
      const name =
        `${credential.fullName?.givenName ?? ""} ${credential.fullName?.familyName ?? ""}`.trim();

      if (!credential.identityToken) {
        throw new Error("Token Apple não encontrado");
      }

      const data = await appleAuthMutation.mutateAsync({
        token: credential.identityToken,
        name
      }
      );

      await handleLoginSuccess(data);
    } catch (error: any) {
      console.log(error);

      Alert.alert("Erro", error?.message ?? "Falha login Apple");
    } finally {
      setIsAuthenticating(false);
    }
  }
  async function handleGoogleSignin() {
    try {
      setIsAuthenticating(true);
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();
      if (!idToken) throw new Error("Não foi possível obter o token do Google");

      const data = await googleAuthMutation.mutateAsync(idToken);
      await handleLoginSuccess(data);
    } catch (error: any) {
      console.log(error);
      console.log("❌ ERRO GOOGLE:", error?.code, error?.message);
      Alert.alert("Erro", error?.message ?? "Não foi possível conectar");
    } finally {
      setIsAuthenticating(false);
    }
  }

  return {
    control,
    onSubmit,
    isLoading,
    handleGoogleSignin,
    handleAppleSignin,
    isAuthenticating,
  };
}

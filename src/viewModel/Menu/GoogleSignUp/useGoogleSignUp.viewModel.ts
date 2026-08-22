import { Resolver, useForm } from "react-hook-form";
import {
  GoogleSignUpFormData,
  googleSignUpScheme,
} from "./googleSignUp.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMask } from "@/shared/hooks/useMask";
import { useUserCompleteSignupMutation, useUserLoggedQuery } from "@/shared/queries/user/use-user-logged.mutation";
import { useCallback, useEffect, useState } from "react";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useFocusEffect } from "expo-router";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useUserStore } from "@/shared/store/user-store";

export function useGoogleSignUpViewModel() {
  const { maskPhone, maskDate, unmask } = useMask();
  const { DateIsoToBR, DateBRToISO } = useFormatDate();

  const [isLoading, setIsLoading] = useState(false);

  const { safeReplace } = useSafeNavigation();
  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();

  const { user, setUser } = useUserStore();
  const { data: userLoggedData } = useUserLoggedQuery();

  const currentUser = userLoggedData || user;

  const isAdmin =
    currentUser?.roles?.some(
      (role) =>
        role.authority === "ROLE_ADMIN" ||
        role.authority === "ROLE_MODERATOR",
    ) ?? false;

  const { control, reset, handleSubmit } = useForm<GoogleSignUpFormData>({
    resolver: yupResolver(
      googleSignUpScheme,
    ) as unknown as Resolver<GoogleSignUpFormData>,
    defaultValues: {
      name: "",
      birthDate: "",
      phone: "",
    },
  });

  const { userCompleteSignupMutation } = useUserCompleteSignupMutation();

  // Redireciona automaticamente se o usuário já possui todas as informações cadastradas
  useEffect(() => {
    if (currentUser?.firstName && currentUser?.phone && currentUser?.birthDate) {
      safeReplace(
        isAdmin
          ? "/(private)/(tabs)/(admin-tabs)/agenda"
          : "/(private)/(tabs)/(client-tabs)/home",
      );
    }
  }, [currentUser?.firstName, currentUser?.phone, currentUser?.birthDate, isAdmin]);

  const onSubmit = handleSubmit(async (userData) => {
    try {
      const nameNeeded = !currentUser?.firstName;
      const phoneNeeded = !currentUser?.phone;
      const birthDateNeeded = !currentUser?.birthDate;

      const name = userData.name?.trim();
      const phone = userData.phone ? unmask(userData.phone) : undefined;
      const birthDate = userData.birthDate
        ? DateBRToISO(userData.birthDate)
        : undefined;

      if (nameNeeded && (!name || name.length === 0)) {
        notify({ message: "Por favor, informe seu nome", type: "ERROR" });
        return;
      }
      if (phoneNeeded && (!phone || phone.length < 10)) {
        notify({ message: "Por favor, informe um telefone válido com DDD", type: "ERROR" });
        return;
      }
      if (birthDateNeeded && (!birthDate || birthDate.length === 0)) {
        notify({ message: "Por favor, informe sua data de nascimento", type: "ERROR" });
        return;
      }

      setIsLoading(true);

      const payload: Record<string, string> = {};
      if (name) payload.firstName = name;
      if (phone) payload.phone = phone;
      if (birthDate) payload.birthDate = birthDate;

      const updatedUser = await userCompleteSignupMutation.mutateAsync(payload as any);
      if (updatedUser) {
        setUser(updatedUser);
      }

      notify({ message: "Cadastro finalizado com sucesso!", type: "SUCCESS" });

      safeReplace(
        isAdmin
          ? "/(private)/(tabs)/(admin-tabs)/agenda"
          : "/(private)/(tabs)/(client-tabs)/home",
      );
    } catch (error) {
      handleError(error, "Falha ao atualizar dados do cadastro");
    } finally {
      setIsLoading(false);
    }
  });

  useFocusEffect(
    useCallback(() => {
      reset({
        name: "",
        birthDate: "",
        phone: "",
      });
    }, [reset]),
  );

  return {
    control,
    reset,
    handleSubmit,
    DateIsoToBR,
    maskPhone,
    maskDate,
    safeReplace,
    onSubmit,
    isLoading,
    user: currentUser,
  };
}

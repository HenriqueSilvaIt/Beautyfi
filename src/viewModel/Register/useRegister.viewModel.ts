import { Resolver, useForm } from "react-hook-form";
import { RegisterFormData, registerScheme } from "./register.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRegisterMutation } from "../../shared/queries/auth/use-register.mutation";
import { useCallback, useEffect, useState } from "react";
import { useMask } from "@/shared/hooks/useMask";
import { useFocusEffect } from "expo-router";
import { COMPANY_ID } from "@env";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";

export function useRegisterViewModel() {
  const COMPANY_ID_NUMBER = Number(COMPANY_ID)
    ? Number(COMPANY_ID)
    : (Number(process.env.EXPO_PUBLIC_COMPANY_ID) ?? 0);

  const userRegisterMutation = useRegisterMutation();
  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();
  const { safeReplace } = useSafeNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const { unmask, maskPhone } = useMask();
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(
      registerScheme,
    ),
    defaultValues: {
      companyId: COMPANY_ID_NUMBER,
      firstName: "",
      email: "",
      password: "",
      phone: "",
    },
  });

  const onSubmit = handleSubmit(async (userData) => {
    try {
      setIsLoading(true);

      if (userData.phone) {
        userData.phone = unmask(userData.phone);
      }
      const mutationResponse = await userRegisterMutation.mutateAsync(userData);
      console.log("RESPOSTA:", mutationResponse);

      notify({
        message: "Usuário criado com sucesso",
        type: "SUCCESS",
      });
      safeReplace("/(public)/login");
    } catch (error) {
      handleError(error, "Falha ao criar usuário");

      console.error("ERRO SUBMIT:", error);
    } finally {
      setIsLoading(false);
    }
  });
useFocusEffect(
  useCallback(() => {
    reset({
      companyId: COMPANY_ID_NUMBER,
      email: "",
      firstName: "",
      password: "",
      phone: "",
    });
  }, [reset])
);

  return {
    control,
    onSubmit,
    errors,
  };
}

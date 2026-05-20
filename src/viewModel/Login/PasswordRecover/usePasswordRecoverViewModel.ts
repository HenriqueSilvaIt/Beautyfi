import { useForm } from "react-hook-form";
import {
  PasswordRecoverFormData,
  passwordRecoverScheme,
} from "./password-recover.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFocusEffect } from "expo-router";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useCallback, useState } from "react";
import { useRecoverPasswordMutation } from "@/shared/queries/auth/use-login.mutation";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";

export function usePasswordRecoverViewModel() {
  const { control, reset, handleSubmit } = useForm<PasswordRecoverFormData>({
    resolver: yupResolver(passwordRecoverScheme),
    defaultValues: {
      email: "",
    },
  });

  const { safeReplace } = useSafeNavigation();

  const recoverPasswordMutation = useRecoverPasswordMutation();

  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useSnackbarContext();
  const { handleError } = useErrorHandler();

  const onSubmit = handleSubmit(async (recoverFormData) => {
    try {
      setIsLoading(true);
      const userData = await recoverPasswordMutation.mutateAsync(
        recoverFormData.email,
      );

      notify({
        message: `Enviado  email para ${recoverFormData.email} verifique sua caixa de entrada`,
        type: "SUCCESS",
        time: 5000,
      });
      safeReplace("/(public)/login");
    } catch (error) {
      handleError(error, "Falha ao logar");
    } finally {
      setIsLoading(false);
    }
  });

  useFocusEffect(
    useCallback(() => {
      reset({
        email: "",
      });
    }, [reset]),
  );

  return {
    control,
    onSubmit,
    isLoading,
  };
}

import { useForm } from "react-hook-form";
import { UserPasswordFormData, userPasswordScheme } from "./user-password.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUserChangePasswordMutation } from "@/shared/queries/user/use-user-logged.mutation";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { router } from "expo-router";
import { useState } from "react";

export function useUserPasswordViewModel() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UserPasswordFormData>({
    resolver: yupResolver(userPasswordScheme),
  });

  const userChangePasswordMutation = useUserChangePasswordMutation();

  const [isLoading, setIsLoading] = useState(false);

  const { notify} = useSnackbarContext();

  const {handleError} = useErrorHandler();

  const onChangePassword = handleSubmit(async (formData) => {
  try {
    
    const {confirmPassword, ...rest} = formData;
    setIsLoading(true);
    await userChangePasswordMutation.mutateAsync({
      
      currentPassword: rest.currentPassword,
      password: rest.password,
    }); 

    notify({ message: "Senha alterada com sucesso", type: "SUCCESS" });
    router.back();
  } catch (error) {
    handleError(error, "Erro ao alterar senha");
  } finally {
    setIsLoading(false);
  }


});
  return {
    control,
    isLoading,
    onChangePassword,
  };
}

import { Resolver, useForm } from "react-hook-form";
import {
  GoogleSignUpFormData,
  googleSignUpScheme,
} from "./googleSignUp.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMask } from "@/shared/hooks/useMask";
import { useUserCompleteSignupMutation } from "@/shared/queries/user/use-user-logged.mutation";
import { useCallback, useState } from "react";
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
  const { control, reset, handleSubmit } = useForm<GoogleSignUpFormData>({
    resolver: yupResolver(
      googleSignUpScheme,
    ) as unknown as Resolver<GoogleSignUpFormData>,
    defaultValues: {
      birthDate: "",
      phone: "",
    },
  });
  const { userCompleteSignupMutation } = useUserCompleteSignupMutation();

  const { user} = useUserStore();
    const isAdmin =
       user?.roles?.some(
        (role) =>
          role.authority === "ROLE_ADMIN" ||
          role.authority === "ROLE_MODERATOR",
      ) ?? false;

  const onSubmit = handleSubmit(async (userData) => {
  try {
    setIsLoading(true);

    const phone = userData.phone ? unmask(userData.phone) : undefined;
    const birthDate = userData.birthDate
      ? DateBRToISO(userData.birthDate)
      : undefined;

    // ✅ só manda os campos que têm valor
    const payload: Record<string, string> = {};
    if (phone) payload.phone = phone;
    if (birthDate) payload.birthDate = birthDate;

    await userCompleteSignupMutation.mutateAsync(payload as any);

    notify({ message: "Usuário atualizado com sucesso", type: "SUCCESS" });

    safeReplace(
      isAdmin
        ? "/(private)/(tabs)/(admin-tabs)/agenda"
        : "/(private)/(tabs)/(client-tabs)/home",
    );
  } catch (error) {
    handleError(error, "Falha ao criar usuário");
  } finally {
    setIsLoading(false);
  }
});
  useFocusEffect(
    useCallback(() => {
      reset({
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
    user
  };
}

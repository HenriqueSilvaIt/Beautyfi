import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import {
  getUserLogged,
  updatePassword,
  updateUser,
  updateUserPreference,
  uploadAvatar,
  userCompleteSignup,
  dismissOnboarding,
} from "../../services/user.service";
import { useUserStore } from "@/shared/store/user-store";
import {
  UpdateUserPreferencesInterface,
  UpdateUserSignupInterface,
  UserChangePasswordInterface,
  UserInterface,
  UserProps,
} from "@/shared/interfaces/user";
import { appleAuth, googleAuth } from "@/shared/services/auth.service";
import { queryClient } from "../../../../queryClient";

interface UpdateUserVariable {
  userId?: number;
  data: Partial<UserInterface>;
}
type UploadAvatarResponse = {
  avatarUrl?: string;
};

type AppleAuthPayload = {
  token: string;
  name: string;
};

type UserLoggedQueryOptions = Omit<
  UseQueryOptions<any, unknown, any, any>,
  "queryKey" | "queryFn"
>;
export const userKeys = {
  all: ["user-logged"] as const,
  detail: (userId: number | string) => [...userKeys.all, userId] as const,
};
export function useUserLoggedQuery(options?: UserLoggedQueryOptions) {
  const { access_token, hasHydrated, setUser } = useUserStore();

  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const data = await getUserLogged();
      if (data) {
        setUser(data);
      }
      return data;
    },
    enabled: hasHydrated && !!access_token,
    staleTime: 0,
    refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
  });
}

export function useUserLogged() {
  const userUpdateMutation = useMutation({
    mutationFn: ({ userId, data }: UpdateUserVariable) =>
      updateUser(data, userId),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.all, updatedUser);
      queryClient.setQueryData(["user-logged"], updatedUser);
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: ["user-logged"] });
    },
  });

  return {
    userUpdateMutation,
  };
}

export function useUserUserUpdatePreferences() {
  const userUpdatePreferencesMutation = useMutation({
    mutationFn: (data: UpdateUserPreferencesInterface) =>
      updateUserPreference(data),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.all, updatedUser);
      queryClient.setQueryData(["user-logged"], updatedUser);
    },
  });

  return {
    userUpdatePreferencesMutation,
  };
}

export function useUserCompleteSignupMutation() {
  const setUser = useUserStore((state) => state.setUser);
  const userCompleteSignupMutation = useMutation({
    mutationFn: (data: UpdateUserSignupInterface) => userCompleteSignup(data),

    onSuccess: (updatedUser) => {
      queryClient.setQueryData(["user-logged"], updatedUser);
      queryClient.setQueryData(userKeys.all, updatedUser);
      if (updatedUser) {
        setUser(updatedUser as UserProps);
      }
    },
  });
  return {
    userCompleteSignupMutation,
  };
}

export function useUserChangePasswordMutation() {
  return useMutation({
    mutationFn: (data: UserChangePasswordInterface) => updatePassword(data),

    onSuccess: (updatedUser) => {
      // updatedUser É exatamente o JSON que você mostrou
      queryClient.setQueryData(["user-logged"], updatedUser);
    },
  });
}

export function useGoogleAuthMutation() {
  return useMutation({
    mutationFn: (token: string) => googleAuth(token),

    onSuccess: (updatedUser) => {
      // updatedUser É exatamente o JSON que você mostrou
      queryClient.setQueryData(["user-logged"], updatedUser);
    },
  });
}

export function useAppleAuthMutation() {
  return useMutation({
    mutationFn: ({ token, name }: AppleAuthPayload) => appleAuth(token, name),
    onSuccess: (updatedUser) => {
      // updatedUser É exatamente o JSON que você mostrou
      queryClient.setQueryData(["user-logged"], updatedUser);
    },
  });
}

export function useUploadAvatarMutation() {
  return useMutation<UploadAvatarResponse, Error, string>({
    mutationFn: async (avatarUri: string): Promise<{ avatarUrl?: string }> => {
      const res = await uploadAvatar(avatarUri);

      return {
        avatarUrl: res.avatarUrl,
      };
    },
    onSuccess: (data) => {
      console.log("UPLOAD RESPONSE:", data);
    },

    onError: (error) => {
      console.log("Erro ao fazer upload do avatar:", error);
    },
  });
}

export function useDismissOnboardingMutation() {
  const dismissOnboardingMutation = useMutation({
    mutationFn: dismissOnboarding,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(userKeys.all, updatedUser);
      queryClient.setQueryData(["user-logged"], updatedUser);
    },
  });
  return {
    dismissOnboardingMutation,
  };
}


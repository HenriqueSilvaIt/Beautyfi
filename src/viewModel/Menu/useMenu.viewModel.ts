import { router } from "expo-router";
import { useUserStore } from "../../shared/store/user-store";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { queryClient } from "../../../queryClient";
import { useSubscriberStore } from "@/shared/store/subscriber-store";
import { useUserLoggedQuery } from "@/shared/queries/user/use-user-logged.mutation";

export function useMenuViewModel() {
  const { handleError } = useErrorHandler();
  const {
    data: userData,
    isLoading: isUserLoading,
    isError,
  } = useUserLoggedQuery();
  const { logout, user } = useUserStore();
  function logoutUser() {
    try {
      logout();
      useUserStore.getState().logout();

      useUserStore.persist.clearStorage();
      useSubscriberStore.getState().setSubscriberId(undefined);
      
      queryClient.clear();

      router.replace("/(public)/home");
    } catch (error) {
      handleError(error, "Falha ao sair");
    }
  }

  return {
    logoutUser,
    user,
    userData
  };
}

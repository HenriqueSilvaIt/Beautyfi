import { useEffect } from "react";
import { router } from "expo-router";
import { useUserStore } from "../../shared/store/user-store";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { queryClient } from "../../../queryClient";
import { useSubscriberStore } from "@/shared/store/subscriber-store";
import { useUserLoggedQuery } from "@/shared/queries/user/use-user-logged.mutation";
import { useCompanyStore } from "@/shared/store/company-store";

export function useMenuViewModel() {
  const { handleError } = useErrorHandler();
  const {
    data: userData,
    isLoading: isUserLoading,
    isError,
  } = useUserLoggedQuery();
  const { logout, user, setUser } = useUserStore();

  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData]);

  function logoutUser() {
    try {
      logout();
      useUserStore.getState().logout();
      useCompanyStore.getState().resetCompanyStore();
      useCompanyStore.persist?.clearStorage?.();
      useSubscriberStore.getState().setSubscriberId(undefined);
      useUserStore.persist?.clearStorage?.();

      queryClient.removeQueries();
      queryClient.clear();

      router.replace("/(public)/home");
    } catch (error) {
      handleError(error, "Falha ao sair");
    }
  }

  return {
    logoutUser,
    user: userData || user,
    userData
  };
}

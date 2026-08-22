import { useLoyaltyMutation, ClientLoyaltyPoints } from "@/shared/queries/company/use-loyalty.mutation";
import { useUserStore } from "@/shared/store/user-store";
import { useState } from "react";

export function useMyLoyaltyViewModel() {
  const user = useUserStore((state) => state.user);
  const clientId = user?.clientId || user?.id;

  const { useGetClientPointsQuery } = useLoyaltyMutation();
  const { data, isLoading, refetch, isRefetching } = useGetClientPointsQuery(
    clientId ? Number(clientId) : undefined
  );

  const pointsList: ClientLoyaltyPoints[] = Array.isArray(data) ? data : data ? [data] : [];

  return {
    user,
    pointsList,
    isLoading,
    isRefetching,
    refetch,
  };
}

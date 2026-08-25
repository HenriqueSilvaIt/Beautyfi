import { styleAppApiClient } from "@/shared/api/styleAppBackend";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export interface LoyaltyRewardItem {
  id?: number;
  title: string;
  pointsRequired: number;
  itemType: "SERVICE" | "PRODUCT" | "CUSTOM";
  serviceId?: number;
  serviceName?: string;
  servicePrice?: number;
  productId?: number;
  productName?: string;
  productPrice?: number;
  description?: string;
}

export interface LoyaltyProgram {
  id?: number;
  companyId?: number;
  name: string;
  description?: string;
  active: boolean;
  pointsPerReal: number;
  pointsAmountPerPoint?: number;
  minPointsToRedeem: number;
  rewardValue?: number;
  rewardDescription?: string;
  ruleDescription?: string;
  items: LoyaltyRewardItem[];

  // Cartão Fidelidade por Serviço (Carimbos)
  stampActive?: boolean;
  stampServiceId?: number;
  stampServiceName?: string;
  stampRequiredCount?: number;
  stampStartDate?: string;
  stampEndDate?: string;
  stampRewardDescription?: string;
}

export interface ClientLoyaltyPoints {
  id?: number;
  clientId: number;
  clientName?: string;
  companyId: number;
  companyName?: string;
  companyLogoUrl?: string;
  pointsBalance: number;
  totalPointsEarned: number;
}

export function useLoyaltyMutation() {
  const queryClient = useQueryClient();

  function useGetActiveProgramQuery(companyId?: number) {
    return useQuery({
      queryKey: ["loyalty-program-active", companyId],
      queryFn: async () => {
        if (!companyId) return null;
        try {
          const { data } = await styleAppApiClient.get<LoyaltyProgram>(
            `/companies/${companyId}/loyalty-programs/active`
          );
          return data;
        } catch {
          return null;
        }
      },
      enabled: !!companyId,
    });
  }

  function useGetClientPointsQuery(clientId?: number, companyId?: number) {
    return useQuery({
      queryKey: ["client-loyalty-points", clientId, companyId],
      queryFn: async () => {
        if (!clientId) return null;
        const url = companyId
          ? `/clients/${clientId}/loyalty-points?companyId=${companyId}`
          : `/clients/${clientId}/loyalty-points`;
        try {
          const { data } = await styleAppApiClient.get<any>(url);
          return data;
        } catch {
          return null;
        }
      },
      enabled: !!clientId,
    });
  }

  const saveProgramMutation = useMutation({
    mutationFn: async ({ companyId, dataBody }: { companyId: number; dataBody: Partial<LoyaltyProgram> }) => {
      const { data } = await styleAppApiClient.post<LoyaltyProgram>(
        `/companies/${companyId}/loyalty-programs`,
        dataBody
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-program-active"] });
      queryClient.invalidateQueries({ queryKey: ["company-details"] });
      queryClient.invalidateQueries({ queryKey: ["company"] });
    },
  });

  const addItemMutation = useMutation({
    mutationFn: async ({ programId, item }: { programId: number; item: Partial<LoyaltyRewardItem> }) => {
      const { data } = await styleAppApiClient.post<LoyaltyRewardItem>(
        `/loyalty-programs/${programId}/items`,
        item
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-program-active"] });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: number) => {
      await styleAppApiClient.delete(`/loyalty-programs/items/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loyalty-program-active"] });
    },
  });

  return {
    useGetActiveProgramQuery,
    useGetClientPointsQuery,
    saveProgramMutation,
    addItemMutation,
    deleteItemMutation,
  };
}

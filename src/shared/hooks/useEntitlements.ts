import { useQuery } from "@tanstack/react-query";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";
import { useUserStore } from "@/shared/store/user-store";

export interface EntitlementsSnapshot {
  planCode: "STARTER" | "PRO" | "ENTERPRISE";
  planName: string;
  status: "ACTIVE" | "TRIAL" | "PAST_DUE" | "CANCELED";
  isSoftLocked: boolean;
  chargeClubPlatformFee: boolean;
  effectiveClubPlatformFee: number;
  features: {
    comissao_automatica: boolean;
    fidelidade: boolean;
    financeiro_dre: boolean;
    reativacao_automatica: boolean;
    multi_unidade: boolean;
    suporte_prioritario: boolean;
  };
  limits: {
    max_profissionais: number | null;
    lembretes_mes: number | null;
    clube_ativos: number | null;
  };
  usage: {
    lembretes_mes: number;
    clube_ativos: number;
  };
}

export function useEntitlements() {
  const { user } = useUserStore();
  const isEnabled = Boolean(user?.id);

  const { data, isLoading, refetch, isError } = useQuery<EntitlementsSnapshot>({
    queryKey: ["entitlements", user?.companyId],
    queryFn: async () => {
      const res = await styleAppApiClient.get<EntitlementsSnapshot>("/me/entitlements");
      return res.data;
    },
    enabled: isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const can = (featureKey: keyof EntitlementsSnapshot["features"]): boolean => {
    if (!data) return true; // Fallback permissivo durante carregamento
    return Boolean(data.features[featureKey]);
  };

  const limit = (limitKey: keyof EntitlementsSnapshot["limits"]): number | null => {
    if (!data) return null;
    return data.limits[limitKey] ?? null;
  };

  const usage = (limitKey: keyof EntitlementsSnapshot["usage"]): number => {
    if (!data) return 0;
    return data.usage[limitKey] || 0;
  };

  return {
    entitlements: data,
    isLoading,
    isError,
    refetch,
    can,
    limit,
    usage,
    isSoftLocked: data?.isSoftLocked || false,
    planCode: data?.planCode || "PRO",
    planName: data?.planName || "Plano Pro",
  };
}

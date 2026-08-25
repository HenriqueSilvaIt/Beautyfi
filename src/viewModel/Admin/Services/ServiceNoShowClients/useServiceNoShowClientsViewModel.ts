import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { useClientMutation } from "@/shared/queries/company/use.client.mutation";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { ClientInterface } from "@/shared/interfaces/http/client";

export function useServiceNoShowClientsViewModel() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { serviceId } = useLocalSearchParams<{ serviceId: string }>();
  const id = Number(serviceId);

  const { notify } = useSnackbarContext();

  const { useGetCompanyServiceById, serviceUpdateNoShowConfigMutation } =
    useCompanyServicesMutation();
  const { data: service, isLoading: isLoadingService } = useGetCompanyServiceById(id);

  const { useGetClientMutation } = useClientMutation();
  const { data: clientsData, isLoading: isLoadingClients } = useGetClientMutation();

  const allClients: ClientInterface[] = useMemo(() => {
    return (
      clientsData?.pages.flatMap((page: any) => page.content ?? []) ?? []
    );
  }, [clientsData]);

  const [noShowApplyToAll, setNoShowApplyToAll] = useState(true);
  const [selectedClientIds, setSelectedClientIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      setNoShowApplyToAll(service.noShowApplyToAll !== false);
      setSelectedClientIds(service.noShowClientIds ?? []);
    }
  }, [service]);

  const filteredClients = useMemo(() => {
    if (!searchQuery.trim()) return allClients;
    const term = searchQuery.toLowerCase();
    return allClients.filter(
      (c) =>
        c.name?.toLowerCase().includes(term) ||
        c.phone?.includes(term) ||
        c.email?.toLowerCase().includes(term)
    );
  }, [allClients, searchQuery]);

  const allFilteredSelected = useMemo(() => {
    if (filteredClients.length === 0) return false;
    return filteredClients.every((c) => c.id && selectedClientIds.includes(c.id));
  }, [filteredClients, selectedClientIds]);

  function handleToggleClient(clientId?: number) {
    if (!clientId) return;
    setSelectedClientIds((prev) => {
      if (prev.includes(clientId)) {
        return prev.filter((i) => i !== clientId);
      } else {
        return [...prev, clientId];
      }
    });
  }

  function handleToggleSelectAll() {
    if (allFilteredSelected) {
      const filteredIds = new Set(filteredClients.map((c) => c.id).filter(Boolean));
      setSelectedClientIds((prev) => prev.filter((id) => !filteredIds.has(id)));
    } else {
      const filteredIds = filteredClients.map((c) => c.id).filter((id): id is number => Boolean(id));
      setSelectedClientIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  }

  async function handleSave() {
    if (!id) return;
    try {
      setIsSubmitting(true);
      await serviceUpdateNoShowConfigMutation.mutateAsync({
        serviceId: id,
        dto: {
          noShowApplyToAll,
          clientIds: selectedClientIds,
        },
      });
      notify({ message: "Regra de No-Show atualizada com sucesso!", type: "SUCCESS" });
      router.back();
    } catch (error) {
      console.error(error);
      notify({ message: "Erro ao atualizar regra de No-Show.", type: "ERROR" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    router,
    insets,
    service,
    isLoadingService,
    isLoadingClients,
    noShowApplyToAll,
    setNoShowApplyToAll,
    selectedClientIds,
    searchQuery,
    setSearchQuery,
    filteredClients,
    allFilteredSelected,
    handleToggleClient,
    handleToggleSelectAll,
    handleSave,
    isSubmitting,
  };
}

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteClientById,
  getClientById,
  getClients,
  postClients,
  updateClients,
  updateClientAnamnesis,
} from "@/shared/services/client.service";
import { ClientInterface } from "@/shared/interfaces/http/client";
import { queryClient } from "../../../../queryClient";
import { CompanyServicesInterface } from "@/shared/interfaces/http/company-services";
import { getServiceById } from "@/shared/services/companyservice.service";

interface UpdateClientsVariables {
  clientId?: number;
  data: ClientInterface;
}
export const clientKeys = {
  detail: (id: number) => ["client", id] as const,
};

export function useClientMutation() {
  function useGetClientById(id: number) {
    return useQuery<ClientInterface>({
      queryKey: clientKeys.detail(id),
      queryFn: () => {
        if (!id) throw new Error("Id is required");
        return getClientById(id);
      },
      enabled: Number.isFinite(id) && id > 0,
      staleTime: 0, // 5 minutos em cache, evita refetch imediato
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }

  function useGetClientMutation(name?: string) {
    return useInfiniteQuery({
      queryKey: ["clients", name],
      queryFn: ({ pageParam = 0 }) => getClients(pageParam, 10, name),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 0, // ✅ sempre considera dado stale — notifica mudanças
      gcTime: 1000 * 60 * 5, // ✅ mantém no cache por 5 min sem refetch desnecessário
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }

  const clientUpdateMutation = useMutation({
    mutationFn: ({ clientId, data }: UpdateClientsVariables) =>
      updateClients(data, clientId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", response.id] });

      queryClient.invalidateQueries({
        queryKey: clientKeys.detail(Number(response.id)), // ✅ invalida o detalhe específico
      });
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const clientPostMutation = useMutation({
    mutationFn: (data: ClientInterface) => postClients(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", response.id] });

      queryClient.invalidateQueries({
        queryKey: clientKeys.detail(Number(response.id)), // ✅ invalida o detalhe específico
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const clientDeleteByIdMutation = useMutation({
    mutationFn: (clientId: number) => deleteClientById(clientId),
    onSuccess: (_, clientId) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["client", clientId] });

      queryClient.invalidateQueries({
        queryKey: clientKeys.detail(clientId), // ✅ limpa o cache do item deletado
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const clientAnamnesisUpdateMutation = useMutation({
    mutationFn: ({ clientId, anamnesisData }: { clientId: number; anamnesisData: any }) =>
      updateClientAnamnesis(clientId, anamnesisData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    clientPostMutation,
    useGetClientById,
    useGetClientMutation,
    clientDeleteByIdMutation,
    clientUpdateMutation,
    clientAnamnesisUpdateMutation,
  };
}

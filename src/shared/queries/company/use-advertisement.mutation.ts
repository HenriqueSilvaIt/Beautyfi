import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteAdvertisementById,
  getAdvertisements,
  getAdvertisementsById,
  postAdvertisements,
  updateAdvertisements,
} from "@/shared/services/advertisement.service";
import {
  AdvertisementCreateDTO,
  AdvertisementInterface,
  AdvertisementUpdateDTO,
} from "@/shared/interfaces/http/advertisement";
import { queryClient } from "../../../../queryClient";

interface UpdateAdvertisementVariables {
  advertisementId?: number;
  data: AdvertisementUpdateDTO;
}

export const advertisementKeys = {
  detail: (id: number) => ["advertisement", id] as const,
};

export function useAdvertisementMutation() {
  function useGetAdvertisementById(id: number) {
    return useQuery<AdvertisementInterface>({
      queryKey: advertisementKeys.detail(id),
      queryFn: () => {
        if (!id) throw new Error("Id is required");
        return getAdvertisementsById(id);
      },
      enabled: Number.isFinite(id) && id > 0,
     staleTime: 0, // 5 minutos em cache, evita refetch imediato
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }

  function useGetAdvertisementsQuery() {
    return useInfiniteQuery({
      queryKey: ["advertisements"],
      queryFn: ({ pageParam = 0 }) => getAdvertisements(pageParam, 10),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos em cache, evita refetch imediato
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }

  const advertisementUpdateMutation = useMutation({
    mutationFn: ({ advertisementId, data }: UpdateAdvertisementVariables) =>
      updateAdvertisements(data, advertisementId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      queryClient.invalidateQueries({
        queryKey: advertisementKeys.detail(Number(response.id)), // ✅ invalida o detalhe específico
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const advertisementPostMutation = useMutation({
    mutationFn: (data: AdvertisementInterface) => postAdvertisements(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      queryClient.invalidateQueries({
        queryKey: advertisementKeys.detail(Number(response.id)), // ✅ invalida o detalhe específico
      });
      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const advertisementDeleteByIdMutation = useMutation({
    mutationFn: (advertisementId: number) =>
      deleteAdvertisementById(advertisementId),
    onSuccess: (_, advertisementId) => {
      queryClient.invalidateQueries({ queryKey: ["advertisements"] });
      queryClient.invalidateQueries({
        queryKey: advertisementKeys.detail(advertisementId),
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    advertisementPostMutation,
    useGetAdvertisementById,
    useGetAdvertisementsQuery,
    advertisementDeleteByIdMutation,
    advertisementUpdateMutation,
  };
}

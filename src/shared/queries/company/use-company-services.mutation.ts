import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteServiceById,
  getServiceById,
  getServices,
  getServicesAvailableInApp,
  getServicesByEmployeeId,
  postServices,
  updateServices,
} from "../../services/companyservice.service";
import {
  CompanyServicesInterface,
  CreateServiceDTO,
} from "@/shared/interfaces/http/company-services";
import { queryClient } from "../../../../queryClient";

interface UpdateServiceVariables {
  serviceId?: number;
  data: CompanyServicesInterface;
}

export const serviceKeys = {
  detail: (id: number) => ["service", id] as const,
};

export function useCompanyServicesMutation() {
  function useGetCompanyServiceById(id: number) {
    return useQuery<CompanyServicesInterface>({
      queryKey: serviceKeys.detail(id),
      queryFn: () => {
        if (!id) throw new Error("Id is required");
        return getServiceById(id);
      },
      enabled: Number.isFinite(id) && id > 0,
      staleTime: 0, // 5 minutos em cache, evita refetch imediato
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }

  function useGetServiceMutation(companyId?: number, name?: string) {
    return useInfiniteQuery({
      queryKey: ["services", companyId, name],
      queryFn: ({ pageParam = 0 }) => getServices(pageParam, 10, name, companyId),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos em cache, evita refetch imediato
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }

  function useGetServiceAvailableInAppMutation(companyId?: number) {
    return useInfiniteQuery({
      queryKey: ["services-available", companyId],
      queryFn: ({ pageParam = 0 }) => getServicesAvailableInApp(pageParam, 50, companyId),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  }

  const serviceGetByEmployeeIdMutation = useMutation({
    mutationFn: (id: number) => getServicesByEmployeeId(id),
    onSuccess: (response) => {},
    onError: (error) => {
      console.error(error);
    },
  });

  const serviceUpdateMutation = useMutation({
    mutationFn: ({ serviceId, data }: UpdateServiceVariables) =>
      updateServices(data, serviceId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({
        queryKey: serviceKeys.detail(Number(response.id)), // ✅ invalida o detalhe específico
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const servicePostMutation = useMutation({
    mutationFn: (data: CreateServiceDTO) => postServices(data),
    onSuccess: (response) => {
      console.log(response);
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({
        queryKey: serviceKeys.detail(Number(response.id)), // ✅ invalida o detalhe específico
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const serviceDeleteByIdMutation = useMutation({
    mutationFn: (serviceId: number) => deleteServiceById(serviceId),
    onSuccess: (_, serviceId) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({
        queryKey: serviceKeys.detail(serviceId), // ✅ limpa o cache do item deletado
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    servicePostMutation,
    useGetCompanyServiceById,
    serviceGetByEmployeeIdMutation,
    useGetServiceMutation,
    useGetServiceAvailableInAppMutation,
    serviceDeleteByIdMutation,
    serviceUpdateMutation,
  };
}

import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  companyDetails,
  createCompany,
  fetchCompanies,
  getCompanyById,
  updateCompany,
  updateReminderConfig,
  toggleFavoriteCompany,
  getFavoritedCompanyIds,
  fetchCompanyCategories,
  fetchNearbyCompanies,
} from "../../services/company.service";
import { CompanyInterface } from "@/shared/interfaces/http/company";
import { queryClient } from "../../../../queryClient";

export function useCompanyDetailsMutation() {
  const mutation = useMutation({
    mutationFn: (id: number | void) => companyDetails(id || undefined),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const getCompanyByIdMutation = useMutation({
    mutationFn: (id: number) => getCompanyById(id),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const mutationCreate = useMutation({
    mutationFn: (props: CompanyInterface) => createCompany(props),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  function useGetCompaniesQuery(name?: string) {
    return useInfiniteQuery({
      queryKey: ["companies", name],
      queryFn: ({ pageParam = 0 }) => fetchCompanies(pageParam, 10, name),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
    });
  }

  function useGetNearbyCompaniesQuery(latitude: number | null, longitude: number | null, radius: number, enabled: boolean) {
    return useQuery({
      queryKey: ["companies-nearby", latitude, longitude, radius],
      queryFn: () => {
        if (latitude === null || longitude === null) throw new Error("Coords required");
        return fetchNearbyCompanies(latitude, longitude, radius);
      },
      enabled: enabled && latitude !== null && longitude !== null,
      staleTime: 0,
    });
  }

  function useGetCompanyByIdQuery(id?: number) {
    return useQuery({
      queryKey: ["company", id],
      queryFn: () => {
        if (!id) throw new Error("Id is required");
        return getCompanyById(id);
      },
      enabled: !!id,
    });
  }

  function useGetCompanyDetailsQuery(id?: number) {
    return useQuery({
      queryKey: ["company-details", id],
      queryFn: () => companyDetails(id),
    });
  }

  const mutationUpdate = useMutation({
    mutationFn: (props: CompanyInterface) => updateCompany(props),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const updateReminderConfigMutation = useMutation({
    mutationFn: (dto: {
      reminderEnabled?: boolean;
      reminderMinutesBefore?: number;
    }) => updateReminderConfig(dto),
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: ({ companyId, isFavorite }: { companyId: number; isFavorite: boolean }) =>
      toggleFavoriteCompany(companyId, isFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorited-ids"] });
    },
  });

  function useGetFavoritedIdsQuery(enabled: boolean) {
    return useQuery({
      queryKey: ["favorited-ids"],
      queryFn: getFavoritedCompanyIds,
      enabled: enabled,
    });
  }

  function useGetCompanyCategoriesQuery() {
    return useQuery({
      queryKey: ["company-categories"],
      queryFn: fetchCompanyCategories,
    });
  }

  return {
    mutation,
    mutationUpdate,
    getCompanyByIdMutation,
    updateReminderConfigMutation,
    mutationCreate,
    useGetCompaniesQuery,
    useGetNearbyCompaniesQuery,
    useGetCompanyByIdQuery,
    useGetCompanyDetailsQuery,
    toggleFavoriteMutation,
    useGetFavoritedIdsQuery,
    useGetCompanyCategoriesQuery,
  };
}

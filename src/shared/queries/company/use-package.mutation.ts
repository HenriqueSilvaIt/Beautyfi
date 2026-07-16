import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  deletePackageById,
  getPackageById,
  getPackages,
  postPackage,
  updatePackage,
} from "@/shared/services/package.service";
import { PackageInterface } from "@/shared/interfaces/http/package";
import { queryClient } from "../../../../queryClient";

interface UpdatePackageVariables {
  packageId: number;
  dataBody: PackageInterface;
}

export const packageKeys = {
  detail: (id: number) => ["package", id] as const,
};

export function usePackageMutation() {
  function useGetPackageById(id: number) {
    return useQuery({
      queryKey: packageKeys.detail(id),
      queryFn: () => {
        if (!id) throw new Error("Id is required");
        return getPackageById(id);
      },
      enabled: Number.isFinite(id) && id > 0,
      staleTime: 0,
      refetchOnWindowFocus: false,
    });
  }

  function useGetPackagesMutation(companyId?: number, name?: string) {
    return useInfiniteQuery({
      queryKey: ["packages", companyId, name],
      queryFn: ({ pageParam = 0 }) =>
        getPackages(pageParam as number, 10, name, companyId),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  }

  const packageUpdateMutation = useMutation({
    mutationFn: ({ packageId, dataBody }: UpdatePackageVariables) =>
      updatePackage(dataBody, packageId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["package", response.id] });
      queryClient.invalidateQueries({
        queryKey: packageKeys.detail(Number(response?.id)),
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const packagePostMutation = useMutation({
    mutationFn: (data: PackageInterface) => postPackage(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["package", response.id] });
      queryClient.invalidateQueries({
        queryKey: packageKeys.detail(Number(response.id)),
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const packageDeleteByIdMutation = useMutation({
    mutationFn: (packageId: number) => deletePackageById(packageId),
    onSuccess: (_, packageId) => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
      queryClient.invalidateQueries({ queryKey: ["package", packageId] });
      queryClient.invalidateQueries({
        queryKey: packageKeys.detail(packageId),
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    packagePostMutation,
    useGetPackageById,
    useGetPackagesMutation,
    packageDeleteByIdMutation,
    packageUpdateMutation,
  };
}

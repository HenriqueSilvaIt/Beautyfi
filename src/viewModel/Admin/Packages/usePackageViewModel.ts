import { useFormContext } from "react-hook-form";
import { PackageFormData } from "./package.scheme";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useCompanyStore } from "@/shared/store/company-store";
import { useUserStore } from "@/shared/store/user-store";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { packageKeys, usePackageMutation } from "@/shared/queries/company/use-package.mutation";
import { PackageInterface } from "@/shared/interfaces/http/package";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { parseMoney, parseQuantity } from "@/utils/moneyMapper";
import { queryClient } from "../../../../queryClient";

export function usePackageViewModel(packageId: number | undefined) {
  const isEditMode = Number.isFinite(packageId) && packageId !== undefined;
  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useSnackbarContext();
  const { handleError } = useErrorHandler();

  // Search with debounce
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchValue), 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const currentUser = useUserStore.getState().user;
  const selectedCompanyId = useCompanyStore.getState().selectedCompanyId;
  const currentCompanyId = currentUser?.companyId ?? selectedCompanyId ?? undefined;

  const {
    useGetPackageById,
    useGetPackagesMutation,
    packagePostMutation,
    packageUpdateMutation,
    packageDeleteByIdMutation,
  } = usePackageMutation();

  // List of packages (paginated)
  const {
    data: packageData,
    isLoading: packagesIsLoading,
    refetch: packageRefetch,
    fetchNextPage: packageFetchNextPage,
    hasNextPage: packageHasNextPage,
    isFetchingNextPage: packageIsFetchingNextPage,
    isRefetching: packageIsRefetching,
  } = useGetPackagesMutation(currentCompanyId, debouncedSearch);

  const packageDataPagged =
    packageData?.pages.flatMap((page) => page.content ?? []) ?? [];

  // Single package for edit
  const { data: packageContent } = useGetPackageById(
    isEditMode && packageId ? packageId : 0,
  );

  const { control, handleSubmit, reset } = useFormContext<PackageFormData>();

  // Prepopulate form in edit mode
  useEffect(() => {
    if (isEditMode && packageContent) {
      reset({
        name: packageContent.name,
        price: String(packageContent.price ?? ""),
        duration: String(packageContent.duration ?? ""),
        description: packageContent.description ?? "",
        servicesIncluded: packageContent.items
          ?.map((i) => i.serviceName ?? i.serviceId)
          .join(", ") ?? "",
        imgUrl: packageContent.imgUrl ?? "",
      });
    } else if (!isEditMode) {
      reset({
        name: "",
        price: "",
        duration: "",
        description: "",
        servicesIncluded: "",
        imgUrl: "",
      });
    }
  }, [packageId, packageContent, isEditMode]);

  const onSubmit = handleSubmit(async (formData) => {
    setIsLoading(true);
    try {
      const payload: PackageInterface = {
        name: formData.name,
        description: formData.description ?? "",
        price: parseMoney(formData.price ?? ""),
        duration: parseInt(formData.duration ?? "0", 10) || 0,
        imgUrl: formData.imgUrl ?? "",
        availableInApp: true,
        companyId: currentCompanyId,
        // items are managed separately via the relational editor
        items: [],
      };

      if (isEditMode && packageId) {
        await packageUpdateMutation.mutateAsync({
          packageId,
          dataBody: payload,
        });
        notify({ message: "Pacote atualizado com sucesso!", type: "SUCCESS" });
      } else {
        await packagePostMutation.mutateAsync(payload);
        notify({ message: "Pacote criado com sucesso!", type: "SUCCESS" });
      }
      await packageRefetch();
      router.back();
    } catch (err) {
      handleError(err, "Erro ao salvar pacote");
    } finally {
      setIsLoading(false);
    }
  });

  const onPackageDelete = async () => {
    if (!isEditMode || !packageId) return;
    try {
      setIsLoading(true);
      await packageDeleteByIdMutation.mutateAsync(packageId);
      notify({ message: "Pacote excluído com sucesso!", type: "SUCCESS" });
      router.back();
    } catch (err) {
      handleError(err, "Erro ao excluir pacote");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    control,
    onSubmit,
    isEditMode,
    packageContent,
    packageId,
    isLoading,
    onPackageDelete,
    packages: packageDataPagged,
    packagesIsLoading,
    packageRefetch,
    packageFetchNextPage,
    packageHasNextPage,
    packageIsFetchingNextPage,
    packageIsRefetching,
    searchValue,
    setSearchValue,
  };
}

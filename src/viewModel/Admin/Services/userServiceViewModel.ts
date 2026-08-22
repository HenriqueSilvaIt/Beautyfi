import { useFormContext } from "react-hook-form";
import { ServiceFormData, serviceScheme } from "./service.scheme";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { useEffect, useRef, useState } from "react";
import {
  CompanyServicesInterface,
  CompanyServicesProps,
} from "@/shared/interfaces/http/company-services";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { router } from "expo-router";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { CameraType } from "expo-image-picker";
import { useImage } from "@/shared/hooks/useImage";
import { useUploadAvatarGenericMutation } from "@/shared/queries/company/use-uploadAvatar.mutation";
import { parseMoney, parseQuantity } from "@/utils/moneyMapper";
import { InfiniteData } from "@tanstack/react-query";
import { queryClient } from "../../../../queryClient";
import { ServiceEmployeeParam } from "@/shared/interfaces/http/employee";

import { useCompanyStore } from "@/shared/store/company-store";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";

export function useServiceViewModel(serviceId: number | undefined) {
  const isEditMode = Number.isFinite(serviceId);

  const { handleError } = useErrorHandler();

  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useSnackbarContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [availableInApp, setAvailableInApp] = useState(false);
  const [requiresDeposit, setRequiresDeposit] = useState(false);
  const [depositType, setDepositType] = useState<"PERCENTAGE" | "FIXED">("FIXED");
  const [isStripeModalVisible, setIsStripeModalVisible] = useState(false);

  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const user = useUserStore((state) => state.user);
  const companyId = selectedCompanyId ?? user?.companyId;

  const { useGetCompanyDetailsQuery } = useCompanyDetailsMutation();
  const { data: companyDetails } = useGetCompanyDetailsQuery(companyId ? Number(companyId) : undefined);

  const hasStripeConnected = Boolean(
    companyDetails?.stripeAccountId && companyDetails.stripeAccountId.trim().length > 0,
  );

  function handleToggleRequiresDeposit() {
    if (!requiresDeposit) {
      if (!hasStripeConnected) {
        setIsStripeModalVisible(true);
        return;
      }
    }
    setRequiresDeposit((prev) => !prev);
  }

  // Estado para armazenar o caminho da imagem que selecionaros ou tirarmos foto
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const uploadServiceAvatarMutation =
    useUploadAvatarGenericMutation<CompanyServicesInterface>();

  const {
    serviceUpdateMutation,
    useGetServiceMutation,
    useGetCompanyServiceById,
    servicePostMutation,
    serviceDeleteByIdMutation,
  } = useCompanyServicesMutation();

  const { data: serviceContent } = useGetCompanyServiceById(Number(serviceId));

  // Search states for debounce
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const {
    data: services,
    error: serviceError,
    refetch: serviceRefetch,
    isFetchingNextPage: serviceIsFetchingNextPage,
    hasNextPage: serviceHasNextPage,
    fetchNextPage: serviceFetchNextPage,
    isRefetching: serviceIsRefetching,
  } = useGetServiceMutation(undefined, debouncedSearch);

  const serviceDataPagged =
    services?.pages.flatMap((page) => page.content ?? []) ?? [];
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ServiceFormData>();

  const hasUserToggled = useRef(false);

  function handleToggleAvailableInApp() {
    hasUserToggled.current = true;
    setAvailableInApp((prev) => !prev);
  }

  const onServiceUpdate = handleSubmit(async (serviceData) => {
    try {
      setIsLoading(true);

      if (!serviceId) return;

      const updateService: CompanyServicesInterface = {
        name: serviceData.name,
        duration: parseQuantity(serviceData.duration ?? "") ?? 0,
        price: parseMoney(serviceData.price) ?? 0,
        commissionServiceFee: parseMoney(
          serviceData.commissionServiceFee ?? "",
        ),
        requiresDeposit: requiresDeposit,
        depositType: depositType,
        depositAmount: parseMoney(serviceData.depositAmount ?? ""),
        availableInApp: availableInApp,
        imgUrl: serviceData.imgUrl ?? "",
        priceDescription: serviceData.priceDescription ?? "",
        employees: (serviceData.employees as ServiceEmployeeParam[]) ?? undefined,
        description: serviceData.description ?? "",
      };
      const response = await serviceUpdateMutation.mutateAsync({
        serviceId: serviceId,
        data: updateService,
      });

      const updatedItem: CompanyServicesInterface = response;

      notify({ message: "Serviço atualizado com sucesso!", type: "SUCCESS" });

      queryClient.setQueryData(
        ["services"],
        (oldData?: InfiniteData<{ content: CompanyServicesProps[] }>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              content: page.content.map((item) =>
                item.id === updatedItem.id ? updatedItem : item,
              ),
            })),
          };
        },
      );

      router.back();
    } catch (error) {
      handleError(error, "Falha ao atualizar serviço");
    } finally {
      setIsLoading(false);
    }
  });

  const { handleSelectImage } = useImage({
    callback: async (uri) => {
      setAvatarUri(uri);
    },
    cameraType: CameraType.front,
  });

  async function handleSelectAvatar() {
    await handleSelectImage();
  }

  const onSubmit = handleSubmit(
    async (serviceData) => {
      try {
        setIsLoading(true);

        let finalServiceId = serviceId;

        if (isEditMode && serviceId) {
          const updateService: CompanyServicesInterface = {
            name: serviceData.name,
            duration: parseQuantity(serviceData.duration ?? "") ?? 0,
            price: parseMoney(serviceData.price) ?? 0,
            commissionServiceFee: parseMoney(serviceData.commissionServiceFee ?? ""),
            requiresDeposit: requiresDeposit,
            depositType: depositType,
            depositAmount: parseMoney(serviceData.depositAmount ?? ""),
            imgUrl: avatarUri ?? serviceData.imgUrl ?? "",
            employees: (serviceData.employees as ServiceEmployeeParam[]) ?? undefined,
            availableInApp: availableInApp,
            priceDescription: serviceData.priceDescription ?? "",
            description: serviceData.description ?? "",
          };

          const updatedService = await serviceUpdateMutation.mutateAsync({
            serviceId,
            data: updateService,
          });

          finalServiceId = updatedService.id;
        } else {
          const payload: CompanyServicesInterface = {
            name: serviceData?.name,
            price: parseMoney(serviceData.price) ?? 0,
            imgUrl: avatarUri ?? serviceData.imgUrl ?? "",
            duration: parseQuantity(serviceData.duration ?? "") ?? 0,
            commissionServiceFee: parseMoney(
              serviceData.commissionServiceFee ?? "",
            ),
            requiresDeposit: requiresDeposit,
            depositType: depositType,
            depositAmount: parseMoney(serviceData.depositAmount ?? ""),
            employees: (serviceData.employees as ServiceEmployeeParam[]) ?? undefined,
            availableInApp: availableInApp,
            priceDescription: serviceData.priceDescription ?? "",
            description: serviceData.description ?? "",
          };
          const createdService = await servicePostMutation.mutateAsync(payload);
          finalServiceId = createdService.id;
        }

        // 2️⃣ Se trocou a imagem, faz upload agora
        if (avatarUri && finalServiceId) {
          setIsUploadingAvatar(true);

          await uploadServiceAvatarMutation.mutateAsync({
            segment: "services",
            avatarUri: avatarUri,
            id: finalServiceId,
          });

          setIsUploadingAvatar(false);
        }

        notify({
          message: isEditMode
            ? "Serviço atualizado com sucesso!"
            : "Serviço criado com sucesso!",
          type: "SUCCESS",
        });

        await queryClient.invalidateQueries({ queryKey: ["services"] });
        if (finalServiceId) {
          await queryClient.invalidateQueries({ queryKey: ["service", finalServiceId] });
        }
        await serviceRefetch();
        router.back();
      } catch (error) {
        handleError(error, "Falha ao criar ou atualizar serviço");
      } finally {
        setIsLoading(false);
      }
    },
    (errors) => {
      console.log("Validation errors on service submission:", errors);
      const firstError = Object.values(errors)[0]?.message;
      notify({
        message: firstError ? String(firstError) : "Preencha todos os campos obrigatórios",
        type: "WARNING",
      });
    }
  );
  // Função para deletar serviço

  async function onServiceDelete(serviceId: number) {
    try {
      setIsLoading(true);
      if (serviceId) {
        await serviceDeleteByIdMutation.mutateAsync(serviceId);

        notify({
          message: "Serviço deletado com sucesso",
          type: "SUCCESS",
        });
        await serviceRefetch();
        router.back();
      } else {
        notify({
          message: "Falha ao deletar serviço",
          type: "ERROR",
        });
        console.log(`Serviço não existe`);
      }
    } catch (error) {
      handleError(error, "Falha ao deletar serviço");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isEditMode || !serviceContent) return;

    reset({
      name: serviceContent.name,
      description: serviceContent.description ?? "",
      duration: String(serviceContent.duration ?? ""),
      priceDescription: serviceContent.priceDescription ?? "",
      imgUrl: avatarUri ?? serviceContent.imgUrl,
      employees: serviceContent.employees,
      price: serviceContent.price != null ? String(serviceContent.price) : "",
      commissionServiceFee: serviceContent.commissionServiceFee != null ? String(serviceContent.commissionServiceFee) : "",
      depositAmount: serviceContent.depositAmount != null ? String(serviceContent.depositAmount) : "",
    });

    setRequiresDeposit(Boolean(serviceContent.requiresDeposit));
    setDepositType(serviceContent.depositType === "PERCENTAGE" ? "PERCENTAGE" : "FIXED");

    if (!hasUserToggled.current) {
      setAvailableInApp(Boolean(serviceContent.availableInApp));
    }
  }, [serviceContent]);

  useEffect(() => {
    if (isEditMode) return;

    reset({
      name: "",
      description: "",
      duration: "",
      imgUrl: "",
      commissionServiceFee: "",
      price: "",
      priceDescription: "",
      depositAmount: "",
      employees: [],
    });
    setRequiresDeposit(false);
    setDepositType("FIXED");
  }, [isEditMode]);

  return {
    control,
    onServiceUpdate,
    onSubmit,
    onServiceDelete,
    isRefreshing,
    services,
    isEditMode,
    reset,
    serviceContent,
    serviceId,
    avatarUri,
    handleSelectAvatar,
    isUploadingAvatar,
    serviceDataPagged,
    isLoading,
    serviceError,
    serviceRefetch,
    serviceIsFetchingNextPage,
    serviceHasNextPage,
    serviceFetchNextPage,
    serviceIsRefetching,
    setAvailableInApp,
    availableInApp,
    handleToggleAvailableInApp,
    requiresDeposit,
    setRequiresDeposit,
    handleToggleRequiresDeposit,
    depositType,
    setDepositType,
    searchValue,
    setSearchValue,
    isStripeModalVisible,
    setIsStripeModalVisible,
  };
}

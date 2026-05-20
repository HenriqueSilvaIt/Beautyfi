import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import {
  NewSubscriptionPlanItemsFormData,
  newSubscriptionPlanItemsScheme,
} from "./new-subscription-plan-items-scheme";
import { useAppModal } from "@/shared/hooks/useAppModal";
import { useModalStore } from "@/shared/store/modal-store";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useProductMutation } from "@/shared/queries/company/use-product.mutation";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { ProductInterface } from "@/shared/interfaces/http/product";
import { CompanyServicesInterface } from "@/shared/interfaces/http/company-services";
import { router } from "expo-router";
import { useStripeMutation } from "@/shared/queries/stripe/use-stripe-mutataion";
import { EStripePlanItemType, StripePlanItemDTO, StriplePlanItemInserParams } from "@/shared/interfaces/http/stripe";
import { DAYS_WEEK, EDayWeek } from "@/shared/interfaces/http/employee";
import { usePlanStore } from "@/shared/store/plan-store";

export function useNewSubscriptionPlanItemsViewModel(plansId?: number) {
 
 
  const { control, reset, handleSubmit, setValue } =
    useForm<NewSubscriptionPlanItemsFormData>({
      resolver: yupResolver(
        newSubscriptionPlanItemsScheme,
      ) as unknown as Resolver<NewSubscriptionPlanItemsFormData>,
      defaultValues: {
        weekDays: [],
      },
    });

  const [typeServiceSelector, setTypeServiceSelector] = useState(false);
  const [type, setType] = useState<EStripePlanItemType>(EStripePlanItemType.PRODUCT);
  const [isListLoading, setIsListLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();
  const [isItemLoading, setIsItemLoading] = useState(false);

  const [product, setProduct] = useState<ProductInterface>();
  const [service, setService] = useState<CompanyServicesInterface>();
  const [selectedWeekDays, setSelectedWeekDays] = useState<EDayWeek[]>([]);


  const modal = useAppModal();
  const { close } = useModalStore();


      const {
        useGetPlanItemsByPlanIdQuery,
        addItemToPlanMutation,
      } = useStripeMutation();

      const {refetch: refetchItems } = useGetPlanItemsByPlanIdQuery();
  const { useGetProductsMutation } = useProductMutation();
  const {
    data: productData,
    error,
    refetch,
    isRefetching,
    isLoading,
  } = useGetProductsMutation();
  const productDataPagged =
    productData?.pages.flatMap((pages) => pages.content ?? []) ?? [];

  const { useGetServiceMutation } = useCompanyServicesMutation();
  const {
    data: serviceData,
    error: serviceError,
    refetch: serviceRefetch,
    isFetchingNextPage,
    isRefetching: serviceIsRefetching,
    isLoading: serviceIsLoading,
  } = useGetServiceMutation();
  const servicesDataPagged =
    serviceData?.pages.flatMap((page) => page.content) ?? [];
const { planId } = usePlanStore();
  const [serviceIsSelected, setServiceIsSelected] = useState(false);
  const [isProductSelected, setIsProductSelected] = useState(false);

  function handleServiceSelector() {
    setTypeServiceSelector(true);
    setType(EStripePlanItemType.SERVICE);
  }

  function handleProductOwner() {
    setTypeServiceSelector(false);
    setType(EStripePlanItemType.PRODUCT);
  }

  async function handleOpenProductList() {
    try {
      setIsListLoading(true);

   
      const formatted = productDataPagged.map((s) => ({
        id: s.id,
        title: s.name,
        description: s.description,
        imgUrl: s.imgUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,
        getList: refetch,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = productDataPagged.find((c) => c.id === item.id);

          console.log("Product item" + selected);
          if (!selected) return;
          setProduct(selected);
          setIsProductSelected(true);
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
    }
  }

  async function handleOpenServiceList() {
    try {
      setIsListLoading(true);

      const formatted = servicesDataPagged.map((s) => ({
        id: s.id,
        title: s.name,
        description: s.description,
        imgUrl: s.imgUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,
        getList: refetch,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = servicesDataPagged.find((c) => c.id === item.id);
          if (!selected) return;
          setService(selected);
          setServiceIsSelected(true);

          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
    }
  }

  function handleToggleWeekDay(day: EDayWeek) {
    const nextSelection = selectedWeekDays.includes(day)
      ? selectedWeekDays.filter((current) => current !== day)
      : [...selectedWeekDays, day];

    setSelectedWeekDays(nextSelection);
    setValue("weekDays", nextSelection, { shouldValidate: true });
  }

  const   onAddItemToPlan = handleSubmit(async (itemData) => {
    try {
      setIsItemLoading(true);


        const serviceParams: StriplePlanItemInserParams = {
        serviceId: service?.id ? Number(service?.id) : undefined,
        type: type,
        cutsAllowed: Number(itemData.cutsAllowed) || 0,
        discountPercentage: Number(itemData.discountPercentage) || 0,
        weekDays: itemData.weekDays ?? [],
      };

      const productParams: StriplePlanItemInserParams = {
        productId: product?.id ? Number(product?.id) : undefined,
        type: type,
        cutsAllowed: Number(itemData.cutsAllowed) || 0,
        discountPercentage: Number(itemData.discountPercentage) || 0,
      };

      console.log("Params to send", type === EStripePlanItemType.PRODUCT ? productParams : serviceParams);
      await addItemToPlanMutation.mutateAsync({
        planId: Number(planId),
        dataBody: type === EStripePlanItemType.PRODUCT ? productParams : serviceParams,
      });
      setService(undefined);
      await refetchItems();
      notify({
        message: "Item adicionado com sucesso!",
        type: "SUCCESS",
      });
      router.back();
    } catch (error) {
 
      handleError(error, "Falha ao adicionar item ao plano");
      console.log("Error details:", error);
    } finally {
      setIsItemLoading(false);
    }
});



  return {
    handleProductOwner,
    onAddItemToPlan,
    handleServiceSelector,
    typeServiceSelector,
    control,
    handleSubmit,
    setValue,
    product,
    service,
    handleOpenProductList,
    handleOpenServiceList,
    isListLoading,
    isItemLoading,
    selectedWeekDays,
    handleToggleWeekDay,
  };
}

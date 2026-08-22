import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { useProductMutation } from "@/shared/queries/company/use-product.mutation";
import { useLoyaltyMutation, LoyaltyRewardItem } from "@/shared/queries/company/use-loyalty.mutation";
import { useCompanyStore } from "@/shared/store/company-store";
import { useUserStore } from "@/shared/store/user-store";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface LoyaltyFormData {
  loyaltyActive: boolean;
  loyaltyPointsPerReal: string;
  loyaltyMinPoints: string;
  loyaltyRewardValue: string;
  loyaltyRewardDescription: string;
  loyaltyRuleDescription: string;
}

export function useLoyaltyViewModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);

  // Form states for new item
  const [itemType, setItemType] = useState<"SERVICE" | "PRODUCT" | "CUSTOM">("SERVICE");
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>();
  const [itemTitle, setItemTitle] = useState("");
  const [itemPoints, setItemPoints] = useState("100");
  const [itemDescription, setItemDescription] = useState("");

  const { notify } = useSnackbarContext();
  const { handleError } = useErrorHandler();

  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const user = useUserStore((state) => state.user);
  const companyId = selectedCompanyId ?? user?.companyId;

  const { useGetCompanyDetailsQuery, companyUpdateMutation } = useCompanyDetailsMutation();
  const { data: companyDetails, isLoading: isCompanyLoading, refetch } =
    useGetCompanyDetailsQuery(companyId ? Number(companyId) : undefined);

  const { useGetServiceAvailableInAppMutation } = useCompanyServicesMutation();
  const { data: serviceData } = useGetServiceAvailableInAppMutation(companyId ? Number(companyId) : undefined);
  const servicesList = serviceData?.pages.flatMap((p) => p.content ?? []) ?? [];

  const { useGetProductsMutation } = useProductMutation();
  const { data: productData } = useGetProductsMutation(companyId ? Number(companyId) : undefined, "");
  const productsList = productData?.pages.flatMap((p) => p.content ?? []) ?? [];

  const { useGetActiveProgramQuery, saveProgramMutation, addItemMutation, deleteItemMutation } = useLoyaltyMutation();
  const { data: activeProgram, refetch: refetchProgram } = useGetActiveProgramQuery(companyId ? Number(companyId) : undefined);

  const { control, handleSubmit, reset, watch, setValue } = useForm<LoyaltyFormData>({
    defaultValues: {
      loyaltyActive: false,
      loyaltyPointsPerReal: "",
      loyaltyMinPoints: "",
      loyaltyRewardValue: "",
      loyaltyRewardDescription: "",
      loyaltyRuleDescription: "",
    },
  });

  const loyaltyActive = watch("loyaltyActive");

  useEffect(() => {
    if (!companyDetails) return;

    reset({
      loyaltyActive: Boolean(companyDetails.loyaltyActive),
      loyaltyPointsPerReal: companyDetails.loyaltyPointsPerReal != null ? String(companyDetails.loyaltyPointsPerReal) : "",
      loyaltyMinPoints: companyDetails.loyaltyMinPoints != null ? String(companyDetails.loyaltyMinPoints) : "",
      loyaltyRewardValue: companyDetails.loyaltyRewardValue != null ? String(companyDetails.loyaltyRewardValue) : "",
      loyaltyRewardDescription: companyDetails.loyaltyRewardDescription ?? "",
      loyaltyRuleDescription: companyDetails.loyaltyRuleDescription ?? "",
    });
  }, [companyDetails]);

  const handleAddItem = async () => {
    if (!companyId) return;

    let titleToSave = itemTitle.trim();
    if (itemType === "SERVICE" && selectedServiceId) {
      const srv = servicesList.find((s) => s.id === selectedServiceId);
      if (srv && !titleToSave) titleToSave = srv.name;
    } else if (itemType === "PRODUCT" && selectedProductId) {
      const prod = productsList.find((p) => p.id === selectedProductId);
      if (prod && !titleToSave) titleToSave = prod.name;
    }

    if (!titleToSave) {
      notify({ message: "Selecione um serviço/produto ou digite o título da recompensa.", type: "ERROR" });
      return;
    }

    const pointsNum = parseInt(itemPoints, 10);
    if (isNaN(pointsNum) || pointsNum <= 0) {
      notify({ message: "Informe uma pontuação válida.", type: "ERROR" });
      return;
    }

    try {
      setIsLoading(true);

      // Garante que existe o programa
      let programId = activeProgram?.id;
      if (!programId) {
        const savedProg = await saveProgramMutation.mutateAsync({
          companyId: Number(companyId),
          dataBody: {
            name: "Programa de Fidelidade",
            active: true,
            pointsPerReal: 1.0,
            minPointsToRedeem: 100,
          },
        });
        programId = savedProg.id;
      }

      if (programId) {
        await addItemMutation.mutateAsync({
          programId,
          item: {
            title: titleToSave,
            pointsRequired: pointsNum,
            itemType,
            serviceId: itemType === "SERVICE" ? selectedServiceId : undefined,
            productId: itemType === "PRODUCT" ? selectedProductId : undefined,
            description: itemDescription.trim(),
          },
        });

        notify({ message: "Item de recompensa adicionado!", type: "SUCCESS" });
        setShowItemModal(false);
        setItemTitle("");
        setItemPoints("100");
        setItemDescription("");
        setSelectedServiceId(undefined);
        setSelectedProductId(undefined);
        await refetchProgram();
      }
    } catch (error) {
      handleError(error, "Erro ao adicionar item de recompensa");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      await deleteItemMutation.mutateAsync(itemId);
      notify({ message: "Item removido com sucesso!", type: "SUCCESS" });
      await refetchProgram();
    } catch (error) {
      handleError(error, "Erro ao remover item");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = handleSubmit(async (formData) => {
    if (!companyId) {
      notify({ message: "ID da empresa não encontrado.", type: "ERROR" });
      return;
    }

    try {
      setIsLoading(true);

      const payload: any = {
        name: "Programa de Fidelidade",
        active: formData.loyaltyActive,
        pointsPerReal: parseFloat(formData.loyaltyPointsPerReal.replace(",", ".")) || 1.0,
        minPointsToRedeem: parseInt(formData.loyaltyMinPoints, 10) || 100,
        rewardValue: parseFloat(formData.loyaltyRewardValue.replace(",", ".")) || 15.0,
        rewardDescription: formData.loyaltyRewardDescription.trim(),
        ruleDescription: formData.loyaltyRuleDescription.trim(),
      };

      await saveProgramMutation.mutateAsync({
        companyId: Number(companyId),
        dataBody: payload,
      });

      await companyUpdateMutation.mutateAsync({
        id: Number(companyId),
        dataBody: {
          loyaltyActive: formData.loyaltyActive,
          loyaltyPointsPerReal: payload.pointsPerReal,
          loyaltyMinPoints: payload.minPointsToRedeem,
          loyaltyRewardValue: payload.rewardValue,
          loyaltyRewardDescription: payload.rewardDescription,
          loyaltyRuleDescription: payload.ruleDescription,
        },
      });

      notify({
        message: "Programa de Fidelidade atualizado com sucesso!",
        type: "SUCCESS",
      });

      await refetch();
      await refetchProgram();
      router.back();
    } catch (error) {
      handleError(error, "Falha ao salvar configurações do Programa de Fidelidade");
    } finally {
      setIsLoading(false);
    }
  });

  return {
    control,
    onSubmit,
    isLoading: isLoading || isCompanyLoading,
    loyaltyActive,
    setValue,
    companyDetails,
    activeProgram,
    itemsList: activeProgram?.items ?? [],
    showItemModal,
    setShowItemModal,
    itemType,
    setItemType,
    selectedServiceId,
    setSelectedServiceId,
    selectedProductId,
    setSelectedProductId,
    itemTitle,
    setItemTitle,
    itemPoints,
    setItemPoints,
    itemDescription,
    setItemDescription,
    servicesList,
    productsList,
    handleAddItem,
    handleDeleteItem,
  };
}

import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { useProductMutation } from "@/shared/queries/company/use-product.mutation";
import { useLoyaltyMutation } from "@/shared/queries/company/use-loyalty.mutation";
import { useCompanyStore } from "@/shared/store/company-store";
import { useUserStore } from "@/shared/store/user-store";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface LoyaltyFormData {
  loyaltyActive: boolean;
  loyaltyPointsPerReal: string;
  loyaltyAmountPerPoint: string;
  loyaltyRuleDescription: string;
  // Cartão Fidelidade por Serviço (Carimbos)
  stampActive: boolean;
  stampServiceId?: number;
  stampRequiredCount: string;
  stampStartDate: string;
  stampEndDate: string;
  stampRewardDescription: string;
}

export function useLoyaltyViewModel() {
  const [isLoading, setIsLoading] = useState(false);

  // Form states for new reward item
  const [itemType, setItemType] = useState<"SERVICE" | "PRODUCT" | "CUSTOM">("SERVICE");
  const [selectedServiceId, setSelectedServiceId] = useState<number | undefined>();
  const [selectedProductId, setSelectedProductId] = useState<number | undefined>();
  const [itemTitle, setItemTitle] = useState("");
  const [itemPoints, setItemPoints] = useState("100");
  const [itemDescription, setItemDescription] = useState("");

  const { notify } = useSnackbarContext();
  const { handleError } = useErrorHandler();
  const { closeBottomSheet } = useBottomSheetContext();

  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const user = useUserStore((state) => state.user);
  const companyId = selectedCompanyId ?? user?.companyId;

  const { useGetCompanyDetailsQuery } = useCompanyDetailsMutation();
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
      loyaltyPointsPerReal: "1.0",
      loyaltyAmountPerPoint: "1.0",
      loyaltyRuleDescription: "",
      stampActive: false,
      stampServiceId: undefined,
      stampRequiredCount: "4",
      stampStartDate: "",
      stampEndDate: "",
      stampRewardDescription: "",
    },
  });

  const loyaltyActive = watch("loyaltyActive");
  const stampActive = watch("stampActive");

  function parseBool(val: any): boolean {
    if (val === true || val === "true" || val === 1 || val === "1") return true;
    return false;
  }

  useEffect(() => {
    if (companyDetails === undefined && activeProgram === undefined) return;

    const isLoyaltyActive =
      activeProgram != null && activeProgram.active !== undefined
        ? parseBool(activeProgram.active)
        : companyDetails != null && companyDetails.loyaltyActive !== undefined
          ? parseBool(companyDetails.loyaltyActive)
          : false;

    const isStampActive =
      activeProgram != null && activeProgram.stampActive !== undefined
        ? parseBool(activeProgram.stampActive)
        : companyDetails != null && (companyDetails as any).stampActive !== undefined
          ? parseBool((companyDetails as any).stampActive)
          : false;

    reset({
      loyaltyActive: isLoyaltyActive,
      loyaltyPointsPerReal:
        activeProgram?.pointsPerReal != null
          ? String(activeProgram.pointsPerReal)
          : companyDetails?.loyaltyPointsPerReal != null
            ? String(companyDetails.loyaltyPointsPerReal)
            : "1.0",
      loyaltyAmountPerPoint:
        activeProgram?.pointsAmountPerPoint != null
          ? String(activeProgram.pointsAmountPerPoint)
          : "1.0",
      loyaltyRuleDescription:
        activeProgram?.ruleDescription ?? companyDetails?.loyaltyRuleDescription ?? "",
      stampActive: isStampActive,
      stampServiceId: activeProgram?.stampServiceId ?? undefined,
      stampRequiredCount:
        activeProgram?.stampRequiredCount != null ? String(activeProgram.stampRequiredCount) : "4",
      stampStartDate: activeProgram?.stampStartDate ? activeProgram.stampStartDate.split("T")[0] : "",
      stampEndDate: activeProgram?.stampEndDate ? activeProgram.stampEndDate.split("T")[0] : "",
      stampRewardDescription: activeProgram?.stampRewardDescription ?? "",
    });
  }, [companyDetails, activeProgram]);

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
      notify({ message: "Informe uma pontuação válida maior que zero.", type: "ERROR" });
      return;
    }

    try {
      setIsLoading(true);

      // Garante que existe o programa ativo no banco sem sobrescrever a preferência do usuário
      let programId = activeProgram?.id;
      if (!programId) {
        const savedProg = await saveProgramMutation.mutateAsync({
          companyId: Number(companyId),
          dataBody: {
            id: activeProgram?.id,
            name: "Programa de Fidelidade VIP",
            active: Boolean(watch("loyaltyActive")),
            pointsPerReal: parseFloat(watch("loyaltyPointsPerReal") || "1.0") || 1.0,
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

        notify({ message: "Item de recompensa adicionado com sucesso!", type: "SUCCESS" });
        closeBottomSheet();
        setItemTitle("");
        setItemPoints("100");
        setItemDescription("");
        setSelectedServiceId(undefined);
        setSelectedProductId(undefined);
        await refetchProgram();
        await refetch();
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
      await refetch();
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

      const ptsPerRealStr = String(formData.loyaltyPointsPerReal || "1.0").replace(",", ".");
      const ptsPerReal = parseFloat(ptsPerRealStr) || 1.0;

      const amtPerPtStr = String(formData.loyaltyAmountPerPoint || "1.0").replace(",", ".");
      const amtPerPt = parseFloat(amtPerPtStr) || 1.0;

      const reqCount = parseInt(formData.stampRequiredCount || "4", 10) || 4;

      const srvName = formData.stampServiceId
        ? servicesList.find((s) => s.id === formData.stampServiceId)?.name
        : undefined;

      const payload: any = {
        id: activeProgram?.id,
        name: "Programa de Fidelidade",
        active: Boolean(formData.loyaltyActive),
        pointsPerReal: ptsPerReal,
        pointsAmountPerPoint: amtPerPt,
        minPointsToRedeem: 100,
        ruleDescription: (formData.loyaltyRuleDescription || "").trim(),

        // Cartão Fidelidade por Serviço (Carimbos)
        stampActive: Boolean(formData.stampActive),
        stampServiceId: formData.stampServiceId,
        stampServiceName: srvName,
        stampRequiredCount: reqCount,
        stampStartDate: formData.stampStartDate ? formData.stampStartDate.trim() : undefined,
        stampEndDate: formData.stampEndDate ? formData.stampEndDate.trim() : undefined,
        stampRewardDescription: (formData.stampRewardDescription || "").trim(),
      };

      await saveProgramMutation.mutateAsync({
        companyId: Number(companyId),
        dataBody: payload,
      });

      await Promise.all([refetchProgram(), refetch()]);

      notify({
        message: "Programa de Fidelidade salvo com sucesso!",
        type: "SUCCESS",
      });

      router.back();
    } catch (error) {
      handleError(error, "Falha ao salvar configurações do Programa de Fidelidade");
    } finally {
      setIsLoading(false);
    }
  });

  return {
    control,
    watch,
    onSubmit,
    isLoading: isLoading || isCompanyLoading,
    loyaltyActive,
    stampActive,
    setValue,
    companyDetails,
    activeProgram,
    itemsList: activeProgram?.items ?? [],
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

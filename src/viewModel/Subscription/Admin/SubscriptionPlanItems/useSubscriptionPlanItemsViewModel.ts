import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useStripeMutation } from "@/shared/queries/stripe/use-stripe-mutataion";
import { useState } from "react";

export function useSubscriptionPlanItemsViewModel(planId?: number) {
  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();

  const [isRemovingItem, setIsRemovingItem] = useState(false);
  const [removeModalVisible, setRemoveModalVisible] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | undefined>();
  const { safePush } = useSafeNavigation();
  const { useGetPlanItemsByPlanIdQuery, removeItemFromPlanMutation } =
    useStripeMutation();

  const {
    data: planItemsData,
    error: planItemsError,
    refetch: planItemsRefetch,
    isRefetching: planItemsIsRefetching,
    fetchNextPage: fetchNextPlanItemsPage,
    isFetchingNextPage: planItemsIsFetchingNextPage,
    hasNextPage: hasNextPlanItemsPage,
    isLoading: planItemsIsLoading,
  } = useGetPlanItemsByPlanIdQuery(planId!);

  async function handleRemoveItemFromPlan(itemId: number) {
    try {
      setIsRemovingItem(true);
      await removeItemFromPlanMutation.mutateAsync({
        planId: planId!,
        itemId,
      });
      notify({
        type: "SUCCESS",
        message: "Item removido do plano com sucesso!",
      });
      planItemsRefetch();
    } catch (error) {
      handleError(
        error,
        "Erro ao remover item do plano. Por favor, tente novamente.",
      );
    } finally {
      setIsRemovingItem(false);
      // Qualquer ação de limpeza, se necessário
    }
  }

  const plantItemsPagged =
    planItemsData?.pages.flatMap((page) => page.content) || [];

 function handleHideModal() {
  setRemoveModalVisible(false)
 }

  return {
    plantItemsPagged,
    planItemsRefetch,
    planItemsError,
    planItemsIsRefetching,
    fetchNextPlanItemsPage,
    handleRemoveItemFromPlan,
    planItemsIsFetchingNextPage,
    hasNextPlanItemsPage,
    planItemsIsLoading,
    safePush,
    selectedItemId,
    setSelectedItemId,
    handleHideModal,
    removeModalVisible,
    isRemovingItem,
    planId,
  };
}

import { useStripeMutation } from "@/shared/queries/stripe/use-stripe-mutataion";

export function useSubscriptionDetailsViewModel(planId?: number) {
  const {
    useGetPlanByIdQuery,
    useGetPlanItemsByPlanIdQuery,
    addItemToPlanMutation,
    removeItemFromPlanMutation,
  } = useStripeMutation();

  const { data: planData ,
    error: planError,   
    refetch: planRefetch,
    isRefetching: planIsRefetching,
  } = useGetPlanByIdQuery(planId!);


  const { data: planItemsData,
    error: planItemsError,
    refetch: planItemsRefetch,
    isRefetching: planItemsIsRefetching,
    fetchNextPage: fetchNextPlanItemsPage,   
    isFetchingNextPage: planItemsIsFetchingNextPage, 
    hasNextPage: hasNextPlanItemsPage,
    isLoading: planItemsIsLoading,


  } = useGetPlanItemsByPlanIdQuery(planId!);

  const plantItemsPagged = planItemsData?.pages.flatMap(page => page.content) || [];

  console.log(planItemsData);
  return {
    planData,
    plantItemsPagged,
    planItemsRefetch,
    planItemsError,
    planItemsIsRefetching,
    fetchNextPlanItemsPage,
    planItemsIsFetchingNextPage,
    hasNextPlanItemsPage,
    planItemsIsLoading,
    planError,
    planRefetch,
  };
}

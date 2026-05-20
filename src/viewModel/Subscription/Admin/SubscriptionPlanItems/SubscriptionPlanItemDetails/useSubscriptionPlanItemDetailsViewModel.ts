import { useStripeMutation } from "@/shared/queries/stripe/use-stripe-mutataion";

export function useSubscriptionPlanItemDetailsViewModel(planItemId?: number) {
  const { data: planItemData } =
    useStripeMutation().useGetItemByIdQuery(planItemId);
  return {
    planItemData,
  };
}

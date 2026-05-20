import { SubscriptionPlanItemsView } from "@/viewModel/Subscription/Admin/SubscriptionPlanItems/SubscriptionPlanItems.view";
import { useSubscriptionPlanItemsViewModel } from "@/viewModel/Subscription/Admin/SubscriptionPlanItems/useSubscriptionPlanItemsViewModel";
import { useLocalSearchParams } from "expo-router";


export default function SubscriptionPlanItemsPage() {


      const { id } = useLocalSearchParams<{ id?: string }>();
    
      const planId = id ? Number(id) : undefined;
    
      const props = useSubscriptionPlanItemsViewModel(planId)

    return (
        <SubscriptionPlanItemsView {...props} />
    )
}
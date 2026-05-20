import { NewSubscriptionPlanItemsView } from "@/viewModel/Subscription/Admin/SubscriptionPlanItems/NewSubscriptionPlanItems/NewSubscriptionPlanItems.view";
import { useNewSubscriptionPlanItemsViewModel } from "@/viewModel/Subscription/Admin/SubscriptionPlanItems/NewSubscriptionPlanItems/useNewSubscriptionPlanItemsViewModel";
import { useLocalSearchParams } from "expo-router";


export default function NewSubscriptionPlanItemsPage() {


      const { id } = useLocalSearchParams<{ id?: string }>();
    
      const planId = id ? Number(id) : undefined;
    
      const props = useNewSubscriptionPlanItemsViewModel(planId)

    return (
        <NewSubscriptionPlanItemsView {...props} />
    )
}
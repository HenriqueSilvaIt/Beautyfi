import { SubscriptionPlanItemDetailsView } from "@/viewModel/Subscription/Admin/SubscriptionPlanItems/SubscriptionPlanItemDetails/SubscriptionPlanItemDetails.view";
import { useSubscriptionPlanItemDetailsViewModel } from "@/viewModel/Subscription/Admin/SubscriptionPlanItems/SubscriptionPlanItemDetails/useSubscriptionPlanItemDetailsViewModel";
import { useLocalSearchParams } from "expo-router";


export default function SubscriptionPlanItemsDetailsPage() {

         const { id } = useLocalSearchParams<{ id?: string }>();

        const planItemId = id ? Number(id) : undefined;

        const props = useSubscriptionPlanItemDetailsViewModel(planItemId) 
    
    return (    

        <SubscriptionPlanItemDetailsView {...props} />
    )   
}
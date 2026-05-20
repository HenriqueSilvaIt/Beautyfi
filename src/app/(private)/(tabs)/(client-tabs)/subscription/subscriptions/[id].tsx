import { SubscriptionDetailsView } from "@/viewModel/Subscription/Client/SubscriptionDetails/SubscriptionDetails.view";
import { useSubscriptionDetailsViewModel } from "@/viewModel/Subscription/Client/SubscriptionDetails/useSubscriptionViewModel";
import { useLocalSearchParams } from "expo-router";
import { useActionState } from "react";

export default function SubscriptionDetails() {

  const { id } = useLocalSearchParams<{ id?: string }>();

  const planId = id ? Number(id) : undefined;

  const props = useSubscriptionDetailsViewModel(planId); 
    return (
      <SubscriptionDetailsView {...props} />
    )
}
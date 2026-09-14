import React from "react";
import { View } from "react-native";
import { useCompanySubscriptionViewModel } from "@/viewModel/Subscription/Company/useCompanySubscriptionViewModel";
import { CompanySubscriptionView } from "@/viewModel/Subscription/Company/CompanySubscription.view";

export default function SubscriptionPage() {
  const props = useCompanySubscriptionViewModel();

  return (
    <View className="flex-1 bg-white">
      <CompanySubscriptionView {...props} />
    </View>
  );
}

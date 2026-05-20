
import { SubscriptionAdminView } from "@/viewModel/Subscription/Admin/SubscriptionAdminView";
import { useSubscriptionAdminViewModel } from "@/viewModel/Subscription/Admin/useSubscriptionAdmin.viewModel";
import {  useLocalSearchParams } from "expo-router";

import { View } from "react-native";

export default function SubscriptionDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const stripePlanId = id ? Number(id) : undefined;

  const props = useSubscriptionAdminViewModel(stripePlanId); 
console.log("ID DA ROTA:", id);
  return (
    <View className="flex-1 bg-background-primary">
      <SubscriptionAdminView {...props} />
    </View>
  );
}

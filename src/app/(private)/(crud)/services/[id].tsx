import { ServiceView } from "@/viewModel/Admin/Services/ServiceView";
import { useServiceViewModel } from "@/viewModel/Admin/Services/userServiceViewModel";
import {  useLocalSearchParams } from "expo-router";

import { View } from "react-native";

export default function ServiceDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const serviceId = id ? Number(id) : undefined;

  const props = useServiceViewModel(serviceId); 

  return (
    <View className="flex-1 bg-background-primary">
      <ServiceView {...props} />
    </View>
  );
}

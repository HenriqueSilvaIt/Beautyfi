import AppDetails from "@/shared/components/AppDetails";
import { ServiceView } from "@/viewModel/Admin/Services/ServiceView";
import { useServiceViewModel } from "@/viewModel/Admin/Services/userServiceViewModel";
import { Text, View } from "react-native";

export default function ServiceCreate() {
  const props = useServiceViewModel(undefined);
  return (
    <View className="flex-1 bg-background-primary">
      <ServiceView {...props} />
    </View>
  );
}

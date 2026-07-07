import { PackageView } from "@/viewModel/Admin/Packages/PackageView";
import { usePackageViewModel } from "@/viewModel/Admin/Packages/usePackageViewModel";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function PackageDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const packageId = id ? Number(id) : undefined;
  const props = usePackageViewModel(packageId);

  return (
    <View className="flex-1 bg-background-primary">
      <PackageView {...props} />
    </View>
  );
}

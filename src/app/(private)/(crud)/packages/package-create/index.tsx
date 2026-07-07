import { PackageView } from "@/viewModel/Admin/Packages/PackageView";
import { usePackageViewModel } from "@/viewModel/Admin/Packages/usePackageViewModel";
import { View } from "react-native";

export default function PackageCreate() {
  const props = usePackageViewModel(undefined);

  return (
    <View className="flex-1 bg-background-primary">
      <PackageView {...props} />
    </View>
  );
}

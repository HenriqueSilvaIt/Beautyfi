import { MenuView } from "@/viewModel/Menu/Menu.view";
import { useMenuViewModel } from "@/viewModel/Menu/useMenu.viewModel";
import { View } from "react-native";

export default function Menu() {
  const props = useMenuViewModel();

  return (
    <View className="flex-1 bg-background-primary">
      <MenuView {...props} />
    </View>
  );
}

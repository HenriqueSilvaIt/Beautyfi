import { UserView } from "@/viewModel/Menu/User/User.view";
import { useUserViewModel } from "@/viewModel/Menu/User/useUser.viewModel";
import { View } from "react-native";

export default function UserDetailsPage() {
  const props = useUserViewModel();
  return (
    <View className="flex-1 bg-background-primary">
      <UserView {...props} />
    </View>
  );
}

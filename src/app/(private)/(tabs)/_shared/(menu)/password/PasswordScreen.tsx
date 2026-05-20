
import { UserPasswordView } from "@/viewModel/Menu/UserPassword/UserPassword.view";
import { useUserPasswordViewModel } from "@/viewModel/Menu/UserPassword/useUserPassword.viewModel";
import {  View } from "react-native";

export default function Password() {

  const props = useUserPasswordViewModel();

  return (
    <View className="flex-1 bg-background-primary">
      <UserPasswordView {...props}/>
    </View>
  );
}

import { Text, TouchableOpacity } from "react-native";
import { RegisterView } from "../../viewModel/Register/Register.view";
import { useRegisterViewModel } from "../../viewModel/Register/useRegister.viewModel";
import { router } from "expo-router";

export default function Register() {
  const props = useRegisterViewModel();

  return (

      <RegisterView {...props} />
  );
}

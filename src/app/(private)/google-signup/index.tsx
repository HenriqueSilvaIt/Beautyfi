import { GoogleSignUpView } from "@/viewModel/Menu/GoogleSignUp/GoogleSignUp.view";
import { useGoogleSignUpViewModel } from "@/viewModel/Menu/GoogleSignUp/useGoogleSignUp.viewModel";
import { View } from "react-native";

export default function GoogleSignUp() {

    const props = useGoogleSignUpViewModel();

  return (
    <View className="flex-1 bg-background-primary">
        <GoogleSignUpView {...props}/>
    </View>
  );
}

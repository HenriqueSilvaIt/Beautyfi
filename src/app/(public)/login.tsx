import { View } from "react-native";
import { useLoginViewModel } from "../../viewModel/Login/useLogin.viewModel";
import { LoginView } from "../../viewModel/Login/Login.view";


export default function Login() {
  const props = useLoginViewModel();

  

  return (
    <>


        <LoginView {...props} />
    </>
  );
}

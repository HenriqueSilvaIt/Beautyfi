import { View } from "react-native";
import { LoginView } from "../../viewModel/Login/Login.view";
import { useLoginViewModel } from "../../viewModel/Login/useLogin.viewModel";

export default function Menu() {
    
    const props = useLoginViewModel();
    
    return(

            <LoginView {...props}/>

    );
}
import { NewHomeView } from "@/viewModel/Home/NewHome/NewHome.view";
import { useNewHomeViewModel } from "@/viewModel/Home/NewHome/useNewHomeViewModel"
import { View } from "react-native";

export default function NewHomePage() {

    const props = useNewHomeViewModel();

    return (

            <NewHomeView {...props}/>
        
    )
}
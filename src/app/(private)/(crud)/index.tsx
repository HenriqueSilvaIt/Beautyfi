import { CrudView } from "@/viewModel/Crud/Crud.view";
import { View } from "react-native";


export default function CrudHome() {

    return (
        <View className="flex-1 bg-background-primary"> 
        <CrudView/>

        </View>
    )
}
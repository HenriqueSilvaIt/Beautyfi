import { ServiceEmployeesView } from "@/viewModel/Admin/Services/ServiceEmployees/ServiceEmployees.view.";
import { View } from "react-native";

export default function ServiceEmployees() {

    return(
        <View className="flex-1 bg-background-primary">
            <ServiceEmployeesView/>
        </View>
    )
}
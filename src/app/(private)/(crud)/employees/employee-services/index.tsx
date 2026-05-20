import { EmployeeServicesView } from "@/viewModel/Admin/Employees/EmployeeServices/EmployeeServices.view";
import { View } from "react-native";


export default function EmployeeServices() {

    return(
        <View className="flex-1 bg-background-primary">
            <EmployeeServicesView/>
        </View>
    )
}
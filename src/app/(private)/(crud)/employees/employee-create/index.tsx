import { EmployeeView } from "@/viewModel/Admin/Employees/EmployeeView";
import { useEmployeeViewModel } from "@/viewModel/Admin/Employees/useEmployeeeViewModel";
import { View } from "react-native";


export default function EmployeeCreate() {


    const props = useEmployeeViewModel(undefined);

    return(
        <View className="flex-1 bg-background-primary">
            <EmployeeView {...props}/>
        </View>
        
    )
}
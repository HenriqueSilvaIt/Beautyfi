import { EmployeeView } from "@/viewModel/Admin/Employees/EmployeeView";
import { useEmployeeViewModel } from "@/viewModel/Admin/Employees/useEmployeeeViewModel";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function EmployeeDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const employeeId = id ? Number(id) : undefined;
  const props = useEmployeeViewModel(employeeId);



  // Se employeeId ainda for undefined, dá pra colocar um fallback ou exibir loading
  if (!employeeId) return( <Text>ID inválido</Text>);
  return (
    <View className="flex-1 bg-background-primary">
        
      <EmployeeView {...props} />
    </View>
  );
}

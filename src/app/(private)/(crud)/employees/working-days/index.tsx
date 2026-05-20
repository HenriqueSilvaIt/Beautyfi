import { WorkingDaysView } from "@/viewModel/Admin/Employees/WorkingDays/WorkingDays.view";
import { View } from "react-native";

export default function WorkingDaysPage() {
  return (
    <View className="flex-1 bg-background-primary">
      <WorkingDaysView />
    </View>
  );
}

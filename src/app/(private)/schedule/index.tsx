import { View } from "react-native";
import { ScheduleView } from "../../../viewModel/Schedule/Schedule.view";
import { useLocalSearchParams } from "expo-router";
import { useScheduleViewModel } from "../../../viewModel/Schedule/useSchedule.viewModel";
import { useMemo } from "react";

export default function Schedule() {
  const { serviceIds } = useLocalSearchParams<{ serviceIds: string }>();
  // "1,2,3" → [1, 2, 3]
    console.log("🔍 serviceIds da rota:", serviceIds);

  const parsedIds = serviceIds
    ? serviceIds.split(",").map(Number).filter(Boolean)
    : [];
    useMemo(() => { return serviceIds ? serviceIds.split(",").map(Number).filter(Boolean) : []; }, [serviceIds]); // só recria se a string mudar
  console.log("🔍 parsedIds:", parsedIds);

  const props = useScheduleViewModel(parsedIds)

  return (
        <View className="flex-1 bg-background-primary">
                <ScheduleView {...props}/>
        </View>
  )
}
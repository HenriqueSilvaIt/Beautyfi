import { useBookingViewModel } from "@/viewModel/Booking/useBookingViewModel";
import { HistoryView } from "@/viewModel/Menu/History/History.view";
import { View } from "react-native";

export default function History() {

    const props = useBookingViewModel();

  return (
    <View className="flex-1 bg-background-primary">
      <HistoryView  {...props}/>
    </View>
  );
}

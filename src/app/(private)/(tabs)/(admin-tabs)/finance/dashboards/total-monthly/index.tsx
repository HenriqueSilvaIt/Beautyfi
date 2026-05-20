import { TotalMonthlyView } from "@/viewModel/Finance/Dashboards/TotalMonthy/TotalMonthly.view";
import { useTotalMonthlyViewModel } from "@/viewModel/Finance/Dashboards/TotalMonthy/useTotalMonthlyViewModel";
import { View } from "react-native";


export default function TotalMonthly() {

    const props = useTotalMonthlyViewModel();
    return(
            <TotalMonthlyView {...props} />
    )
}
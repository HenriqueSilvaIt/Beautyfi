import { NewTipView } from "@/viewModel/Finance/Order/OrderDetails/NewTip/NewTip.view";
import { useNewTipViewModel } from "@/viewModel/Finance/Order/OrderDetails/NewTip/useNewTipViewModel";
import { View } from "react-native";


export default function NewTipPage() {


    const props = useNewTipViewModel();

    return (
        <NewTipView {...props} />
    )
}
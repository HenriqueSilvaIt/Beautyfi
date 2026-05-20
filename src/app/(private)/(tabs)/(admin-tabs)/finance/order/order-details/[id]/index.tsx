import { OrderDetailsView } from "@/viewModel/Finance/Order/OrderDetails/OrderDetails.view";
import { useOrderDetailsViewModel } from "@/viewModel/Finance/Order/OrderDetails/useOrderDetailsViewModel";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function OrderDetails() {

    const { id} = useLocalSearchParams<{id : string}>();

    const orderId = id ?  Number(id)  : undefined;

    const props = useOrderDetailsViewModel(orderId);

    return (
        <OrderDetailsView  {...props}/>
    )
}
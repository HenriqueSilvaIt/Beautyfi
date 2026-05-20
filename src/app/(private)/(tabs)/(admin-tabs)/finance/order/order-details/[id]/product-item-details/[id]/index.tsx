import { ProductItemDetailsView } from "@/viewModel/Finance/Order/OrderDetails/OrderItemDetails/ProductItemDetails/ProductItemDetails.view";
import { useProductItemDetailsViewModel } from "@/viewModel/Finance/Order/OrderDetails/OrderItemDetails/ProductItemDetails/useProductItemDetailsViewModel";
import { id } from "date-fns/locale";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";


export default function ProductItemDetails() {


    const {id} = useLocalSearchParams<{id?: string}>();

    const productId = id ? Number(id) : undefined;
    const props = useProductItemDetailsViewModel(productId);
    return (

        <ProductItemDetailsView {...props}/>

    );
}
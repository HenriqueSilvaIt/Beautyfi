import { ProductView } from "@/viewModel/Admin/Products/ProductView";
import { useProductViewModel } from "@/viewModel/Admin/Products/useProductViewModel";
import { View } from "react-native";


export default function ProductCreate() {

        const props = useProductViewModel(undefined);
    
        return (
            <View className="flex-1 bg-background-primary">
                <ProductView {...props} />
            </View>
        )
}
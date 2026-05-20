import { NewProductItem } from "@/viewModel/Finance/Order/OrderDetails/OrderItemDetails/NewProductItem/NewProductItem.view";
import { useNewProductItemViewModel } from "@/viewModel/Finance/Order/OrderDetails/OrderItemDetails/NewProductItem/useNewProductItemViewModel";

export default function NewProductItemPage() {


    const props = useNewProductItemViewModel();
    return(
        <NewProductItem {...props}/>
    )
}
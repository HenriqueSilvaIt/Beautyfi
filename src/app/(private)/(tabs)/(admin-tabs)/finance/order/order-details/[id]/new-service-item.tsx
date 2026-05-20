import { NewServiceItem } from "@/viewModel/Finance/Order/OrderDetails/OrderItemDetails/NewServiceItem/NewServiceItem.view";
import { useNewServiceItemViewModel } from "@/viewModel/Finance/Order/OrderDetails/OrderItemDetails/NewServiceItem/useNewServiceItemViewModel";


export default function NewServiceItemPage() {


    const props = useNewServiceItemViewModel();
    return(
        <NewServiceItem {...props}/>
    )
}
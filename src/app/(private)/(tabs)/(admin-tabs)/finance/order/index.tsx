import { OrderView } from "@/viewModel/Finance/Order/Order.view";
import { useOrderViewModel } from "@/viewModel/Finance/Order/useOrderViewModel";


export default function Order() {
 
    const props = useOrderViewModel();
    return(
       <OrderView {...props}/>
    );
}
import { NewOrderView } from "@/viewModel/Finance/Order/NewOrder/NewOrder.view";
import { useNewOrderViewModel } from "@/viewModel/Finance/Order/NewOrder/useNewOrderViewModel";

export default function NewOrder() {

  const props = useNewOrderViewModel();
  return (<NewOrderView {...props}/>)
}

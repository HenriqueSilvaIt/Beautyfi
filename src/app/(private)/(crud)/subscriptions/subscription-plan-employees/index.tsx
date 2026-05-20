import { SubscriptionPlanEmployeesView } from "@/viewModel/Subscription/Admin/SubscriptionPlanEmployees/SubscriptionPlanEmployees.view";
import { useSubscriptionPlanEmployeesViewModel } from "@/viewModel/Subscription/Admin/SubscriptionPlanEmployees/useSubscriptionPlanEmployeesViewModel";

export default function SubscriptionPlanEmployees() {



  const props = useSubscriptionPlanEmployeesViewModel();
    return (
    <SubscriptionPlanEmployeesView {...props} />
    )
}
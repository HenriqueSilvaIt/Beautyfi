import { SubscriptionAdminView } from "@/viewModel/Subscription/Admin/SubscriptionAdminView";
import { useSubscriptionAdminViewModel } from "@/viewModel/Subscription/Admin/useSubscriptionAdmin.viewModel";

export default function NewSubscription() {



  const props = useSubscriptionAdminViewModel(undefined);
    return (
    <SubscriptionAdminView {...props} />
    )
}
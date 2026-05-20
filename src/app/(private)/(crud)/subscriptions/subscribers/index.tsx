import { SubscribersView } from "@/viewModel/Subscription/Admin/Subscribers/Subscribers.view";
import { useSubscribersViewModel } from "@/viewModel/Subscription/Admin/Subscribers/useSubscribersViewModel";
import { useSubscriptionAdminViewModel } from "@/viewModel/Subscription/Admin/useSubscriptionAdmin.viewModel";

export default function SubscribersPage() {


    const props =  useSubscribersViewModel();
    return (
        <SubscribersView {...props} />
    )
}
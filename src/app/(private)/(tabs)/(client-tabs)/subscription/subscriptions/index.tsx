import { SubscriptionListView } from "@/viewModel/Subscription/Client/SubscriptionList/SubscriptionList.view";
import { useSubscriptionlistViewModel } from "@/viewModel/Subscription/Client/SubscriptionList/useSubscription.viewModel";
import { View } from "react-native";

export default function Subscriptions() {

     const props = useSubscriptionlistViewModel();
 
     return (
       <SubscriptionListView {...props} />
     )
    }
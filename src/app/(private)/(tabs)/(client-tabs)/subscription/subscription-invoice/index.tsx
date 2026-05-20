import { InvoiceListView } from "@/viewModel/Subscription/Invoice/InvoiceList/InvoiceList.view";
import { useInvoiceListViewModel } from "@/viewModel/Subscription/Invoice/InvoiceList/useInvoiceListViewModel";

export default function SubscriptionInvoiceListPage() {

    const props = useInvoiceListViewModel();
    
    return(
        <InvoiceListView {...props}/>
    )
}
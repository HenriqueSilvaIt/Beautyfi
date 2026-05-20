import { InvoiceDetailsView } from "@/viewModel/Subscription/Invoice/InvoiceDetails/InvoiceDetails.view";
import { useInvoiceDetailsViewModel } from "@/viewModel/Subscription/Invoice/InvoiceDetails/useInvoiceDetailsViewModel";
import { useLocalSearchParams } from "expo-router";

export default function InvoiceDetails() {

    const {id} = useLocalSearchParams<{id?: string}>();

    const props = useInvoiceDetailsViewModel(id);
    return (
        <InvoiceDetailsView {...props} />
    )
}
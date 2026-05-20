import { ServiceItemDetailsView } from "@/viewModel/Finance/Order/OrderDetails/OrderItemDetails/ServiceItemDetails/ServiceItemDetails.view";
import { useServiceItemDetailsViewModel } from "@/viewModel/Finance/Order/OrderDetails/OrderItemDetails/ServiceItemDetails/useServiceItemDetailsViewModel";
import { useLocalSearchParams } from "expo-router";

export default function ServiceItemDetails() {

    const { id} = useLocalSearchParams<{id?: string}>();

    const serviceId = id ? Number(id) : undefined;

  const props = useServiceItemDetailsViewModel(serviceId);

  return <ServiceItemDetailsView {...props} />;
}

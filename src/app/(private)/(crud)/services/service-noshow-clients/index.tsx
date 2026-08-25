import React from "react";
import { ServiceNoShowClientsView } from "@/viewModel/Admin/Services/ServiceNoShowClients/ServiceNoShowClients.view";
import { useServiceNoShowClientsViewModel } from "@/viewModel/Admin/Services/ServiceNoShowClients/useServiceNoShowClientsViewModel";

export default function ServiceNoShowClientsScreen() {
  const viewModel = useServiceNoShowClientsViewModel();
  return <ServiceNoShowClientsView {...viewModel} />;
}

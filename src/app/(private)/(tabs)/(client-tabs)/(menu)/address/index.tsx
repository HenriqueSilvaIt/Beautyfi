import React from "react";
import { AddressView } from "@/viewModel/Menu/Address/Address.view";
import { useAddressViewModel } from "@/viewModel/Menu/Address/useAddressViewModel";

export default function ClientAddressScreen() {
  const viewModel = useAddressViewModel();
  return <AddressView {...viewModel} />;
}

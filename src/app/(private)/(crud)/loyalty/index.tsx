import React from "react";
import { LoyaltyView } from "@/viewModel/Admin/Loyalty/LoyaltyView";
import { useLoyaltyViewModel } from "@/viewModel/Admin/Loyalty/useLoyaltyViewModel";

export default function LoyaltyScreen() {
  const loyaltyViewModel = useLoyaltyViewModel();

  return <LoyaltyView {...loyaltyViewModel} />;
}

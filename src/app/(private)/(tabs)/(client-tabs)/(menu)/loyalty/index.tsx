import { MyLoyaltyView } from "@/viewModel/Menu/Loyalty/MyLoyaltyView";
import { useMyLoyaltyViewModel } from "@/viewModel/Menu/Loyalty/useMyLoyaltyViewModel";

export default function MyLoyaltyScreen() {
  const viewModel = useMyLoyaltyViewModel();
  return <MyLoyaltyView {...viewModel} />;
}

import { NewHomeView } from "@/viewModel/Home/NewHome/NewHome.view";
import { useNewHomeViewModel } from "@/viewModel/Home/NewHome/useNewHomeViewModel";

export default function Home() {
  const props = useNewHomeViewModel();

  return <NewHomeView {...props} />;
}

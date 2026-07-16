import { DashboardComandasView } from "@/viewModel/Finance/Dashboards/DashboardComandas/DashboardComandas.view";
import { useDashboardComandasViewModel } from "@/viewModel/Finance/Dashboards/DashboardComandas/useDashboardComandasViewModel";

export default function ComandasReportScreen() {
  const props = useDashboardComandasViewModel();
  return <DashboardComandasView {...props} />;
}

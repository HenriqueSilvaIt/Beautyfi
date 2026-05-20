import { DashboardEmployeeView } from "@/viewModel/Finance/Dashboards/DashboardEmployee/DashboardEmployee.view";
import { useDashboardEmployeeViewModel } from "@/viewModel/Finance/Dashboards/DashboardEmployee/useDashboardEmployeeViewModel"


export default function EmployeeReport() {

    const props = useDashboardEmployeeViewModel();

    return (

        <DashboardEmployeeView {...props} />
    )

}
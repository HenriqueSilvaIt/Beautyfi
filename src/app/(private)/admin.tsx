import { AdminView } from "@/viewModel/Admin/Admin.view";
import { useAdminViewModel } from "@/viewModel/Admin/useAdminViewModel";

export default function AdminLayout() {
  const props = useAdminViewModel();
  return (
      <AdminView {...props}/>
  );
}

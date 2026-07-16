import { CompanyDetailsView } from "@/viewModel/Home/NewHome/CompanyDetails/CompanyDetails.view";
import { useCompanyDetailsViewModel } from "@/viewModel/Home/NewHome/CompanyDetails/useCompanyDetailsViewModel";
import { useLocalSearchParams } from "expo-router";

export default function CompaniesDetailsPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const companyId = id != null ? Number(id) : undefined;

  const props = useCompanyDetailsViewModel(companyId);

  return <CompanyDetailsView {...props} />;
}

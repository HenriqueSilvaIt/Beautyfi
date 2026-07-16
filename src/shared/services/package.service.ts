import { styleAppApiClient } from "../api/styleAppBackend";
import { PackageHttpResponse, PackageInterface, PackageProps } from "../interfaces/http/package";
import { useCompanyStore } from "../store/company-store";
import { useUserStore } from "../store/user-store";

function getCompanyId() {
  const user = useUserStore.getState().user;
  if (user?.companyId) return user.companyId;
  return useCompanyStore.getState().selectedCompanyId || 0;
}

export async function getPackages(
  page: number = 0,
  size: number = 10,
  name?: string,
  companyId?: number,
) {
  const resolvedCompanyId = companyId || getCompanyId();
  const { data } = await styleAppApiClient.get<PackageHttpResponse>(
    `/packages/${resolvedCompanyId}/company?sort=name,asc`,
    {
      params: { page, size, name },
    },
  );
  return data;
}

export async function getPackageById(packageId: number) {
  const { data } = await styleAppApiClient.get<PackageProps>(
    `/packages/${packageId}`,
  );
  return data;
}

export async function postPackage(dataBody: PackageInterface) {
  const { data } = await styleAppApiClient.post<PackageProps>(
    "/packages",
    dataBody,
  );
  return data;
}

export async function updatePackage(
  dataBody: PackageInterface,
  packageId: number,
) {
  const { data } = await styleAppApiClient.put<PackageProps>(
    `/packages/${packageId}`,
    dataBody,
  );
  return data;
}

export async function deletePackageById(packageId: number) {
  await styleAppApiClient.delete(`/packages/${packageId}`);
}

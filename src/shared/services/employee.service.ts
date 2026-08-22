import { styleAppApiClient } from "../api/styleAppBackend";
import { useCompanyStore } from "../store/company-store";
import { useUserStore } from "../store/user-store";
import {
  EmployeeHttpRepsonse,
  EmployeeInterface,
  EmployeeProps,
  ServiceEmployeeInterface,
  ServiceEmployeeParam,
  ServiceEmployeeParams,
} from "../interfaces/http/employee";

function getCompanyId() {
  const user = useUserStore.getState().user;
  if (user?.companyId) return user.companyId;
  const selectedCompanyId = useCompanyStore.getState().selectedCompanyId;
  if (selectedCompanyId) return selectedCompanyId;
  return undefined;
}

export async function getEmployees(
  page: number = 0,
  size: number = 30,
  employeeId?: number,
  name?: string,
  companyId?: number,
) {
  const resolvedCompanyId = companyId || getCompanyId();
  const url = resolvedCompanyId && resolvedCompanyId > 0
    ? `/employees?companyId=${resolvedCompanyId}&sort=name,asc`
    : `/employees?sort=name,asc`;

  const { data } = await styleAppApiClient.get<EmployeeHttpRepsonse>(
    url,
    {
      params: {
        page,
        size,
        employeeId,
        name,
      },
    },
  );

  return data;
}

export async function getEmployeesByServiceId(serviceId: number) {
  const { data } = await styleAppApiClient.get<EmployeeInterface[]>(
    `/employees/service/${serviceId}`,
  );
  return data;
}

export async function getEmployeeById(employeeId: number) {
  const { data } = await styleAppApiClient.get<EmployeeInterface>(
    `/employees/${employeeId}`,
  );
  return data;
}
export async function getEmployeeByUser(employeeId: number) {
  const { data } = await styleAppApiClient.get<EmployeeInterface>(
    `/employees/user/${employeeId}`,
  );
  return data;
}

export async function postEmployees(dataBody: EmployeeInterface) {
  const { data } = await styleAppApiClient.post<EmployeeProps>(
    "/employees",
    dataBody,
  );
  return data;
}

export async function updateEmployees(
  dataBody: EmployeeInterface,
  employeeId?: number,
) {
  const { data } = await styleAppApiClient.put<EmployeeInterface>(
    `/employees/${employeeId}`,
    dataBody,
  );
  return data;
}

export async function deleteEmployeeById(employeeId: number) {
  await styleAppApiClient.delete<EmployeeInterface>(`/employees/${employeeId}`);
}

export async function findByEmployeeAndService(
  employeeId: number,
  serviceId: number,
) {
  const { data } = await styleAppApiClient.get<ServiceEmployeeInterface>(
    `/service-employees/by-employee/${employeeId}/service/${serviceId}`,
  );

  return data;
}

export async function customServiceDetailsInsert(
  dataBody: ServiceEmployeeParams,
) {
  const { data } = await styleAppApiClient.post<ServiceEmployeeInterface>(
    `/service-employees`,
    dataBody,
  );

  return data;
}

export async function customServiceDetailsUpdate(
  dataBody: ServiceEmployeeParams,
  id: number,
) {
  const { data } = await styleAppApiClient.put<ServiceEmployeeInterface>(
    `/service-employees/${id}`,
    dataBody,
  );

  return data;
}

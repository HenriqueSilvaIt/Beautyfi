import { styleAppApiClient } from "../api/styleAppBackend";
import { CompanyInterface, CompanyProps } from "../interfaces/http/company";

export async function companyDetails() {

    const {data} =  await styleAppApiClient.get<CompanyProps>(`/companies/1/details`);

    return data;
}

export async function getCompanyById(companyId: number) {

    const {data} = await styleAppApiClient.get<CompanyInterface>(`/companies/${companyId}`)

    return data;
}

export async function createCompany(dataBody: CompanyInterface) {
 
    const {data} =  await styleAppApiClient.post<CompanyProps>(`/companies`, dataBody);

    return data;
}

export async function updateCompany(dataBody: CompanyInterface) {

    const {data} =  await styleAppApiClient.put<CompanyProps>(`/companies/1`, dataBody);

    return data;
}

export async function updateReminderConfig(dto: {
  reminderEnabled?: boolean;
  reminderMinutesBefore?: number;
}): Promise<void> {
  await styleAppApiClient.patch("/companies/reminder-config", dto);
}
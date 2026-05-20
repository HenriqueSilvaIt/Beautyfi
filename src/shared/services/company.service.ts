import { AxiosRequestConfig } from "axios";
import { styleAppApiClient } from "../api/styleAppBackend";
import { CompanyInterface, CompanyProps } from "../interfaces/http/company";
import { useUserStore } from "../store/user-store";
import { COMPANY_ID } from "@env";

  const COMPANY_ID_NUMBER = Number(COMPANY_ID) ? Number(COMPANY_ID)  : Number(process.env.EXPO_PUBLIC_COMPANY_ID) ?? 0;


export async function companyDetails() {

    const {data} =  await styleAppApiClient.get<CompanyProps>(`/companies/1/details`);

    return data;
}

export async function getCompanyById(companyId: number) {

    const {data} = await styleAppApiClient.get<CompanyInterface>(`/companies/${companyId}`)

    return data;
}

export async function createCompany(dataBody: CompanyInterface) {

    
         const access_token = useUserStore.getState().access_token;
        
          if (!access_token) {
            throw new Error("Token de acesso não encontrado");
          }
        
        
          const config : AxiosRequestConfig = {
        
              headers: {
                Authorization: `Bearer ${access_token}`
              }
          }
    const {data} =  await styleAppApiClient.post<CompanyProps>(`/companies`, dataBody, config);

    return data;
}

export async function updateCompany(dataBody: CompanyInterface) {

    const {data} =  await styleAppApiClient.put<CompanyProps>(`/companies/${COMPANY_ID_NUMBER}`, dataBody);

    return data;
}

export async function updateReminderConfig(dto: {
  reminderEnabled?: boolean;
  reminderMinutesBefore?: number;
}): Promise<void> {
  await styleAppApiClient.patch("/companies/reminder-config", dto);
}
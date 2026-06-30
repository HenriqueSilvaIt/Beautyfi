import { styleAppApiClient } from "../api/styleAppBackend";
import { ClientHttpResponse, ClientInterface } from "../interfaces/http/client";
import { AxiosRequestConfig } from "axios";
import { useUserStore } from "../store/user-store";
import { useCompanyStore } from "../store/company-store";
import { COMPANY_ID } from "@env";

const COMPANY_ID_NUMBER = Number(COMPANY_ID)
  ? Number(COMPANY_ID)
  : (Number(process.env.EXPO_PUBLIC_COMPANY_ID) ?? 0);

export async function getClients(page: number = 0, size: number = 10) {
  const companyId = useCompanyStore.getState().selectedCompanyId || COMPANY_ID_NUMBER;
  const { data } = await styleAppApiClient.get<ClientHttpResponse>(
    `/clients?companyId=${companyId}&sort=name,asc`,
    {
      params: {
        page,
        size,
      },
    },
  );

  return data;
}

export async function getClientById(clientId: number) {
  const { data } = await styleAppApiClient.get<ClientInterface>(
    `/clients/${clientId}`,
  );
  return data;
}

export async function postClients(dataBody: ClientInterface) {
  const { data } = await styleAppApiClient.post<ClientInterface>(
    "/clients",
    dataBody,
  );
  return data;
}

export async function updateClients(
  dataBody: ClientInterface,
  clientId?: number,
) {
  const { data } = await styleAppApiClient.put<ClientInterface>(
    `/clients/${clientId}`,
    dataBody,
  );
  return data;
}

export async function deleteClientById(clientId: number) {
  await styleAppApiClient.delete<ClientInterface>(`/clients/${clientId}`);
}

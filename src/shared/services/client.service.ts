import { styleAppApiClient } from "../api/styleAppBackend";
import { ClientHttpResponse, ClientInterface } from "../interfaces/http/client";
import { useCompanyStore } from "../store/company-store";
import { useUserStore } from "../store/user-store";

function getCompanyId() {
  const user = useUserStore.getState().user;
  if (user?.companyId) return user.companyId;
  return useCompanyStore.getState().selectedCompanyId || 0;
}

export async function getClients(page: number = 0, size: number = 10, name?: string) {
  const companyId = getCompanyId();
  const { data } = await styleAppApiClient.get<ClientHttpResponse>(
    `/clients?companyId=${companyId}&sort=name,asc`,
    {
      params: {
        page,
        size,
        name,
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

export async function updateClientAnamnesis(
  clientId: number,
  anamnesisData: any,
) {
  const { data } = await styleAppApiClient.put<ClientInterface>(
    `/clients/${clientId}/anamnesis`,
    anamnesisData,
  );
  return data;
}

export async function deleteClientById(clientId: number) {
  await styleAppApiClient.delete<ClientInterface>(`/clients/${clientId}`);
}

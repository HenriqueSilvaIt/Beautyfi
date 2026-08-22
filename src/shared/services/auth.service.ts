import queryString from "query-string";
import { styleAppApiClient } from "../api/styleAppBackend";
import {
  RegisterHttpParams,
  RegisterHttpResponse,
} from "../interfaces/http/register";
import { LoginHttpParams, LoginHttpResponse } from "../interfaces/http/login";
import { Buffer } from "buffer";
import { useUserStore } from "../store/user-store";
import { useCompanyStore } from "../store/company-store";
import { GoogleAuthResponseDTO } from "../interfaces/http/authenticate-reposnse";
function getCompanyId() {
  const user = useUserStore.getState().user;
  if (user?.companyId) return user.companyId;
  return useCompanyStore.getState().selectedCompanyId || 0;
}

export async function register(userData: RegisterHttpParams) {
  const { data } = await styleAppApiClient.post<RegisterHttpResponse>(
    "/users",
    userData,
  );

  return data;
}

export async function login(userData: LoginHttpParams) {
  const body = queryString.stringify({
    grant_type: "password",
    username: userData.email,
    password: userData.password,
  });

  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
    Authorization:
      "Basic " + Buffer.from("myclientid:myclientsecret").toString("base64"),
  };

  const { data } = await styleAppApiClient.post<LoginHttpResponse>(
    "/oauth2/token",
    body,
    { headers },
  );

  return data;
}

export async function recoverPassword(email: string) {
  const { data } = await styleAppApiClient.post(`/auth/recover-token`, {email: email});
  return data;
}


export async function googleAuth(token: string) {
  const companyId = getCompanyId();
  const { data } = await styleAppApiClient.post<GoogleAuthResponseDTO>(
    `/auth/${companyId}/google`,
    {
      token, 
    }
  );

  return data;
}

export async function appleAuth(token: string, name: string) {
  const companyId = getCompanyId();
  const { data } = await styleAppApiClient.post<GoogleAuthResponseDTO>(
    `/auth/${companyId}/apple`,
    {
      token, 
      name,
    }
  );

  return data;
}
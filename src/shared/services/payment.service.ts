import { AxiosRequestConfig } from "axios";
import { useUserStore } from "../store/user-store";
import { PaymentCardFlagDTO, PaymentMethodDTO } from "../interfaces/http/order";
import { styleAppApiClient } from "../api/styleAppBackend";

export async function getPaymentMethods() {

  const { data } = await styleAppApiClient.get<PaymentMethodDTO[]>(
    `/payments/methods`
  );

  return data;
}


export async function getPaymentCardFlag() {

  const { data } = await styleAppApiClient.get<PaymentCardFlagDTO[]>(
    `/payments/card-flags`
  );

  return data;
}

export async function postPaymentMethod(dataBody: PaymentMethodDTO) {
  const { data } = await styleAppApiClient.post<PaymentMethodDTO>("/payments/methods", dataBody);
  return data;
}

export async function updatePaymentMethod(id: number, dataBody: PaymentMethodDTO) {
  const { data } = await styleAppApiClient.put<PaymentMethodDTO>(`/payments/methods/${id}`, dataBody);
  return data;
}

export async function deletePaymentMethod(id: number) {
  await styleAppApiClient.delete(`/payments/methods/${id}`);
}

export async function postPaymentCardFlag(dataBody: PaymentCardFlagDTO) {
  const { data } = await styleAppApiClient.post<PaymentCardFlagDTO>("/payments/card-flags", dataBody);
  return data;
}

export async function updatePaymentCardFlag(id: number, dataBody: PaymentCardFlagDTO) {
  const { data } = await styleAppApiClient.put<PaymentCardFlagDTO>(`/payments/card-flags/${id}`, dataBody);
  return data;
}

export async function deletePaymentCardFlag(id: number) {
  await styleAppApiClient.delete(`/payments/card-flags/${id}`);
}


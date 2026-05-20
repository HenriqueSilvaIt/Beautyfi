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


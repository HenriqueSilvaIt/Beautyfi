import { AxiosRequestConfig } from "axios";
import { styleAppApiClient } from "../api/styleAppBackend";
import {
  OrderHttpResponse,
  OrderInsertDetailsParams,
  OrderInterface,
  OrderItemInsertParams,
  OrderMinParams,
  PaymentInsertDTO,
} from "../interfaces/http/order";
import { useUserStore } from "../store/user-store";

export async function getOrders(page: number = 0, size: number = 10) {
  const { data } = await styleAppApiClient.get<OrderHttpResponse>("/orders", {
    params: {
      page,
      size,
    },
  });

  return data;
}

export async function getOrderById(id?: number) {
  const { data } = await styleAppApiClient.get<OrderInterface>(`/orders/${id}`);

  return data;
}

export async function insertOrderDetails(dataBody: OrderInsertDetailsParams) {
  const { data } = await styleAppApiClient.post<OrderInterface>(
    `/orders/details`,
    dataBody,
  );

  return data;
}

export async function insertOrderMin(dataBody: OrderMinParams) {
  const { data } = await styleAppApiClient.post<OrderInterface>(
    `/orders/min`,
    dataBody,
  );

  return data;
}

export async function addItemToOrder(
  dataBody: OrderItemInsertParams,
  orderId: number,
) {
  const { data } = await styleAppApiClient.post(
    `/orders/${orderId}/items`,
    dataBody,
  );

  return data;
}




export async function updateItemToOrder(
  dataBody: OrderItemInsertParams,
  orderId: number,
  orderItemId: number,
) {
  const { data } = await styleAppApiClient.put(
    `/orders/${orderId}/items/${orderItemId}`,
    dataBody,
  );

  return data;
}

export async function closeOrderById(orderId: number) {
  const { data } = await styleAppApiClient.patch(`/orders/close/${orderId}`);

  return data;
}

export async function removeOrderItemById(orderId: number) {
  const { data } = await styleAppApiClient.delete(`/orders/items/${orderId}`);

  return data;
}


export async function addPaymentToOrder(
  dataBody: PaymentInsertDTO,
  orderId: number,
) {
  const { data } = await styleAppApiClient.post(
    `/orders/${orderId}/payments`,
    dataBody,
  );

  return data;
}

export async function deleteOrderById(orderId: number) {
  const { data } = await styleAppApiClient.delete(`/orders/${orderId}`);

  return data;
}

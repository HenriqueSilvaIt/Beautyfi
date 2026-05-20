import { OrderInterface, OrderItemsInterface } from "../interfaces/http/order";

export function calculateOrderTotal(items: any[]) {
  return items.reduce((acc, item) => {
    const price = Number(item.price ?? item.servicePrice ?? 0);
    const qty = Number(item.quantity ?? 1);

    return acc + price * qty;
  }, 0);
}
export function normalizeOrder(order: OrderInterface) {
  return {
    ...order,
    total: order.total ?? 0,
    items: order.items ?? [],
  };
}

export const getOrderTotal = (order: OrderInterface) => {
  if (order.total != null && order.total > 0) return order.total;

  return calculateOrderTotal(order.items ?? []);
};
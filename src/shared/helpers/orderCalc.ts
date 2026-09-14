import { OrderInterface, OrderItemsInterface } from "../interfaces/http/order";

export function calculateOrderTotal(items: any[]) {
  if (!items || items.length === 0) return 0;
  return items.reduce((acc, item) => {
    let price = 0;
    if (item.appointmentServices && item.appointmentServices.length > 0) {
      price = item.appointmentServices.reduce(
        (sum: number, aps: any) => sum + Number(aps.priceAtMoment ?? aps.service?.price ?? 0),
        0
      );
    } else {
      price = Number(item.servicePrice || item.price || 0);
    }
    const qty = Number(item.quantity ?? 1);
    return acc + price * qty;
  }, 0);
}

export function normalizeOrder(order: OrderInterface) {
  return {
    ...order,
    total: order.total ?? order.totalSold ?? order.totalOrder ?? 0,
    items: order.items ?? [],
  };
}

export const getOrderTotal = (order: OrderInterface) => {
  if (order.totalSold != null && Number(order.totalSold) > 0) return Number(order.totalSold);
  if (order.total != null && Number(order.total) > 0) return Number(order.total);
  if (order.totalOrder != null && Number(order.totalOrder) > 0) return Number(order.totalOrder);

  return calculateOrderTotal(order.items ?? []);
};
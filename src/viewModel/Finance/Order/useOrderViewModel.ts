import { calculateOrderTotal } from "@/shared/helpers/orderCalc";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { OrderInterface } from "@/shared/interfaces/http/order";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useOrderStore } from "@/shared/store/order-store";
import { useEffect, useState } from "react";

export function useOrderViewModel() {
  const { safePush } = useSafeNavigation();


  
  const { useGetOrdersMutation } = useOrderMutation();

  const {
    data: orderData,
    error: orderError,
    refetch: orderRefetch,
    isRefetching: orderIsRefetching,
    isLoading: orderIsLoading,
    hasNextPage: orderHasNextPage,
    fetchNextPage: orderFetchNextPage,
    isFetchingNextPage: orderIsFetchingNextPage,
  } = useGetOrdersMutation();



  const orderDataPagged =
  orderData?.pages
    .flatMap((page) => page.content ?? [])
    .filter((order) => order.status === "OPEN") ?? [];
  const { formatIsoDateAndTimeToBR } = useFormatDate();


const getOrderTotal = (order: OrderInterface) => {
  if (order.total != null && order.total > 0) return order.total;

  return calculateOrderTotal(order.items ?? []);
};
  return {
    orderDataPagged,
    safePush,
    formatIsoDateAndTimeToBR,
    orderRefetch,
    orderIsRefetching,
    orderIsLoading,
    getOrderTotal,
    orderIsFetchingNextPage,
    orderHasNextPage,
    orderFetchNextPage,
  };
}

import { calculateOrderTotal } from "@/shared/helpers/orderCalc";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { OrderInterface } from "@/shared/interfaces/http/order";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useState } from "react";

export function useOrderViewModel() {
  const { safePush } = useSafeNavigation();
  const { useGetOrdersMutation } = useOrderMutation();

  // Search & Filter states
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const debouncedSearchText = useDebounce(searchText, 300);

  const {
    data: orderData,
    refetch: orderRefetch,
    isRefetching: orderIsRefetching,
    isLoading: orderIsLoading,
    hasNextPage: orderHasNextPage,
    fetchNextPage: orderFetchNextPage,
    isFetchingNextPage: orderIsFetchingNextPage,
  } = useGetOrdersMutation();

  // Map all orders (both open and closed)
  const allOrders = orderData?.pages.flatMap((page) => page.content ?? []) ?? [];

  // Filter orders locally based on search text and selected date
  const orderDataPagged = allOrders.filter((order) => {
    // 1. Search text filter (Order number or client name)
    if (debouncedSearchText) {
      const search = debouncedSearchText.toLowerCase();
      const numMatch = order.orderNumber
        ? order.orderNumber.toString().includes(search)
        : false;
      const clientNameMatch = order.user?.name
        ? order.user.name.toLowerCase().includes(search)
        : false;
      if (!numMatch && !clientNameMatch) return false;
    }

    // 2. Date filter
    if (selectedDate) {
      const orderDateStr = order.moment ? order.moment.substring(0, 10) : ""; // "YYYY-MM-DD"
      const selectedDateStr = selectedDate.toISOString().substring(0, 10);
      if (orderDateStr !== selectedDateStr) return false;
    }

    return true;
  });

  const { formatIsoDateAndTimeToBR } = useFormatDate();

  const getOrderTotal = (order: OrderInterface) => {
    if (order.total != null && order.total > 0) return order.total;
    return calculateOrderTotal(order.items ?? []);
  };

  const clearFilters = () => {
    setSearchText("");
    setSelectedDate(undefined);
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
    // New states and methods
    searchText,
    setSearchText,
    selectedDate,
    setSelectedDate,
    showDatePicker,
    setShowDatePicker,
    clearFilters,
  };
}

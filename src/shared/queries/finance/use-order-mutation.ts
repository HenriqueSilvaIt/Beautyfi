import {
  OrderInsertDetailsParams,
  OrderInterface,
  OrderItemInsertParams,
  OrderMinParams,
  PaymentInsertDTO,
} from "@/shared/interfaces/http/order";
import {
  addItemToOrder,
  addPaymentToOrder,
  closeOrderById,
  deleteOrderById,
  getOrderById,
  getOrders,
  insertOrderDetails,
  insertOrderMin,
  removeOrderItemById,
  updateItemToOrder,
} from "@/shared/services/order.service";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "../../../../queryClient";

export interface AddItemToOrderParams {
  dataBody: OrderItemInsertParams;
  orderId: number;
}

export interface AddPaymentoOrderParams {
  dataBody: PaymentInsertDTO;
  orderId: number;
}
export interface UpdateItemToOrderParams {
  dataBody: OrderItemInsertParams;
  orderId: number;
  orderItemId: number;
}

export const orderKeys = {
  detail: (id: number) => ["order", id] as const,
};

export function useOrderMutation() {
  function useGetOrderById(id: number) {
    return useQuery<OrderInterface>({
      queryKey: orderKeys.detail(id),
      queryFn: () => {
        if (!id) throw new Error("Id is required");
        return getOrderById(id);
      },
      enabled: id != null,
      staleTime: 1000 * 60 * 5, // 5 minutos em cache, evita refetch imediato
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }
  function useGetOrdersMutation(companyId?: number) {
    return useInfiniteQuery({
      queryKey: ["orders", companyId],
      //Porque o cache será separado por cliente.
      queryFn: ({ pageParam = 0 }) => getOrders(pageParam, 10, companyId),

      initialPageParam: 0,

      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos em cache, evita refetch imediato
    });
  }

  const insertOrderDetailsMutation = useMutation({
    mutationFn: (dataBody: OrderInsertDetailsParams) =>
      insertOrderDetails(dataBody),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const inserOrderMinMutation = useMutation({
    mutationFn: (dataBody: OrderMinParams) => insertOrderMin(dataBody),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const addItemToOrderMutation = useMutation({
    mutationFn: ({ dataBody, orderId }: AddItemToOrderParams) =>
      addItemToOrder(dataBody, orderId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateItemToOrderMutation = useMutation({
    mutationFn: ({ dataBody, orderId, orderItemId }: UpdateItemToOrderParams) =>
      updateItemToOrder(dataBody, orderId, orderItemId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const closeOrderByIdMutation = useMutation({
    mutationFn: (orderId: number) => closeOrderById(orderId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const removeOrderItemByIdMutation = useMutation({
    mutationFn: (orderId: number) => removeOrderItemById(orderId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

    const addPaymentToOrderMutation = useMutation({
    mutationFn: ({ dataBody, orderId }: AddPaymentoOrderParams) =>
      addPaymentToOrder(dataBody, orderId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deleteOrderByIdMutation = useMutation({
    mutationFn: (orderId: number) => deleteOrderById(orderId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order"] });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    useGetOrderById,
    insertOrderDetailsMutation,
    inserOrderMinMutation,
    addItemToOrderMutation,
    closeOrderByIdMutation,
    deleteOrderByIdMutation,
    removeOrderItemByIdMutation,
    updateItemToOrderMutation,
    addPaymentToOrderMutation,
    useGetOrdersMutation,
  };
}

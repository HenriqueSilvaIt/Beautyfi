import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getPaymentMethods,
  getPaymentCardFlag,
  postPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  postPaymentCardFlag,
  updatePaymentCardFlag,
  deletePaymentCardFlag,
} from "@/shared/services/payment.service";
import { PaymentCardFlagDTO, PaymentMethodDTO } from "@/shared/interfaces/http/order";
import { queryClient } from "../../../../queryClient";

export function usePaymentCrudMutation() {
  function useGetPaymentMethodsQuery() {
    return useQuery<PaymentMethodDTO[]>({
      queryKey: ["payment-methods"],
      queryFn: getPaymentMethods,
      staleTime: 0,
      refetchOnWindowFocus: false,
    });
  }

  function useGetPaymentCardFlagsQuery() {
    return useQuery<PaymentCardFlagDTO[]>({
      queryKey: ["payment-card-flags"],
      queryFn: getPaymentCardFlag,
      staleTime: 0,
      refetchOnWindowFocus: false,
    });
  }

  const paymentMethodCreateMutation = useMutation({
    mutationFn: (dto: PaymentMethodDTO) => postPaymentMethod(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });

  const paymentMethodUpdateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: PaymentMethodDTO }) =>
      updatePaymentMethod(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });

  const paymentMethodDeleteMutation = useMutation({
    mutationFn: (id: number) => deletePaymentMethod(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
    },
  });

  const paymentCardFlagCreateMutation = useMutation({
    mutationFn: (dto: PaymentCardFlagDTO) => postPaymentCardFlag(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-card-flags"] });
    },
  });

  const paymentCardFlagUpdateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: PaymentCardFlagDTO }) =>
      updatePaymentCardFlag(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-card-flags"] });
    },
  });

  const paymentCardFlagDeleteMutation = useMutation({
    mutationFn: (id: number) => deletePaymentCardFlag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-card-flags"] });
    },
  });

  return {
    useGetPaymentMethodsQuery,
    useGetPaymentCardFlagsQuery,
    paymentMethodCreateMutation,
    paymentMethodUpdateMutation,
    paymentMethodDeleteMutation,
    paymentCardFlagCreateMutation,
    paymentCardFlagUpdateMutation,
    paymentCardFlagDeleteMutation,
  };
}

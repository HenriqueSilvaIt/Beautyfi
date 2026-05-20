import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import {
  EStripeInvoiceState,
  SubscriberInvoiceDetailsDTO,
} from "@/shared/interfaces/http/stripe";
import { useStripeMutation } from "@/shared/queries/stripe/use-stripe-mutataion";
import { useState } from "react";

export function useInvoiceDetailsViewModel(invoiceId?: string) {
  const { useGetInvoiceDetailsById, createRefundMutation } =
    useStripeMutation();
  const { data, error, refetch, isLoading, isRefetching } =
    useGetInvoiceDetailsById(invoiceId);
const invoice = data;


  const [isRefunding, setIsRefunding] = useState(false);

  const [isRefundModalVisible, setIsRefundingModalVisible] = useState(false);

  function toggleHideModal() {
    setIsRefundingModalVisible(false);
  }

  function toggleRefundModal() {
    setIsRefundingModalVisible(true);
  }

  const { notify } = useSnackbarContext();
  const { handleError } = useErrorHandler();

  async function onCreateRefund(invoiceId?: string) {
    try {
      setIsRefunding(true);

      if (!invoiceId) {
  throw new Error("InvoiceId não informado");
}

      await createRefundMutation.mutateAsync({
        invoiceId: invoiceId,
        // amount opcional (se não colocar ele pega o valor total da fatura)
      });

      await refetch();

      notify({
        message: "Fatura reembolsada com sucesso!",
        type: "SUCCESS",
      });
    } catch (error) {
      handleError(error, "Erro ao reembolsar fatura.");
    } finally {
      setIsRefunding(false);
    }
  }

  const invoiceDetailsMock: SubscriberInvoiceDetailsDTO = {
    id: 11,
    createdAt: "2026-03-31T14:30:17.281890Z",
    updatedAt: "2026-04-01T21:04:31.032219112Z",
    total: 79,
    subTotal: 79,
    amountDue: 79,
    amountPaid: 79,
    amount: 0,
    created: "2026-03-31T14:16:42",
    dueDate: new Date(),
    customerStripeId: "cus_UENaFThsER6Nn9",
    status: EStripeInvoiceState.PAID,
    stripeInvoiceId: "in_1TH35yD0zP58uYkcLI8ZHubo",
    clientSecret:
      "pi_3TH35zD0zP58uYkc1ZkWi804_secret_fuEiLLdmpG3A9p9hL8ENzlWCB",
    paymentIntentId: "pi_3TH35zD0zP58uYkc1ZkWi804",
    paidAt: "null",
    invoicePdfUrl:
      "https://pay.stripe.com/invoice/acct_1SG7HcD0zP58uYkc/test_YWNjdF8xU0c3SGNEMHpQNTh1WWtjLF9VRllDbEJWTE1oR3V4a3NYcGdyempacnJwUERHSk1oLDE2NTYxODI2OQ0200guXu3rP7/pdf?s=ap",
    hostedInvoiceUrl:
      "https://invoice.stripe.com/i/acct_1SG7HcD0zP58uYkc/test_YWNjdF8xU0c3SGNEMHpQNTh1WWtjLF9VRllDbEJWTE1oR3V4a3NYcGdyempacnJwUERHSk1oLDE2NTYxODI2OQ0200guXu3rP7?s=ap",
    refunded: false,
    refundedAmount: 0,
    refundedAt: "",
    refundId: "",
    companyId: 0,
    productDescriptions: [],
  };

  return {
    invoice,
    data,
    invoiceDetailsMock,
    error,
    refetch,
    isLoading,
    isRefetching,
    onCreateRefund,
    isRefunding,
    setIsRefunding,
    toggleRefundModal,
    isRefundModalVisible,
    toggleHideModal,
  };
}

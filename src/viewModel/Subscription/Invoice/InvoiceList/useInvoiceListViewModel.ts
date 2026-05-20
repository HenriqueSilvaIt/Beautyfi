import {
  EStripeInvoiceState,
  SubscriberInvoiceDTO,
} from "@/shared/interfaces/http/stripe";
import { useStripeMutation } from "@/shared/queries/stripe/use-stripe-mutataion";

import { useSubscriberStore } from "@/shared/store/subscriber-store";
import { useUserStore } from "@/shared/store/user-store";

export function useInvoiceListViewModel() {
  const { useListInvoiceMutation } = useStripeMutation();
  const setSubscriber = useSubscriberStore((state) => state.setSubscriberId);
  const subscriber = useSubscriberStore((state) => state.subscriberId);
 const {user} = useUserStore();
const customerId = subscriber ?? user?.stripeCustomerId ?? "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useListInvoiceMutation(customerId);

  const invoicesListMock: SubscriberInvoiceDTO[] = [
    {
      id: 11,
      status: EStripeInvoiceState.OPEN,
      created: "2026-03-31T14:16:42",
      amountDue: 79.0,
      amountPaid: 79.0,
      dueDate: new Date(),
      periodStart: "",
      periodEnd: "",
      customerStripeId: "cus_UENaFThsER6Nn9",
      stripeInvoiceId: "in_1TH35yD0zP58uYkcLI8ZHubo",
      paymentIntentId: "pi_3TH35zD0zP58uYkc1ZkWi804",
    },
    {
      id: 10,
      status: EStripeInvoiceState.PAID,
      created: "2026-03-31T13:57:36",
      amountDue: 79.0,
      amountPaid: 79.0,
      dueDate: new Date(),
      periodStart: "",
      periodEnd: "2026-04-30T14:16:42",
      customerStripeId: "cus_UENaFThsER6Nn9",
      stripeInvoiceId: "in_1TH2nUD0zP58uYkcG0szSRc6",
      paymentIntentId: "pi_3TH2nVD0zP58uYkc1WPzuApk",
    },
    {
      id: 9,
      status: EStripeInvoiceState.PAST_DUE,
      created: "2026-03-31T09:19:35",
      amountDue: 79.0,
      amountPaid: 79.0,
      dueDate: new Date(),
      periodStart: "",
      periodEnd: "",
      customerStripeId: "cus_UENaFThsER6Nn9",
      stripeInvoiceId: "in_1TGySRD0zP58uYkcRobNsAxs",
      paymentIntentId: "",
    },
  ];
  const invoices = data?.pages?.flatMap((page) => page.content ?? []) ?? [];
  return {
    invoicesListMock,
    invoices,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
    subscriber,
    setSubscriber,
  };
}

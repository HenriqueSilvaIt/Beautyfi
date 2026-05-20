import { AdminSubscribersDTO, EStripeInvoiceState, ESubscriptionState } from "@/shared/interfaces/http/stripe";
import { useStripeMutation } from "@/shared/queries/stripe/use-stripe-mutataion";
import { useSubscriberStore } from "@/shared/store/subscriber-store";

export function useSubscribersViewModel() {
  const { useListAdminSubscribersMutation } = useStripeMutation();

  const setSubscriber = useSubscriberStore((state) => state.setSubscriberId);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
  } = useListAdminSubscribersMutation();

const subscribers =
  data?.pages?.flatMap((page) => page.content ?? []) ?? [];
  const subscribersMock: AdminSubscribersDTO[] = Array.from(
  { length: 20 },
  (_, index) => ({
    userName: `Cliente ${index + 1}`,
    userEmail: `cliente${index + 1}@gmail.com`,
    customerId: `cus_TEST_${(index + 1)
      .toString()
      .padStart(3, "0")}`,

    planName:
      index % 3 === 0
        ? "Corte"
        : index % 3 === 1
        ? "Corte + Barba"
        : "Premium",
      avatarUrl: "",
    cutsAllowed:
      index % 3 === 0
        ? 4
        : index % 3 === 1
        ? 6
        : 8,

    cutsUsed: index % 8,

    amount:
      index % 3 === 0
        ? 79
        : index % 3 === 1
        ? 119
        : 149,

    dueDate: new Date(),

    paidAt:
      index % 2 === 0
        ? ""
        : "2026-04-01T09:00:00",

    startDate: "2026-03-31T14:16:42",
    endDate: "2026-04-30T14:16:42",

    invoiceStatus:
      index % 4 === 0
        ? EStripeInvoiceState.PENDING
        : index % 4 === 1
        ? EStripeInvoiceState.PAID
        : index % 4 === 2
        ? EStripeInvoiceState.PAST_DUE
        : EStripeInvoiceState.VOID,

    subscriptionStatus:
      index % 5 === 0
        ? ESubscriptionState.ACTIVE
        : index % 5 === 1
        ? ESubscriptionState.PAST_DUE
        : index % 5 === 2
        ? ESubscriptionState.CANCEL_SCHEDULED
        : index % 5 === 3
        ? ESubscriptionState.EXPIRED
        : ESubscriptionState.RENOVATED,

    cancelAtPeriodEnd: index % 5 === 2,
  })
);

  return {
    subscribersMock,
    subscribers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
    isRefetching,
    setSubscriber,
  };
}

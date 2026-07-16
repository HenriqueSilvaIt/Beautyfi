import {
  AssociatedEmployeesParams,
  CustormerStripeParam,
  PaymentIntentParam,
  StripePlanDTO,
  StripePlanItemDTO,
  StripePlanParam,
  StriplePlanItemInserParams,
  SubscriberInvoiceDetailsDTO,
  SubscriptionStripeParam,
  SubscriptionStripePlanDTO,
  SubscriptionStripePlanParams,
  UserSubscriptionDTO,
} from "@/shared/interfaces/http/stripe";
import {
  addItemToPlan,
  removeItemFromPlan,
  fetchItemsByPlanId,
  associateEmployeeToPlan,
  dissociateEmployeeFromPlan,
  fetchEmployeesByPlanId,
  adminGetSubscribers,
  cancelSubscription,
  createCustomer,
  createPlan,
  createRefund,
  createSubscritpion,
  deletePlanById,
  fetchSubscriptionPlans,
  getMySubscriptionPlan,
  getPlanById,
  getSubscriberInvoiceByInvoiceId,
  getSubscriberInvoicesByCustomerId,
  listInvoices,
  listSubscriptions,
  paymentIntent,
  reactivateSubscription,
  updatePlan,
  updateSubscription,
  fetchItemById,
  upsertEmployeeInPlan,
} from "@/shared/services/stripe.service";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { queryClient } from "../../../../queryClient";
import { useUserStore } from "@/shared/store/user-store";

export interface UpdateSubscriptionProps {
  subscriptionId: string;
  newPriceId: string;
}

export interface RefundSubscriberInvoiceProps {
  invoiceId: string;
  amount?: number;
}

export function useGetSubscriptionPlansQuery(companyId?: number) {
  const queryClient = useQueryClient();
  return useQuery<StripePlanDTO[], Error>({
    queryKey: ["subscription-plans", companyId],
    queryFn: () => fetchSubscriptionPlans(companyId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useStripeMutation() {
  const getSubscritionPlans = useMutation({
    mutationFn: (customerId: string) => listInvoices(customerId),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function useListAdminSubscribersMutation(name?: string) {
    return useInfiniteQuery({
      queryKey: ["subscribers", name],
      queryFn: ({ pageParam = 0 }) => adminGetSubscribers(name, pageParam, 10),

      initialPageParam: 0,

      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos em cache, evita refetch imediato
    });
  }

  function useListInvoiceMutation(customerId: string) {
    return useInfiniteQuery({
      queryKey: ["subscriber-invoices", customerId],
      //Porque o cache será separado por cliente.
      queryFn: ({ pageParam = 0 }) =>
        getSubscriberInvoicesByCustomerId(customerId, pageParam, 10),
      enabled: !!customerId, // só roda quando customerId existir

      initialPageParam: 0,

      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos em cache, evita refetch imediato
    });
  }

  const createRefundMutation = useMutation({
    mutationFn: ({ invoiceId, amount }: RefundSubscriberInvoiceProps) =>
      createRefund(invoiceId, amount),
    onSuccess: (response) => {
      (queryClient.invalidateQueries({ queryKey: ["subscriber-invoice"] }),
        queryClient.invalidateQueries({ queryKey: ["invoice"] }));
      queryClient.invalidateQueries({ queryKey: ["my-subscription-plans"] });
    },
  });

  const createPlanMutation = useMutation({
    mutationFn: (dataBody: StripePlanParam) => createPlan(dataBody),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription-plans"] });

      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function useGetPlanByIdQuery(id?: number) {
    return useQuery<StripePlanDTO>({
      queryKey: ["plan", id],
      queryFn: () => getPlanById(id!),
      enabled: !!id,
    });
  }

  function useGetInvoiceDetailsById(id?: string) {
    return useQuery<SubscriberInvoiceDetailsDTO>({
      queryKey: ["invoice", id],
      queryFn: () => {
        if (!id) throw new Error("ID is required");
        return getSubscriberInvoiceByInvoiceId(id);
      },
      enabled: !!id,
    });
  }

  function useGetMySubscriptionPlanQuery() {
    const { user, access_token } = useUserStore();

    return useQuery({
      queryKey: ["my-subscription-plans"],
      queryFn: () => getMySubscriptionPlan(),
      enabled: !!access_token,
      staleTime: 1000,
    });
  }

  const useGetMyPlanPlanMutation = useMutation({
    mutationFn: () => getMySubscriptionPlan(),
    onSuccess: (response) => {
      console.log(
        `Resposta da API getMySubscriptionPlan (mutation):`,
        response,
      );
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const getPlanByIdMutation = useMutation({
    mutationFn: (id: number) => getPlanById(id),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ dataBody, id }: { dataBody: StripePlanParam; id: number }) =>
      updatePlan(dataBody, id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      queryClient.invalidateQueries({ queryKey: ["plan", response.id] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription-plans"] });
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: (id: number) => deletePlanById(id),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["subscription-plans"] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription-plans"] });

      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function useGetItemByIdQuery(itemId?: number) {
    return useQuery<StripePlanItemDTO>({
      queryKey: ["plan-item", itemId],
      queryFn: () => fetchItemById(itemId!),
      enabled: !!itemId,
    });
  }

  function useGetPlanItemsByPlanIdQuery(planId?: number) {
    return useInfiniteQuery({
      queryKey: ["plan-items", planId],
      //Porque o cache será separado por cliente.
      queryFn: ({ pageParam = 0 }) =>
        fetchItemsByPlanId(Number(planId), pageParam, 10),
      enabled: !!planId, // só roda quando customerId existir

      initialPageParam: 0,

      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos em cache, evita refetch imediato
    });
  }

  const addItemToPlanMutation = useMutation({
    mutationFn: ({
      planId,
      dataBody,
    }: {
      planId: number;
      dataBody: StriplePlanItemInserParams;
    }) => addItemToPlan(planId, dataBody),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["plan-items", variables.planId],
      });
      console.log(response);
    },
  });

  const removeItemFromPlanMutation = useMutation({
    mutationFn: ({ planId, itemId }: { planId: number; itemId: number }) =>
      removeItemFromPlan(planId, itemId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["plan-items", variables.planId],
      });
      console.log(response);
    },
  });

  const getEmployeesByPlanIdQuery = (planId?: number) => {
    return useInfiniteQuery({
      queryKey: ["plan-employees", planId],
      //Porque o cache será separado por cliente.
   queryFn: ({ pageParam = 0 }) =>
  fetchEmployeesByPlanId({
    page: pageParam,
    size: 10,
    planId: Number(planId),
  }),
      enabled: !!planId, // só roda quando customerId existir

      initialPageParam: 0,

      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 1000 * 60 * 5, // 5 minutos em cache, evita refetch imediato
    });
  };


 const upsertEmployeeInPlanMutation = useMutation({
    mutationFn: ({
      planId,
      dataBody
        }: {
      planId: number;
      dataBody: AssociatedEmployeesParams;
    }) => upsertEmployeeInPlan(planId, dataBody),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plan-employees", variables.planId] });

      queryClient.invalidateQueries({ queryKey: ["plan", variables.planId] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription-plans"] });
      console.log(response);
    },
  });

  const associateEmployeeToPlanMutation = useMutation({
    mutationFn: ({
      planId,
      employeeId,
    }: {
      planId: number;
      employeeId: number;
    }) => associateEmployeeToPlan(planId, employeeId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plan-employees", variables.planId] });

      queryClient.invalidateQueries({ queryKey: ["plan", variables.planId] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription-plans"] });
      console.log(response);
    },
  });

  const dissociateEmployeeFromPlanMutation = useMutation({
    mutationFn: ({
      planId,
      employeeId,
    }: {
      planId: number;
      employeeId: number;
    }) => dissociateEmployeeFromPlan(planId, employeeId),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: ["plan", variables.planId] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription-plans"] });
      console.log(response);
    },
  });

  const listSubscriptionsMutation = useMutation({
    mutationFn: (customerId: string) => listSubscriptions(customerId),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const createCustomerMutation = useMutation({
    mutationFn: (dataBody: CustormerStripeParam) => createCustomer(dataBody),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const createSubscritpionMutation = useMutation({
    mutationFn: (dataBody: SubscriptionStripeParam) =>
      createSubscritpion(dataBody),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const updateSubscriptionMutation = useMutation({
    mutationFn: ({ subscriptionId, newPriceId }: UpdateSubscriptionProps) =>
      updateSubscription(subscriptionId, newPriceId),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: (subscriptionId: string) => cancelSubscription(subscriptionId),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const reactivateSubscriptionMutation = useMutation({
    mutationFn: (subscriptionId: string) =>
      reactivateSubscription(subscriptionId),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const paymentIntentMutation = useMutation({
    mutationFn: (dataBody: PaymentIntentParam) => paymentIntent(dataBody),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    useListInvoiceMutation,
    useListAdminSubscribersMutation,
    listSubscriptionsMutation,
    createPlanMutation,
    getPlanByIdMutation,
    updatePlanMutation,
    deletePlanMutation,
    createCustomerMutation,
    createSubscritpionMutation,
    updateSubscriptionMutation,
    paymentIntentMutation,
    createRefundMutation,
    cancelSubscriptionMutation,
    reactivateSubscriptionMutation,
    getSubscritionPlans,
    useGetPlanByIdQuery,
    useGetMyPlanPlanMutation,
    useGetMySubscriptionPlanQuery,
    useGetInvoiceDetailsById,
    useGetPlanItemsByPlanIdQuery,
    addItemToPlanMutation,
    removeItemFromPlanMutation,
    useGetItemByIdQuery,
    upsertEmployeeInPlanMutation,
    getEmployeesByPlanIdQuery,
    associateEmployeeToPlanMutation,
    dissociateEmployeeFromPlanMutation,
  };
}

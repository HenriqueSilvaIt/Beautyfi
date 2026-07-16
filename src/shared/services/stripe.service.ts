import { styleAppApiClient } from "../api/styleAppBackend";
import { EmployeeOption } from "../interfaces/http/available-appointments";
import {
  AdminSubscribersDTO,
  AdminSubscribersResponse,
  AssociatedEmployeesParams,
  AssociatedEmployeesResponse,
  CustomerStripeDTO,
  CustormerStripeParam,
  InvoiceStripeResponse,
  PaymentIntentDTO,
  PaymentIntentParam,
  StripePlanDTO,
  StripePlanItemDTO,
  StripePlanParam,
  StripePlanResponse,
  StriplePlanItemInserParams,
  SubscriberInvoiceDetailsDTO,
  SubscriberInvoiceResponse,
  SubscriptionStripeDTO,
  SubscriptionStripeParam,
  SubscriptionStripePlanDTO,
  SubscriptionStripeResponse,
  UserSubscriptionDTO,
} from "../interfaces/http/stripe";

import { useUserStore } from "../store/user-store";

export async function fetchSubscriptionPlans(companyId?: number) {
  const { data } =
    await styleAppApiClient.get<StripePlanDTO[]>(`/subscriptions/plans`, {
      params: { companyId },
    });

  return data;
}

export async function listInvoices(customerId: string) {
  const { data } = await styleAppApiClient.get<InvoiceStripeResponse[]>(
    `/stripe/invoices?customerId=${customerId}`,
  );

  return data;
}

export async function listSubscriptions(customerId: string) {
  const { data } = await styleAppApiClient.get<SubscriptionStripeResponse[]>(
    `/stripe/subscriptions?customerId=${customerId}`,
  );

  return data;
}

export async function createPlan(dataBody: StripePlanParam) {
  const { data } = await styleAppApiClient.post<StripePlanDTO>(
    `/stripe/subscriptions/plan`,
    dataBody,
  );

  return data;
}

export async function getPlanById(id: number) {
  const { data } = await styleAppApiClient.get<StripePlanDTO>(
    `/subscriptions/plans/${id}`,
  );
  return data;
}

export async function updatePlan(dataBody: StripePlanParam, id?: number) {
  const { data } = await styleAppApiClient.put<StripePlanDTO>(
    `/subscriptions/plans/${id}`,
    dataBody,
  );

  return data;
}

export async function deletePlanById(id: number) {
  const { data } = await styleAppApiClient.delete<StripePlanDTO>(
    `/subscriptions/plans/${id}`,
  );
  return data;
}

export async function fetchItemById(itemId: number) {
  const { data } = await styleAppApiClient.get<StripePlanItemDTO>(
    `/subscriptions/items/${itemId}`,
  );
  return data;
}

export async function fetchItemsByPlanId(
  planId: number,
  number: number = 0,
  size: number = 10
) {

  const { data } = await styleAppApiClient.get<StripePlanResponse>(
    `/subscriptions/${planId}/items`,
  );
  return data;
 }

 export async function addItemToPlan(planId: number, dataBody: StriplePlanItemInserParams) {
  const { data } = await styleAppApiClient.post<StripePlanItemDTO>(
    `/subscriptions/${planId}/items`,
    dataBody
  );
  return data;
 }

export async function removeItemFromPlan(planId: number, itemId: number) {
  const { data } = await styleAppApiClient.delete(
    `/subscriptions/${planId}/items/${itemId}`
  );
  return data;
}

export async function upsertEmployeeInPlan(planId: number, dataBody: AssociatedEmployeesParams) {
  const { data } = await styleAppApiClient.put<AssociatedEmployeesResponse>(
    `/subscriptions/${planId}/employees`,
    dataBody
  );  
  return data;
}

export async function fetchEmployeesByPlanId({
  page = 0,
  size = 10,
  planId,
}: {
  page?: number;
  size?: number;
  planId: number;
}) {
  const { data } = await styleAppApiClient.get<AssociatedEmployeesResponse>(
    `/subscriptions/${planId}/employees` ,
 {
    params:{
        page,
        size
      
    }
  } 
    );  
    console.log(data)

    return data;
  }


export function associateEmployeeToPlan (planId: number, employeeId: number) {
  return styleAppApiClient.post(`/subscriptions/${planId}/employees/${employeeId}`);

}

export function dissociateEmployeeFromPlan (planId: number, employeeId: number) {
  return styleAppApiClient.delete(`/subscriptions/${planId}/employees/${employeeId}`);  
  
}

  

export async function createCustomer(dataBody: CustormerStripeParam) {
  const { data } = await styleAppApiClient.post<CustomerStripeDTO>(
    `/stripe/customers`,
    dataBody,
  );
  return data;
}

export async function createSubscritpion(dataBody: SubscriptionStripeParam) {
  const { data } = await styleAppApiClient.post<{
    clientSecret: string;
    subscriptionId: string;
  }>(`/stripe/subscriptions`, dataBody);

  return data;
}

export async function updateSubscription(
  subscriptionId: string,
  newPriceId: string,
) {
  const { data } = await styleAppApiClient.post<SubscriptionStripeResponse>(
    `/stripe/subscriptions/update/${subscriptionId}/${newPriceId}`,
  );

  return data;
}

export async function cancelSubscription(subscriptionId: string) {
  const { data } = await styleAppApiClient.post<SubscriptionStripeResponse>(
    `/stripe/subscriptions/cancel/${subscriptionId}`,
  );

  return data;
}

export async function reactivateSubscription(subscriptionId: string) {
  const { data } = await styleAppApiClient.post<SubscriptionStripeResponse>(
    `/stripe/subscriptions/reactivate/${subscriptionId}`,
  );

  return data;
}

export async function getMySubscriptionPlan() {
  try {
    const { data } = await styleAppApiClient.get<UserSubscriptionDTO>(
      `/subscriptions/plans/me`,
    );

    return data;
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return null; // 👈 SEM ASSINATURA
    }
  }
}



export async function adminGetSubscribers(
  name?: string,
  page: number = 0,
  size: number = 10,
) {

  const {data} = await styleAppApiClient.get<AdminSubscribersResponse>
  (`/subscriptions/admin/subscribers`, {
    params: {
      name,
      page,
      size
    }
  });
  return data;
}
 
export async function getSubscriberInvoiceByInvoiceId(invoiceId?: string) {

  const {data} = await styleAppApiClient.get<SubscriberInvoiceDetailsDTO>(`/stripe/invoice/${invoiceId}`)

  return data;

}

    export async function getSubscriberInvoicesByCustomerId(
      customerId: string,
      page: number = 0,
      size: number = 10
    ) {
      const { data } = await styleAppApiClient.get<SubscriberInvoiceResponse>(
        `/stripe/invoices/${customerId}`,
        {
          params: {
            page,
            size,
          }, 
        }
      );

      return data;
    }

export async function createRefund(invoiceId: string, amount?: number) {

  const {data} = await styleAppApiClient.post(`/stripe/refund/${invoiceId}?amount=${amount}`)
  return data;
}

export async function paymentIntent(dataBody: PaymentIntentParam) {
  const { data } = await styleAppApiClient.post<PaymentIntentDTO>(
    `/stripe/payment-intent`,
    dataBody,
  );
  return data;
}

import { EDayWeek, EmployeeDtoMin } from "./employee";

export enum ESubscriptionState {
  ACTIVE = "ACTIVE",
  PAST_DUE = "PAST_DUE", // FALHo
  PENDING = "PENDING",
  CANCELED = "CANCELED",
  CANCEL_SCHEDULED = "CANCEL_SCHEDULED",
  DEACTIVATED = "DEACTIVATED",
  RENOVATED = "RENOVATED",
  EXPIRED = "EXPIRED",
}

export enum EStripeInvoiceState {
  OPEN = "OPEN",
  VOID = "VOID",
  PENDING = "OVERDUE",
  OVERDUE = "OVERDUE", // Inadimplente
  PAST_DUE = "PAST_DUE",
  PAID = "PAID",
}

export enum EStripePlanItemType {
  SERVICE = "SERVICE",
  PRODUCT = "PRODUCT",
}

export interface InvoiceStripeResponse {
  id: string;
  amountDue: number;
  status: string;
  created: number;
}

export interface StripePlanParam {
  name: string;
  description: string;
  amount: number;
  cutsAllowed: number;
  commissionPercentage?: number
}

export interface StripePlanDTO {
  id: number;
  name: string;
  description: string;
  productId: string;
  priceId: string;
  cutsAllowed: number;
  amount: number;
  active: true;
  commissionPercentage: number | null;
  userSubscriptions: [];
  company: number | null;
  employees: [];
  stripePlanPresentations: [];
  stripePlanContracts: [];
  createdAt: number;
}

export interface SubscriptionStripePlanDTO {
  id: number;
  name: string;
  description: string;
  stripeProductId: string;
  stripePriceId: string;
  cutsAllowed: number;
  amount: number;
  active: boolean;
  commissionPercentage: number;
  userSubscriptions: [];
  company: number;
  employee: [];
  stripePlanPresentations: [];
  stripePlanContracts: [];
  createdAt: string;
}

export interface AssociatedEmployeesResponse {
  
    content: EmployeeDtoMin[];
    totalElements: number;
    totalPages: number;
    page: number;
    size: number;
    number: number;
    numberOfElements: number;
    last: boolean;
  }
export interface AssociatedEmployeesParams {
  
  employeeIds: number[]
}

export interface StripePlanItemDTO {

  id: number;
  type: EStripePlanItemType;
  discountPercentage:  number;
  cutsAllowed: number;
  weekDays: EDayWeek[];
  productId: number;
  productName: string;
  productImgUrl: string;
  serviceId: number;
  serviceName: string;
  serviceImgUrl: string;
}

export interface StriplePlanItemInserParams {
  type: EStripePlanItemType;
  discountPercentage: number;
  cutsAllowed: number;
  weekDays?: EDayWeek[];
  productId?: number;
  serviceId?: number;

}


export interface StripePlanResponse {
  content: StripePlanItemDTO[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}


export interface CustormerStripeParam {
  email: string;
  name: string;
}

export interface CustomerStripeDTO {
  id: string;
  email: string;
  name: string;
}

export interface PaymentIntentParam {
  customerId?: string;
  amount: number;
  productName: string;
  productId: string;
  companyId?: number;
}

export interface PaymentIntentDTO {
  paymentIntentId: string;
  clientSecret: string;
  pixQrCodeUrl?: string;
  pixCopiaECola?: string;
  pixExpiresAt?: number;
}

export interface UserSubscriptionDTO {
  id: number;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  priceId: string;
  cutsAllowed: number;
  cutsUsed: number;
  periodStart: string;
  periodEnd: string;
  status: ESubscriptionState;
  cancelAtPeriodEnd?: boolean;
}

export interface SubscriptionStripeParam {
  customerId?: string;
  priceId: string;
  userId?: number;
}

export interface SubscriptionStripeDTO {
  clientSecret: string;
  subscriptionId: string;
}
export interface SubscriptionStripeResponse {
  id: string;
  status: string;
  customerId: string;
  priceId: string;
  periodStart: number;
  periodEnd: number;
  productName: string;
  productDescription: string;
  clientSecret: string;
}

export interface SubscriptionStripePlanParams {
  name: string;
  description: string;
  amount: number;
  cutsAllowed: number;
}

export interface SubscriberInvoiceDTO {
  id: number;
  status: EStripeInvoiceState;
  created: string;
  amountDue: number;
  amountPaid: number;
  dueDate: Date;
  periodStart: string;
  periodEnd: string;
  customerStripeId: string;
  stripeInvoiceId: string;
  paymentIntentId: string;
}

export interface SubscriberInvoiceResponse {
  content: SubscriberInvoiceDTO[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}

export interface SubscriberInvoiceDetailsDTO {
  id: number;
  createdAt: string;
  updatedAt: string;
  total: number;
  subTotal: number;
  amountDue: number;
  amountPaid: number;
  amount: number;
  created: string;
  dueDate: Date;
  customerStripeId: string;
  status: EStripeInvoiceState;
  stripeInvoiceId: string;
  clientSecret: string;
  paymentIntentId: string;
  paidAt: string;
  invoicePdfUrl: string;
  hostedInvoiceUrl: string;
  refunded: boolean;
  refundedAmount: number;
  refundedAt: string;
  refundId: string;
  companyId: number;
  productDescriptions: string[];
}

export interface AdminSubscribersDTO {
  userName: string;
  userEmail: string;
  planName: string;
  customerId: string;
  cutsAllowed: number;
  cutsUsed: number;
  avatarUrl: string;
  amount: number;
  dueDate: Date;
  paidAt: string;
  startDate: string;
  endDate: string;
  invoiceStatus: EStripeInvoiceState;
  subscriptionStatus: ESubscriptionState;
  cancelAtPeriodEnd: boolean;
}
export interface AdminSubscribersResponse {
  content: AdminSubscribersDTO[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}

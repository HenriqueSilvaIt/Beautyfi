import { number } from "yup";
import { EmployeeProps } from "./employee";

export enum EOrderStatus {
  WAITING_PAYMENT = "WAITING_PAYMENT",
  PAID = "PAID",
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  CANCELED = "CANCELED",
}

export enum EPaymentStatus {
  PENDING = "PEDING",
  PROCESSING = "PROCESSING",
  CONFIRMED = "CONFIRMED",
  PAID = "PAID",
  FAILED = "FAILED",
  CANCELED = "CANCELED",
  REFUNDED = "REFUNDED",
}

export enum ECardFlagDayType {
  WOKRING_DAYS = "WORKING_DAYS",
  CALENDAR_DAYS = "CALENDAR_DAYS",
}

export enum EPaymentStatus {}

export interface EmployeeOrderDTO {
  id: number;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface PaymentCardFlagDTO {
  id: number;
  name: string;
  fee: number;
  dayDelay: number;
  dayType: ECardFlagDayType;
}

export interface PaymentMethodDTO {
  id: number;
  fee: number;
  name: string;
  card: boolean;
}

export interface PaymentInterface {
  id: number;
  moment: Date;
  amount: number;
  applicationFee: number;
  status: EPaymentStatus;
  paymentIntentId: number;
  installment?: number;
  paymentMethodDTO: PaymentMethodDTO;
  paymentMethodId: number;
  paymentCardFlagDto: PaymentCardFlagDTO;
}

export interface OrderItemInsertParams {
  id?: number;
  productId?: number;
  serviceId?: number;
  userId?: number;
  dateScheduled?: string;
  employeeId?: number;
  quantity?: number;
  price?: number;
  toUse?: boolean;
  courtesy?: boolean;
}

export interface PaymentInsertDTO {
  amount?: number;
  status?: EPaymentStatus;
  installment: number;
  paymentMethodId: number;
  paymentCardFlagId?: number;
}

export interface OrderInsertDetailsParams {
  orderId: number;
  tip?: number;
  total?: number;
  discount?: number;
}

export interface OrderMinParams {
  moment: String;
  clientId?: number;
  employeeId: number;
  additionalInfo: string;
  orderNumber: string | null;
  isEmployee?: boolean;
}

export interface OrderUserInterface {
  id: number;
  name: string;
}

export interface OrderItemsInterface {
  id: number;
  serviceId: number;
  dateScheduled: string;
  dateEnd: string;
  servicePrice: number;
  serviceName: string;
  productId: number;
  toUse: boolean;
  courtesy: boolean;
  name: string;
  commissionAtMomen: number;
  usingSubscription?: boolean;
  
  price: number;
  quantity: number;
  imgUrl: string;
  employeeName: string;
  serviceDuration: number;
}

export interface OrderInterface {
  id: number;
  moment: string;
  isEmployee?: boolean;
  status: EOrderStatus;
  user: OrderUserInterface;
  payment: PaymentInterface | null;
  additionalInfo: string;
  employee: EmployeeOrderDTO;
  total: number;
  employeeId: number;
  createdBy: string | null;
  closedBy: string | null;
  orderNumber: string | null;
  items: OrderItemsInterface[];
  tip: number;
  discountPercent: number;
}

export interface OrderHttpResponse {
  content: OrderInterface[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}

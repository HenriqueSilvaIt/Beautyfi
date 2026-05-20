import { UserInterface, UserProps } from "../user";
import { ClientInterface } from "./client";
import { CompanyServicesProps } from "./company-services";
import { EmployeeProps } from "./employee";

export enum AppointmentStatus {
  AVAILABLE = "AVAILABLE",
  SCHEDULED = "SCHEDULED",
  CONFIRMED = "CONFIRMED",
  CANCELED = "CANCELED",
}

export enum EAppointmentType {
  CLIENT = "CLIENT",
  ADMIN = "ADMIN",
  IA = "IA",
}

export interface AppointmentServices {
  serviceId: number | undefined;
  priceAtMoment: number;
  durationAtMoment: number;
  discount: number;
  notes: string;
  appointmentId: number;
  service: CompanyServicesProps;
}

export interface AppointmentProps {
  id: number;
  dateScheduled: Date;
  status: AppointmentStatus;
  user: UserProps;
  employee: EmployeeProps;
  services: AppointmentServices[];
  schedulingFitIn?: boolean;
  additionalInfo?: string;
  blocked?: boolean;
  dateEnd?: Date;
  type?: EAppointmentType;
  client?: ClientInterface;
  usingSubscription?: boolean;
}

export interface AppointmentServicesHttpParams {
  serviceId: number | undefined;
}

export interface fetchAppointmentsParams {
  page: number;
  perPage?: number;
}

export interface AppointmentHttpStatusParams {
  status: AppointmentStatus;
}

export interface AppointmentsParams {
  page?: number;
  size?: number;
}

export interface AppointmentHttpParams {
  page?: number;
  perPage?: number;
  dateScheduled: string;
  additionalInfo?: string;
  status: AppointmentStatus;
  employeeId?: number | null;
  services: AppointmentServicesHttpParams[];
  clientId?: number;
  schedulingFitIn?: boolean;
  usingSubscription?: boolean;
  client?: ClientInterface;
}

export interface AppointmentBlockHttpParams {
  page?: number;
  perPage?: number;
  dateScheduled: string;
  dateEnd: string;
  status: AppointmentStatus;
  employeeId?: number | null;
  schedulingFitIn?: boolean;
  blocked: boolean;
}

export interface AppointmentHttpResponse {
  content: AppointmentProps[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}

export interface Pagination {
  totalRows: number;
  totalPages: number;
  page: number;
  perPage: number;
}

import { CompanyServicesProps } from "./company-services";

export interface AvailableEmployeesProps {
  id?: number;
  name: string;
  avatarUrl: string;
  price: number;
  commissionFee: number;
  duration: number;
}

export type EmployeeOption =
  | AvailableEmployeesProps
  | {
      id?: number | null;
      name: string;
      avatarUrl?: string;
      price?: number;
      commissionFee?: number;
      duration?: number;
    };

export interface AvailableAppointmentsProps {
  dateBooking: Date;
  availableEmployees: AvailableEmployeesProps[];
  service: CompanyServicesProps;
}

export interface AvailableAppointmentsHttpResponse {
  content: AvailableAppointmentsProps[];
  totalRows: number;
  totalPage: number;
  number: number;
  size: number;
  last: boolean;
  numberOfElements: number;
}

export interface AvailableAppointmentsHttpParams {
  employeeId?: number | null;
  serviceIds?: number[]; 
    date: string;
}

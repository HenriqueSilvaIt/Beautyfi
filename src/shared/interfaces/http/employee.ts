export type EDayWeek =
  | "Segunda"
  | "Terça"
  | "Quarta"
  | "Quinta"
  | "Sexta"
  | "Sábado"
  | "Domingo";

export const DAYS_WEEK: EDayWeek[] = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo",
];

export interface EmployeeProps {
  id: number;
  name: string;
  email: string;
  password?: string;
  description: string;
  phone: string;
  avatarUrl: string;
  firstTime: string;
  secondTime: string;
  thirdTime: string;
  lastTime: string;
  workDays?: EDayWeek[];
  schedule?: EmployeeWorkDays[];
}

export interface EmployeeWorkTimes {
  start: string;
  end: string;
}

export interface EmployeeWorkDays {
  day: EDayWeek;
  times: EmployeeWorkTimes[];
}

export interface ServiceEmployeeParam {
  id?: number;
}

export interface EmployeeInterface {
  id?: number;
  name: string;
  email: string;
  password?: string | null;
  description?: string;
  phone?: string;
  avatarUrl?: string;
  firstTime?: string;
  secondTime?: string;
  thirdTime?: string;
  lastTime?: string;
  daysWeek?: EDayWeek[];
  schedule?: EmployeeWorkDays[];
  services?: ServiceEmployeeParam[];
}

export interface CreateEmployeeDTO {
  name: string;
  description?: string;
  phone?: string;
  comissionRate: number;
  avatarUrl?: string;
  firstTime: string;
  secondTime: string;
  thirdTime: string;
  lastTime: string;
}

export interface DayPrice {
  dayWeek: string;
  customPrice: number;
  customCommission: number;
}

export interface ServiceEmployeeParams {
  employeeId: number;
  serviceId: number;
  customPrice?: number;
  customDuration?: number;
  customCommission?: number;
  dayPrices?: DayPrice[];
}

export interface ServiceEmployeeInterface {
  id: number;
  serviceId: number;
  employeeId: number;
  dayPrices: DayPrice[];
  customPrice: number;
  customDuration: number;
  customCommission: number;
}

export interface  EmployeeDtoMin {
  id?: number;
  name: string;
  avatarUrl?: string;
  price?: number;
  commissionFee?: number;
  duration?: number;
}

export interface EmployeeHttpRepsonse {
  content: EmployeeProps[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}

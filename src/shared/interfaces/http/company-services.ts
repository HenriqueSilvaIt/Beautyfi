import { ServiceEmployeeParam } from "./employee";

export interface CompanyServicesProps {
  id: number;
  name: string;
  price: number;
  description?: string;
  priceDescription?: string;
  availableInApp?: boolean;
  requiresDeposit?: boolean;
  depositType?: "PERCENTAGE" | "FIXED";
  depositAmount?: number;
  noShowFee?: number;
  noShowApplyToAll?: boolean;
  noShowClientIds?: number[];
  imgUrl?: string;
  duration: number;
  companyId?: number;
}

export interface CompanyServicesInterface {
  id?: number;
  name: string;
  price: number;
  commissionServiceFee?: number;
  description?: string;
  imgUrl?: string;
  duration: number;
  availableInApp?: boolean;
  requiresDeposit?: boolean;
  depositType?: "PERCENTAGE" | "FIXED";
  depositAmount?: number;
  noShowFee?: number;
  noShowApplyToAll?: boolean;
  noShowClientIds?: number[];
  priceDescription?: string;
  employees?: ServiceEmployeeParam[];
}

export interface CreateServiceDTO {
  name: string;
  price: number;
  description?: string;
  priceDescription?: string;
  requiresDeposit?: boolean;
  depositType?: "PERCENTAGE" | "FIXED";
  depositAmount?: number;
  noShowFee?: number;
  imgUrl?: string;
  duration?: number;
}

export interface ServiceResponse {
  id: number;
  name: string;
  price: number;
  description?: string;
  priceDescription?: string;
  imgUrl?: string;
  duration?: number;
  companyId: number;
}

export interface UpdateServiceDTO {
  name: string;
  price: number;
  priceDescription?: string;
  description?: string;
  requiresDeposit?: boolean;
  depositType?: "PERCENTAGE" | "FIXED";
  depositAmount?: number;
  noShowFee?: number;
  imgUrl?: string;
  duration?: number;
}

export interface CompanyServiceHttpResponse {
  content: CompanyServicesProps[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}

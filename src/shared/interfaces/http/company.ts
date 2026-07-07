export interface OpeningHourProps {
  id: number;
  firstHour: Date;
  secondHour: Date;
  thirdHour: Date;
  lastHour: Date;
  dayWeek: string;
  companyId: number;
}

export interface PaymentMethodDTOS {
  id: number;
  name: string;
  companyId: number;
}

export interface SocialMediaDTOS {
  id: number;
  name: string;
  mediaUrl: string;
  icon: string;
  companyid: string;
}

export interface CompanyInterface {
  id?: number;
  name: string;
  description?: string;
  cnpj?: string;
  logoUrl?: string;
  address: string;
  phone: string;
  rating?: number;
  reviewsCount?: number;
  imagesUrl?: string;
  services?: any[];
  companyCategories?: any[];
}

export interface CompanyProps {
  id: number;
  name: string;
  description: string;
  cnpj: string;
  logoUrl: string;
  address: string;
  phone: string;
  openingHourDTOS: OpeningHourProps[];
  socialMediaDTOS: SocialMediaDTOS[];
  paymentMethodDTOS: PaymentMethodDTOS[];
  rating?: number;
  reviewsCount?: number;
  imagesUrl?: string;
  services?: any[];
  companyCategories?: any[];
  reminderEnabled?: boolean;
  reminderMinutesBefore?: number;
  bookingConfirmationEnabled?: boolean;
  type?: "MULTI_TENANT" | "WHITE_LABEL";
}

export interface CompanyDTO {
  id: number;
  name: string;
  description: string;
  cnpj: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
  address: string;
  subdomain: string;
  phone: string;
  rating?: number;
  reviewsCount?: number;
  imagesUrl?: string;
  services?: any[];
  companyCategories?: any[];
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  reminderEnabled?: boolean;
  reminderMinutesBefore?: number;
  bookingConfirmationEnabled?: boolean;
  type?: "MULTI_TENANT" | "WHITE_LABEL";
}

export interface CompanyHttpResponse {
  content: CompanyDTO[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}

export interface CompanyReviewProps {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userId: number;
  userFirstName: string;
  userAvatarUrl?: string;
}

export interface CompanyReviewHttpResponse {
  content: CompanyReviewProps[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}

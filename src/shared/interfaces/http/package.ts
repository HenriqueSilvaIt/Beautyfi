export interface PackageItemProps {
  id?: number;
  serviceId: number;
  serviceName?: string;
  quantity: number;
}

export interface PackageProps {
  id: number;
  name: string;
  description?: string;
  price: number;
  duration?: number;
  imgUrl?: string;
  imgUrlPublicId?: string;
  availableInApp?: boolean;
  companyId?: number;
  items: PackageItemProps[];
}

export interface PackageInterface {
  id?: number;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  imgUrl?: string;
  availableInApp?: boolean;
  companyId?: number;
  items?: PackageItemProps[];
}

export interface PackageHttpResponse {
  content: PackageProps[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}

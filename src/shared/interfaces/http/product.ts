export interface ProductProps {
  id: number;
  name: string;
  description: string;
  price: number;
  commission: number;
  availableInApp?: boolean;

  quantity: number;
  imgUrl: string;
  barCode: string;
  companyId?: number;
}

export interface ProductInterface {
  id?: number;
  name: string;
  description?: string;
  price?: number;
  quantity?: number;
  commission?: number;
  imgUrl?: string;
  barCode?: string;
  availableInApp?: boolean;
  companyId?: number;
}

export interface ProductHttpResponse {
  content: ProductProps[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number;
  numberOfElements: number;
  last: boolean;
}

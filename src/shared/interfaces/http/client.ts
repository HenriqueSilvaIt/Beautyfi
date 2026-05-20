export interface ClientInterface {
  id?: number;
  name: string;
  email?: string;
  lastName?: string;
  birthDate?: string;
  profileUrl?: string;
  phone?: string;
}

export interface ClientCreateDTO {
  id?: number;
  name: string;
  lastName?: string;
  birthDate?: Date;
  profileUrl?: string;
}

export interface ClientHttpResponse {
  content: ClientInterface[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number
  numberOfElements: number
  last: boolean;
}

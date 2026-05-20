export interface AdvertisementProps {
  id: number;
  title: string;
  imgUrlPublicId: string;
  description: string;
  imgUrl: string;
  url: string;
}


export interface AdvertisementInterface {
  id?: number;
  title?: string;
  description?: string;
  imgUrl?: string;
  url?: string;
}

export type AdvertisementUpdateDTO = {
  title?: string;
  description?: string;
  imgUrl?: string;
  url?: string;
};

export interface AdvertisementCreateDTO {
  title?: string;
  description?: string;
  imgUrl?: string;
  url?: string;
}

export interface AdvertisementHttpResponse {
  content: AdvertisementProps[];
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
  number: number
  numberOfElements: number
  last: boolean;
}

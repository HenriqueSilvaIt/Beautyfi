import { styleAppApiClient } from "../api/styleAppBackend";
import {
  AdvertisementHttpResponse,
  AdvertisementInterface,
  AdvertisementProps,
} from "../interfaces/http/advertisement";

export async function getAdvertisementsById(advertisementId: number) {
  const { data } = await styleAppApiClient.get<AdvertisementProps>(
    `/advertisements/${advertisementId}`,
  );
  return data;
}

export async function getAdvertisements(
  page: number = 0,
  size: number = 10
) {
  const { data } =
    await styleAppApiClient.get<AdvertisementHttpResponse>("/advertisements",
      { 
        params: {
          page,
          size
        }
      }
    );
  return data;
}

export async function postAdvertisements(dataBody: AdvertisementInterface) {
  const { data } = await styleAppApiClient.post<AdvertisementInterface>(
    "/advertisements",
    dataBody,
  );
  return data;
}

export async function updateAdvertisements(
  dataBody: AdvertisementInterface,
  advertisementId?: number,
) {
  const { data } = await styleAppApiClient.put<AdvertisementInterface>(
    `/advertisements/${advertisementId}`,
    dataBody,
  );
  return data;
}

export async function deleteAdvertisementById(advertisementId: number) {
  await styleAppApiClient.delete<AdvertisementHttpResponse>(
    `/advertisements/${advertisementId}`,
  );
}

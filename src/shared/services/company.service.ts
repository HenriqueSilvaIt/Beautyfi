import { styleAppApiClient } from "../api/styleAppBackend";
import { useCompanyStore } from "../store/company-store";
import {
  CompanyHttpResponse,
  CompanyInterface,
  CompanyProps,
  CompanyDTO,
  CompanyReviewHttpResponse,
  CompanyReviewProps,
} from "../interfaces/http/company";

const COMPANY_ID_NUMBER = 1; // Fallback default ID

export async function companyDetails(companyId?: number) {
  const id = companyId || useCompanyStore.getState().selectedCompanyId || COMPANY_ID_NUMBER;
  const { data } =
    await styleAppApiClient.get<CompanyProps>(`/companies/${id}/details`);

  return data;
}

export async function fetchCompanies(page: number = 0, size: number = 10, name?: string) {
  const { data } = await styleAppApiClient.get<CompanyHttpResponse>(
    `companies`,
    {
      params: {
        page,
        size,
        ...(name ? { name } : {}),
      }
    },
  );

  return data;
}

export async function fetchNearbyCompanies(latitude: number, longitude: number, radius: number = 50) {
  const { data } = await styleAppApiClient.get<CompanyDTO[]>(
    `/companies/nearby`,
    {
      params: {
        latitude,
        longitude,
        radius,
      }
    }
  );
  return data;
}

export async function getCompanyById(companyId: number) {
  const { data } = await styleAppApiClient.get<CompanyInterface>(
    `/companies/${companyId}`,
  );

  return data;
}

export async function createCompany(dataBody: CompanyInterface) {
  const { data } = await styleAppApiClient.post<CompanyProps>(
    `/companies`,
    dataBody,
  );

  return data;
}

export async function updateCompany(dataBody: CompanyInterface) {
  const { data } = await styleAppApiClient.put<CompanyProps>(
    `/companies/1`,
    dataBody,
  );

  return data;
}

export async function updateReminderConfig(dto: {
  reminderEnabled?: boolean;
  reminderMinutesBefore?: number;
  bookingConfirmationEnabled?: boolean;
}): Promise<void> {
  await styleAppApiClient.patch("/companies/reminder-config", dto);
}

// Favorite endpoints
export async function toggleFavoriteCompany(companyId: number, isFavorite: boolean) {
  if (isFavorite) {
    await styleAppApiClient.post(`/favorites?companyId=${companyId}`);
  } else {
    await styleAppApiClient.delete(`/favorites?companyId=${companyId}`);
  }
}

export async function getFavoritedCompanyIds() {
  const { data } = await styleAppApiClient.get<number[]>(`/favorites/ids`);
  return data;
}

// Company Categories endpoint
export interface CompanyCategoryInterface {
  id: number;
  name: string;
}

export async function fetchCompanyCategories() {
  const { data } = await styleAppApiClient.get<CompanyCategoryInterface[]>(`/companies/categories`);
  return data;
}

export async function getCompanyReviews(companyId: number, page: number = 0, size: number = 10) {
  const { data } = await styleAppApiClient.get<CompanyReviewHttpResponse>(
    `/companies/${companyId}/reviews?page=${page}&size=${size}`
  );
  return data;
}

export async function createCompanyReview(companyId: number, dto: { rating: number; comment: string }) {
  const { data } = await styleAppApiClient.post<CompanyReviewProps>(
    `/companies/${companyId}/reviews`,
    dto
  );
  return data;
}

export async function updateOpeningHours(companyId: number, openingHours: any[]) {
  await styleAppApiClient.put(`/companies/${companyId}/opening-hours`, openingHours);
}

export async function updateSocialMedias(companyId: number, socialMedias: any[]) {
  await styleAppApiClient.put(`/companies/${companyId}/social-medias`, socialMedias);
}

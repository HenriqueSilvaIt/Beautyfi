import { styleAppApiClient } from "../api/styleAppBackend";

export interface WaitListInsertParams {
  userId: number;
  employeeId: number;
  requestedDate: string; // "YYYY-MM-DD"
}

export async function addToWaitList(params: WaitListInsertParams) {
  const { data } = await styleAppApiClient.post("/waitlist", params);
  return data;
}

export async function getWaitList(startDate: string, endDate: string) {
  const { data } = await styleAppApiClient.get("/waitlist", {
    params: { startDate, endDate }
  });
  return data;
}

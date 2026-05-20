import { AxiosRequestConfig } from "axios";
import { useUserStore } from "../store/user-store";
import { DashboardEmployeeDTO, DashboardEmployeeParam, TotalMonthlyDTO, TotalMonthlyHttpResponse } from "../interfaces/http/finance";
import {  styleAppApiClient } from "../api/styleAppBackend";

export async function getTotalMonthly() {

  const { data } = await styleAppApiClient.get<TotalMonthlyDTO[]>(
    "/finance-reports/total-sold?employeeId=&startDate=2022-02-03&endDate=2027-12-03"
  );
  return data;
}



export async function getDashboardEmployee(dataBody: DashboardEmployeeParam) {

  const {data} = await styleAppApiClient.get<DashboardEmployeeDTO[]>("/finance-reports/total-sold-list", 
    {
    params: 
      dataBody
    }
  );

    return data;

}
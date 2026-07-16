
export interface TotalMonthlyDTO {
  monthYear: string;
  totalSold: number;
}

export interface DashboardEmployeeParam {
  startDate?: string;
  endDate?: string;
}

export interface DashboardEmployeeDTO {
  employeeId: number;
  employeeName: string;
  totalSold: number;
  totalOrder: number;
  totalCommission: number;
  tips: number;
  totalEmployee: number;
  totalEmployeeDiscount:number;
  totalEmployeeNet: number;
  totalSubscription: number;
  totalCompany: number;
  totalOrderEmployee: number;
}

export interface TotalMonthlyHttpResponse {
  data: TotalMonthlyDTO[];
}

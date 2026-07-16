import { DashboardEmployeeParam } from "@/shared/interfaces/http/finance";
import { getDashboardEmployee, getTotalMonthly, getDetailedOrdersReport } from "@/shared/services/finance.service";
import { useMutation } from "@tanstack/react-query";

export function useFinanceMutation() {

  const getTotalMonthlyMutation = useMutation({
    mutationFn: () => getTotalMonthly(),
    onSuccess: (response) => {
        console.log(response)
    },
    onError: (error) => {
      console.log(error);
    },
  });


  const getDashboardEmployeeMutation = useMutation({

    mutationFn: (dataBody: DashboardEmployeeParam) =>  getDashboardEmployee(dataBody),
      onSuccess: (response) => {
        console.log(response)
      },
      onError: (error) => {
        console.log(error)
      }
  })

  const getDetailedOrdersReportMutation = useMutation({
    mutationFn: (params: { employeeId?: number; startDate: string; endDate: string }) =>
      getDetailedOrdersReport(params.employeeId, params.startDate, params.endDate),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return {
    getDashboardEmployeeMutation,
    getTotalMonthlyMutation,
    getDetailedOrdersReportMutation
  }
}
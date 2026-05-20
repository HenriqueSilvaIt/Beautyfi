import { DashboardEmployeeParam } from "@/shared/interfaces/http/finance";
import { getDashboardEmployee, getTotalMonthly } from "@/shared/services/finance.service";
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

  return {
    getDashboardEmployeeMutation,
        getTotalMonthlyMutation
  }
}
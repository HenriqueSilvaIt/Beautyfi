import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { OrderInterface } from "@/shared/interfaces/http/order";
import { EmployeeInterface } from "@/shared/interfaces/http/employee";
import { useFinanceMutation } from "@/shared/queries/finance/use-finance-mutation";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useEffect, useState } from "react";

export function useDashboardComandasViewModel() {
  const [orders, setOrders] = useState<OrderInterface[]>([]);
  const [employees, setEmployees] = useState<EmployeeInterface[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);

  const { DateIsoToBR, formatDateToISO } = useFormatDate();
  
  // Define o período inicial como o mês atual
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const [dateParam, setDateParam] = useState({
    startDate: formatDateToISO(firstDay),
    endDate: formatDateToISO(lastDay),
  });

  const { getDetailedOrdersReportMutation } = useFinanceMutation();
  const { useGetEmployeeMutation } = useEmployeeMutation();
  
  // Carrega a lista de funcionários
  const { data: employeesData } = useGetEmployeeMutation();

  useEffect(() => {
    if (employeesData?.pages) {
      const allEmployees = employeesData.pages.flatMap((page) => page.content);
      setEmployees(allEmployees);
    }
  }, [employeesData]);

  async function onGetReportData() {
    try {
      setIsLoading(true);
      const data = await getDetailedOrdersReportMutation.mutateAsync({
        employeeId: selectedEmployeeId,
        startDate: dateParam.startDate,
        endDate: dateParam.endDate,
      });
      setOrders(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  // Cálculos consolidados para exibição nos cartões
  const totals = orders.reduce(
    (acc, order) => {
      acc.totalSold += Number(order.totalSold || 0);
      acc.totalEmployee += Number(order.totalEmployee || 0);
      acc.totalCompany += Number(order.totalCompany || 0);
      acc.totalEmployeeNet += Number(order.totalEmployeeNet || 0);
      acc.totalEmployeeDiscount += Number(order.totalEmployeeDiscount || 0);
      acc.totalSubscription += Number(order.totalSubscription || 0);
      acc.tips += Number(order.tip || 0);
      return acc;
    },
    {
      totalSold: 0,
      totalEmployee: 0,
      totalCompany: 0,
      totalEmployeeNet: 0,
      totalEmployeeDiscount: 0,
      totalSubscription: 0,
      tips: 0,
    }
  );

  function handleChangeDate(startDate: string, endDate: string) {
    setDateParam({ startDate, endDate });
  }

  useEffect(() => {
    onGetReportData();
  }, [dateParam, selectedEmployeeId]);

  return {
    orders,
    employees,
    selectedEmployeeId,
    setSelectedEmployeeId,
    totals,
    showStartDatePicker,
    showEndDatePicker,
    showEmployeeModal,
    setShowStartDatePicker,
    setShowEndDatePicker,
    setShowEmployeeModal,
    DateIsoToBR,
    isLoading,
    dateParam,
    setDateParam,
    formatDateToISO,
    handleChangeDate,
    onGetReportData,
  };
}

import { useState, useMemo, useEffect } from "react";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { calculateOrderTotal } from "@/shared/helpers/orderCalc";

export interface PaymentMethodItem {
  id: string;
  name: string;
  isCard: boolean;
  totalGross: number;
  totalFee: number;
  totalNet: number;
  count: number;
  percentage: number;
  flags: Record<string, { name: string; gross: number; fee: number; net: number; count: number; feePercent: number }>;
}

export function usePaymentMethodsReportViewModel() {
  const [dateStart, setDateStart] = useState<Date>(startOfMonth(new Date()));
  const [dateEnd, setDateEnd] = useState<Date>(endOfMonth(new Date()));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>("Todos");

  const currentUser = useUserStore((s) => s.user);
  const selectedCompanyId = useCompanyStore((s) => s.selectedCompanyId);
  const companyId = currentUser?.companyId ?? selectedCompanyId ?? 1;

  const isAdmin = currentUser?.roles?.some((role) => role.authority === "ROLE_ADMIN") ?? false;
  const myEmployeeId = currentUser?.employeeId ?? null;

  const { useGetCompanyPreferencesQuery } = useCompanyDetailsMutation();
  const companyPreferencesQuery = useGetCompanyPreferencesQuery?.();
  const { data: preferencesData } = companyPreferencesQuery ?? { data: undefined };

  const showAll = isAdmin || (preferencesData?.showAllEmployeeDashboardsToEmployees === true);

  // Load employees
  const { useGetEmployeeMutation } = useEmployeeMutation();
  const { data: employeeData } = useGetEmployeeMutation({ companyId: String(companyId) });
  const employeeList = useMemo(
    () => employeeData?.pages.flatMap((p) => p.content ?? []) ?? [],
    [employeeData],
  );

  useEffect(() => {
    if (preferencesData) {
      const showAllPref = isAdmin || (preferencesData.showAllEmployeeDashboardsToEmployees === true);
      if (!showAllPref && myEmployeeId !== null) {
        setSelectedEmployeeId(myEmployeeId);
        const emp = employeeList.find((e) => e.id === myEmployeeId);
        setSelectedEmployeeName(emp ? emp.name : "Meu Perfil");
      }
    }
  }, [preferencesData, isAdmin, myEmployeeId, employeeList]);

  // Load orders
  const { useGetOrdersMutation } = useOrderMutation();
  const {
    data: ordersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: ordersLoading,
  } = useGetOrdersMutation(companyId);

  // Auto-load all pages
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, ordersData]);

  const allOrders = useMemo(
    () => ordersData?.pages.flatMap((page) => page.content ?? []) ?? [],
    [ordersData],
  );

  // Process payments
  const reportData = useMemo(() => {
    const sDate = startOfDay(dateStart);
    const eDate = endOfDay(dateEnd);

    const methodsMap: Record<string, PaymentMethodItem> = {};
    let totalGrossRevenue = 0;
    let totalFeeDeductions = 0;
    let totalNetRevenue = 0;
    let totalTransactionsCount = 0;

    allOrders.forEach((order) => {
      if (!order.moment) return;
      const d = new Date(order.moment);
      if (d < sDate || d > eDate) return;

      if (selectedEmployeeId !== null && order.employee?.id !== selectedEmployeeId) {
        return;
      }

      const grossVal = Number(
        order.totalSold && Number(order.totalSold) > 0
          ? order.totalSold
          : order.total && Number(order.total) > 0
          ? order.total
          : order.totalOrder && Number(order.totalOrder) > 0
          ? order.totalOrder
          : calculateOrderTotal(order.items ?? [])
      );
      if (grossVal <= 0) return;

      const p = order.payment;
      const methodName = p?.paymentMethodDTO?.name || (order.items?.some((i: any) => i.usingSubscription) ? "Assinatura (Clube)" : "Outro / Não Definido");
      const isCard = Boolean(p?.paymentMethodDTO?.card);
      const flagName = p?.paymentCardFlagDto?.name || "Padrão";
      const feePercent = Number(p?.paymentCardFlagDto?.fee || 0);

      const feeVal = isCard && feePercent > 0 ? (grossVal * feePercent) / 100 : Number(order.cardFeeAmount || 0);
      const netVal = Math.max(0, grossVal - feeVal);

      totalGrossRevenue += grossVal;
      totalFeeDeductions += feeVal;
      totalNetRevenue += netVal;
      totalTransactionsCount += 1;

      if (!methodsMap[methodName]) {
        methodsMap[methodName] = {
          id: methodName,
          name: methodName,
          isCard,
          totalGross: 0,
          totalFee: 0,
          totalNet: 0,
          count: 0,
          percentage: 0,
          flags: {},
        };
      }

      methodsMap[methodName].totalGross += grossVal;
      methodsMap[methodName].totalFee += feeVal;
      methodsMap[methodName].totalNet += netVal;
      methodsMap[methodName].count += 1;

      if (isCard) {
        if (!methodsMap[methodName].flags[flagName]) {
          methodsMap[methodName].flags[flagName] = {
            name: flagName,
            gross: 0,
            fee: 0,
            net: 0,
            count: 0,
            feePercent,
          };
        }
        methodsMap[methodName].flags[flagName].gross += grossVal;
        methodsMap[methodName].flags[flagName].fee += feeVal;
        methodsMap[methodName].flags[flagName].net += netVal;
        methodsMap[methodName].flags[flagName].count += 1;
      }
    });

    const paymentMethodsList: PaymentMethodItem[] = Object.values(methodsMap)
      .map((item) => ({
        ...item,
        percentage: totalGrossRevenue > 0 ? (item.totalGross / totalGrossRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.totalGross - a.totalGross);

    const averageFeePercentage = totalGrossRevenue > 0 ? (totalFeeDeductions / totalGrossRevenue) * 100 : 0;

    return {
      paymentMethodsList,
      totalGrossRevenue,
      totalFeeDeductions,
      totalNetRevenue,
      totalTransactionsCount,
      averageFeePercentage,
    };
  }, [allOrders, dateStart, dateEnd, selectedEmployeeId]);

  return {
    loading: ordersLoading,
    reportData,
    dateStart,
    setDateStart,
    dateEnd,
    setDateEnd,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedEmployeeName,
    setSelectedEmployeeName,
    employeeList,
    showAll,
  };
}

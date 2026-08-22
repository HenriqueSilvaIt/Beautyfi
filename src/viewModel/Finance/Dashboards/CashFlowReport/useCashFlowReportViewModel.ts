import { useState, useMemo, useEffect } from "react";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";
import { calculateOrderTotal } from "@/shared/helpers/orderCalc";

export interface CashTransactionItem {
  id: string | number;
  description: string;
  value: number;
  type: "DEPOSIT" | "WITHDRAW";
  dateTime: string;
  source: "ORDER" | "CASH_MANUAL";
  orderNumber?: string;
  employeeName?: string;
}

export function useCashFlowReportViewModel() {
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

  // Carrega profissionais
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

  // Carrega comandas
  const { useGetOrdersMutation } = useOrderMutation();
  const {
    data: ordersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: ordersLoading,
  } = useGetOrdersMutation(companyId);

  // Auto-load todas as páginas de comandas
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, ordersData]);

  const allOrders = useMemo(
    () => ordersData?.pages.flatMap((page) => page.content ?? []) ?? [],
    [ordersData],
  );

  // Carrega movimentações manuais do caixa
  const [manualCashList, setManualCashList] = useState<any[]>([]);
  const [cashLoading, setCashLoading] = useState(false);

  const fetchManualCash = async () => {
    setCashLoading(true);
    try {
      const response = await styleAppApiClient.get<any[]>(`/cash?companyId=${companyId}`);
      setManualCashList(response.data || []);
    } catch (e) {
      setManualCashList([]);
    } finally {
      setCashLoading(false);
    }
  };

  useEffect(() => {
    fetchManualCash();
  }, [companyId]);

  // Função para calcular valor real da comanda
  const getOrderVal = (order: any) => {
    if (order.total && Number(order.total) > 0) return Number(order.total);
    return calculateOrderTotal(order.items ?? []);
  };

  // Consolidação de Transações (Comandas + Caixa) filtradas por período e profissional
  const consolidatedTransactions = useMemo(() => {
    const list: CashTransactionItem[] = [];

    // 1. Processa Comandas Fechadas no Período
    allOrders.forEach((order) => {
      if (!order.moment) return;
      const d = new Date(order.moment);
      if (d < dateStart || d > dateEnd) return;

      // Filtro por profissional se selecionado
      if (selectedEmployeeId !== null && order.employee?.id !== selectedEmployeeId) {
        return;
      }

      const val = getOrderVal(order);
      if (val <= 0) return;

      const isProf = Boolean(order.isEmployee);
      list.push({
        id: `order-${order.id}`,
        description: isProf
          ? `Comanda Profissional Nº ${order.orderNumber || order.id}`
          : `Comanda Fechada Nº ${order.orderNumber || order.id} (${order.user?.name || "Cliente"})`,
        value: val,
        type: isProf ? "WITHDRAW" : "DEPOSIT",
        dateTime: order.moment,
        source: "ORDER",
        orderNumber: order.orderNumber || String(order.id),
        employeeName: order.employee?.name,
      });
    });

    // 2. Processa Lançamentos Manuais do Caixa no Período
    manualCashList.forEach((c) => {
      const dt = c.dateTime || c.createdAt || new Date().toISOString();
      const d = new Date(dt);
      if (d < dateStart || d > dateEnd) return;

      list.push({
        id: `cash-${c.id}`,
        description: c.description || (c.type === "DEPOSIT" ? "Entrada de Caixa" : "Saída de Caixa"),
        value: Number(c.value || 0),
        type: c.type === "WITHDRAW" ? "WITHDRAW" : "DEPOSIT",
        dateTime: dt,
        source: "CASH_MANUAL",
      });
    });

    // Ordena por data decrescente
    return list.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());
  }, [allOrders, manualCashList, dateStart, dateEnd, selectedEmployeeId]);

  // Cálculos de Totais
  const totals = useMemo(() => {
    let depositOrders = 0;
    let depositManual = 0;
    let withdrawOrders = 0;
    let withdrawManual = 0;

    consolidatedTransactions.forEach((t) => {
      if (t.type === "DEPOSIT") {
        if (t.source === "ORDER") depositOrders += t.value;
        else depositManual += t.value;
      } else {
        if (t.source === "ORDER") withdrawOrders += t.value;
        else withdrawManual += t.value;
      }
    });

    const totalDeposit = depositOrders + depositManual;
    const totalWithdraw = withdrawOrders + withdrawManual;
    const netBalance = totalDeposit - totalWithdraw;
    const grandTotal = totalDeposit + totalWithdraw;

    const depositPercentage = grandTotal > 0 ? (totalDeposit / grandTotal) * 100 : 50;
    const withdrawPercentage = grandTotal > 0 ? (totalWithdraw / grandTotal) * 100 : 50;

    return {
      totalDeposit,
      depositOrders,
      depositManual,
      totalWithdraw,
      withdrawOrders,
      withdrawManual,
      netBalance,
      grandTotal,
      depositPercentage,
      withdrawPercentage,
    };
  }, [consolidatedTransactions]);

  return {
    loading: ordersLoading || cashLoading,
    consolidatedTransactions,
    totals,
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

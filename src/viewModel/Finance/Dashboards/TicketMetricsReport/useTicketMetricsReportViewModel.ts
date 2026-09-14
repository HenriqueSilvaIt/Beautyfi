import { useState, useMemo, useEffect } from "react";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";
import { startOfMonth, endOfMonth, startOfDay, endOfDay, subMonths } from "date-fns";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { calculateOrderTotal } from "@/shared/helpers/orderCalc";

export interface MonthlyTicketStat {
  monthYear: string;
  label: string;
  ticketAverage: number;
  totalRevenue: number;
  totalOrders: number;
}

export interface VipClientItem {
  id: string | number;
  name: string;
  phone?: string;
  avatarUrl?: string;
  totalSpent: number;
  ordersCount: number;
  averageTicket: number;
}

export function useTicketMetricsReportViewModel() {
  const [dateStart, setDateStart] = useState<Date>(startOfMonth(subMonths(new Date(), 5)));
  const [dateEnd, setDateEnd] = useState<Date>(endOfMonth(new Date()));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>("Todos");
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

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

  function formatMonthYear(monthYear: string) {
    const [year, month] = monthYear.split("-");
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    return `${months[Number(month) - 1]}/${year.slice(2)}`;
  }

  // Process Metrics & Monthly Ticket Averages
  const metrics = useMemo(() => {
    const sDate = startOfDay(dateStart);
    const eDate = endOfDay(dateEnd);

    const monthlyMap: Record<string, { revenue: number; count: number }> = {};
    const clientsMap: Record<string, { id: string | number; name: string; phone?: string; avatarUrl?: string; totalSpent: number; count: number }> = {};

    let totalPeriodRevenue = 0;
    let totalPeriodOrders = 0;
    let totalPeriodItems = 0;
    let totalTips = 0;

    allOrders.forEach((order) => {
      if (!order.moment) return;
      const d = new Date(order.moment);
      if (d < sDate || d > eDate) return;

      if (selectedEmployeeId !== null && order.employee?.id !== selectedEmployeeId) {
        return;
      }

      const val = Number(
        order.totalSold && Number(order.totalSold) > 0
          ? order.totalSold
          : order.total && Number(order.total) > 0
          ? order.total
          : order.totalOrder && Number(order.totalOrder) > 0
          ? order.totalOrder
          : calculateOrderTotal(order.items ?? [])
      );
      const itemsCount = (order.items ?? []).reduce(
        (acc: number, item: any) =>
          acc + (item.appointmentServices && item.appointmentServices.length > 0 ? item.appointmentServices.length : Number(item.quantity ?? 1)),
        0
      );
      const tipVal = Number(order.tip || 0);
      const monthStr = order.moment.substring(0, 7); // "YYYY-MM"

      totalPeriodRevenue += val;
      totalPeriodOrders += 1;
      totalPeriodItems += itemsCount;
      totalTips += tipVal;

      if (!monthlyMap[monthStr]) {
        monthlyMap[monthStr] = { revenue: 0, count: 0 };
      }
      monthlyMap[monthStr].revenue += val;
      monthlyMap[monthStr].count += 1;

      const clientName = order.user?.name || "Cliente Final";
      const clientId = order.user?.id || `client-${clientName}`;
      const avatarUrl = order.user?.avatarUrl || (order.user as any)?.imgUrl;
      if (!clientsMap[clientId]) {
        clientsMap[clientId] = {
          id: clientId,
          name: clientName,
          phone: order.user?.phone,
          avatarUrl: avatarUrl,
          totalSpent: 0,
          count: 0,
        };
      } else if (!clientsMap[clientId].avatarUrl && avatarUrl) {
        clientsMap[clientId].avatarUrl = avatarUrl;
      }
      clientsMap[clientId].totalSpent += val;
      clientsMap[clientId].count += 1;
    });

    const averageTicket = totalPeriodOrders > 0 ? totalPeriodRevenue / totalPeriodOrders : 0;
    const averageItemsPerOrder = totalPeriodOrders > 0 ? totalPeriodItems / totalPeriodOrders : 0;
    const uniqueClientsCount = Object.keys(clientsMap).length;

    const monthlyStatsList: MonthlyTicketStat[] = Object.keys(monthlyMap)
      .sort()
      .map((mKey) => {
        const item = monthlyMap[mKey];
        const ticket = item.count > 0 ? item.revenue / item.count : 0;
        return {
          monthYear: mKey,
          label: formatMonthYear(mKey),
          ticketAverage: ticket,
          totalRevenue: item.revenue,
          totalOrders: item.count,
        };
      });

    const vipClientsList: VipClientItem[] = Object.values(clientsMap)
      .map((c) => ({
        id: c.id,
        name: c.name,
        phone: c.phone,
        avatarUrl: c.avatarUrl,
        totalSpent: c.totalSpent,
        ordersCount: c.count,
        averageTicket: c.count > 0 ? c.totalSpent / c.count : 0,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 10);

    const maxMonthlyTicket = Math.max(...monthlyStatsList.map((m) => m.ticketAverage), 1);

    return {
      averageTicket,
      averageItemsPerOrder,
      totalPeriodRevenue,
      totalPeriodOrders,
      totalPeriodItems,
      totalTips,
      uniqueClientsCount,
      monthlyStatsList,
      vipClientsList,
      maxMonthlyTicket,
    };
  }, [allOrders, dateStart, dateEnd, selectedEmployeeId]);

  return {
    loading: ordersLoading,
    metrics,
    selectedBar,
    setSelectedBar,
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

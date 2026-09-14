import { useState, useMemo, useEffect } from "react";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";

export interface RankingItem {
  id: string | number;
  name: string;
  category: "SERVICE" | "PRODUCT" | "SUBSCRIPTION";
  quantity: number;
  totalRevenue: number;
  percentage: number;
}

export function useRankingReportViewModel() {
  const [dateStart, setDateStart] = useState<Date>(startOfMonth(new Date()));
  const [dateEnd, setDateEnd] = useState<Date>(endOfMonth(new Date()));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>("Todos");
  const [activeTab, setActiveTab] = useState<"SERVICES" | "PRODUCTS">("SERVICES");

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

  // Process ranking data
  const rankingData = useMemo(() => {
    const sDate = startOfDay(dateStart);
    const eDate = endOfDay(dateEnd);

    const servicesMap: Record<string, { id: string | number; name: string; quantity: number; revenue: number }> = {};
    const productsMap: Record<string, { id: string | number; name: string; quantity: number; revenue: number }> = {};
    
    let totalServicesRevenue = 0;
    let totalProductsRevenue = 0;
    let totalSubscriptionRevenue = 0;
    let totalServicesCount = 0;
    let totalProductsCount = 0;
    let totalSubscriptionCount = 0;

    allOrders.forEach((order) => {
      if (!order.moment) return;
      const d = new Date(order.moment);
      if (d < sDate || d > eDate) return;

      if (selectedEmployeeId !== null && order.employee?.id !== selectedEmployeeId) {
        return;
      }

      const items = order.items ?? [];
      items.forEach((item: any) => {
        const qty = Number(item.quantity ?? 1);
        const price = Number(item.price ?? item.servicePrice ?? 0);
        const revenue = price * qty;

        if (item.usingSubscription) {
          totalSubscriptionRevenue += Number(item.subscriptionValue ?? revenue);
          totalSubscriptionCount += qty;
        } else if (item.product) {
          const prodId = item.product.id || `p-${item.product.name}`;
          const prodName = item.product.name || "Produto";
          if (!productsMap[prodId]) {
            productsMap[prodId] = { id: prodId, name: prodName, quantity: 0, revenue: 0 };
          }
          productsMap[prodId].quantity += qty;
          productsMap[prodId].revenue += revenue;
          totalProductsRevenue += revenue;
          totalProductsCount += qty;
        } else {
          // Servico
          if (item.appointmentServices && item.appointmentServices.length > 0) {
            item.appointmentServices.forEach((aps: any) => {
              const sId = aps.serviceId || aps.service?.id || `s-${aps.service?.name || "servico"}`;
              const sName = aps.service?.name || item.serviceName || "Serviço";
              const sPrice = Number(aps.priceAtMoment ?? aps.service?.price ?? item.servicePrice ?? 0);
              const sQty = 1;
              const sRev = sPrice * sQty;

              if (!servicesMap[sId]) {
                servicesMap[sId] = { id: sId, name: sName, quantity: 0, revenue: 0 };
              }
              servicesMap[sId].quantity += sQty;
              servicesMap[sId].revenue += sRev;
              totalServicesRevenue += sRev;
              totalServicesCount += sQty;
            });
          } else if (item.appointment?.appointmentService && item.appointment.appointmentService.length > 0) {
            item.appointment.appointmentService.forEach((aps: any) => {
              const sId = aps.service?.id || `s-${aps.service?.name || "servico"}`;
              const sName = aps.service?.name || "Serviço";
              const sPrice = Number(aps.priceAtMoment ?? aps.service?.price ?? 0);
              const sQty = 1;
              const sRev = sPrice * sQty;

              if (!servicesMap[sId]) {
                servicesMap[sId] = { id: sId, name: sName, quantity: 0, revenue: 0 };
              }
              servicesMap[sId].quantity += sQty;
              servicesMap[sId].revenue += sRev;
              totalServicesRevenue += sRev;
              totalServicesCount += sQty;
            });
          } else if (item.serviceName && item.serviceName.includes(",")) {
            const names = item.serviceName.split(",").map((n: string) => n.trim());
            const partRev = revenue / (names.length || 1);
            names.forEach((sName: string) => {
              const sId = `s-${sName}`;
              if (!servicesMap[sId]) {
                servicesMap[sId] = { id: sId, name: sName, quantity: 0, revenue: 0 };
              }
              servicesMap[sId].quantity += 1;
              servicesMap[sId].revenue += partRev;
              totalServicesRevenue += partRev;
              totalServicesCount += 1;
            });
          } else {
            let serviceName = item.serviceName || item.service?.name || "Serviço";
            let serviceId: string | number = item.serviceId || item.service?.id || `s-${serviceName}`;

            if (!servicesMap[serviceId]) {
              servicesMap[serviceId] = { id: serviceId, name: serviceName, quantity: 0, revenue: 0 };
            }
            servicesMap[serviceId].quantity += qty;
            servicesMap[serviceId].revenue += revenue;
            totalServicesRevenue += revenue;
            totalServicesCount += qty;
          }
        }
      });
    });

    const totalGeneralRevenue = totalServicesRevenue + totalProductsRevenue + totalSubscriptionRevenue;

    const rankedServices: RankingItem[] = Object.values(servicesMap)
      .map((s) => ({
        id: s.id,
        name: s.name,
        category: "SERVICE" as const,
        quantity: s.quantity,
        totalRevenue: s.revenue,
        percentage: totalServicesRevenue > 0 ? (s.revenue / totalServicesRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    const rankedProducts: RankingItem[] = Object.values(productsMap)
      .map((p) => ({
        id: p.id,
        name: p.name,
        category: "PRODUCT" as const,
        quantity: p.quantity,
        totalRevenue: p.revenue,
        percentage: totalProductsRevenue > 0 ? (p.revenue / totalProductsRevenue) * 100 : 0,
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue);

    const servicePercent = totalGeneralRevenue > 0 ? (totalServicesRevenue / totalGeneralRevenue) * 100 : 0;
    const productPercent = totalGeneralRevenue > 0 ? (totalProductsRevenue / totalGeneralRevenue) * 100 : 0;
    const subscriptionPercent = totalGeneralRevenue > 0 ? (totalSubscriptionRevenue / totalGeneralRevenue) * 100 : 0;

    return {
      rankedServices,
      rankedProducts,
      totalServicesRevenue,
      totalProductsRevenue,
      totalSubscriptionRevenue,
      totalGeneralRevenue,
      totalServicesCount,
      totalProductsCount,
      totalSubscriptionCount,
      servicePercent,
      productPercent,
      subscriptionPercent,
      topService: rankedServices[0] || null,
      topProduct: rankedProducts[0] || null,
    };
  }, [allOrders, dateStart, dateEnd, selectedEmployeeId]);

  return {
    loading: ordersLoading,
    rankingData,
    activeTab,
    setActiveTab,
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

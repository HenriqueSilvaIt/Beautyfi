import { useState, useMemo, useEffect } from "react";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";
import { startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { calculateOrderTotal } from "@/shared/helpers/orderCalc";

export interface DayOfWeekStat {
  dayIndex: number; // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  name: string;
  shortName: string;
  count: number;
  revenue: number;
  percentage: number;
}

export interface ShiftStat {
  id: string;
  label: string;
  hours: string;
  count: number;
  revenue: number;
  percentage: number;
  color: string;
}

/**
 * Parses date string preserving local time correctly for both:
 * 1. LocalDateTime strings without timezone (e.g. "2026-09-06T15:30:00" or "2026-09-06 15:30:00")
 * 2. Instant / UTC timestamps with Z or offset (e.g. "2026-09-06T18:30:00Z")
 */
function parseDateParts(dateInput: string | Date | undefined | null): { date: Date; hour: number; dayOfWeek: number } | null {
  if (!dateInput) return null;
  if (dateInput instanceof Date) {
    return {
      date: dateInput,
      hour: dateInput.getHours(),
      dayOfWeek: dateInput.getDay(),
    };
  }

  const str = String(dateInput).trim();
  if (!str) return null;

  // Check if string has timezone suffix (e.g. Z or +03:00 / -03:00)
  const hasTimezone = /[Zz]|[+-]\d{2}(?::?\d{2})?$/.test(str);

  if (!hasTimezone) {
    const match = str.match(/^(\d{4})-(\d{2})-(\d{2})[T\s](\d{2}):(\d{2})(?::(\d{2}))?/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const hour = parseInt(match[4], 10);
      const minute = parseInt(match[5], 10);
      const second = match[6] ? parseInt(match[6], 10) : 0;
      const localDate = new Date(year, month, day, hour, minute, second);
      return {
        date: localDate,
        hour: hour,
        dayOfWeek: localDate.getDay(),
      };
    }
  }

  // Standard parse converts UTC timestamp to device's local time
  const d = new Date(str);
  if (isNaN(d.getTime())) return null;

  return {
    date: d,
    hour: d.getHours(),
    dayOfWeek: d.getDay(),
  };
}

export function usePeakHoursReportViewModel() {
  const [dateStart, setDateStart] = useState<Date>(startOfMonth(new Date()));
  const [dateEnd, setDateEnd] = useState<Date>(endOfMonth(new Date()));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>("Todos");
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(null);

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

  // Process days and peak hours
  const stats = useMemo(() => {
    const sDate = startOfDay(dateStart);
    const eDate = endOfDay(dateEnd);

    const dayNames = [
      { dayIndex: 0, name: "Domingo", shortName: "Dom" },
      { dayIndex: 1, name: "Segunda-feira", shortName: "Seg" },
      { dayIndex: 2, name: "Terça-feira", shortName: "Ter" },
      { dayIndex: 3, name: "Quarta-feira", shortName: "Qua" },
      { dayIndex: 4, name: "Quinta-feira", shortName: "Qui" },
      { dayIndex: 5, name: "Sexta-feira", shortName: "Sex" },
      { dayIndex: 6, name: "Sábado", shortName: "Sáb" },
    ];

    const daysMap: Record<number, { count: number; revenue: number }> = {
      0: { count: 0, revenue: 0 },
      1: { count: 0, revenue: 0 },
      2: { count: 0, revenue: 0 },
      3: { count: 0, revenue: 0 },
      4: { count: 0, revenue: 0 },
      5: { count: 0, revenue: 0 },
      6: { count: 0, revenue: 0 },
    };

    const shifts = {
      morning: { id: "morning", label: "Manhã", hours: "06:00 às 11:59", count: 0, revenue: 0, color: "#38bdf8" },
      afternoon: { id: "afternoon", label: "Tarde", hours: "12:00 às 17:59", count: 0, revenue: 0, color: "#CBA35D" },
      night: { id: "night", label: "Noite", hours: "18:00 às 23:59", count: 0, revenue: 0, color: "#a855f7" },
    };

    const hoursMap: Record<number, { hour: number; count: number; revenue: number }> = {};
    for (let h = 0; h <= 23; h++) {
      hoursMap[h] = { hour: h, count: 0, revenue: 0 };
    }

    let totalRevenue = 0;
    let totalAppointments = 0;

    allOrders.forEach((order) => {
      if (selectedEmployeeId !== null && order.employee?.id !== selectedEmployeeId) {
        return;
      }

      const items = order.items && order.items.length > 0 ? order.items : [];

      if (items.length > 0) {
        // Calculate raw items sum
        const rawItemTotal = items.reduce((sum, item) => {
          const itemPrice =
            item.servicePrice != null && Number(item.servicePrice) > 0
              ? Number(item.servicePrice)
              : item.price != null && Number(item.price) > 0
              ? Number(item.price) * (Number(item.quantity ?? 1) || 1)
              : 0;
          return sum + itemPrice;
        }, 0);

        const orderTotal = Number(
          order.totalSold && Number(order.totalSold) > 0
            ? order.totalSold
            : order.total && Number(order.total) > 0
            ? order.total
            : order.totalOrder && Number(order.totalOrder) > 0
            ? order.totalOrder
            : rawItemTotal > 0
            ? rawItemTotal
            : calculateOrderTotal(order.items ?? [])
        );

        const ratio = rawItemTotal > 0 && orderTotal > 0 ? orderTotal / rawItemTotal : 1;

        items.forEach((item) => {
          // Priority to item.dateScheduled, fallback to order.moment
          const parsed = parseDateParts(item.dateScheduled || order.moment);
          if (!parsed) return;
          if (parsed.date < sDate || parsed.date > eDate) return;

          const rawItemPrice =
            item.servicePrice != null && Number(item.servicePrice) > 0
              ? Number(item.servicePrice)
              : item.price != null && Number(item.price) > 0
              ? Number(item.price) * (Number(item.quantity ?? 1) || 1)
              : orderTotal > 0 && items.length > 0
              ? orderTotal / items.length
              : 0;

          const val = rawItemPrice * (rawItemTotal > 0 ? ratio : 1);
          const svcCount =
            item.appointmentServices && item.appointmentServices.length > 0
              ? item.appointmentServices.length
              : Number(item.quantity ?? 1) || 1;

          const { dayOfWeek, hour } = parsed;

          totalRevenue += val;
          totalAppointments += svcCount;

          daysMap[dayOfWeek].count += svcCount;
          daysMap[dayOfWeek].revenue += val;

          if (hour < 12) {
            shifts.morning.count += svcCount;
            shifts.morning.revenue += val;
          } else if (hour < 18) {
            shifts.afternoon.count += svcCount;
            shifts.afternoon.revenue += val;
          } else {
            shifts.night.count += svcCount;
            shifts.night.revenue += val;
          }

          if (hoursMap[hour]) {
            hoursMap[hour].count += svcCount;
            hoursMap[hour].revenue += val;
          }
        });
      } else {
        // Order with no items
        const parsed = parseDateParts(order.moment);
        if (!parsed) return;
        if (parsed.date < sDate || parsed.date > eDate) return;

        const val = Number(
          order.totalSold && Number(order.totalSold) > 0
            ? order.totalSold
            : order.total && Number(order.total) > 0
            ? order.total
            : order.totalOrder && Number(order.totalOrder) > 0
            ? order.totalOrder
            : 0
        );
        const svcCount = 1;
        const { dayOfWeek, hour } = parsed;

        totalRevenue += val;
        totalAppointments += svcCount;

        daysMap[dayOfWeek].count += svcCount;
        daysMap[dayOfWeek].revenue += val;

        if (hour < 12) {
          shifts.morning.count += svcCount;
          shifts.morning.revenue += val;
        } else if (hour < 18) {
          shifts.afternoon.count += svcCount;
          shifts.afternoon.revenue += val;
        } else {
          shifts.night.count += svcCount;
          shifts.night.revenue += val;
        }

        if (hoursMap[hour]) {
          hoursMap[hour].count += svcCount;
          hoursMap[hour].revenue += val;
        }
      }
    });

    const daysList: DayOfWeekStat[] = dayNames.map((item) => ({
      ...item,
      count: daysMap[item.dayIndex].count,
      revenue: daysMap[item.dayIndex].revenue,
      percentage: totalRevenue > 0 ? (daysMap[item.dayIndex].revenue / totalRevenue) * 100 : 0,
    }));

    const sortedDaysByRevenue = [...daysList].sort((a, b) => b.revenue - a.revenue);
    const bestDay = sortedDaysByRevenue[0]?.revenue > 0 ? sortedDaysByRevenue[0] : null;
    const lowestDay = [...daysList].filter((d) => d.count > 0).sort((a, b) => a.revenue - b.revenue)[0] || null;

    const shiftList: ShiftStat[] = [
      {
        ...shifts.morning,
        percentage: totalRevenue > 0 ? (shifts.morning.revenue / totalRevenue) * 100 : 0,
      },
      {
        ...shifts.afternoon,
        percentage: totalRevenue > 0 ? (shifts.afternoon.revenue / totalRevenue) * 100 : 0,
      },
      {
        ...shifts.night,
        percentage: totalRevenue > 0 ? (shifts.night.revenue / totalRevenue) * 100 : 0,
      },
    ];

    const peakHoursList = Object.values(hoursMap)
      .filter((h) => h.count > 0)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const maxDayRevenue = Math.max(...daysList.map((d) => d.revenue), 1);

    return {
      daysList,
      shiftList,
      peakHoursList,
      totalRevenue,
      totalAppointments,
      bestDay,
      lowestDay,
      maxDayRevenue,
    };
  }, [allOrders, dateStart, dateEnd, selectedEmployeeId]);

  return {
    loading: ordersLoading,
    stats,
    selectedDayIndex,
    setSelectedDayIndex,
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

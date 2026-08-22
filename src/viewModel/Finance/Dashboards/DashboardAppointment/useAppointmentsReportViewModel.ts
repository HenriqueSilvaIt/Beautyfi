import { useState, useMemo, useEffect } from "react";
import { useAppointmentMutation } from "@/shared/queries/company/use-appointment.mutation";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";
import { format } from "date-fns";
import { AppointmentStatus } from "@/shared/interfaces/http/appointment";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";

export function useAppointmentsReportViewModel() {
  const [dateStart, setDateStart] = useState<Date>(new Date(new Date().getFullYear(), 0, 1)); // início do ano
  const [dateEnd, setDateEnd] = useState<Date>(new Date(new Date().getFullYear(), 11, 31)); // fim do ano
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<string>("Todos");

  const startStr = format(dateStart, "yyyy-MM-dd");
  const endStr = format(dateEnd, "yyyy-MM-dd");

  const currentUser = useUserStore((s) => s.user);
  const selectedCompanyId = useCompanyStore((s) => s.selectedCompanyId);
  const companyId = currentUser?.companyId ?? selectedCompanyId ?? 1;

  const isAdmin = currentUser?.roles?.some((role) => role.authority === "ROLE_ADMIN") ?? false;
  const myEmployeeId = currentUser?.employeeId ?? null;

  const { useGetCompanyPreferencesQuery } = useCompanyDetailsMutation();
  const companyPreferencesQuery = useGetCompanyPreferencesQuery?.();
  const { data: preferencesData } = companyPreferencesQuery ?? { data: undefined };

  const showAll = isAdmin || (preferencesData?.showAllEmployeeDashboardsToEmployees === true);

  const { useGetMonthlyAppointmentsQuery, useGetAppointmentMutation } = useAppointmentMutation();
  const { data: monthlyData, isLoading: monthlyLoading } = useGetMonthlyAppointmentsQuery(startStr, endStr, companyId);

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
        const emp = employeeList.find(e => e.id === myEmployeeId);
        setSelectedEmployeeName(emp ? emp.name : "Meu Perfil");
      }
    }
  }, [preferencesData, isAdmin, myEmployeeId, employeeList]);

  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  function formatMonthYear(monthYear: string) {
    const [year, month] = monthYear.split("-");
    const months = [
      "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
      "Jul", "Ago", "Set", "Out", "Nov", "Dez"
    ];
    return `${months[Number(month) - 1]}/${year.slice(2)}`;
  }

  const {
    data: appointmentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAppointmentMutation(companyId);

  const barData = useMemo(() => {
    const grouped: Record<string, number> = {};
    let all = appointmentsData?.pages.flatMap((page) => page.content ?? []) ?? [];
    
    if (selectedEmployeeId !== null) {
      all = all.filter((app) => app.employee?.id === selectedEmployeeId);
    }
    
    all.forEach((app) => {
      if (!app.dateScheduled) return;
      const d = new Date(app.dateScheduled);
      if (d >= dateStart && d <= dateEnd) {
        if (app.status === AppointmentStatus.SCHEDULED || app.status === AppointmentStatus.CONFIRMED) {
          const dateStr = typeof app.dateScheduled === "string" ? app.dateScheduled : app.dateScheduled.toISOString();
          const monthStr = dateStr.substring(0, 7); // "YYYY-MM"
          grouped[monthStr] = (grouped[monthStr] || 0) + 1;
        }
      }
    });

    return (monthlyData ?? []).map((item: any) => ({
      value: grouped[item.monthYear] || 0,
      label: formatMonthYear(item.monthYear),
      rawMonthYear: item.monthYear,
    }));
  }, [monthlyData, appointmentsData, selectedEmployeeId, dateStart, dateEnd]);

  const [highlightValue, setHighlightValue] = useState(0);

  useEffect(() => {
    if (barData.length > 0 && selectedBar === null) {
      setSelectedBar(barData.length - 1);
      setHighlightValue(barData[barData.length - 1].value);
    }
  }, [barData]);

  useEffect(() => {
    if (selectedBar !== null && barData[selectedBar]) {
      setHighlightValue(barData[selectedBar].value);
    }
  }, [selectedBar, barData]);

  const maxBarValue = useMemo(() => {
    return Math.max(...barData.map((b: any) => b.value), 1);
  }, [barData]);

  // Auto-load all pages to list everything
  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, appointmentsData]);

  const periodFilteredAppointments = useMemo(() => {
    let all = appointmentsData?.pages.flatMap((page) => page.content ?? []) ?? [];
    all = all.filter(
      (item) =>
        item.status === AppointmentStatus.SCHEDULED ||
        item.status === AppointmentStatus.CONFIRMED,
    );
    all = all.filter((app) => {
      if (!app.dateScheduled) return false;
      const date = new Date(app.dateScheduled);
      return date >= dateStart && date <= dateEnd;
    });

    if (selectedEmployeeId !== null) {
      all = all.filter((app) => app.employee?.id === selectedEmployeeId);
    }

    return all;
  }, [appointmentsData, dateStart, dateEnd, selectedEmployeeId]);

  const periodTotalCount = periodFilteredAppointments.length;

  const appointmentsList = useMemo(() => {
    if (selectedBar !== null && barData[selectedBar]) {
      const selectedMonthStr = barData[selectedBar].rawMonthYear; // "2026-06"
      const [year, month] = selectedMonthStr.split("-").map(Number);

      return periodFilteredAppointments.filter((app) => {
        if (!app.dateScheduled) return false;
        const date = new Date(app.dateScheduled);
        return date.getFullYear() === year && date.getMonth() + 1 === month;
      });
    }

    return periodFilteredAppointments;
  }, [periodFilteredAppointments, selectedBar, barData]);

  const selectedMonthLabel =
    selectedBar !== null && barData[selectedBar]
      ? barData[selectedBar].label
      : null;

  return {
    monthlyLoading,
    selectedBar,
    setSelectedBar,
    highlightValue,
    periodTotalCount,
    selectedMonthLabel,
    barData,
    maxBarValue,
    appointmentsList,
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

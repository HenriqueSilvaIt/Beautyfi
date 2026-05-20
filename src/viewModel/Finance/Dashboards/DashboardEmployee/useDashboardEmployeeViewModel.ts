import { useFormatDate } from "@/shared/hooks/useFormatDate";
import {
  DashboardEmployeeDTO,
  DashboardEmployeeParam,
} from "@/shared/interfaces/http/finance";
import { useFinanceMutation } from "@/shared/queries/finance/use-finance-mutation";
import { useEffect, useState } from "react";

export function useDashboardEmployeeViewModel() {
  const [reportData, setReportData] = useState<DashboardEmployeeDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);

 

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const { DateIsoToBR, formatDateToISO } = useFormatDate();
  const today = formatDateToISO(new Date());
 const [dateParam, setDateParam] = useState<DashboardEmployeeParam>({
    startDate: today,
    endDate: today,
  });
  console.log(reportData);

  const { getDashboardEmployeeMutation } = useFinanceMutation();

  async function onGetReportData() {
    try {
      setIsLoading(true);

      const data = await getDashboardEmployeeMutation.mutateAsync({
        startDate: dateParam.startDate,
        endDate: dateParam.endDate,
      });

      console.log(data);

      setReportData(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleChangeDate(startDate: string, endDate: string) {
    setDateParam({
      startDate: startDate,
      endDate: endDate,
    });
  }

  useEffect(() => {
    onGetReportData();
  }, [dateParam]);

  return {
    reportData,
    setShowStartDatePicker,
    setShowEndDatePicker,
    showStartDatePicker,
    showEndDatePicker,
    DateIsoToBR,
    isLoading,
    dateParam,
    setDateParam,
    formatDateToISO,
    handleChangeDate,
    onGetReportData,
  };
}

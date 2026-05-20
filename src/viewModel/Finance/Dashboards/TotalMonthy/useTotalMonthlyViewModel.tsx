import {
  TotalMonthlyDTO,
} from "@/shared/interfaces/http/finance";
import { useFinanceMutation } from "@/shared/queries/finance/use-finance-mutation";
import { useEffect, useState } from "react";

export function useTotalMonthlyViewModel() {
  const { getTotalMonthlyMutation } = useFinanceMutation();

const [totalMonthly, setTotalMonthly] = useState<TotalMonthlyDTO[]>([]);





  async function onGetTotalMonthly() {
    try {
      const response = await getTotalMonthlyMutation.mutateAsync();

    console.log("API RESPONSE:", response);

    setTotalMonthly(response);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    onGetTotalMonthly();
  }, []);

  return {
    totalMonthly,
  };
}

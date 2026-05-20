import { EmployeeDtoMin } from "@/shared/interfaces/http/employee";
import { useStripeMutation } from "@/shared/queries/stripe/use-stripe-mutataion";
import { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { SubscriptionPlanEmployeeFormData } from "./subscription-plan-employees.scheme";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { usePlanStore } from "@/shared/store/plan-store";
import { router } from "expo-router";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";

export function useSubscriptionPlanEmployeesViewModel() {
  const { upsertEmployeeInPlanMutation, getEmployeesByPlanIdQuery } =
    useStripeMutation();
    const {useGetEmployeeMutation} = useEmployeeMutation();
    const {
  data: allEmployeesData,
} = useGetEmployeeMutation();

const employees =
  allEmployeesData?.pages.flatMap(
    page => page.content ?? []
  ) ?? [];
  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();

  const [isLoading, setIsLoading] = useState(false);

  const { planId } = usePlanStore();
  const {
    data: associatedEmployeesData,
    error: employeesError,
    refetch: employeesRefetch,
    isRefetching: employeesIsRefetching,
    fetchNextPage: employeesFetchNextPage,
    isFetchingNextPage: employeesIsFetchingNextPage,
    hasNextPage: employeeHasNextPage,
    isLoading: employeeIsLoading,
  } = getEmployeesByPlanIdQuery(planId);
const associatedEmployees =
  associatedEmployeesData?.pages.flatMap(
    page => page.content ?? []
  ) ?? [];
console.log("funcionários", employees);
  const { watch, setValue, handleSubmit, reset } =
    useFormContext<SubscriptionPlanEmployeeFormData>();
  const selectedEmployees = (watch("employeeIds") ?? []) as number[];

const isAllSelected =
  employees.length > 0 &&
  selectedEmployees.length === employees.length;
  const onSubmit = handleSubmit(async (employeeData) => {
    try {
      setIsLoading(true);

      console.log(employeeData.employeeIds);

      await upsertEmployeeInPlanMutation.mutateAsync({
        planId: planId,
        dataBody: {
          employeeIds: employeeData.employeeIds ?? [],
        },
      });

      notify({
        message: "Atualizado com sucesso",
        type: "SUCCESS",
      });

      await employeesRefetch();
      router.back();
    } catch (error) {
      handleError(error, "Falha ao criar ou atualizar serviço");
    } finally {
      setIsLoading(false);
    }
  });

  // Função para Buscar serviços

  const toggleEmployee = useCallback(
    (id: number) => {
      const currentEmployeeIds = (watch("employeeIds") ?? []) as number[];
      const exists = currentEmployeeIds.includes(id);

      const updated = exists
        ? currentEmployeeIds.filter((employeeId) => employeeId !== id)
        : [...currentEmployeeIds, id];

      setValue("employeeIds", updated, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [watch, setValue],
  );

  const toggleSelectAll = useCallback(() => {
    const currentEmployees = (watch("employeeIds") ?? []) as number[];

    const allSelected = currentEmployees.length === employees?.length;

    // Se todos já estiverem selecionados → limpa tudo
    if (allSelected) {
      setValue("employeeIds", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    // Se não estiverem todos selecionados → seleciona todos
    const allEmployees = employees
      ?.map((employee) => employee.id)
      .filter((employeeId): employeeId is number => employeeId != null);

    setValue("employeeIds", allEmployees ?? [], {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [watch, setValue, employees]);

 
  useEffect(() => {
  if (!associatedEmployees.length) return;

  setValue(
    "employeeIds",
    associatedEmployees
      .map(employee => employee.id)
      .filter((id): id is number => id != null)
  );
}, [associatedEmployees]);
  return {
    employees,
    employeesError,
    employeesRefetch,
    employeesIsRefetching,
    employeesFetchNextPage,
    employeesIsFetchingNextPage,
    employeeHasNextPage,
    employeeIsLoading,
    toggleEmployee,
    toggleSelectAll,
    selectedEmployees,
    isAllSelected,
    onSubmit,
  };
}

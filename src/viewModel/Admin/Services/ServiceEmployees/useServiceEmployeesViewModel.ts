import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useFormContext } from "react-hook-form";
import { EmployeeFormData } from "../../Employees/employee.scheme";
import {
  EmployeeInterface,
  ServiceEmployeeParam,
} from "@/shared/interfaces/http/employee";
import { useCallback } from "react";
import { ServiceFormData } from "../service.scheme";

export function useServiceEmployeesViewModel() {
  const { useGetEmployeeMutation } = useEmployeeMutation();

  const {
    data,
    refetch,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isRefetching,
  } = useGetEmployeeMutation();

  const { watch, setValue } = useFormContext<ServiceFormData>();
  const selectedEmployees = (watch("employees") ??
    []) as ServiceEmployeeParam[];
  const employees = data?.pages?.flatMap((page) => page.content ?? []) ?? [];

  const isAllSelected = selectedEmployees.length === employees.length;
  // Função para Buscar serviços

  const toggleEmployee = useCallback(
    (id: number) => {
      const currentEmployees = (watch("employees") ??
        []) as ServiceEmployeeParam[];

      const currentEmployee = (watch("employees") ?? []) as EmployeeInterface[];
      const exists = currentEmployee.some((s) => s.id === id);

      if (exists) {
        const updated = currentEmployee.filter((s) => s.id !== id);
        setValue("employees", updated, {
          shouldDirty: true,
          shouldValidate: true,
        });
        return;
      }

      const updated = [...currentEmployees, { id }];

      setValue("employees", updated, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [watch, setValue],
  );

  const toggleSelectAll = useCallback(() => {
    const currentEmployees = (watch("employees") ??
      []) as ServiceEmployeeParam[];
    
    const allSelected = currentEmployees.length === employees.length;

    // Se todos já estiverem selecionados → limpa tudo
    if (allSelected) {
      setValue("employees", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    // Se não estiverem todos selecionados → seleciona todos
    const allEmployees = employees.map((service) => ({
      id: service.id,
    }));

    setValue("employees", allEmployees, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [watch, setValue, employees]);

  return {
    employees,
    isRefetching,
    isLoading,
    error,
    toggleEmployee,
    toggleSelectAll,
    selectedEmployees,
    isAllSelected,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
}

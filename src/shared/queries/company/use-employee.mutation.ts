import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  customServiceDetailsInsert,
  customServiceDetailsUpdate,
  deleteEmployeeById,
  findByEmployeeAndService,
  getEmployeeById,
  getEmployeeByUser,
  getEmployees,
  getEmployeesByServiceId,
  postEmployees,
  updateEmployees,
} from "@/shared/services/employee.service";
import {
  EmployeeInterface,
  ServiceEmployeeParams,
} from "@/shared/interfaces/http/employee";
import { queryClient } from "../../../../queryClient";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";

interface UpdateEmployeesVariables {
  employeeId?: number;
  data: EmployeeInterface;
}

interface UpdateCustomServiceVariables {
  id: number;
  dataBody: ServiceEmployeeParams;
}

interface FetchCustomServiceVariables {
  employeeId: number;
  serviceId: number;
}

export const employeeKeys = {
  detail: (id: number) => ["employee", id] as const,
};

export function useEmployeeMutation() {
  function useGetEmployeeById(id: number) {
    return useQuery<EmployeeInterface>({
      queryKey: employeeKeys.detail(id),
      queryFn: () => {
        if (!id) throw new Error("Id is required");
        return getEmployeeById(id);
      },

      enabled: Number.isFinite(id) && id > 0,
      staleTime: 0, // ✅ sempre considera dado stale — notifica mudanças
      gcTime: 1000 * 60 * 5, // ✅ mantém no cache por 5 min sem refetch desnecessário
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }
  const employeeGetUserMutation = useMutation({
    mutationFn: (id: number) => getEmployeeByUser(id),
    onSuccess: (response) => {},
    onError: (error) => {
      console.error(error);
    },
  });

  function useGetEmployeeMutation(params?: {
    name?: string;
    companyId?: string;
    employeeId?: number;
  }) {
    const userCompanyId = useUserStore((state: any) => state.user?.companyId);
    const selectedCompanyId = useCompanyStore((state: any) => state.selectedCompanyId);

    const resolvedCompanyId = params?.companyId 
      ? Number(params.companyId) 
      : (userCompanyId || selectedCompanyId || undefined);

    return useInfiniteQuery({
      queryKey: ["employees", params?.employeeId, params?.name, resolvedCompanyId],
      queryFn: ({ pageParam = 0 }) =>
        getEmployees(
          pageParam, 
          30, 
          params?.employeeId, 
          params?.name, 
          resolvedCompanyId
        ),
      enabled: resolvedCompanyId !== undefined && resolvedCompanyId > 0,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 0,
      gcTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    });
  }

  const employeesGetByServiceIdMutation = useMutation({
    mutationFn: (id: number) => getEmployeesByServiceId(id),
    onSuccess: (response) => {},
    onError: (error) => {
      console.error(error);
    },
  });

  const employeeUpdateMutation = useMutation({
    mutationFn: ({ employeeId, data }: UpdateEmployeesVariables) =>
      updateEmployees(data, employeeId),
    onSuccess: (response) => {
      console.log("✅ onSuccess response.id:", response.id);
      console.log(
        "✅ employeeKeys.detail:",
        employeeKeys.detail(Number(response.id)),
      );

      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.setQueryData(
        employeeKeys.detail(Number(response.id)),
        response,
      );

      // confirma que foi salvo
      const cached = queryClient.getQueryData(
        employeeKeys.detail(Number(response.id)),
      );
      console.log("✅ cache após setQueryData:", JSON.stringify(cached));
    },
  });

  const employeePostMutation = useMutation({
    mutationFn: (data: EmployeeInterface) => postEmployees(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.setQueryData(
        employeeKeys.detail(Number(response.id)),
        response,
      );
      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const findByEmployeeAndServiceMutation = useMutation({
    mutationFn: ({ employeeId, serviceId }: FetchCustomServiceVariables) =>
      findByEmployeeAndService(employeeId, serviceId),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const customServiceDetailsInsertMutation = useMutation({
    mutationFn: (data: ServiceEmployeeParams) =>
      customServiceDetailsInsert(data),
    onSuccess: (response) => {},
    onError: (error) => {
      console.error(error);
    },
  });

  const customServiceDetailsUpdateMutation = useMutation({
    mutationFn: ({ dataBody, id }: UpdateCustomServiceVariables) =>
      customServiceDetailsUpdate(dataBody, id),
    onSuccess: (response) => {},
    onError: (error) => {
      console.error(error);
    },
  });

  const employeeDeleteByIdMutation = useMutation({
    mutationFn: (employeeId: number) => deleteEmployeeById(employeeId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employee"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    employeePostMutation,
    useGetEmployeeById,
    employeesGetByServiceIdMutation,
    employeeGetUserMutation,
    useGetEmployeeMutation,
    employeeDeleteByIdMutation,
    findByEmployeeAndServiceMutation,
    customServiceDetailsInsertMutation,
    customServiceDetailsUpdateMutation,
    employeeUpdateMutation,
  };
}

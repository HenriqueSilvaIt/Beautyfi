import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useAppModal } from "@/shared/hooks/useAppModal";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { CompanyServicesInterface } from "@/shared/interfaces/http/company-services";
import {
  EmployeeInterface,
  EmployeeProps,
} from "@/shared/interfaces/http/employee";
import { OrderItemInsertParams } from "@/shared/interfaces/http/order";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useModalStore } from "@/shared/store/modal-store";
import { useOrderStore } from "@/shared/store/order-store";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export function useNewServiceItemViewModel() {
  const [dateTimePicker, setDateTimePicker] = useState(false);
  const { formatDateTimeToBR } = useFormatDate();

  const date = useOrderStore((state) => state.serviceItemDate);
  const setDate = useOrderStore((state) => state.setServiceItemDate);
  const order = useOrderStore((state) => state.order);
  const { useGetOrderById } = useOrderMutation();
  const { refetch: orderByIdRefetch } = useGetOrderById(Number(order?.id));

  const serviceId = useOrderStore((state) => state.serviceItemId);
  const setServiceId = useOrderStore((state) => state.setServiceItemId);
  const service = useOrderStore((state) => state.service);
  const setService = useOrderStore((state) => state.setService);

  const employeeId = useOrderStore((state) => state.employeeItemId);
  const setEmployeeId = useOrderStore((state) => state.setEmployeeItemid);
  const employee = useOrderStore((state) => state.employee);
  const setEmployee = useOrderStore((state) => state.setEmployee);
  const [employees, setEmployees] = useState<EmployeeInterface[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);
  const [isItemLoading, setIsItemLoading] = useState(false);
  const { useGetServiceMutation } = useCompanyServicesMutation();
  const {
    data: serviceData,
    error,
    refetch: serviceRefetch,
    isFetchingNextPage: serviceIsFetchingNextPage,
    hasNextPage: serviceHasNextPage,
    fetchNextPage: serviceFetchNextPage,
    isLoading: serviceIsLoading,
    isRefetching: serviceIsRefetching,
  } = useGetServiceMutation();
  const servicesDataPagged =
    serviceData?.pages.flatMap((page) => page.content) ?? [];

  const [serviceIsSelected, setServiceIsSelected] = useState(false);

  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();

  const { formatDateToDateTimeIso } = useFormatDate();

  const modal = useAppModal();
  const { close } = useModalStore();
  const { addItemToOrderMutation } = useOrderMutation();
  const { employeesGetByServiceIdMutation } = useEmployeeMutation();

  // Função para Buscar Profissionals

  async function onGetEmployeesByServiceId() {
    try {
      setIsItemLoading(true);
      const data = await employeesGetByServiceIdMutation.mutateAsync(
        Number(serviceId),
      );
      const mutationResponse = data ?? [];
      console.log("Profissionais RECEBIDOS DA API:", mutationResponse);
      setEmployees([...mutationResponse]);
    } catch (error) {
      handleError(error, "Falha ao buscar profissionais");
    } finally {
      setIsItemLoading(false);
    }
  }

  // Vai ter que fazer um método que busca os serviços pelo employeeId e companyId
  // para mostrar somente os serviços que determinado funcionário faz

  async function onAddServiceToOrder() {
    try {
      setIsItemLoading(true);

      if (!date) {
        throw new Error("Itens do serviço não foram selecionados");
      }

      const serviceParams: OrderItemInsertParams = {
        dateScheduled: formatDateToDateTimeIso(date),
        serviceId: serviceId,
        employeeId: employeeId,
        courtesy: false,
        price: service?.price,
        userId: order.user?.id,
      };

      await addItemToOrderMutation.mutateAsync({
        orderId: Number(order?.id),
        dataBody: serviceParams,
      });
      await orderByIdRefetch();
      setService(undefined);
      setEmployee(undefined);

      notify({
        message: "Serviço adicionado com sucesso!",
        type: "SUCCESS",
      });
      router.back();
    } catch (error) {
      notify({
        message: "Falha ao adicionar serviço",
        type: "ERROR",
      });
      error;
    } finally {
      setIsItemLoading(false);
    }
  }

  async function handleOpenServiceList() {
    try {
      setIsListLoading(true);

      const formatted = servicesDataPagged.map((s) => ({
        id: s.id,
        title: s.name,
        description: s.description,
        imgUrl: s.imgUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,
        isRefetching: serviceIsRefetching,
        fetchNextPage: serviceFetchNextPage,
        hasNextPage: serviceHasNextPage,
        isFetchingNextPage: serviceIsFetchingNextPage,
        isLoading: serviceIsLoading,
        getList: serviceRefetch,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = servicesDataPagged.find((c) => c.id === item.id);
          if (!selected) return;
          setServiceId(selected.id);
          setService(selected);
          setServiceIsSelected(true);
          setEmployee(undefined);
          setEmployeeId(undefined);

          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
    }
  }

  async function handleOpenEmployeeList() {
    try {
      setIsListLoading(true);

      const data = await employeesGetByServiceIdMutation.mutateAsync(
        Number(serviceId),
      );

      console.log(serviceId, "serviço");
      const mutationResponse = data ?? [];
      console.log(JSON.stringify(mutationResponse));
      setEmployees(mutationResponse);
      const formatted = mutationResponse.map((e) => ({
        id: e.id,
        title: e.name,
        description: e.description,
        imgUrl: e.avatarUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,

        getList: onGetEmployeesByServiceId,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = mutationResponse.find((e) => e.id === item.id);
          if (!selected) return;

          setEmployeeId(selected.id);
          setEmployee(selected as EmployeeProps);
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
    }
  }

  useEffect(() => {
    if (service) {
      setEmployee(undefined);
      setEmployeeId(undefined);
    }
  }, [service]);

  return {
    dateTimePicker,
    setDateTimePicker,
    formatDateTimeToBR,
    date,
    setDate,
    service,
    setServiceId,
    handleOpenServiceList,
    employee,
    handleOpenEmployeeList,
    serviceIsSelected,
    onAddServiceToOrder,
    isItemLoading,
  };
}

import { OrderMinParams } from "@/shared/interfaces/http/order";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useOrderStore } from "@/shared/store/order-store";
import { useEffect, useMemo, useState } from "react";
import { OrderFormData, orderScheme } from "./order.scheme";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useAppModal } from "@/shared/hooks/useAppModal";
import { ClientInterface } from "@/shared/interfaces/http/client";
import { EmployeeInterface } from "@/shared/interfaces/http/employee";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useClientMutation } from "@/shared/queries/company/use.client.mutation";
import { useModalStore } from "@/shared/store/modal-store";
import { router } from "expo-router";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";

export function useNewOrderViewModel() {
  const { inserOrderMinMutation } = useOrderMutation();

  const order = useOrderStore((state) => state.order);
  const setOrder = useOrderStore((state) => state.setOrder);

  const { formatDateTimeToBR, formatDateInstantToDateTimeIso } =
    useFormatDate();

  const [openDateTimePicker, setDateTimePicker] = useState(false);
  const today = new Date();
  const [date, setDate] = useState<Date>(today);

  const modal = useAppModal();

  const [isEmployee, setIsEmployee] = useState(false);
  const [employeeSelector, setEmployeeSelector] = useState(false);

  const [clients, setClients] = useState<ClientInterface[]>([]);
  const [client, setClient] = useState<ClientInterface | null>(null);
  const [employees, setEmplyoees] = useState<EmployeeInterface[]>([]);
  const [employee, setEmployee] = useState<EmployeeInterface | null>();

  const [isListLoading, setIsListLoading] = useState(false);
  const { useGetEmployeeMutation } = useEmployeeMutation();
  const {
    data: employeeData,
    error: employeeError,
    refetch: employeeRefetch,
    isRefetching: employeeIsRefetching,
    isLoading: employeeIsLoading,
    hasNextPage: employeeHasNextPage,
    fetchNextPage: employeeFetchNextPage,
    isFetchingNextPage: employeeIsFetchingNextPage,
  } = useGetEmployeeMutation();

  const employeeDataPagged =
    employeeData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const { useGetClientMutation } = useClientMutation();

  const {
    data: clientData,
    error: clientError,
    refetch: clientRefetch,
    isRefetching: clientIsRefetching,
    isLoading: clientIsLoading,
    hasNextPage: clientHasNextPage,
    isFetchingNextPage: clientIsFetchingNextPage,
  } = useGetClientMutation();

  const { notify } = useSnackbarContext();
  const clientDataPagged =
    clientData?.pages.flatMap((page) => page.content ?? []) ?? [];

  const { close } = useModalStore();
  const { useGetOrdersMutation } = useOrderMutation();

  const {
    data: orderData,
    error: orderError,
    refetch: orderRefetch,
    isRefetching: orderIsRefetching,
    isLoading: orderIsLoading,
    hasNextPage: orderHasNextPage,
    fetchNextPage: orderFetchNextPage,
    isFetchingNextPage: orderIsFetchingNextPage,
  } = useGetOrdersMutation();
  const [loading, setLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const { control, reset, handleSubmit } = useForm<OrderFormData>({
    resolver: yupResolver(orderScheme) as unknown as Resolver<OrderFormData>,
    defaultValues: {
      additionalInfo: undefined,
      orderNumber: undefined,
    },
  });

  const { handleError } = useErrorHandler();

  async function handleOpenEmployeetList() {
    try {
      setIsListLoading(true);

      setClients(employeeDataPagged);
      const formatted = employeeDataPagged.map((e) => ({
        id: e.id,
        title: e.name, // 👈 AQUI resolve
        description: e.description,
        imgUrl: e.avatarUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,
        getList: employeeRefetch,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = employeeDataPagged.find((e) => e.id === item.id);
          if (!selected) return;
          setIsSelected(true);

          setEmployee(selected);
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar profissionais");
    } finally {
      setIsListLoading(false);
    }
  }

  async function handleOpenClientList() {
    try {
      setIsListLoading(true);

      setClients(clientDataPagged);
      const formatted = clientDataPagged.map((c) => ({
        id: c.id,
        title: c.name,
        description: c.lastName,
        imgUrl: c.profileUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,
        getList: clientRefetch,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = clientDataPagged.find((c) => c.id === item.id);
          if (!selected) return;
          setIsSelected(true);

          setClient(selected);
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
    }
  }

  const onSubmit = handleSubmit(async (orderFormData) => {
    try {
      setLoading(true);
      let isEmployeeSelected;
      if (employeeSelector) {
        isEmployeeSelected = true;
      }

      if (!isSelected) {
        console.log(isSelected)
        notify({
          message: "Escolha um cliente ou profissional",
          type: "WARNING",
        });

        return;
      }

      const orderParams: OrderMinParams = {
        moment: formatDateInstantToDateTimeIso(date) || "",
        orderNumber: orderFormData.orderNumber || null,
        additionalInfo: orderFormData.additionalInfo || "",
        clientId: client?.id,
        employeeId: employee?.id || 0,
        isEmployee: true,
      };

      const data = await inserOrderMinMutation.mutateAsync(orderParams);
      notify({
        message: "Comanda criada com sucesso!",
        type: "SUCCESS",
      });
      router.back();
      await orderRefetch();
      setOrder(data);
    } catch (error) {
      notify({
        message: "Falha ao criar comanda",
        type: "ERROR",
      });
      console.log(error);
    } finally {
      setLoading(false);
    }
  });

  function handleEmployeeOwner() {
    setEmployeeSelector(true);
    setIsEmployee(true);
  }

  function handleClientOwner() {
    setEmployeeSelector(false);
  }

  useEffect(() => {
    // Reset the form whenever the `order` object changes
    reset({
      additionalInfo: undefined,
      orderNumber: undefined,
    });
  }, [order, reset]);

  return {
    order,
    setOrder,
    employeeSelector,
    setEmployeeSelector,
    onSubmit,
    openDateTimePicker,
    setDateTimePicker,
    formatDateTimeToBR,
    handleOpenClientList,
    handleOpenEmployeetList,
    date,
    setDate,
    loading,
    handleClientOwner,
    handleEmployeeOwner,
    control,
    employee,
    client,
  };
}

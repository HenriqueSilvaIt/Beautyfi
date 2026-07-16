import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { SelectionVariant, useAppModal } from "@/shared/hooks/useAppModal";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useModalStore } from "@/shared/store/modal-store";
import { useOrderStore } from "@/shared/store/order-store";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  OrderDetailsFormData,
  orderDetailsScheme,
} from "./orderDetails.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";
import {
  EPaymentStatus,
  PaymentCardFlagDTO,
  PaymentInsertDTO,
  PaymentMethodDTO,
} from "@/shared/interfaces/http/order";
import { useClientMutation } from "@/shared/queries/company/use.client.mutation";
import { ClientInterface } from "@/shared/interfaces/http/client";
import { ButtonProps } from "./OrderDetails.view";
import clsx from "clsx";
import { usePaymentMutation } from "@/shared/queries/finance/use-payment-mutation";
import {
  calculateOrderTotal,
  normalizeOrder,
} from "@/shared/helpers/orderCalc";

export function useOrderDetailsViewModel(orderId?: number) {
  //const [order, setOrder] = useState<OrderInterface>();

  const { formatIsoDateAndTimeToBR } = useFormatDate();

  const [isLoading, setIsLoading] = useState(false);

  const { safePush } = useSafeNavigation();
  const [clients, setClients] = useState<ClientInterface[]>([]);
  const product = useOrderStore((state) => state.product);

  const [client, setClient] = useState<ClientInterface>();

  const [paymentCardFlags, setPaymentCardFlags] = useState<
    PaymentCardFlagDTO[]
  >([]);
  const [paymentCardFlag, setPaymentCardFlag] = useState<PaymentCardFlagDTO>();
  const [installment, setInstallment] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodDTO[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodDTO>();
  const service = useOrderStore((state) => state.service);
  const order = useOrderStore((state) => state.order);
  const setOrder = useOrderStore((state) => state.setOrder);

  const isInstallmentAllowed = Boolean(
    paymentMethod?.name &&
      paymentMethod.name
        .toLowerCase()
        .replace(/[áàâãéèêíïóôõöúç]/g, (c) => {
          return {
            á: "a", à: "a", â: "a", ã: "a",
            é: "e", è: "e", ê: "e",
            í: "i", ï: "i",
            ó: "o", ô: "o", õ: "o", ö: "o",
            ú: "u", ç: "c"
          }[c] || c;
        })
        .includes("cartao de credito")
  );

  const [isDeleting, setIsDeleting] = useState(false);
  const [isListLoading, setIsListLoading] = useState(false);
  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);
  const {
    useGetOrderById,
    useGetOrdersMutation,
    addItemToOrderMutation,
    insertOrderDetailsMutation,
    closeOrderByIdMutation,
    deleteOrderByIdMutation,
    addPaymentToOrderMutation,
    removeOrderItemByIdMutation,
  } = useOrderMutation();

  const { data: orderContent, refetch: orderByIdRefetch } = useGetOrderById(
    Number(orderId) ?? "",
  );
  const { refetch: ordersRefech } = useGetOrdersMutation();
  const { useGetClientMutation } = useClientMutation();
  useClientMutation();

  const {
    data: clientData,
    error: clientError,
    refetch: clientRefetch,
    isRefetching: clientIsRefetching,
    isLoading: clientIsLoading,
    hasNextPage: clientHasNextPage,
    isFetchingNextPage: clientIsFetchingNextPage,
  } = useGetClientMutation();

  const clientDataPagged =
    clientData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const { notify } = useSnackbarContext();

  const { handleError } = useErrorHandler();

  const { getPaymentMethodMutation, getPaymentCardFlagMutation } =
    usePaymentMutation();

  const modal = useAppModal();

  const { close, open } = useModalStore();

  const { control, reset, handleSubmit } = useForm<OrderDetailsFormData>({
    resolver: yupResolver(
      orderDetailsScheme,
    ) as unknown as Resolver<OrderDetailsFormData>,
    defaultValues: {
      discount: undefined,
      total: undefined,
      tip: undefined,
    },
  });

  function generateInstallments(max = 12, allowZero = true) {
    return Array.from({ length: allowZero ? max + 1 : max }, (_, i) => {
      const value = allowZero ? i : i + 1;

      return {
        label: value === 0 ? "À vista" : `${value}x`,
        value,
      };
    });
  }
  const installments = generateInstallments(12, true);

  async function handleOpenInstallmentCheckbox() {
    try {
      setIsListLoading(true);
      const formatted = installments.map((item) => ({
        id: item.value,
        name: item.label,
        value: item.value,
      }));

      modal.showCheckbox({
        data: formatted,
        title: "Parcelas",
        isRefreshing: false,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = installments.find((e) => e.value === item.id);
          if (!selected) return;

          setInstallment(selected.value);
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
    }
  }

  async function handleOpenPaymentFlagCheckbox() {
    try {
      setIsListLoading(true);

      const data = await getPaymentCardFlagMutation.mutateAsync();

      const mutationResponse = data ?? [];
      setPaymentCardFlags(mutationResponse);
      const formatted = mutationResponse.map((p) => ({
        id: p.id,
        name: p.name,
      }));
      modal.showCheckbox({
        data: formatted,
        title: "Escolha a bandeira",
        isRefreshing: false,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = mutationResponse.find((e) => e.id === item.id);
          if (!selected) return;

          setPaymentCardFlag(selected);
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
    }
  }

  async function handleOpenPaymentMethodCheckbox() {
    try {
      setIsListLoading(true);

      const data = await getPaymentMethodMutation.mutateAsync();

      const mutationResponse = data ?? [];
      console.log(JSON.stringify(mutationResponse));
      setPaymentMethods(mutationResponse);
      const formatted = mutationResponse.map((p) => ({
        id: p.id,
        name: p.name,
      }));
      modal.showCheckbox({
        data: formatted,
        title: "Forma de Pagamento",
        isRefreshing: false,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = mutationResponse.find((e) => e.id === item.id);
          if (!selected) return;
          setPaymentMethod(selected);
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
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
        description: c.phone,
        imgUrl: c.profileUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,
        getList: clientRefetch,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = clientDataPagged.find((e) => e.id === item.id);
          if (!selected) return;

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
  const createDiscount = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      await insertOrderDetailsMutation.mutateAsync({
        orderId: Number(order.id),
        discount: Number(data.discount),
        tip: 0,
      });

      const { data: updatedOrder } = await orderByIdRefetch();
      if (updatedOrder) {
        setOrder(normalizeOrder(updatedOrder));
      }
      reset({ discount: undefined });
      notify({ message: "Desconto aplicado!", type: "SUCCESS" });
    } catch (error) {
      handleError(error, "Falha ao aplicar desconto");
    } finally {
      setIsLoading(false);
      close();
    }
  });

  const createTip = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      await insertOrderDetailsMutation.mutateAsync({
        orderId: Number(order.id),
        tip: Number(data.tip),
      });

      const { data: updatedOrder } = await orderByIdRefetch();
      if (updatedOrder) {
        setOrder(normalizeOrder(updatedOrder));
      }
      reset({ tip: undefined });
      notify({ message: "Gorjeta adicionada!", type: "SUCCESS" });
    } catch (error) {
      handleError(error, "Falha ao adicionar gorjeta");
    } finally {
      setIsLoading(false);
      close();
    }
  });

  const createTotal = handleSubmit(async (data) => {
    try {
      setIsLoading(true);
      await insertOrderDetailsMutation.mutateAsync({
        orderId: Number(order.id),
        total: Number(data.total),
      });

      // ✅ Estava faltando isso
      const { data: updatedOrder } = await orderByIdRefetch();
      if (updatedOrder) {
        setOrder(normalizeOrder(updatedOrder));
      }

      reset({ total: undefined });
      notify({ message: "Total atualizado!", type: "SUCCESS" });
    } catch (error) {
      handleError(error, "Falha ao atualizar total");
    } finally {
      setIsLoading(false);
      close();
    }
  });

  async function onAddPaymentOrder() {
    const payload: PaymentInsertDTO = {
      installment: installment,
      paymentCardFlagId: paymentCardFlag?.id
        ? Number(paymentCardFlag.id)
        : undefined,
      paymentMethodId: Number(paymentMethod?.id),
      amount: order.total,
      status: EPaymentStatus.PENDING,
    };

    // ✅ Sem try/catch — deixa o erro subir para onCloseOrder
    await addPaymentToOrderMutation.mutateAsync({
      dataBody: payload,
      orderId: Number(order.id),
    });
  }

  async function onCloseOrder() {
    try {
      setIsLoading(true); // ✅ adicione loading

      await closeOrderByIdMutation.mutateAsync(Number(order.id));

      //  Só adiciona pagamento se tiver método selecionado
      if (paymentMethod?.id) {
        await onAddPaymentOrder();
      }

      notify({ message: "Comanda fechada com sucesso!", type: "SUCCESS" });
      await ordersRefech();
      router.back();
    } catch (error) {
      handleError(error, "Falha ao fechar comanda");
    } finally {
      setIsLoading(false);
    }
  }
  function handleOpenTipModal() {
    try {
      modal.showTotal({
        type: "tip",
        title: "Gorjeta",
        subtitle: "Adicionar gorjeta",
        control,
        buttonAction: () => createTip(),
        buttonTitle: "Salvar",
        isLoading: isLoading,
      });
    } catch (error) {
      handleError(error, "Falha ao abrir tela");
    }
  }
  function handleOpenTotalModal() {
    try {
      modal.showTotal({
        amount: 0,
        type: "total",
        total: 0,
        title: "Valor total da comanda",
        subtitle:
          "Edite o valor total da comanda, a comissão do profissional não sera afetada",
        control,
        buttonAction: () => createTotal(),
        buttonTitle: "Salvar",
        isLoading: isLoading,
      });
    } catch (error) {
      handleError(error, "Falha ao abrir tela");
    }
  }

  function handleOpenDiscountModal() {
    try {
      modal.showAmount({
        amount: 0,
        type: "discount",
        title: "Aplicação desconto na comanda",
        subtitle: "Porcentagem de desconto",
        control,
        buttonAction: createDiscount,
        buttonTitle: "Aplicar Desconto",
        isLoading: isLoading,
      });
    } catch (error) {
      handleError(error, "Falha ao abrir tela");
    }
  }

  function hideDeleteModal() {
    try {
      setModalDeleteVisible(false);
      close();
    } catch (error) {
      console.log(error);
    }
  }

  function showDeleteModal() {
    setModalDeleteVisible(true);
  }

  async function onDeleteOrder(orderId: number) {
    try {
      setIsDeleting(true);
      await deleteOrderByIdMutation.mutateAsync(orderId);
      await ordersRefech();
      notify({
        message: "Comanda deletada com sucesso!",
        type: "SUCCESS"
      })
      router.back();
    } catch (error) {
      handleError(error, "Falha ao deletar comanda")
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  }
  useEffect(() => {
    if (orderContent) {
      setOrder(normalizeOrder(orderContent));
    }
  }, [orderContent]);
  useEffect(() => {
    orderByIdRefetch();
  }, [service, client, product]);
  useEffect(() => {
    if (!orderId) return;
    orderByIdRefetch();
  }, [orderId]);
  useEffect(() => {
    if (orderContent) {
      setOrder(normalizeOrder(orderContent));
    }
  }, [orderContent]);
  const displayTotal = useMemo(() => {
    return Number(order?.total ?? 0);
  }, [order?.total]);
  return {
    isLoading,
    orderByIdRefetch,
    handleOpenTotalModal,
    safePush,
    order,
    setModalDeleteVisible,
    modalDeleteVisible,
    setIsDeleting,
    displayTotal,
    isDeleting,
    hideDeleteModal,
    showDeleteModal,
    handleOpenDiscountModal,
    onDeleteOrder,
    control,
    paymentMethod,
    client,
    createDiscount,
    paymentCardFlag,
    handleOpenTipModal,
    installment,
    handleOpenPaymentMethodCheckbox,
    handleOpenInstallmentCheckbox,
    handleOpenPaymentFlagCheckbox,
    handleOpenClientList,
    onCloseOrder,
    formatIsoDateAndTimeToBR,
    isInstallmentAllowed,
  };
}

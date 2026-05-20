import { useEffect, useMemo, useState } from "react";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { router } from "expo-router";
import { OrderItemInsertParams } from "@/shared/interfaces/http/order";
import { yupResolver } from "@hookform/resolvers/yup";
import { Resolver, useForm } from "react-hook-form";

import { useAppModal } from "@/shared/hooks/useAppModal";
import { useMask } from "@/shared/hooks/useMask";
import { useModalStore } from "@/shared/store/modal-store";
import { useProductMutation } from "@/shared/queries/company/use-product.mutation";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { ProductInterface } from "@/shared/interfaces/http/product";
import { useOrderStore } from "@/shared/store/order-store";
import {
  EmployeeInterface,
  EmployeeProps,
} from "@/shared/interfaces/http/employee";
import { DeleteModal } from "@/shared/components/AppDeleteModal";
import { moneyMapper, parseMoney } from "@/utils/moneyMapper";
import {
  UpdateProductItemFormData,
  updateProductItemScheme,
} from "./updateProductItem.scheme";

export function useProductItemDetailsViewModel(productId?: number) {
  const [isDeleting, setIsDeleting] = useState(false);

  const [modalDeleteVisible, setModalDeleteVisible] = useState(false);

  const employeeId = useOrderStore((state) => state.employeeItemId);
  const setEmployeeId = useOrderStore((state) => state.setEmployeeItemid);
  const employee = useOrderStore((state) => state.employee);
  const setEmployee = useOrderStore((state) => state.setEmployee);
  const [employees, setEmployees] = useState<EmployeeInterface[]>([]);

  const product = useOrderStore((state) => state.product);
  const setProduct = useOrderStore((state) => state.setProduct);
  const productItemId = useOrderStore((state) => state.productItemId);
  const setProductItemId = useOrderStore((state) => state.setProductItemId);

  const [isProductSelected, setIsProductSelected] = useState(false);

  const order = useOrderStore((state) => state.order);
  const { useGetOrderById } = useOrderMutation();
  const { refetch: orderByIdRefetch } = useGetOrderById(Number(order?.id));
  const item = order.items?.find((x) => x.productId === productId);
  const [products, setProducts] = useState<ProductInterface[]>([]);

  const [quantity, setQuantity] = useState(1);
  const basePrice = product?.price ?? item?.price ?? 0;
  const [isListLoading, setIsListLoading] = useState(false);
  const { notify } = useSnackbarContext();
  const [isItemLoading, setIsItemLoading] = useState(false);
  const { handleError } = useErrorHandler();

  const [courtesy, setCourtesy] = useState(false);
  const [toUse, setToUse] = useState(false);

  const { useGetEmployeeMutation } = useEmployeeMutation();

  const {
    data: employeeData,
    error: employeeError,
    refetch: employeeRefetch,
    fetchNextPage: employeeFetchNextPage,
    isRefetching: employeeIsRefetching,
    isLoading: employeeIsLoading,
    hasNextPage: employeeHasNextPage,
    isFetchingNextPage: employeeIsFetchingNextPage,
  } = useGetEmployeeMutation();

  const employeeDataPagged =
    employeeData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const { removeOrderItemByIdMutation, updateItemToOrderMutation } =
    useOrderMutation();
  const { maskMoneyBR } = useMask();

  const modal = useAppModal();
  const { close } = useModalStore();
  const { useGetProductsMutation } = useProductMutation();

  const {
    data: productData,
    error,
    refetch: productRefetch,
    isRefetching: productIsRefetching,
    hasNextPage: productHasNextPage,
    fetchNextPage: productFetchNextPage,
    isFetchingNextPage: productIsFetchingNextPage,
    isLoading: productIsLoading,
  } = useGetProductsMutation();

  const productDataPagged =
    productData?.pages.flatMap((pages) => pages.content ?? []) ?? [];
  function handleToggleCourtesy() {
    setCourtesy((prev) => !prev);
  }
  function handleToggleToUse() {
    setToUse((prev) => !prev);
  }

  const { control, reset, handleSubmit, setValue } =
    useForm<UpdateProductItemFormData>({
      resolver: yupResolver(
        updateProductItemScheme,
      ) as Resolver<UpdateProductItemFormData>,
      defaultValues: {
        price: moneyMapper(item?.price) ?? 0,
      },
    });

  const onUpdateProductToOrder = handleSubmit(async (data) => {
    try {
      setIsItemLoading(true);

      const itemId = item?.id;
      if (!itemId) throw new Error("Item não encontrado");

      const productParams: OrderItemInsertParams = {
        productId: productItemId ?? item?.productId,
        employeeId: employeeId,
        quantity: quantity,
        courtesy: courtesy,
        toUse: toUse,
        price: parseMoney(data.price), // ✅ desmascarar
        userId: order.user?.id,
      };

      await updateItemToOrderMutation.mutateAsync({
        orderId: Number(order?.id),
        orderItemId: Number(itemId), // ✅ id do item existente
        dataBody: productParams,
      });
      await orderByIdRefetch();
      notify({ message: "Produto atualizado com sucesso!", type: "SUCCESS" });
      router.back();
    } catch (error) {
      handleError(error, "Falha ao atualizar produto");
    } finally {
      setIsItemLoading(false);
    }
  });
  async function handleOpenEmployeeList() {
    try {
      setIsListLoading(true);

      setEmployees(employeeDataPagged);
      const formatted = employeeDataPagged.map((e) => ({
        id: e.id,
        title: e.name,
        description: e.description,
        imgUrl: e.avatarUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,
        isRefetching: employeeIsRefetching,
        fetchNextPage: employeeFetchNextPage,
        hasNextPage: employeeHasNextPage,
        isFetchingNextPage: employeeIsFetchingNextPage,
        isLoading: employeeIsLoading,
        onRefetch: employeeRefetch,
        getList: employeeRefetch,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = employeeDataPagged.find((e) => e.id === item.id);
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

  async function handleOpenProductList() {
    try {
      setIsListLoading(true);

      setProducts(productDataPagged);
      const formatted = productDataPagged.map((s) => ({
        id: s.id,
        title: s.name,
        description: s.description,
        imgUrl: s.imgUrl,
      }));
      modal.showList({
        data: formatted,
        isRefreshing: false,
        isRefetching: productIsRefetching,
        fetchNextPage: productFetchNextPage,
        hasNextPage: productHasNextPage,
        isFetchingNextPage: productIsFetchingNextPage,
        isLoading: productIsLoading,
        getList: productRefetch,
        keyExtractor: (item, index) => item.id?.toString() ?? index.toString(),
        onItemPress: (item) => {
          const selected = productDataPagged.find((c) => c.id === item.id);
          if (!selected) return;
          setProductItemId(selected.id);
          setProduct(selected);
          setIsProductSelected(true);
          close();
        },
      });
    } catch (error) {
      handleError(error, "Falha ao buscar clientes");
    } finally {
      setIsListLoading(false);
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

  async function onDeleteOrder(orderItemId: number) {
    try {
      setIsDeleting(true);
      await removeOrderItemByIdMutation.mutateAsync(orderItemId);
      await orderByIdRefetch();
      router.back();
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  }

  useEffect(() => {
    if (product) {
      setProductItemId(product.id);
    }
  }, [product]);
  useEffect(() => {
    if (item) {
      reset({
        price: moneyMapper(item.price),
      });

      setQuantity(item.quantity ?? 1);

      setCourtesy(item.courtesy ?? false);
      setToUse(item.toUse ?? false);
    }
  }, [item]);
  const total = useMemo(() => {
    if (courtesy || toUse) return 0;
    return basePrice * quantity;
  }, [basePrice, quantity, courtesy, toUse]);

  useEffect(() => {
    const base = product?.price ?? item?.price ?? 0;
    const finalPrice = courtesy || toUse ? 0 : base * quantity;
    setValue("price", moneyMapper(finalPrice));
  }, [product?.price, item?.price, quantity, courtesy, toUse]);

  return {
    product,
    isProductSelected,
    isItemLoading,
    handleOpenProductList,
    onUpdateProductToOrder,
    employee,
    handleOpenEmployeeList,
    item,
    toUse,
    setToUse,
    courtesy,
    setCourtesy,
    quantity,
    setQuantity,
    total,
    order,
    maskMoneyBR,
    control,
    handleToggleCourtesy,
    handleToggleToUse,
    isDeleting,
    onDeleteOrder,
    setIsDeleting,
    DeleteModal,
    showDeleteModal,
    hideDeleteModal,
    modalDeleteVisible,
  };
}

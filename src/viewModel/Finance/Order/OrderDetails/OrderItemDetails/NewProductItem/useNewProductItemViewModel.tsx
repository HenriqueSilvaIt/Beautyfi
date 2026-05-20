import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useAppModal } from "@/shared/hooks/useAppModal";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import {
  EmployeeInterface,
  EmployeeProps,
} from "@/shared/interfaces/http/employee";
import { OrderItemInsertParams } from "@/shared/interfaces/http/order";
import { ProductInterface } from "@/shared/interfaces/http/product";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useProductMutation } from "@/shared/queries/company/use-product.mutation";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { useModalStore } from "@/shared/store/modal-store";
import { useOrderStore } from "@/shared/store/order-store";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  NewProductItemFormData,
  newProductItemScheme,
} from "./newProductItem.scheme";
import { Resolver, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useMask } from "@/shared/hooks/useMask";
import { moneyMapper, parseMoney } from "@/utils/moneyMapper";

export function useNewProductItemViewModel() {
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
  const { maskMoneyBR } = useMask();

  const [products, setProducts] = useState<ProductInterface[]>([]);

  const [quantity, setQuantity] = useState(1);

  const [isListLoading, setIsListLoading] = useState(false);
    const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();
  const [isItemLoading, setIsItemLoading] = useState(false);


  const [courtesy, setCourtesy] = useState(false);
  const [toUse, setToUse] = useState(false);

  const { useGetEmployeeMutation } = useEmployeeMutation();
  const {
    data: employeeData,
    error: employeeError,
    refetch: employeeRefetch,
    isRefetching: employeeIsRefetching,
    fetchNextPage: employeeFetchNextPage,
    isLoading: employeeIsLoading,
    hasNextPage: employeeHasNextPage,
    isFetchingNextPage: employeeIsFetchingNextPage,
  } = useGetEmployeeMutation();

  const employeeDataPagged =
    employeeData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const { addItemToOrderMutation } = useOrderMutation();

  const modal = useAppModal();
  const { close } = useModalStore();

  const { useGetProductsMutation } = useProductMutation();
  const {
    data: productData,
    error,
    refetch : productRefetch,
    isRefetching: productIsRefetching,
    hasNextPage: productHasNextPage,
    fetchNextPage: productFetchNextPage,
    isFetchingNextPage: productIsFetchingNextPage,
    isLoading: productIsLoading
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
    useForm<NewProductItemFormData>({
      resolver: yupResolver(
        newProductItemScheme,
      ) as unknown as Resolver<NewProductItemFormData>,
      defaultValues: {},
    });

  const onAddProductToOrder = handleSubmit(async (newProductItemData) => {
    try {
      setIsItemLoading(true);

      const newPrice = parseMoney(newProductItemData.price);
      const productParams: OrderItemInsertParams = {
        productId: productItemId,
        employeeId: employeeId,
        quantity: quantity,
        courtesy: courtesy,
        toUse: toUse,
        price: newPrice,
        userId: order.user?.id,
      };

      console.log(JSON.stringify(productParams) + "para");
      await addItemToOrderMutation.mutateAsync({
        orderId: Number(order?.id),
        dataBody: productParams,
      });
      await orderByIdRefetch();
      resetFormState();
      notify({
        message: "Produto adicionado com sucesso!",
        type: "SUCCESS",
      });
      router.back();
    } catch (error: any) {
    // ✅ Mensagem específica de estoque
    if (error?.message?.includes("estoque")) {
      notify({ message: error.message, type: "ERROR" });
    } else {
      handleError(error, "Falha ao adicionar produto");
    }
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

          console.log("Product item" + selected);
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
  useEffect(() => {
    if (!product) return;

    if (courtesy || toUse) {
      setValue("price", moneyMapper(0));
      return;
    }

    const newTotal = product.price * quantity;

    // 🔥 atualiza o form também
    setValue("price", moneyMapper(newTotal));
  }, [product, quantity, courtesy, toUse]);

  const basePrice = product?.price ?? 0;

  const total = useMemo(() => {
    if (courtesy || toUse) return 0;
    return basePrice * quantity;
  }, [basePrice, quantity, courtesy, toUse]);

  function resetFormState() {
    // 1️⃣ limpa react-hook-form
    reset({
      price: "",
    });

    // 2️⃣ limpa produto
    setProduct(undefined);
    setProductItemId(undefined);
    setIsProductSelected(false);

    // 3️⃣ limpa funcionário
    setEmployee(undefined);
    setEmployeeId(undefined);

    // 4️⃣ estados locais
    setQuantity(1);
    setCourtesy(false);
    setToUse(false);
  }
  return {
    product,
    isProductSelected,
    isItemLoading,
    handleOpenProductList,
    onAddProductToOrder,
    employee,
    handleOpenEmployeeList,
    toUse,
    setToUse,
    courtesy,
    setCourtesy,
    quantity,
    setQuantity,
    total,
    maskMoneyBR,
    control,
    handleToggleCourtesy,
    handleToggleToUse,
  };
}

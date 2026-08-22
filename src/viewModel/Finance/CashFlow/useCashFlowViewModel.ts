import { useState, useEffect, useMemo } from "react";
import { Alert } from "react-native";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";
import { useOrderMutation } from "@/shared/queries/finance/use-order-mutation";
import { calculateOrderTotal } from "@/shared/helpers/orderCalc";

export interface CashItem {
  id: string | number;
  description: string;
  value: number;
  type: "DEPOSIT" | "WITHDRAW";
  dateTime: string;
  source?: "ORDER" | "CASH_MANUAL";
}

export function useCashFlowViewModel() {
  const currentUser = useUserStore((s) => s.user);
  const selectedCompanyId = useCompanyStore((s) => s.selectedCompanyId);
  const companyId = currentUser?.companyId ?? selectedCompanyId ?? 1;

  const [manualTransactions, setManualTransactions] = useState<CashItem[]>([]);
  const [loadingCash, setLoadingCash] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Form states
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");

  // Carrega comandas
  const { useGetOrdersMutation } = useOrderMutation();
  const {
    data: ordersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: ordersLoading,
  } = useGetOrdersMutation(companyId);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, ordersData]);

  const allOrders = useMemo(
    () => ordersData?.pages.flatMap((page) => page.content ?? []) ?? [],
    [ordersData],
  );

  useEffect(() => {
    loadTransactions();
  }, [companyId]);

  const loadTransactions = async () => {
    setLoadingCash(true);
    try {
      const response = await styleAppApiClient.get<CashItem[]>(
        `/cash?companyId=${companyId}`,
      );
      setManualTransactions(
        (response.data || []).map((t) => ({ ...t, source: "CASH_MANUAL" })),
      );
    } catch (err) {
      setManualTransactions([]);
    } finally {
      setLoadingCash(false);
    }
  };

  const getOrderVal = (order: any) => {
    if (order.total && Number(order.total) > 0) return Number(order.total);
    return calculateOrderTotal(order.items ?? []);
  };

  // Consolidação de transações: Lançamentos do Caixa + Comandas Fechadas
  const transactions = useMemo(() => {
    const combined: CashItem[] = [...manualTransactions];

    allOrders.forEach((order) => {
      if (!order.moment) return;
      const val = getOrderVal(order);
      if (val <= 0) return;

      const isProf = Boolean(order.isEmployee);
      combined.push({
        id: `order-${order.id}`,
        description: isProf
          ? `Comanda Profissional Nº ${order.orderNumber || order.id}`
          : `Comanda Fechada Nº ${order.orderNumber || order.id} (${order.user?.name || "Cliente"})`,
        value: val,
        type: isProf ? "WITHDRAW" : "DEPOSIT",
        dateTime: order.moment,
        source: "ORDER",
      });
    });

    return combined.sort(
      (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
    );
  }, [manualTransactions, allOrders]);

  const handleSave = async (
    descText?: string,
    valText?: string,
    typeVal?: "DEPOSIT" | "WITHDRAW",
  ) => {
    const finalDesc = descText !== undefined ? descText : description;
    const finalVal = valText !== undefined ? valText : value;
    const finalType = typeVal !== undefined ? typeVal : type;

    if (!finalDesc.trim() || !finalVal.trim()) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    try {
      await styleAppApiClient.post("/cash", {
        description: finalDesc.trim(),
        value: Number(finalVal),
        type: finalType,
        companyId,
      });

      setModalVisible(false);
      resetForm();
      loadTransactions();
    } catch (e) {
      const newItem: CashItem = {
        id: Date.now(),
        description: finalDesc.trim(),
        value: Number(finalVal),
        type: finalType,
        dateTime: new Date().toISOString(),
        source: "CASH_MANUAL",
      };
      setManualTransactions((prev) => [newItem, ...prev]);
      setModalVisible(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setDescription("");
    setValue("");
    setType("DEPOSIT");
  };

  const totals = useMemo(() => {
    let deposit = 0;
    let withdraw = 0;
    transactions.forEach((t) => {
      if (t.type === "DEPOSIT") deposit += t.value;
      else withdraw += t.value;
    });
    return { deposit, withdraw, balance: deposit - withdraw };
  }, [transactions]);

  return {
    transactions,
    loading: loadingCash || ordersLoading,
    modalVisible,
    setModalVisible,
    description,
    setDescription,
    value,
    setValue,
    type,
    setType,
    handleSave,
    deposit: totals.deposit,
    withdraw: totals.withdraw,
    balance: totals.balance,
  };
}

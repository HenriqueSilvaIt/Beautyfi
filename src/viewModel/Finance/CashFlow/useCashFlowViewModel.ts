import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useUserStore } from "@/shared/store/user-store";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";

export interface CashItem {
  id: number;
  description: string;
  value: number;
  type: "DEPOSIT" | "WITHDRAW";
  dateTime: string;
}

export function useCashFlowViewModel() {
  const user = useUserStore((s) => s.user);
  const companyId = user?.companyId || 1;

  const [transactions, setTransactions] = useState<CashItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Form states
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await styleAppApiClient.get<CashItem[]>(
        `/cash?companyId=${companyId}`,
      );
      setTransactions(response.data);
    } catch (err) {
      // fallback local
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (
    descText?: string,
    valText?: string,
    typeVal?: "DEPOSIT" | "WITHDRAW"
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
      // optimistic update
      const newItem: CashItem = {
        id: Date.now(),
        description: finalDesc.trim(),
        value: Number(finalVal),
        type: finalType,
        dateTime: new Date().toISOString(),
      };
      setTransactions((prev) => [newItem, ...prev]);
      setModalVisible(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setDescription("");
    setValue("");
    setType("DEPOSIT");
  };

  const totals = () => {
    let deposit = 0;
    let withdraw = 0;
    transactions.forEach((t) => {
      if (t.type === "DEPOSIT") deposit += t.value;
      else withdraw += t.value;
    });
    return { deposit, withdraw, balance: deposit - withdraw };
  };

  const { deposit, withdraw, balance } = totals();

  return {
    transactions,
    loading,
    modalVisible,
    setModalVisible,
    description,
    setDescription,
    value,
    setValue,
    type,
    setType,
    handleSave,
    deposit,
    withdraw,
    balance,
  };
}

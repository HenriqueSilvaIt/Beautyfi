import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { AppButton } from "@/shared/components/AppButton";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { useCashFlowViewModel } from "./useCashFlowViewModel";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";

// Subcomponente de Formulário de Nova Transação para usar dentro do BottomSheet
function TransactionForm({
  onSave,
  onClose,
  colorsStyle,
}: {
  onSave: (desc: string, val: string, type: "DEPOSIT" | "WITHDRAW") => void;
  onClose: () => void;
  colorsStyle: any;
}) {
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");
  const [type, setType] = useState<"DEPOSIT" | "WITHDRAW">("DEPOSIT");

  const handlePressSave = () => {
    onSave(description, value, type);
  };

  return (
    <View className="p-6 gap-4 bg-background-quartenary flex-1 rounded-t-3xl">
      <View className="flex-row justify-between items-center border-b border-slate-800 pb-3 mb-2">
        <Text className="text-font-primary font-bold text-lg">
          Nova Transação
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colorsStyle.white || "#ffffff"} />
        </TouchableOpacity>
      </View>

      <TextInput
        placeholder="Descrição"
        placeholderTextColor="#4b5563"
        value={description}
        onChangeText={setDescription}
        className="bg-background-tertiary text-font-primary p-4 rounded-2xl border border-slate-800 text-sm"
      />

      <TextInput
        placeholder="Valor (R$)"
        placeholderTextColor="#4b5563"
        value={value}
        onChangeText={setValue}
        keyboardType="numeric"
        className="bg-background-tertiary text-font-primary p-4 rounded-2xl border border-slate-800 text-sm"
      />

      <View className="flex-row gap-3 mt-2">
        <TouchableOpacity
          onPress={() => setType("DEPOSIT")}
          className={`flex-1 p-4 rounded-2xl items-center border ${
            type === "DEPOSIT"
              ? "bg-green-500/10 border-green-500"
              : "bg-background-tertiary border-slate-800"
          }`}
        >
          <Text className="text-green-400 font-bold text-xs">Entrada</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setType("WITHDRAW")}
          className={`flex-1 p-4 rounded-2xl items-center border ${
            type === "WITHDRAW"
              ? "bg-red-500/10 border-red-500"
              : "bg-background-tertiary border-slate-800"
          }`}
        >
          <Text className="text-red-400 font-bold text-xs">Saída</Text>
        </TouchableOpacity>
      </View>

      <AppButton variant="admin" onPress={handlePressSave} className="mt-4">
        Salvar
      </AppButton>
    </View>
  );
}

export function CashFlowView() {
  const {
    transactions,
    loading,
    handleSave,
    deposit,
    withdraw,
    balance,
  } = useCashFlowViewModel();

  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  const handleOpenTransactionSheet = () => {
    openBottomSheet(
      <TransactionForm
        colorsStyle={colors}
        onClose={closeBottomSheet}
        onSave={async (desc, val, tType) => {
          await handleSave(desc, val, tType);
          closeBottomSheet();
        }}
      />,
      0 // Abre o bottom sheet ocupando 70% da tela (snapPoint index 0)
    );
  };

  return (
    <KeyboardContainer>
      <AppAdminHeader
        title="Caixa"
        iconRight={{ icon: true, path: "" }}
        iconRightName="add-circle-outline"
        action={handleOpenTransactionSheet}
      />

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View className="bg-background-quartenary p-4 rounded-xl mb-6 gap-4 border border-slate-800 mt-4">
          <View className="flex-row justify-between">
            <View>
              <Text className="text-font-primary text-[10px] uppercase font-bold">
                Entradas
              </Text>
              <Text className="text-green-400 text-lg font-bold">
                R$ {deposit.toFixed(2)}
              </Text>
            </View>
            <View>
              <Text className="text-font-primary text-[10px] uppercase font-bold">
                Saídas
              </Text>
              <Text className="text-red-400 text-lg font-bold">
                R$ {withdraw.toFixed(2)}
              </Text>
            </View>
          </View>
          <View className="border-t border-slate-800 pt-3">
            <Text className="text-font-primary text-[10px] uppercase font-bold">
              Saldo Líquido
            </Text>
            <Text
              className="text-xl font-bold"
              style={{
                color: balance >= 0 ? colors["app-theme-primary"] : "#f87171",
              }}
            >
              R$ {balance.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* Ledger List */}
        <Text className="text-font-primary font-bold text-sm mb-3">
          Histórico recente
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={colors["app-theme-primary"]} />
        ) : transactions.length > 0 ? (
          transactions.map((t) => (
            <View
              key={t.id}
              className="bg-background-quartenary p-4 rounded-xl mb-3 flex-row justify-between items-center border border-slate-800"
            >
              <View className="flex-1 mr-4">
                <Text className="text-font-primary font-bold text-sm">
                  {t.description}
                </Text>
                <Text className="text-font-primary text-[10px] mt-1">
                  {new Date(t.dateTime).toLocaleDateString("pt-BR")}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Ionicons
                  name={t.type === "DEPOSIT" ? "arrow-up-circle" : "arrow-down-circle"}
                  size={16}
                  color={t.type === "DEPOSIT" ? "#4ade80" : "#f87171"}
                />
                <Text
                  className={`font-bold text-sm ${
                    t.type === "DEPOSIT" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {t.type === "DEPOSIT" ? "+" : "-"} R$ {t.value.toFixed(2)}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-font-primary text-xs text-center py-8">
            Nenhuma transação registrada.
          </Text>
        )}
      </ScrollView>
    </KeyboardContainer>
  );
}

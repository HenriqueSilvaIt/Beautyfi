import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";

export function EmptyInvoiceList() {
  return (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <View className="mb-5 rounded-full border border-white/10 bg-white/5 p-5">
        <Ionicons name="receipt-outline" size={34} color="white" />
      </View>

      <Text className="text-center text-lg font-semibold text-font-primary">
        Nenhuma fatura encontrada
      </Text>

      <Text className="mt-2 text-center text-sm leading-6 text-zinc-400">
        Quando houver cobranças ou pagamentos, suas faturas aparecerão aqui.
      </Text>
    </View>
  );
}

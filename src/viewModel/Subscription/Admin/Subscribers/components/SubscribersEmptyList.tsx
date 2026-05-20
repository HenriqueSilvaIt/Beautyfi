import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function SubscribersEmptyList() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <View className="rounded-3xl border border-white/10 bg-zinc-900 p-6 items-center">
        <Ionicons
          name="people-outline"
          size={48}
          color="#71717a"
        />

        <Text className="mt-4 text-lg font-bold text-font-primary">
          Nenhum assinante encontrado
        </Text>

        <Text className="mt-2 text-center text-sm text-zinc-400 leading-6">
          Ainda não existem assinantes ativos.
        </Text>
      </View>
    </View>
  );
}
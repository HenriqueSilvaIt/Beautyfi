import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function SubscribersEmptyList() {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className="w-full rounded-3xl border border-zinc-800 bg-background-tertiary p-8 items-center shadow-sm">
        <View className="w-16 h-16 rounded-full bg-zinc-800 items-center justify-center mb-4 border border-zinc-700">
          <Ionicons
            name="people-outline"
            size={32}
            color="#A1A1AA"
          />
        </View>

        <Text className="text-lg font-bold text-font-primary text-center">
          Nenhum assinante encontrado
        </Text>

        <Text className="mt-2 text-center text-sm text-zinc-400 leading-6 max-w-[260px]">
          Ainda não existem assinantes cadastrados nesta empresa.
        </Text>
      </View>
    </View>
  );
}
import React from "react";
import { View, Text } from "react-native";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";

interface MedidorDeCotaProps {
  current: number;
  max: number | null;
  label: string;
}

export function MedidorDeCota({ current, max, label }: MedidorDeCotaProps) {
  const themeGold = colors["app-theme-secundary"] || "#CBA35D";

  if (max === null) {
    return (
      <View className="bg-background-secondary border border-emerald-500/30 rounded-xl p-3 my-2 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Ionicons name="infinite-outline" size={20} color="#10B981" />
          <Text className="text-font-primary text-xs font-semibold">{label}</Text>
        </View>
        <Text className="text-emerald-400 font-bold text-xs">Ilimitado</Text>
      </View>
    );
  }

  const percent = Math.min(Math.round((current / max) * 100), 100);
  const isFull = current >= max;

  return (
    <View className="bg-background-secondary border border-white/10 rounded-xl p-3 my-2">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-font-primary text-xs font-semibold">{label}</Text>
        <Text className={`text-xs font-bold ${isFull ? "text-red-400" : "text-font-secondary"}`}>
          {current} de {max} ({percent}%)
        </Text>
      </View>

      <View className="w-full h-2 bg-background-quartenary rounded-full overflow-hidden">
        <View
          className={`h-full rounded-full ${isFull ? "bg-red-500" : "bg-accent-gold"}`}
          style={{ width: `${percent}%`, backgroundColor: isFull ? "#EF4444" : themeGold }}
        />
      </View>
    </View>
  );
}

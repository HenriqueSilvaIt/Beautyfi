import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";

interface UpgradeLockProps {
  featureName?: string;
  title?: string;
  description?: string;
}

export function UpgradeLock({ featureName, title, description }: UpgradeLockProps) {
  const themeGold = colors["app-theme-secundary"] || "#CBA35D";
  const { safePush } = useSafeNavigation();

  const displayTitle = title || "Recurso exclusivo do Plano Pro ou Enterprise";
  const displayDescription =
    description ||
    "Faça um upgrade no seu plano para desbloquear este recurso avançado e otimizar a gestão do seu salão.";

  return (
    <View className="bg-background-secondary border border-accent-gold/40 rounded-2xl p-5 my-3 items-center text-center shadow-lg">
      <View className="w-12 h-12 rounded-full bg-accent-gold/20 items-center justify-center mb-3">
        <Ionicons name="lock-closed" size={24} color={themeGold} />
      </View>

      <Text className="text-font-primary font-bold text-base text-center mb-1">
        {displayTitle}
      </Text>

      <Text className="text-font-secondary text-xs text-center leading-relaxed mb-4 px-2">
        {displayDescription}
      </Text>

      <TouchableOpacity
        onPress={() => safePush("/(private)/(tabs)/(admin-tabs)/(menu)/preferences/subscription")}
        activeOpacity={0.8}
        className="bg-accent-gold px-5 py-3 rounded-xl flex-row items-center gap-2"
        style={{ backgroundColor: themeGold }}
      >
        <Ionicons name="sparkles" size={16} color="#000" />
        <Text className="text-black font-bold text-sm">Fazer Upgrade de Plano</Text>
      </TouchableOpacity>
    </View>
  );
}

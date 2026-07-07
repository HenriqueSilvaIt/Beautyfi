import React, { useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { colors } from "@/styles/colors";

interface TrialBannerProps {
  companyCreatedAt?: string | null;
  /** URL para upgrade de plano (site web) */
  upgradeUrl?: string;
}

const TRIAL_DAYS = 14;

export function TrialBanner({ companyCreatedAt, upgradeUrl }: TrialBannerProps) {
  const daysLeft = useMemo(() => {
    if (!companyCreatedAt) return null;
    const created = new Date(companyCreatedAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const remaining = TRIAL_DAYS - diffDays;
    return remaining > 0 ? remaining : 0;
  }, [companyCreatedAt]);

  // Only show if within trial period
  if (daysLeft === null || daysLeft > TRIAL_DAYS) return null;

  const isExpired = daysLeft === 0;

  const handleUpgrade = () => {
    const url = upgradeUrl || "https://beautyfi.app/planos";
    Linking.openURL(url).catch(() => {});
  };

  return (
    <TouchableOpacity
      onPress={handleUpgrade}
      activeOpacity={0.85}
      className="mx-4 mb-4 rounded-2xl overflow-hidden"
      style={{
        backgroundColor: isExpired ? "#7f1d1d20" : colors["app-theme-primary"] + "18",
        borderWidth: 1,
        borderColor: isExpired ? "#ef4444" : colors["app-theme-primary"],
      }}
    >
      <View className="p-4 flex-row items-center gap-3">
        <View
          className="p-2.5 rounded-xl"
          style={{
            backgroundColor: isExpired
              ? "#ef444420"
              : colors["app-theme-primary"] + "25",
          }}
        >
          <Ionicons
            name={isExpired ? "warning-outline" : "gift-outline"}
            size={22}
            color={isExpired ? "#ef4444" : colors["app-theme-primary"]}
          />
        </View>

        <View className="flex-1">
          {isExpired ? (
            <>
              <Text className="text-red-400 font-bold text-sm">
                Período de teste encerrado
              </Text>
              <Text className="text-gray-600 text-xs mt-0.5">
                Assine um plano para continuar
              </Text>
            </>
          ) : (
            <>
              <Text
                style={{ color: colors["app-theme-primary"] }}
                className="font-bold text-sm"
              >
                Teste grátis — {daysLeft} dia{daysLeft !== 1 ? "s" : ""} restante
                {daysLeft !== 1 ? "s" : ""}
              </Text>
              <Text className="text-gray-600 text-xs mt-0.5">
                Toque para conhecer nossos planos
              </Text>
            </>
          )}
        </View>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={isExpired ? "#ef4444" : colors["app-theme-primary"]}
        />
      </View>
    </TouchableOpacity>
  );
}

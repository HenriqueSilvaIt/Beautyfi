import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useOnboardingChecklistViewModel } from "./useOnboardingChecklist.viewModel";
import { ImportClientsModal } from "../Clients/ImportClientsModal";

export function OnboardingChecklistCard() {
  const themeGold = colors["app-theme-secundary"] || "#CBA35D";

  const {
    steps,
    completedCount,
    totalCount,
    progressPercent,
    isDismissed,
    dismissCard,
    isImportModalOpen,
    setIsImportModalOpen,
    handleStepPress,
    isAllCompleted,
  } = useOnboardingChecklistViewModel();

  if (isDismissed) return null;

  return (
    <View className="bg-background-quartenary rounded-2xl overflow-hidden my-3 shadow-xl">
      {/* Gold top accent line */}
      <View className="h-1 w-full" style={{ backgroundColor: themeGold }} />

      <View className="p-5">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-3 flex-1">
            <View
              className="w-11 h-11 rounded-2xl items-center justify-center"
              style={{ backgroundColor: `${themeGold}25` }}
            >
              <Ionicons name="trophy" size={22} color={themeGold} />
            </View>
            <View className="flex-1">
              <Text className="text-font-primary text-lg font-bold tracking-tight">
                Primeiros Passos
              </Text>
              <Text className="text-font-secondary text-xs mt-0.5">
                {isAllCompleted
                  ? "Tudo configurado! 🎉"
                  : `${completedCount} de ${totalCount} etapas concluídas`}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={dismissCard}
            className="px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: `${themeGold}15` }}
          >
            <Text style={{ color: themeGold }} className="text-xs font-semibold">
              Ocultar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Section */}
        <View className="mb-5">
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-font-secondary text-xs font-medium">Progresso</Text>
            <Text className="text-xs font-bold" style={{ color: themeGold }}>
              {progressPercent}%
            </Text>
          </View>
          <View className="w-full h-3 bg-background-tertiary rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: themeGold,
                shadowColor: themeGold,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.6,
                shadowRadius: 6,
                elevation: 4,
              }}
            />
          </View>
        </View>

        {/* 100% Celebration Banner */}
        {isAllCompleted && (
          <View className="bg-emerald-500/15 border border-emerald-500/30 rounded-2xl p-4 mb-5 items-center flex-row gap-3">
            <View className="w-10 h-10 rounded-full bg-emerald-500/20 items-center justify-center">
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-emerald-400 font-bold text-sm">Parabéns! 🎉</Text>
              <Text className="text-emerald-300/80 text-xs mt-0.5">
                Seu salão está 100% configurado para receber agendamentos.
              </Text>
            </View>
          </View>
        )}

        {/* Steps List */}
        <View className="gap-3">
          {steps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              onPress={() => handleStepPress(step)}
              activeOpacity={0.7}
              className={`p-4 rounded-2xl border flex-row items-center justify-between ${
                step.isCompleted
                  ? "bg-background-tertiary/30 border-emerald-500/20"
                  : "bg-background-tertiary border-accent-gold/15"
              }`}
            >
              <View className="flex-row items-center gap-3 flex-1 pr-3">
                {/* Step number / check */}
                <View
                  className={`w-10 h-10 rounded-xl items-center justify-center ${
                    step.isCompleted ? "bg-emerald-500/15" : ""
                  }`}
                  style={
                    !step.isCompleted
                      ? { backgroundColor: `${themeGold}15` }
                      : undefined
                  }
                >
                  {step.isCompleted ? (
                    <Ionicons name="checkmark-circle" size={22} color="#10B981" />
                  ) : (
                    <Text className="text-xs font-bold" style={{ color: themeGold }}>
                      {index + 1}
                    </Text>
                  )}
                </View>

                <View className="flex-1">
                  <Text
                    className={`text-sm font-semibold ${
                      step.isCompleted
                        ? "text-font-secondary line-through"
                        : "text-font-primary"
                    }`}
                  >
                    {step.title}
                  </Text>
                  <Text
                    className="text-font-secondary text-xs mt-0.5 leading-4"
                    numberOfLines={2}
                  >
                    {step.description}
                  </Text>
                </View>
              </View>

              {!step.isCompleted && (
                <View
                  className="px-3 py-1.5 rounded-lg flex-row items-center gap-1"
                  style={{ backgroundColor: `${themeGold}15` }}
                >
                  <Text className="text-xs font-bold" style={{ color: themeGold }}>
                    Fazer
                  </Text>
                  <Ionicons name="arrow-forward" size={12} color={themeGold} />
                </View>
              )}

              {step.isCompleted && (
                <Ionicons name="checkmark-done" size={18} color="#10B981" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Modal Importar Clientes */}
      <ImportClientsModal
        visible={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />
    </View>
  );
}

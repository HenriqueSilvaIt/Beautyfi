import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOnboardingChecklistViewModel } from "./useOnboardingChecklist.viewModel";
import { ImportClientsModal } from "../Clients/ImportClientsModal";

export function OnboardingChecklistCard() {
  const navyBlue = "#092D5D";

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
    <View className="bg-white rounded-2xl border border-gray-200/80 my-3 shadow-sm overflow-hidden">
      {/* Top accent line */}
      <View className={`h-1.5 w-full ${isAllCompleted ? "bg-emerald-500" : "bg-[#092D5D]"}`} />

      <View className="p-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3.5">
          <View className="flex-row items-center gap-3 flex-1">
            <View
              className={`w-10 h-10 rounded-2xl items-center justify-center border ${
                isAllCompleted
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <Ionicons
                name={isAllCompleted ? "checkmark-circle" : "trophy"}
                size={22}
                color={isAllCompleted ? "#059669" : navyBlue}
              />
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-gray-900 text-base font-black tracking-tight">
                  Primeiros Passos
                </Text>

                {/* Badge para contagem 4/6 (Alta visibilidade sem bege) */}
                <View
                  className={`px-2.5 py-0.5 rounded-full border ${
                    completedCount === totalCount
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-black ${
                      completedCount === totalCount
                        ? "text-emerald-700"
                        : "text-blue-700"
                    }`}
                  >
                    {completedCount}/{totalCount}
                  </Text>
                </View>
              </View>

              <Text className="text-gray-500 text-xs font-semibold mt-0.5">
                {isAllCompleted
                  ? "Tudo configurado! 🎉"
                  : `${completedCount} de ${totalCount} etapas concluídas`}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={dismissCard}
            activeOpacity={0.8}
            className="px-3 py-1.5 bg-gray-100 rounded-xl border border-gray-200"
          >
            <Text className="text-gray-600 text-xs font-bold">Ocultar</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Section */}
        <View className="mb-4">
          <View className="flex-row items-center justify-between mb-1.5">
            <Text className="text-gray-500 text-xs font-bold">Progresso de Configuração</Text>
            <Text
              className={`text-xs font-black ${
                isAllCompleted ? "text-emerald-600" : "text-[#092D5D]"
              }`}
            >
              {progressPercent}%
            </Text>
          </View>

          <View className="w-full h-2.5 bg-gray-100 rounded-full border border-gray-200 overflow-hidden">
            <View
              className={`h-full rounded-full ${isAllCompleted ? "bg-emerald-500" : "bg-[#092D5D]"}`}
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>

        {/* 100% Celebration Banner */}
        {isAllCompleted && (
          <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 mb-4 items-center flex-row gap-3">
            <Ionicons name="checkmark-circle" size={24} color="#059669" />
            <View className="flex-1">
              <Text className="text-emerald-800 font-extrabold text-xs">Parabéns! 🎉</Text>
              <Text className="text-emerald-700 text-xs font-medium mt-0.5">
                Seu estabelecimento está 100% pronto para agendamentos.
              </Text>
            </View>
          </View>
        )}

        {/* Steps List */}
        <View className="gap-2.5">
          {steps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              onPress={() => handleStepPress(step)}
              activeOpacity={0.75}
              className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                step.isCompleted
                  ? "bg-emerald-50/40 border-emerald-200/60"
                  : "bg-slate-50 border-gray-200/80"
              }`}
            >
              <View className="flex-row items-center gap-3 flex-1 pr-2">
                {/* Step number / check badge */}
                <View
                  className={`w-9 h-9 rounded-xl items-center justify-center ${
                    step.isCompleted ? "bg-emerald-100" : "bg-[#092D5D]/10 border border-[#092D5D]/20"
                  }`}
                >
                  {step.isCompleted ? (
                    <Ionicons name="checkmark-circle" size={20} color="#059669" />
                  ) : (
                    <Text className="text-xs font-black text-[#092D5D]">
                      {index + 1}
                    </Text>
                  )}
                </View>

                <View className="flex-1">
                  <Text
                    className={`text-xs font-bold ${
                      step.isCompleted
                        ? "text-gray-400 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {step.title}
                  </Text>
                  <Text
                    className="text-gray-500 text-[11px] font-medium mt-0.5 leading-4"
                    numberOfLines={2}
                  >
                    {step.description}
                  </Text>
                </View>
              </View>

              {!step.isCompleted && (
                <View className="px-3 py-1.5 bg-[#092D5D] rounded-xl flex-row items-center gap-1 shadow-xs">
                  <Text className="text-white text-xs font-extrabold uppercase">
                    Fazer
                  </Text>
                  <Ionicons name="arrow-forward" size={12} color="#FFF" />
                </View>
              )}

              {step.isCompleted && (
                <Ionicons name="checkmark-done" size={18} color="#059669" />
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

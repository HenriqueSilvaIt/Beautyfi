import React, { useState, useEffect } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";
import { useQueryClient } from "@tanstack/react-query";
import { useLoyaltyMutation } from "@/shared/queries/company/use-loyalty.mutation";

interface ClientLoyaltyModalProps {
  clientId: number;
  clientName: string;
  companyId: number;
  currentStamps?: number;
  stampRequiredCount?: number;
  stampServiceName?: string;
  stampRewardDescription?: string;
  readOnly?: boolean;
  onClose: () => void;
}

export function ClientLoyaltyModal({
  clientId,
  clientName,
  companyId,
  currentStamps: initialStamps = 0,
  stampRequiredCount: initialRequiredCount,
  stampServiceName: initialServiceName,
  stampRewardDescription: initialRewardDesc,
  readOnly = false,
  onClose,
}: ClientLoyaltyModalProps) {
  const [stamps, setStamps] = useState(initialStamps);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const { useGetActiveProgramQuery, useGetClientPointsQuery } = useLoyaltyMutation();
  const { data: programData } = useGetActiveProgramQuery(companyId);
  const { data: pointsData } = useGetClientPointsQuery(clientId, companyId);

  useEffect(() => {
    if (pointsData && pointsData.stampsBalance !== undefined) {
      setStamps(pointsData.stampsBalance);
    } else if (initialStamps !== undefined) {
      setStamps(initialStamps);
    }
  }, [pointsData, initialStamps]);

  const stampRequiredCount = programData?.stampRequiredCount ?? initialRequiredCount ?? 4;
  const stampServiceName = programData?.stampServiceName ?? initialServiceName ?? "Serviço Especial";
  const stampRewardDescription = programData?.stampRewardDescription ?? initialRewardDesc ?? `Complete ${stampRequiredCount} serviços e ganhe o próximo grátis!`;

  const handleUpdateStamps = async (delta: number, mode: "ADD" | "RESET" | "SET" = "ADD") => {
    if (readOnly) return;

    try {
      setIsLoading(true);
      const { data } = await styleAppApiClient.post(
        `/clients/${clientId}/loyalty-stamps?companyId=${companyId}&delta=${delta}&mode=${mode}`
      );
      if (data && data.stampsBalance !== undefined) {
        setStamps(data.stampsBalance);
      } else if (mode === "RESET") {
        setStamps(0);
      } else {
        setStamps((prev) => Math.max(0, prev + delta));
      }

      queryClient.invalidateQueries({ queryKey: ["client-loyalty-points"] });
      queryClient.invalidateQueries({ queryKey: ["client"] });
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    } catch (err) {
      console.error("Erro ao atualizar carimbos do cliente:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isComplete = stamps >= stampRequiredCount;

  return (
    <View className="p-5 bg-white rounded-3xl gap-4">
      {/* Header */}
      <View className="flex-row items-center justify-between border-b border-gray-100 pb-3">
        <View className="flex-row items-center gap-2.5 flex-1 pr-2">
          <View className="w-10 h-10 rounded-2xl bg-[#CBA35D]/15 border border-[#CBA35D]/40 items-center justify-center">
            <Ionicons name="ribbon" size={22} color="#092D5D" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 text-base font-extrabold" numberOfLines={1}>
              Cartão Fidelidade
            </Text>
            <Text className="text-gray-500 text-xs font-semibold" numberOfLines={1}>
              {clientName}
            </Text>
          </View>
        </View>

        <TouchableOpacity onPress={onClose} className="p-1.5 rounded-full bg-gray-100">
          <Ionicons name="close" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Nome do Serviço e Meta */}
      <View className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 flex-row items-center justify-between">
        <Text className="text-gray-700 text-xs font-bold flex-1 pr-2">
          🎯 {stampServiceName}
        </Text>
        <View className="px-2.5 py-1 rounded-full bg-[#092D5D]/10">
          <Text className="text-[#092D5D] text-xs font-black">
            {stamps}/{stampRequiredCount} carimbos
          </Text>
        </View>
      </View>

      {/* Visualização dos Carimbos */}
      <View className="flex-row items-center justify-around py-4 bg-slate-50 rounded-2xl border border-slate-200/80 my-1 px-2">
        {Array.from({ length: stampRequiredCount }).map((_, index) => {
          const isEarned = index < stamps;
          return (
            <TouchableOpacity
              key={index}
              disabled={readOnly}
              activeOpacity={readOnly ? 1 : 0.8}
              onPress={() => {
                if (readOnly) return;
                if (isEarned && index === stamps - 1) {
                  handleUpdateStamps(-1, "ADD");
                } else if (!isEarned && index === stamps) {
                  handleUpdateStamps(1, "ADD");
                }
              }}
              className="items-center gap-1.5"
            >
              <View
                className={`w-11 h-11 rounded-full items-center justify-center shadow-xs border ${
                  isEarned
                    ? "bg-emerald-50 border-emerald-400"
                    : "bg-white border-slate-300"
                }`}
              >
                <Ionicons
                  name={isEarned ? "checkmark-circle" : "ellipse-outline"}
                  size={24}
                  color={isEarned ? "#059669" : "#9CA3AF"}
                />
              </View>
              <Text
                className={`text-[11px] font-bold ${
                  isEarned ? "text-emerald-700 font-black" : "text-slate-400"
                }`}
              >
                {index + 1}º
              </Text>
            </TouchableOpacity>
          );
        })}

        <View className="items-center gap-1.5">
          <View className={`w-12 h-12 rounded-full items-center justify-center shadow-md border-2 ${
            isComplete ? "bg-emerald-600 border-amber-300" : "bg-[#092D5D] border-[#CBA35D]"
          }`}>
            <Ionicons name="gift" size={22} color={isComplete ? "#FFFFFF" : "#CBA35D"} />
          </View>
          <Text className={`text-[11px] font-black ${isComplete ? "text-emerald-600 uppercase" : "text-[#092D5D]"}`}>
            {isComplete ? "COMPLETO!" : "GRÁTIS!"}
          </Text>
        </View>
      </View>

      {/* Descrição da Recompensa */}
      <View className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60 flex-row items-center gap-2">
        <Ionicons name="sparkles" size={16} color="#B45309" />
        <Text className="text-amber-900 text-xs font-semibold flex-1">
          {stampRewardDescription}
        </Text>
      </View>

      {/* Modo Somente Leitura (Cliente) */}
      {readOnly ? (
        <View className="p-3.5 bg-[#092D5D]/5 rounded-2xl border border-[#092D5D]/20">
          <Text className="text-gray-700 text-xs text-center leading-4 font-medium">
            {isComplete
              ? "🎉 Parabéns! Você completou todos os carimbos. Apresente este cartão no seu próximo agendamento no salão para resgatar sua recompensa grátis!"
              : `Faltam apenas ${Math.max(0, stampRequiredCount - stamps)} carimbo(s) para você ganhar sua recompensa grátis!`
            }
          </Text>
        </View>
      ) : (
        /* Botões de Ação para o Profissional / Admin */
        <View className="gap-2 mt-1">
          <View className="flex-row gap-2">
            <TouchableOpacity
              disabled={isLoading}
              onPress={() => handleUpdateStamps(1, "ADD")}
              activeOpacity={0.85}
              className="flex-1 h-12 bg-[#092D5D] rounded-2xl items-center justify-center flex-row gap-2 shadow-sm"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
                  <Text className="text-white font-extrabold text-xs uppercase">
                    +1 Carimbo
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              disabled={isLoading || stamps <= 0}
              onPress={() => handleUpdateStamps(-1, "ADD")}
              activeOpacity={0.85}
              className={`flex-1 h-12 rounded-2xl items-center justify-center flex-row gap-2 border ${
                stamps > 0
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-100 border-gray-200 opacity-50"
              }`}
            >
              <Ionicons name="remove-circle-outline" size={20} color={stamps > 0 ? "#DC2626" : "#9CA3AF"} />
              <Text className={`font-extrabold text-xs uppercase ${stamps > 0 ? "text-red-600" : "text-gray-400"}`}>
                -1 Carimbo
              </Text>
            </TouchableOpacity>
          </View>

          {isComplete && (
            <TouchableOpacity
              disabled={isLoading}
              onPress={() => handleUpdateStamps(0, "RESET")}
              activeOpacity={0.85}
              className="h-12 bg-emerald-600 rounded-2xl items-center justify-center flex-row gap-2 shadow-sm mt-1"
            >
              <Ionicons name="checkmark-done-circle" size={20} color="#FFFFFF" />
              <Text className="text-white font-black text-xs uppercase tracking-wider">
                Resgatar Prêmio & Zerar Cartela
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

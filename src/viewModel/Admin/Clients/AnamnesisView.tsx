import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppInput } from "@/shared/components/AppInput";
import { useAnamnesisViewModel } from "./useAnamnesisViewModel";

interface AnamnesisViewProps {
  clientId: number;
}

export function AnamnesisView({ clientId }: AnamnesisViewProps) {
  const {
    client,
    isLoading,
    allergies,
    setAllergies,
    skinHairType,
    setSkinHairType,
    preExistingConditions,
    setPreExistingConditions,
    medications,
    setMedications,
    observations,
    setObservations,
    handleSaveAnamnesis,
  } = useAnamnesisViewModel(clientId);

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100 shadow-sm">
        <AppAdminHeader
          title="Ficha de Anamnese"
          iconRight={{ icon: false, path: "" }}
        />
        <TouchableOpacity
          onPress={handleSaveAnamnesis}
          disabled={isLoading}
          activeOpacity={0.85}
          className="px-5 py-2.5 rounded-xl flex-row items-center gap-1.5 shadow-sm"
          style={{ backgroundColor: "#092D5D" }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={16} color="#CBA35D" />
              <Text className="text-white text-xs font-extrabold uppercase tracking-wide">
                Salvar
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Banner com dados do cliente */}
        <View className="bg-white p-4 rounded-2xl border border-gray-100 mb-5 shadow-sm flex-row items-center gap-3">
          <View className="w-12 h-12 rounded-full bg-[#092D5D]/10 justify-center items-center border border-[#092D5D]/20">
            <Ionicons name="person" size={24} color="#092D5D" />
          </View>
          <View className="flex-1">
            <Text className="text-xs text-gray-400 font-bold uppercase tracking-wider">
              Cliente
            </Text>
            <Text className="text-gray-900 font-black text-base">
              {client?.name || "Carregando cliente..."}
            </Text>
            {client?.phone ? (
              <Text className="text-gray-500 text-xs font-medium mt-0.5">
                📞 {client.phone}
              </Text>
            ) : null}
          </View>
        </View>

        {/* Card 1: Alergias e Restrições */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm gap-3">
          <View className="flex-row items-center gap-2 pb-2 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-amber-50 justify-center items-center border border-amber-200">
              <Ionicons name="warning-outline" size={18} color="#d97706" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Alergias & Restrições
            </Text>
          </View>
          <AppInput
            label="Descreva qualquer alergia conhecida"
            placeholder="Ex: Alergia a amônia, látex, eugenol, esmaltes sintéticos..."
            value={allergies}
            onChangeText={setAllergies}
            multiline
            numberOfLines={3}
            formCrud
          />
        </View>

        {/* Card 2: Tipo de Pele / Cabelo */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm gap-3">
          <View className="flex-row items-center gap-2 pb-2 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-purple-50 justify-center items-center border border-purple-200">
              <Ionicons name="sparkles-outline" size={18} color="#7c3aed" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Tipo de Pele & Cabelo
            </Text>
          </View>
          <AppInput
            label="Características de pele e cabelo"
            placeholder="Ex: Pele sensível/acneica, cabelo fino, descolorido, com química prévia..."
            value={skinHairType}
            onChangeText={setSkinHairType}
            multiline
            numberOfLines={3}
            formCrud
          />
        </View>

        {/* Card 3: Condições Pré-existentes */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm gap-3">
          <View className="flex-row items-center gap-2 pb-2 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-rose-50 justify-center items-center border border-rose-200">
              <Ionicons name="fitness-outline" size={18} color="#e11d48" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Condições Pré-existentes
            </Text>
          </View>
          <AppInput
            label="Condições de saúde relevantes"
            placeholder="Ex: Gestante, lactante, dermatite, sensibilidade ao calor, marcapasso..."
            value={preExistingConditions}
            onChangeText={setPreExistingConditions}
            multiline
            numberOfLines={3}
            formCrud
          />
        </View>

        {/* Card 4: Medicamentos em Uso */}
        <View className="bg-white rounded-2xl p-5 mb-4 border border-gray-100 shadow-sm gap-3">
          <View className="flex-row items-center gap-2 pb-2 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-blue-50 justify-center items-center border border-blue-200">
              <Ionicons name="medkit-outline" size={18} color="#2563eb" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Medicamentos em Uso
            </Text>
          </View>
          <AppInput
            label="Medicamentos continuados"
            placeholder="Ex: Roacutan, anticoagulantes, fotossensibilizantes..."
            value={medications}
            onChangeText={setMedications}
            multiline
            numberOfLines={2}
            formCrud
          />
        </View>

        {/* Card 5: Observações e Histórico */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-gray-100 shadow-sm gap-3">
          <View className="flex-row items-center gap-2 pb-2 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-emerald-50 justify-center items-center border border-emerald-200">
              <Ionicons name="document-text-outline" size={18} color="#059669" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Observações & Histórico
            </Text>
          </View>
          <AppInput
            label="Notas e histórico de atendimento"
            placeholder="Preferências do cliente, testes de mechas anteriores, histórico de procedimentos..."
            value={observations}
            onChangeText={setObservations}
            multiline
            numberOfLines={4}
            formCrud
          />
        </View>

        {/* Botão Salvar Principal */}
        <TouchableOpacity
          onPress={handleSaveAnamnesis}
          disabled={isLoading}
          activeOpacity={0.85}
          className="w-full py-4 rounded-2xl flex-row justify-center items-center gap-2 shadow-md"
          style={{ backgroundColor: "#092D5D" }}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color="#CBA35D" />
              <Text className="text-white text-sm font-extrabold uppercase tracking-wider">
                Salvar Ficha de Anamnese
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

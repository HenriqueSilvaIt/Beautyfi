import React from "react";
import { ScrollView, ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAddressViewModel } from "./useAddressViewModel";
import { colors } from "@/styles/colors";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppInput } from "@/shared/components/AppInput";

export function AddressView(props: ReturnType<typeof useAddressViewModel>) {
  const {
    addressText,
    cep,
    street,
    number,
    neighborhood,
    city,
    state,
    complement,
    loading,
    saving,
    handleCepChange,
    handleSave,
    handleClear,
    setStreet,
    setNumber,
    setNeighborhood,
    setCity,
    setState,
    setComplement,
  } = props;

  const themeColor = colors["app-theme-primary"];

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-5 pt-2">
      <AppAdminHeader title="Meu Endereço" iconRight={{ icon: false, path: "" }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Current Address Card */}
        {addressText ? (
          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 mt-2">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Endereço Atual
            </Text>
            <View className="flex-row items-start gap-2 mb-2">
              <Ionicons name="location" size={16} color={themeColor} style={{ marginTop: 2 }} />
              <Text className="text-slate-700 text-xs leading-relaxed flex-1">
                {addressText}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClear}
              activeOpacity={0.7}
              className="self-start flex-row items-center gap-1 mt-1"
            >
              <Ionicons name="trash-outline" size={14} color="#ef4444" />
              <Text className="text-red-500 text-xs font-bold">Remover endereço</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Form Fields */}
        <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 mt-1">
          Dados de Endereço
        </Text>

        <View className="gap-3">
          {/* CEP */}
          <View className="relative">
            <AppInput
              label="CEP *"
              placeholder="00000-000"
              keyboardType="numeric"
              maxLength={9}
              value={cep}
              onChangeText={handleCepChange}
            />
            {loading && (
              <ActivityIndicator
                size="small"
                color={themeColor}
                style={{ position: "absolute", right: 15, top: 40 }}
              />
            )}
          </View>

          {/* Rua */}
          <AppInput
            label="Logradouro / Rua *"
            placeholder="Digite o nome da rua"
            value={street}
            onChangeText={setStreet}
          />

          {/* Número & Complemento */}
          <View className="flex-row gap-3">
            <View className="flex-[2]">
              <AppInput
                label="Número *"
                placeholder="Ex: 123"
                value={number}
                onChangeText={setNumber}
              />
            </View>
            <View className="flex-[3]">
              <AppInput
                label="Complemento"
                placeholder="Apto, Bloco, etc."
                value={complement}
                onChangeText={setComplement}
              />
            </View>
          </View>

          {/* Bairro */}
          <AppInput
            label="Bairro *"
            placeholder="Digite o bairro"
            value={neighborhood}
            onChangeText={setNeighborhood}
          />

          {/* Cidade & Estado */}
          <View className="flex-row gap-3">
            <View className="flex-[3]">
              <AppInput
                label="Cidade *"
                placeholder="Ex: São Paulo"
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View className="flex-[1]">
              <AppInput
                label="UF *"
                placeholder="SP"
                maxLength={2}
                autoCapitalize="characters"
                value={state}
                onChangeText={setState}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
          className="bg-[#092D5D] py-3.5 rounded-xl items-center mt-6 shadow-sm"
        >
          <Text className="text-white text-sm font-bold">
            {saving ? "Salvando..." : "Salvar Endereço"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

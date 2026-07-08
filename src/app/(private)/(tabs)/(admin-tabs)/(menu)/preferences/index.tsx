import React from "react";
import { Text, TouchableOpacity, View, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSettingsStore } from "@/shared/store/settings-store";

export default function PreferencesMenuScreen() {
  const { allowInAppNewAppointmentModal, setAllowInAppNewAppointmentModal } = useSettingsStore();

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-5 py-4">
      {/* Header */}
      <View className="flex-row items-center mb-8">
        <TouchableOpacity
          onPress={() => router.replace("/(private)/(tabs)/(menu)")}
          activeOpacity={0.7}
          className="bg-white/10 p-2.5 rounded-full mr-4"
        >
          <Ionicons name="arrow-back" size={22} color="#ffffff" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Preferências</Text>
      </View>
 
      {/* Menu Options */}
      <View className="gap-4">
        {/* WhatsApp Button */}
        <TouchableOpacity
          onPress={() => router.push("/(private)/(tabs)/(admin-tabs)/(menu)/preferences/whatsapp-config")}
          activeOpacity={0.8}
          className="bg-white/5 border border-gray-700/60 p-4 rounded-2xl flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1">
            <View className="bg-green-500/10 p-3 rounded-xl mr-4">
              <Ionicons name="logo-whatsapp" size={24} color="#22c55e" />
            </View>
            <View className="flex-1 pr-2">
              <Text className="text-white text-base font-bold">WhatsApp e Notificações</Text>
              <Text className="text-gray-600 text-xs mt-1">Configure o disparo de lembretes e confirmações</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
 
        {/* Company Data Button */}
        <TouchableOpacity
          onPress={() => router.push("/(private)/(tabs)/(admin-tabs)/(menu)/preferences/company-edit")}
          activeOpacity={0.8}
          className="bg-white/5 border border-gray-700/60 p-4 rounded-2xl flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1">
            <View className="bg-[#CBA35D]/10 p-3 rounded-xl mr-4">
              <Ionicons name="business" size={24} color="#CBA35D" />
            </View>
            <View className="flex-1 pr-2">
              <Text className="text-white text-base font-bold">Dados do Estabelecimento</Text>
              <Text className="text-gray-600 text-xs mt-1">Nome, CNPJ, Horários, Redes Sociais e Carousel</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

        {/* Switch Toggle for in-app modals */}
        <View className="bg-white/5 border border-gray-700/60 p-4 rounded-2xl flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 pr-4">
            <View className="bg-blue-500/10 p-3 rounded-xl mr-4">
              <Ionicons name="notifications" size={24} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-base font-bold">Alertas de Agendamento</Text>
              <Text className="text-gray-600 text-xs mt-1">Exibir balão flutuante para novos agendamentos com app aberto</Text>
            </View>
          </View>
          <Switch
            value={allowInAppNewAppointmentModal}
            onValueChange={setAllowInAppNewAppointmentModal}
            trackColor={{ false: "#374151", true: "#CBA35D" }}
            thumbColor={allowInAppNewAppointmentModal ? "#ffffff" : "#9ca3af"}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

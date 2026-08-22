import React, { useEffect } from "react";
import { Text, TouchableOpacity, View, Switch, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { usePreferencesStore } from "@/shared/store/preferences-store";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";

export default function PreferencesMenuScreen() {
  const {
    showInAppNewAppointmentModal,
    setShowInAppNewAppointmentModal,
    showAllEmployeeDashboardsToEmployees,
    setShowAllEmployeeDashboardsToEmployees,
  } = usePreferencesStore();

  const { useGetCompanyPreferencesQuery, updateCompanyPreferencesMutation } = useCompanyDetailsMutation();
  const companyPreferencesQuery = useGetCompanyPreferencesQuery?.();
  const { data: preferencesData, isLoading } = companyPreferencesQuery ?? { data: undefined, isLoading: false };

  useEffect(() => {
    if (preferencesData) {
      setShowInAppNewAppointmentModal(preferencesData.showInAppNewAppointmentModal !== false);
      setShowAllEmployeeDashboardsToEmployees(preferencesData.showAllEmployeeDashboardsToEmployees === true);
    }
  }, [preferencesData, setShowInAppNewAppointmentModal, setShowAllEmployeeDashboardsToEmployees]);

  const handleToggle = async (value: boolean) => {
    setShowInAppNewAppointmentModal(value); // optimistic update
    try {
      if (!updateCompanyPreferencesMutation?.mutateAsync) {
        return;
      }
      await updateCompanyPreferencesMutation.mutateAsync({ showInAppNewAppointmentModal: value });
    } catch (err) {
      setShowInAppNewAppointmentModal(!value); // revert on error
    }
  };

  const handleToggleShowAll = async (value: boolean) => {
    setShowAllEmployeeDashboardsToEmployees(value); // optimistic update
    try {
      if (!updateCompanyPreferencesMutation?.mutateAsync) {
        return;
      }
      await updateCompanyPreferencesMutation.mutateAsync({ showAllEmployeeDashboardsToEmployees: value });
    } catch (err) {
      setShowAllEmployeeDashboardsToEmployees(!value); // revert on error
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-5 py-4">
      {/* Header */}
      <AppAdminHeader
        title="Preferências"
        leftIconShown={false}
        iconRight={{
          icon: false,
          path: "",
        }}
      />
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
              <Text className="text-font-primary text-base font-bold">WhatsApp e Notificações</Text>
              <Text className="text-gray-600 text-xs mt-1">Configure o disparo de lembretes e confirmações</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>
 

        {/* Marketing Automático Button */}
        <TouchableOpacity
          onPress={() => router.push("/(private)/(tabs)/(admin-tabs)/(menu)/preferences/marketing")}
          activeOpacity={0.8}
          className="bg-white/5 border border-gray-700/60 p-4 rounded-2xl flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1">
            <View className="bg-pink-500/10 p-3 rounded-xl mr-4">
              <Ionicons name="megaphone-outline" size={24} color="#ec4899" />
            </View>
            <View className="flex-1 pr-2">
              <Text className="text-font-primary text-base font-bold">Marketing Automático</Text>
              <Text className="text-gray-600 text-xs mt-1">Mensagens de aniversário e reativação de clientes</Text>
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
              <Text className="text-font-primary text-base font-bold">Alertas de Agendamento</Text>
              <Text className="text-gray-600 text-xs mt-1">Exibir balão flutuante para novos agendamentos com app aberto</Text>
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator color="#CBA35D" size="small" />
          ) : (
            <Switch
              value={showInAppNewAppointmentModal}
              onValueChange={handleToggle}
              trackColor={{ false: "#374151", true: "#CBA35D" }}
              thumbColor={showInAppNewAppointmentModal ? "#000" : "#9ca3af"}
            />
          )}
        </View>

        {/* Switch Toggle for dashboard view */}
        <View className="bg-white/5 border border-gray-700/60 p-4 rounded-2xl flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 pr-4">
            <View className="bg-indigo-500/10 p-3 rounded-xl mr-4">
              <Ionicons name="bar-chart-sharp" size={24} color="#6366f1" />
            </View>
            <View className="flex-1">
              <Text className="text-font-primary text-base font-bold">Dashboards de Outros Profissionais</Text>
              <Text className="text-gray-600 text-xs mt-1">Habilitar visualização do dashboards de todos profissionais aos funcionários?</Text>
            </View>
          </View>
          {isLoading ? (
            <ActivityIndicator color="#CBA35D" size="small" />
          ) : (
            <Switch
              value={showAllEmployeeDashboardsToEmployees}
              onValueChange={handleToggleShowAll}
              trackColor={{ false: "#374151", true: "#CBA35D" }}
              thumbColor={showAllEmployeeDashboardsToEmployees ? "#000" : "#9ca3af"}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

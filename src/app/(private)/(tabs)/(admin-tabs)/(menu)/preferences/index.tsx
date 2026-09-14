import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View, Switch, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { usePreferencesStore } from "@/shared/store/preferences-store";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { useUserStore } from "@/shared/store/user-store";
import { useUserUserUpdatePreferences } from "@/shared/queries/user/use-user-logged.mutation";

export default function PreferencesMenuScreen() {
  const {
    showInAppNewAppointmentModal,
    setShowInAppNewAppointmentModal,
    showAllEmployeeDashboardsToEmployees,
    setShowAllEmployeeDashboardsToEmployees,
  } = usePreferencesStore();

  const { user, setUser } = useUserStore();
  const { userUpdatePreferencesMutation } = useUserUserUpdatePreferences();
  const [isUpdatingUserPref, setIsUpdatingUserPref] = useState(false);

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

  const allowPushReminder = user?.allowPushReminderNotifications !== false;

  const handleTogglePushReminder = async (value: boolean) => {
    // Optimistic local update
    setUser((prev) => (prev ? { ...prev, allowPushReminderNotifications: value } : null));
    setIsUpdatingUserPref(true);
    try {
      await userUpdatePreferencesMutation.mutateAsync({
        allowPushReminderNotifications: value,
      });
    } catch (err) {
      // Revert on error
      setUser((prev) => (prev ? { ...prev, allowPushReminderNotifications: !value } : null));
    } finally {
      setIsUpdatingUserPref(false);
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
        {/* Minha Assinatura Button */}
        <TouchableOpacity
          onPress={() => router.push("/(private)/(tabs)/(admin-tabs)/(menu)/subscription")}
          activeOpacity={0.8}
          className="bg-white/5 border border-gray-700/60 p-4 rounded-2xl flex-row items-center justify-between"
        >
          <View className="flex-row items-center flex-1">
            <View className="bg-amber-500/10 p-3 rounded-xl mr-4">
              <Ionicons name="card-outline" size={24} color="#CBA35D" />
            </View>
            <View className="flex-1 pr-2">
              <Text className="text-font-primary text-base font-bold">Minha Assinatura</Text>
              <Text className="text-gray-600 text-xs mt-1">Gerencie seu plano, status, cancelamento e reativação</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
        </TouchableOpacity>

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

        {/* Switch Toggle for Admin OneSignal Reminder Push */}
        <View className="bg-white/5 border border-gray-700/60 p-4 rounded-2xl flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 pr-4">
            <View className="bg-amber-500/10 p-3 rounded-xl mr-4">
              <Ionicons name="alarm-outline" size={24} color="#f59e0b" />
            </View>
            <View className="flex-1">
              <Text className="text-font-primary text-base font-bold">Lembretes de Agendamento (Push)</Text>
              <Text className="text-gray-600 text-xs mt-1">
                Receber notificações push no celular como lembrete dos próximos agendamentos
              </Text>
            </View>
          </View>
          {isUpdatingUserPref ? (
            <ActivityIndicator color="#CBA35D" size="small" />
          ) : (
            <Switch
              value={allowPushReminder}
              onValueChange={handleTogglePushReminder}
              trackColor={{ false: "#374151", true: "#CBA35D" }}
              thumbColor={allowPushReminder ? "#000" : "#9ca3af"}
            />
          )}
        </View>

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

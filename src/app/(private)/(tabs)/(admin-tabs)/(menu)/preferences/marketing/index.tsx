import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Switch,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { colors } from "@/styles/colors";

export default function MarketingScreen() {
  const { useGetCompanyPreferencesQuery, updateCompanyPreferencesMutation } =
    useCompanyDetailsMutation();

  const { data: preferencesData, isLoading } = useGetCompanyPreferencesQuery?.() ?? {
    data: undefined,
    isLoading: false,
  };

  const [sendBirthday, setSendBirthday] = useState(false);
  const [sendReactivation, setSendReactivation] = useState(false);
  const [days, setDays] = useState("30");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preferencesData) {
      setSendBirthday(preferencesData.sendBirthdayMessage === true);
      setSendReactivation(preferencesData.sendReactivationMessage === true);
      setDays(String(preferencesData.reactivationDays ?? 30));
    }
  }, [preferencesData]);

  const handleUpdatePreference = async (updates: {
    sendBirthdayMessage?: boolean;
    sendReactivationMessage?: boolean;
    reactivationDays?: number;
  }) => {
    try {
      setSaving(true);
      await updateCompanyPreferencesMutation.mutateAsync(updates);
    } catch (err) {
      console.error("Failed to update preferences:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleBirthdayToggle = (val: boolean) => {
    setSendBirthday(val);
    handleUpdatePreference({ sendBirthdayMessage: val });
  };

  const handleReactivationToggle = (val: boolean) => {
    setSendReactivation(val);
    handleUpdatePreference({ sendReactivationMessage: val });
  };

  const handleDaysChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    setDays(cleaned);
  };

  const handleDaysSubmit = () => {
    const val = parseInt(days, 10);
    if (!isNaN(val) && val > 0) {
      handleUpdatePreference({ reactivationDays: val });
    } else {
      setDays("30");
      handleUpdatePreference({ reactivationDays: 30 });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-5 py-4">
          <AppAdminHeader title="Marketing" iconRight={{ icon: false, path: "" }} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-4">
          <View className="gap-6 pb-8">
            <Text className="text-gray-600 text-sm leading-relaxed">
              Ative o disparo de mensagens automáticas via WhatsApp para fidelizar seus clientes e aumentar sua taxa de retorno.
            </Text>

            {/* Birthday Wishes Card */}
            <View className="bg-white/5 border border-gray-700/60 p-5 rounded-3xl gap-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 pr-4">
                  <View className="bg-pink-500/10 p-3 rounded-2xl mr-4">
                    <Ionicons name="gift-outline" size={24} color="#ec4899" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-font-primary text-base font-bold">
                      Mensagem de Aniversário
                    </Text>
                    <Text className="text-gray-600 text-xs mt-1">
                      Envio automático no dia do aniversário
                    </Text>
                  </View>
                </View>
                {isLoading ? (
                  <ActivityIndicator color="#CBA35D" size="small" />
                ) : (
                  <Switch
                    value={sendBirthday}
                    onValueChange={handleBirthdayToggle}
                    trackColor={{ false: "#374151", true: "#CBA35D" }}
                    thumbColor={sendBirthday ? "#000" : "#9ca3af"}
                  />
                )}
              </View>

              <Text className="text-gray-600 text-xs leading-relaxed">
                Parabenize seus clientes no dia especial deles de forma automática. Fortalece o relacionamento e mantém seu estabelecimento lembrado.
              </Text>
            </View>

            {/* Reactivation Card */}
            <View className="bg-white/5 border border-gray-700/60 p-5 rounded-3xl gap-5">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1 pr-4">
                  <View className="bg-purple-500/10 p-3 rounded-2xl mr-4">
                    <Ionicons name="sparkles-outline" size={24} color="#a855f7" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-font-primary text-base font-bold">
                      Reativação de Clientes
                    </Text>
                    <Text className="text-gray-600 text-xs mt-1">
                      Resgate clientes dormentes
                    </Text>
                  </View>
                </View>
                {isLoading ? (
                  <ActivityIndicator color="#CBA35D" size="small" />
                ) : (
                  <Switch
                    value={sendReactivation}
                    onValueChange={handleReactivationToggle}
                    trackColor={{ false: "#374151", true: "#CBA35D" }}
                    thumbColor={sendReactivation ? "#000" : "#9ca3af"}
                  />
                )}
              </View>

              <Text className="text-gray-600 text-xs leading-relaxed">
                Envie um lembrete amigável aos clientes que não agendam um serviço há algum tempo, incentivando o retorno.
              </Text>

              {sendReactivation && (
                <View className="border-t border-gray-700/40 pt-4 gap-3">
                  <Text className="text-font-primary text-sm font-bold">
                    Tempo sem agendamento (dias)
                  </Text>
                  <View className="flex-row items-center gap-3">
                    <TextInput
                      value={days}
                      onChangeText={handleDaysChange}
                      onBlur={handleDaysSubmit}
                      keyboardType="numeric"
                      placeholder="30"
                      placeholderTextColor="#6b7280"
                      className="bg-white/5 border border-gray-700/60 rounded-xl px-4 py-3 text-font-primary font-bold text-sm w-24 text-center"
                    />
                    <Text className="text-gray-600 text-xs flex-1">
                      Dias após o último agendamento finalizado para disparar a mensagem.
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {saving && (
              <View className="flex-row items-center justify-center gap-2 mt-2">
                <ActivityIndicator size="small" color="#CBA35D" />
                <Text className="text-gray-600 text-xs">Salvando alterações...</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

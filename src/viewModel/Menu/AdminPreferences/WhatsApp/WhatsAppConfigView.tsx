import { useWhatsAppViewModel } from "./useWhatsAppViewModel";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { SafeAreaView } from "react-native-safe-area-context";

export function WhatsAppConfigView({
  status,
  qrBase64,
  isLoading,
  isInitialLoading,
  isPolling,
  handleConnect,
  handleDisconnect,
  reminderEnabled,
  minutesBefore,
  isSavingReminder,
  handleToggleReminder,
  handleChangeMinutesBefore,
  bookingConfirmationEnabled,
  companyType,
  isSavingConfirmation,
  handleToggleConfirmation,
  remindersCount,
  remindersLimit,
  handleBuyMessages,
}: ReturnType<typeof useWhatsAppViewModel>) {
  if (isInitialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator color="#092D5D" size="large" />
        <Text className="text-gray-500 mt-3 text-sm font-semibold">
          Carregando configurações...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        <AppAdminHeader
          title="WhatsApp e Notificações"
          leftIconShown={false}
          iconRight={{ icon: false, path: "" }}
        />

        {/* ─── Uso do Plano & Lembretes WhatsApp ────────────────── */}
        <View className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm mb-5">
          <View className="flex-row justify-between items-center mb-2">
            <View className="flex-row items-center gap-2">
              <Ionicons name="logo-whatsapp" size={20} color="#22c55e" />
              <Text className="text-gray-900 font-extrabold text-base">
                Uso do Plano & Disparos
              </Text>
            </View>
            {remindersCount >= remindersLimit && (
              <View className="bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                <Text className="text-red-600 text-[10px] font-black uppercase">Limite Atingido</Text>
              </View>
            )}
          </View>

          <View className="flex-row justify-between items-center my-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
            <Text className="text-gray-600 text-xs font-semibold">Mensagens Enviadas (Mês):</Text>
            <Text className={`text-sm font-black ${remindersCount >= remindersLimit ? "text-red-600" : "text-[#092D5D]"}`}>
              {remindersCount} / {remindersLimit >= 9999 ? "Ilimitado" : remindersLimit}
            </Text>
          </View>

          {remindersLimit < 9999 && (
            <View className="w-full bg-gray-100 h-2.5 rounded-full mb-3 overflow-hidden">
              <View
                className={`h-2.5 rounded-full ${remindersCount >= remindersLimit ? "bg-red-500" : "bg-[#22c55e]"}`}
                style={{ width: `${Math.min(100, (remindersCount / remindersLimit) * 100)}%` }}
              />
            </View>
          )}

          {remindersCount >= remindersLimit && (
            <View className="bg-red-50 border border-red-200 p-3 rounded-xl mb-3 flex-row items-center gap-2">
              <Ionicons name="alert-circle" size={18} color="#ef4444" />
              <Text className="text-red-700 text-xs font-bold flex-1 leading-4">
                O limite mensal do seu plano foi atingido ({remindersCount}/{remindersLimit}). Adquira pacotes adicionais para liberar envios automáticos.
              </Text>
            </View>
          )}

          <Text className="text-gray-500 text-xs mb-4 leading-relaxed">
            As confirmações e lembretes são disparados automaticamente pelo WhatsApp para os seus clientes.
          </Text>

          <TouchableOpacity
            onPress={handleBuyMessages}
            activeOpacity={0.85}
            className="bg-[#092D5D] py-3.5 px-4 rounded-xl items-center flex-row justify-center gap-2 shadow-sm"
          >
            <Ionicons name="open-outline" size={18} color="white" />
            <Text className="text-white font-black text-xs uppercase tracking-wide">
              Gerenciar Pacotes no Painel Web
            </Text>
          </TouchableOpacity>
        </View>

        {/* ─── WHITE_LABEL (Evolution API) Widgets ─────────────────────────── */}
        {companyType === "WHITE_LABEL" && (
          <View className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm mb-5">
            <View className="flex-row items-center gap-2 mb-4">
              <View
                className={`w-3 h-3 rounded-full ${
                  status === "CONNECTED"
                    ? "bg-green-500"
                    : status === "QRCODE" || status === "CONNECTING"
                      ? "bg-amber-400"
                      : "bg-red-500"
                }`}
              />
              <Text className="text-gray-900 font-extrabold text-base flex-1">
                {status === "CONNECTED"
                  ? "Conectado ao WhatsApp"
                  : status === "QRCODE" || status === "CONNECTING"
                    ? "Aguardando leitura do QR Code"
                    : status === "DISCONNECTED"
                      ? "Desconectado"
                      : "Sem instância registrada"}
              </Text>
              {isPolling && <ActivityIndicator size="small" color="#092D5D" />}
            </View>

            {/* QR Code */}
            {qrBase64 && (status === "QRCODE" || status === "CONNECTING") && (
              <View className="items-center bg-gray-50 border border-gray-200 p-4 rounded-2xl mb-4">
                <Text className="text-gray-700 font-bold mb-3 text-center text-xs">
                  Escaneie o código com o WhatsApp do seu celular
                </Text>
                <Image
                  source={{ uri: qrBase64 }}
                  className="w-[200px] h-[200px]"
                  resizeMode="contain"
                />
                <Text className="text-gray-500 text-xs mt-3 text-center">
                  Abra o WhatsApp → Dispositivos conectados → Conectar dispositivo
                </Text>
              </View>
            )}

            {/* Actions */}
            <View className="gap-3">
              {(status === "DISCONNECTED" || status === null) && (
                <TouchableOpacity
                  onPress={handleConnect}
                  disabled={isLoading}
                  className="bg-[#22c55e] py-3.5 rounded-xl items-center shadow-sm"
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-black text-xs uppercase tracking-wide">Conectar WhatsApp</Text>
                  )}
                </TouchableOpacity>
              )}

              {(status === "QRCODE" || status === "CONNECTING") && (
                <TouchableOpacity
                  onPress={handleConnect}
                  disabled={isLoading}
                  className="border border-[#092D5D] py-3.5 rounded-xl items-center"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#092D5D" />
                  ) : (
                    <Text className="text-[#092D5D] font-black text-xs uppercase tracking-wide">
                      Gerar novo QR Code
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              {status === "CONNECTED" && (
                <TouchableOpacity
                  onPress={handleDisconnect}
                  disabled={isLoading}
                  className="border border-red-500 py-3.5 rounded-xl items-center"
                >
                  {isLoading ? (
                    <ActivityIndicator color="#ef4444" />
                  ) : (
                    <Text className="text-red-500 font-extrabold text-xs uppercase tracking-wide">Desconectar WhatsApp</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* ─── Configurações de Mensagens e Regras de Disparo ─── */}
        <View className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm">
          <View className="flex-row items-center gap-2 mb-4">
            <Ionicons name="chatbubbles" size={20} color="#092D5D" />
            <Text className="text-gray-900 font-extrabold text-base">
              Regras de Notificações
            </Text>
          </View>

          {/* Toggle Confirmação de Agendamento */}
          <View className="flex-row justify-between items-center mb-5 pb-4 border-b border-gray-100">
            <View className="flex-1 pr-3">
              <Text className="text-gray-900 text-sm font-extrabold">
                Confirmação Instantânea
              </Text>
              <Text className="text-gray-500 text-xs mt-1 leading-relaxed">
                {bookingConfirmationEnabled
                  ? "Envia mensagem no WhatsApp do cliente no exato momento em que o agendamento é realizado."
                  : "Confirmações instantâneas desativadas."}
              </Text>
            </View>
            {isSavingConfirmation ? (
              <ActivityIndicator size="small" color="#092D5D" />
            ) : (
              <Switch
                value={bookingConfirmationEnabled}
                onValueChange={handleToggleConfirmation}
                trackColor={{ false: "#e5e7eb", true: "#092D5D" }}
                thumbColor={bookingConfirmationEnabled ? "#CBA35D" : "#f3f4f6"}
              />
            )}
          </View>

          {/* Toggle Lembrete Automático */}
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-1 pr-3">
              <Text className="text-gray-900 text-sm font-extrabold">
                Lembrete Automático de Horário
              </Text>
              <Text className="text-gray-500 text-xs mt-1 leading-relaxed">
                {reminderEnabled
                  ? "Relembra o cliente via WhatsApp com antecedência para evitar faltas (no-show)."
                  : "Lembretes prévios desativados."}
              </Text>
            </View>
            {isSavingReminder ? (
              <ActivityIndicator size="small" color="#092D5D" />
            ) : (
              <Switch
                value={reminderEnabled}
                onValueChange={handleToggleReminder}
                trackColor={{ false: "#e5e7eb", true: "#092D5D" }}
                thumbColor={reminderEnabled ? "#CBA35D" : "#f3f4f6"}
              />
            )}
          </View>

          {/* Antecedência */}
          {reminderEnabled && (
            <View className="mt-4 pt-4 border-t border-gray-100">
              <Text className="text-gray-700 text-xs font-bold uppercase tracking-wider mb-3">
                Enviar lembrete com antecedência de:
              </Text>
              <View className="gap-2.5">
                {[
                  { min: 30, label: "30 minutos antes" },
                  { min: 60, label: "1 hora antes (Recomendado)" },
                  { min: 120, label: "2 horas antes" },
                  { min: 1440, label: "24 horas (1 dia antes)" },
                ].map((item) => (
                  <TouchableOpacity
                    key={item.min}
                    onPress={() => handleChangeMinutesBefore(item.min)}
                    disabled={isSavingReminder}
                    activeOpacity={0.8}
                    className={`flex-row items-center justify-between py-3.5 px-4 rounded-xl border ${
                      minutesBefore === item.min
                        ? "border-[#092D5D] bg-[#092D5D]/5"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <View className="flex-row items-center gap-3">
                      <Ionicons
                        name={minutesBefore === item.min ? "radio-button-on" : "radio-button-off"}
                        size={18}
                        color={minutesBefore === item.min ? "#092D5D" : "#9ca3af"}
                      />
                      <Text
                        className={`text-xs font-bold ${
                          minutesBefore === item.min ? "text-[#092D5D]" : "text-gray-700"
                        }`}
                      >
                        {item.label}
                      </Text>
                    </View>
                    {minutesBefore === item.min && (
                      <Ionicons name="checkmark-circle" size={16} color="#CBA35D" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

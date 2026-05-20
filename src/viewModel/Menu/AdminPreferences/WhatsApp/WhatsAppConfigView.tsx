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
import { colors } from "@/styles/colors";
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
  handleDelete,
  reminderEnabled,
  minutesBefore,
  isSavingReminder,
  handleToggleReminder,
  handleChangeMinutesBefore,
}: ReturnType<typeof useWhatsAppViewModel>) {
  if (isInitialLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary items-center justify-center">
        <ActivityIndicator color={colors.white} />
        <Text className="text-gray-500 mt-2 text-sm">
          Verificando conexão...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <AppAdminHeader
          title="Configurar WhatsApp"
          leftIconShown={false}
          iconRight={{ icon: false, path: "" }}
        />

        <Text className="text-font-primary text-xl font-bold mt-4 mb-1">WhatsApp</Text>
        <Text className="text-gray-500 text-sm mb-6">
          Conecte o WhatsApp da empresa para enviar lembretes e confirmações.
        </Text>

        {/* ─── Status ─────────────────────────────────────────────────────── */}
        <View className="flex-row items-center gap-2 mb-6 bg-background-tertiary p-4 rounded-xl">
          <View
            className={`w-3 h-3 rounded-full ${
              status === "CONNECTED"
                ? "bg-green-400"
                : status === "QRCODE" || status === "CONNECTING"
                  ? "bg-yellow-400"
                  : "bg-red-500"
            }`}
          />
          <Text className="text-font-primary font-semibold flex-1">
            {status === "CONNECTED"
              ? "Conectado"
              : status === "QRCODE" || status === "CONNECTING"
                ? "Aguardando leitura do QR Code"
                : status === "DISCONNECTED"
                  ? "Desconectado"
                  : "Sem instância"}
          </Text>
          {isPolling && <ActivityIndicator size="small" color={colors.white} />}
        </View>

        {/* ─── QR Code ────────────────────────────────────────────────────── */}
        {qrBase64 && (status === "QRCODE" || status === "CONNECTING") && (
          <View className="items-center bg-white p-4 rounded-xl mb-6">
            <Text className="text-font-secundary font-semibold mb-3 text-center">
              Escaneie com o WhatsApp do celular
            </Text>
            <Image
              source={{ uri: qrBase64 }}
              className="w-[220px] h-[220px]"
              resizeMode="contain"
            />
            <Text className="text-gray-500 text-xs mt-3 text-center">
              Abra o WhatsApp → Dispositivos conectados → Conectar dispositivo
            </Text>
          </View>
        )}

        {/* ─── Conectado ──────────────────────────────────────────────────── */}
        {status === "CONNECTED" && (
          <View className="items-center bg-green-900/30 border border-green-600 p-4 rounded-xl mb-6">
            <Ionicons name="checkmark-circle" size={40} color="#4ade80" />
            <Text className="text-green-400 font-semibold mt-2">
              WhatsApp conectado com sucesso!
            </Text>
            <Text className="text-gray-500 text-sm mt-1 text-center">
              Lembretes e confirmações serão enviados automaticamente.
            </Text>
          </View>
        )}

        {/* ─── Botões de ação ─────────────────────────────────────────────── */}
        <View className="gap-3 mb-6">
          {(status === "DISCONNECTED" || status === null) && (
            <TouchableOpacity
              onPress={handleConnect}
              disabled={isLoading}
              className="bg-green-600 py-3 rounded-xl items-center"
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-font-primary font-bold">Conectar WhatsApp</Text>
              )}
            </TouchableOpacity>
          )}

          {(status === "QRCODE" || status === "CONNECTING") && (
            <TouchableOpacity
              onPress={handleConnect}
              disabled={isLoading}
              className="border border-app-theme-primary py-3 rounded-xl items-center"
            >
              {isLoading ? (
                <ActivityIndicator color={colors["app-theme-primary"]} />
              ) : (
                <Text className="text-app-theme-primary font-bold">
                  Gerar novo QR Code
                </Text>
              )}
            </TouchableOpacity>
          )}

          {status === "CONNECTED" && (
            <TouchableOpacity
              onPress={handleDisconnect}
              disabled={isLoading}
              className="border border-red-500 py-3 rounded-xl items-center"
            >
              {isLoading ? (
                <ActivityIndicator color="red" />
              ) : (
                <Text className="text-red-500 font-bold">Desconectar</Text>
              )}
            </TouchableOpacity>
          )}
          {status !== null && status !== "DISCONNECTED" && (
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isLoading}
              className="py-3 rounded-xl items-center"
            >
              <Text className="text-gray-500 text-sm">Remover instância</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ─── Configuração de lembrete (só quando conectado) ─────────────── */}
        {status === "CONNECTED" && (
          <View className="bg-background-tertiary p-4 rounded-xl">
            <Text className="text-font-primary font-semibold mb-4">
              Lembrete automático
            </Text>

            {/* Toggle */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1 pr-3">
                <Text className="text-font-primary text-sm font-medium">
                  Enviar lembrete
                </Text>
                <Text className="text-gray-500 text-xs mt-1">
                  {reminderEnabled
                    ? "Clientes receberão lembrete antes do agendamento."
                    : "Lembretes desativados."}
                </Text>
              </View>
              {isSavingReminder ? (
                <ActivityIndicator
                  size="small"
                  color={colors["app-theme-primary"]}
                />
              ) : (
                <Switch
                  value={reminderEnabled}
                  onValueChange={handleToggleReminder}
                  thumbColor={
                    reminderEnabled ? colors["app-theme-primary"] : colors.white
                  }
                  trackColor={{
                    false: colors.gray[800],
                    true: colors["app-theme-primary-light"] ?? "#f97316",
                  }}
                  ios_backgroundColor={colors.gray[800]}
                />
              )}
            </View>

            {/* Antecedência */}
            {reminderEnabled && (
              <View>
                <Text className="text-gray-400 text-sm mb-3">
                  Enviar com antecedência de:
                </Text>
                <View className="gap-2">
                  {[30, 60, 120].map((min) => (
                    <TouchableOpacity
                      key={min}
                      onPress={() => handleChangeMinutesBefore(min)}
                      disabled={isSavingReminder}
                      className={`flex-row items-center gap-3 py-3 px-4 rounded-xl border ${
                        minutesBefore === min
                          ? "border-app-theme-primary bg-app-theme-primary/10"
                          : "border-gray-700"
                      }`}
                    >
                      <View
                        className={`w-4 h-4 rounded-full border-2 items-center justify-center ${
                          minutesBefore === min
                            ? "border-app-theme-primary"
                            : "border-gray-500"
                        }`}
                      >
                        {minutesBefore === min && (
                          <View className="w-2 h-2 rounded-full bg-app-theme-primary" />
                        )}
                      </View>
                      <Text
                        className={`text-sm ${
                          minutesBefore === min
                            ? "text-app-theme-primary font-semibold"
                            : "text-font-primary"
                        }`}
                      >
                        {min < 60
                          ? `${min} minutos antes`
                          : `${min / 60} hora${min > 60 ? "s" : ""} antes`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNewOrderViewModel } from "./useNewOrderViewModel";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { AppDateTimePicker } from "@/shared/components/AppDateTimePicker";
import { AppInputController } from "@/shared/components/AppInputControler";

export function NewOrderView({
  order,
  setOrder,
  employeeSelector,
  control,
  date,
  setDate,
  onSubmit,
  openDateTimePicker,
  setDateTimePicker,
  formatDateTimeToBR,
  handleClientOwner,
  handleEmployeeOwner,
  handleOpenEmployeetList,
  handleOpenClientList,
  client,
  employee,
  loading,
}: ReturnType<typeof useNewOrderViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppAdminHeader
        title={`Nova Comanda`}
        iconRight={{ icon: false, path: "" }}
      />

      <View className="p-4 gap-4">
        {/* Card Principal */}
        <View className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs gap-4">
          <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider">
            Abrir Comanda para:
          </Text>

          {/* Selector de Cliente / Profissional em estilo Pílula */}
          <View className="flex-row bg-slate-100 p-1.5 rounded-xl border border-slate-200">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleClientOwner}
              className={`flex-1 py-2.5 items-center justify-center rounded-lg ${
                !employeeSelector ? "bg-[#092D5D] shadow-xs" : ""
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  !employeeSelector ? "text-white" : "text-slate-600"
                }`}
              >
                Cliente
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEmployeeOwner}
              activeOpacity={0.8}
              className={`flex-1 py-2.5 items-center justify-center rounded-lg ${
                employeeSelector ? "bg-[#092D5D] shadow-xs" : ""
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  employeeSelector ? "text-white" : "text-slate-600"
                }`}
              >
                Profissional
              </Text>
            </TouchableOpacity>
          </View>

          {/* Data da Comanda */}
          <TouchableOpacity
            onPress={() => setDateTimePicker(true)}
            activeOpacity={0.8}
            className="w-full"
          >
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
              Data de Abertura
            </Text>
            <View className="w-full flex-row items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-300">
              <Ionicons name="calendar-outline" size={20} color="#092D5D" />
              <View className="flex-1">
                <Text className="text-slate-900 font-bold text-sm">
                  {date ? formatDateTimeToBR(date) : "Selecione a data"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#64748b" />
            </View>
          </TouchableOpacity>

          {/* Selecionar Cliente ou Profissional */}
          {employeeSelector ? (
            <TouchableOpacity onPress={handleOpenEmployeetList} activeOpacity={0.8}>
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
                Profissional Vinculado
              </Text>
              <View className="w-full flex-row items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                <View className="flex-row items-center gap-2.5">
                  <Ionicons name="person-outline" size={18} color="#092D5D" />
                  <Text
                    className={`text-sm font-bold ${
                      employee ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {employee ? employee.name : "Escolha o profissional"}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#092D5D" />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleOpenClientList} activeOpacity={0.8}>
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
                Cliente Vinculado
              </Text>
              <View className="w-full flex-row items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                <View className="flex-row items-center gap-2.5">
                  <Ionicons name="person-outline" size={18} color="#092D5D" />
                  <Text
                    className={`text-sm font-bold ${
                      client ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {client ? client.name : "Escolha o cliente"}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={18} color="#092D5D" />
              </View>
            </TouchableOpacity>
          )}

          {/* Campos Adicionais */}
          <AppInputController
            control={control}
            name="additionalInfo"
            label="Observação"
            placeholder="Adicione uma observação (opcional)"
            placeholderTextColor={colors.gray[400]}
          />

          <AppInputController
            control={control}
            name="orderNumber"
            leftIcon="receipt-outline"
            label="Número da comanda"
            placeholder="Ex: 001002"
            placeholderTextColor={colors.gray[400]}
          />
        </View>

        {/* Botão de Abrir Comanda */}
        <TouchableOpacity
          onPress={onSubmit}
          activeOpacity={0.85}
          className="h-14 bg-[#092D5D] border border-[#092D5D] rounded-xl items-center justify-center shadow-md"
        >
          <Text className="text-center text-white font-extrabold text-base uppercase tracking-wide">
            {loading ? <ActivityIndicator color="#ffffff" /> : "Abrir Comanda"}
          </Text>
        </TouchableOpacity>
      </View>

      <AppDateTimePicker
        open={openDateTimePicker}
        date={date}
        onConfirm={(date) => {
          setDateTimePicker(false);
          setDate(date);
        }}
        onCancel={() => setDateTimePicker(false)}
      />
    </SafeAreaView>
  );
}

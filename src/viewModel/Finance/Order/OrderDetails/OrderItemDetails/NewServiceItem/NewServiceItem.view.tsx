import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNewServiceItemViewModel } from "./useNewServiceItemViewModel";
import { AppDateTimePicker } from "@/shared/components/AppDateTimePicker";

export function NewServiceItem({
  dateTimePicker,
  setDateTimePicker,
  date,
  setDate,
  formatDateTimeToBR,
  serviceIsSelected,
  service,
  handleOpenServiceList,
  handleOpenEmployeeList,
  employee,
  onAddServiceToOrder,
  isItemLoading,
}: ReturnType<typeof useNewServiceItemViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppAdminHeader
        title={`Inserir Serviço`}
        iconRight={{ icon: false, path: "" }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
      >
        <Text className="text-[#092D5D] font-black text-xs uppercase tracking-wider mb-3">
          Adicionar Serviço na Comanda
        </Text>

        <View className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs gap-4 mb-5">
          {/* Data e Hora */}
          <TouchableOpacity
            onPress={() => setDateTimePicker(true)}
            activeOpacity={0.85}
            className="w-full"
          >
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
              Data e Horário Agendado
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

          {/* Selecionar Serviço */}
          <TouchableOpacity onPress={handleOpenServiceList} activeOpacity={0.85}>
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
              Serviço
            </Text>
            <View className="w-full flex-row items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300">
              <View className="flex-row items-center gap-2.5">
                <Ionicons name="cut-outline" size={18} color="#092D5D" />
                <Text
                  className={`text-sm font-bold ${
                    service ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {service ? service.name : "Escolha o serviço"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#092D5D" />
            </View>
          </TouchableOpacity>

          {/* Selecionar Profissional */}
          {serviceIsSelected && (
            <TouchableOpacity onPress={handleOpenEmployeeList} activeOpacity={0.85}>
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
                Profissional Atendente
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
          )}

          {/* Aviso informativo */}
          <View className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex-row gap-2 items-center">
            <Ionicons name="information-circle-outline" size={18} color="#d97706" />
            <Text className="text-amber-800 text-[11px] font-medium flex-1">
              Agendamentos inseridos diretamente por aqui não entram em conflito com bloqueios da agenda.
            </Text>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          onPress={onAddServiceToOrder}
          activeOpacity={0.85}
          className="h-14 bg-[#092D5D] border border-[#092D5D] rounded-xl items-center justify-center shadow-md"
        >
          <Text className="text-center text-white font-extrabold text-sm uppercase tracking-wide">
            {isItemLoading ? <ActivityIndicator color="#ffffff" /> : "Salvar Serviço"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <AppDateTimePicker
        open={dateTimePicker}
        date={date}
        onConfirm={(date) => {
          setDate(date);
          setDateTimePicker(false);
        }}
        onCancel={() => setDateTimePicker(false)}
      />
    </SafeAreaView>
  );
}

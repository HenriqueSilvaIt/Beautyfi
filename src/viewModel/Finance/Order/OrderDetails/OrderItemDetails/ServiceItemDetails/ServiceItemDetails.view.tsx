import { SafeAreaView } from "react-native-safe-area-context";
import { useServiceItemDetailsViewModel } from "./useServiceItemDetailsViewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { ActivityIndicator, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { DeleteModal } from "@/shared/components/AppDeleteModal";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { AppDateTimePicker } from "@/shared/components/AppDateTimePicker";

export function ServiceItemDetailsView({
  dateTimePicker,
  setDateTimePicker,
  formatDateTimeToBR,
  date,
  setDate,
  service,
  onDeleteOrder,
  item,
  setServiceId,
  handleOpenServiceList,
  employee,
  handleOpenEmployeeList,
  serviceIsSelected,
  isItemLoading,
  onUpdateServiceToOrder,
  setOrderitemId,
  orderItemId,
  modalDeleteVisible,
  hideDeleteModal,
  showDeleteModal,
  setIsDeleting,
  isDeleting,
}: ReturnType<typeof useServiceItemDetailsViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppAdminHeader
        title={`Editar Item de Serviço`}
        iconRightName="trash"
        iconRight={{
          icon: true,
          path: "",
        }}
        action={showDeleteModal}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
      >
        <Text className="text-[#092D5D] font-black text-xs uppercase tracking-wider mb-3">
          Informações do Serviço na Comanda
        </Text>

        {/* Card do Sinal Pago (se houver) */}
        {(item?.requiresDeposit || Boolean(item?.depositAmount)) && (
          <View className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 mb-4 flex-row items-center justify-between shadow-xs">
            <View className="flex-row items-center gap-3">
              <Ionicons name="checkmark-circle-outline" size={24} color="#10b981" />
              <View>
                <Text className="text-emerald-950 font-extrabold text-xs uppercase tracking-wide">
                  Sinal Pago no Agendamento (PIX)
                </Text>

                <Text className="text-slate-600 text-xs mt-0.5">
                  Valor já abatido do total do serviço
                </Text>
              </View>
            </View>

            <Text className="text-emerald-700 font-black text-base">
              R$ {(item?.depositAmount || 0).toFixed(2).replace(".", ",")}
            </Text>
          </View>
        )}

        {/* Form Container */}
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
              Serviço Agendado
            </Text>
            <View className="w-full flex-row items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300">
              <Text
                className={`text-sm font-bold ${
                  item?.serviceName ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {item?.serviceName ? item?.serviceName : "Escolha o serviço"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#092D5D" />
            </View>
          </TouchableOpacity>

          {/* Selecionar Profissional */}
          {(serviceIsSelected || !!item?.serviceName) && (
            <TouchableOpacity onPress={handleOpenEmployeeList} activeOpacity={0.85}>
              <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
                Profissional Atendente
              </Text>
              <View className="w-full flex-row items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300">
                <Text
                  className={`text-sm font-bold ${
                    employee?.name || item?.employeeName ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {employee?.name ?? item?.employeeName ?? "Escolha o profissional"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#092D5D" />
              </View>
            </TouchableOpacity>
          )}

          {/* Aviso informativo */}
          <View className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex-row gap-2 items-center">
            <Ionicons name="information-circle-outline" size={18} color="#d97706" />
            <Text className="text-amber-800 text-[11px] font-medium flex-1">
              Alterações diretas na comanda não sobrepõem conflitos de horários na agenda principal.
            </Text>
          </View>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          onPress={onUpdateServiceToOrder}
          activeOpacity={0.85}
          className="h-14 bg-[#092D5D] border border-[#092D5D] rounded-xl items-center justify-center shadow-md"
        >
          <Text className="text-center text-white font-extrabold text-sm uppercase tracking-wide">
            {isItemLoading ? <ActivityIndicator color="#ffffff" /> : "Salvar Alterações"}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <AppDateTimePicker
        open={dateTimePicker}
        date={date}
        onConfirm={(date) => {
          setDateTimePicker(false);
          setDate(date);
        }}
        onCancel={() => setDateTimePicker(false)}
      />

      <DeleteModal
        loading={isDeleting}
        visible={modalDeleteVisible}
        confirmationButtonText="Sim"
        confirmationButtonColor
        hideModal={hideDeleteModal}
        handleDelete={() => {
          if (item?.id) {
            onDeleteOrder(Number(item?.id));
            hideDeleteModal();
          }
        }}
        description="Tem certeza que deseja deletar este item da comanda?"
        title="Deletar Item"
      />
    </SafeAreaView>
  );
}

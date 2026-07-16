import { SafeAreaView } from "react-native-safe-area-context";
import { useServiceItemDetailsViewModel } from "./useServiceItemDetailsViewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
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
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title={`Editar Serviço`}
        iconRightName="trash"
        iconRight={{
          icon: true,
          path: "",
        }}
        action={showDeleteModal}
      />
      <View className="mx-2"> 
      <Text className="text-app-theme-primary font-bold text-xl">Editar item</Text>
      <View className="mt-5">
        <TouchableOpacity
          onPress={() => setDateTimePicker(true)}
          activeOpacity={0.8}
          className="w-full"
        >
          <View className="w-full mb-2 flex-row items-center gap-3 p-2 rounded-sm bg-background-secondary border border-white/20 shadow">
            <Ionicons name="calendar" size={22} color={colors.white} />

            <View className="">
              <Text className="text-font-primary text-base opacity-70">Data:</Text>
              <Text className="text-font-primary font-semibold text-base">
                {date ? formatDateTimeToBR(date) : "Selecione"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleOpenServiceList}>
        <View className="my-2 justify-center  rouded-sm w-full border border-gray-600 px-5 h-[60px] rounded-sm ">
          <Text
            className={`text-gray-600 text-xl 
                      ${item?.serviceName ? "text-font-primary" : "text-gray-600"}`}
          >
            {item?.serviceName ? item?.serviceName : "Escolha o serviço"}
          </Text>
        </View>
      </TouchableOpacity>

      {(serviceIsSelected || !!item?.serviceName) && (
        <TouchableOpacity onPress={handleOpenEmployeeList}>
          <View className="my-2 justify-center  rouded-sm w-full border border-gray-600 px-5 h-[60px] rounded-sm ">
            <Text
              className={`text-gray-600 text-xl 
                      ${item?.employeeName ? "text-font-primary" : "text-gray-600"}`}
            >
              {employee?.name ?? item?.employeeName ?? "Escolha o profissional"}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      <View className="rounded-sm mb-2">
        <Text className="text-app-theme-primary  text-center text-sm">
          Agendamentos realizados por aqui, não será levado em consideração
          horários ocupados na agenda.
        </Text>
      </View>
</View>
      <TouchableOpacity onPress={onUpdateServiceToOrder}
      className="px-2" activeOpacity={0.8}>
        <View
          className={`h-[40px] bg-app-theme-primary rounded-md items-center justify-center 
                              ${isItemLoading ? "justify-between" : ""}`}
        >
          <Text className="text-center text-xl text-font-secundary font-bold">
            {isItemLoading ? <ActivityIndicator /> : "Salvar"}
          </Text>
        </View>
      </TouchableOpacity>
      
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
        description="Tem certeza que deseja deletar a comanda"
        title="Deletar comanda"
      />
    </SafeAreaView>
  );
}

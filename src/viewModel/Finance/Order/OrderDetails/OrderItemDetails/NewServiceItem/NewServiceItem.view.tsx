import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import { ActivityIndicator, Text, View } from "react-native";
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
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title={`Inserir Serviço`}
        iconRight={{ icon: false, path: "" }}
      />
      <View className="mx-2">
        <Text className="text-app-theme-primary font-bold text-xl">
          Adicionar Item
        </Text>

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
                      ${service ? "text-font-primary" : "text-gray-600"}`}
            >
              {service ? service.name : "Escolha o serviço"}
            </Text>
          </View>
        </TouchableOpacity>

        {serviceIsSelected && (
          <TouchableOpacity onPress={handleOpenEmployeeList}>
            <View className="my-2 justify-center  rouded-sm w-full border border-gray-600 px-5 h-[60px] rounded-sm ">
              <Text
                className={`text-gray-600 text-xl 
                      ${employee ? "text-font-primary" : "text-gray-600"}`}
              >
                {employee ? employee.name : "Escolha o profissional"}
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

        <TouchableOpacity onPress={onAddServiceToOrder} activeOpacity={0.8}>
          <View
            className={`h-[40px] bg-app-theme-primary rounded-md items-center justify-center 
                              ${isItemLoading ? "justify-between" : ""}`}
          >
            <Text className="text-center text-xl text-font-secundary font-bold">
              {isItemLoading ? <ActivityIndicator /> : "Salvar"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
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

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
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title={`Nova comanda`}
        iconRight={{ icon: false, path: "" }}
      />

      <View className="mt-2 mx-2">
        <Text className="text-font-primary text-base">Abrir comanda para:</Text>

        <View className="flex-row mt-2   bg-background-tertiary w-full gap-2 items-center justify-center">
          <TouchableOpacity activeOpacity={0.8} onPress={handleClientOwner}>
            <View
              className={`p-2  my-2 w-[120px] justify-center items-center  rounded-md 
                ${!employeeSelector && "bg-app-theme-primary   rounded-md "}`}
            >
              <Text className="text-sm text-font-primary font-semibold">Cliente</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleEmployeeOwner} activeOpacity={0.8}>
            <View
              className={`p-2 rounded-md     my-2 w-[120px] justify-center items-center
                ${employeeSelector === true && "bg-app-theme-primary   "} `}
            >
              <Text className="text-sm text-font-primary font-semibold">
                Profissional
              </Text>
            </View>
          </TouchableOpacity>
        </View>

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

        {employeeSelector ? (
          <TouchableOpacity onPress={handleOpenEmployeetList}>
            <View className="my-2 justify-center  w-full border border-gray-600 px-5 h-[60px] rounded-sm ">
              <Text
                className={`text-gray-600 text-xl 
                ${employee ? "text-font-primary" : "text-gray-600"}`}
              >
                {employee ? employee.name : "Escolha o profissional"}
              </Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleOpenClientList}>
            <View className="my-2 justify-center   w-full border border-gray-600 px-5 h-[60px] rounded-sm ">
              <Text
                className={`text-gray-600 text-xl 
                ${client ? "text-font-primary" : "text-gray-600"}`}
              >
                {client ? client.name : "Escolha o cliente"}
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <AppInputController
          control={control}
          name="additionalInfo"
          label="Observação"
          placeholder="Adicione uma observação"
          placeholderTextColor={colors.gray[600]}
        />
        <AppInputController
          control={control}
          name="orderNumber"
          leftIcon="mail-outline"
          label="Número da comanda"
          placeholder="xxxxxxxx"
          placeholderTextColor={colors.gray[600]}
        />

        <TouchableOpacity
          onPress={onSubmit}
          activeOpacity={0.8}
          className={`h-[40px] px-2 bg-app-theme-primary rounded-md items-center justify-center 
                        ${loading ? "justify-between" : ""}`}
        >
          <Text className="text-center text-xl text-font-primary font-bold">
            {loading ? <ActivityIndicator /> : "Salvar"}
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

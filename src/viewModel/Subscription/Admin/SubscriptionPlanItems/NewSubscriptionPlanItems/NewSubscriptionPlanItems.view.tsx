import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useNewSubscriptionPlanItemsViewModel } from "./useNewSubscriptionPlanItemsViewModel";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppInputController } from "@/shared/components/AppInputControler";
import { colors } from "@/styles/colors";
import { DAYS_WEEK } from "@/shared/interfaces/http/employee";

export function NewSubscriptionPlanItemsView({
  handleProductOwner,
  handleServiceSelector,
  typeServiceSelector,
  onAddItemToPlan,
  control,
  handleSubmit,
  setValue,
  product,
  service,
  handleOpenProductList,
  handleOpenServiceList,
  isListLoading,
  isItemLoading,
  selectedWeekDays,
  handleToggleWeekDay,
}: ReturnType<typeof useNewSubscriptionPlanItemsViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Novo item"
        iconRight={{
          icon: false,
          path: "",
        }}
      />

      <View className="flex-row mt-2   bg-background-tertiary w-full gap-2 items-center justify-center">
        <TouchableOpacity activeOpacity={0.8} onPress={handleProductOwner}>
          <View
            className={`p-2  my-2 w-[120px] justify-center items-center  rounded-md 
                ${!typeServiceSelector && "bg-app-theme-primary   rounded-md "}`}
          >
            <Text className="text-sm text-font-primary font-semibold">Produto</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleServiceSelector} activeOpacity={0.8}>
          <View
            className={`p-2 rounded-md     my-2 w-[120px] justify-center items-center
                ${typeServiceSelector === true && "bg-app-theme-primary   "} `}
          >
            <Text className="text-sm text-font-primary font-semibold">Serviço</Text>
          </View>
        </TouchableOpacity>
      </View>
      {typeServiceSelector ? (
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
      ) : (
        <TouchableOpacity onPress={handleOpenProductList}>
          <View className="my-2 justify-center  rouded-sm w-full border border-gray-600 px-5 h-[60px] rounded-sm ">
            <Text
              className={`text-gray-600 text-xl 
                      ${product ? "text-font-primary" : "text-gray-600"}`}
            >
              {product ? product.name : "Escolha o produto"}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {typeServiceSelector && (
        <View className="px-2 mb-4">
          <Text className="text-font-primary text-base font-semibold mb-2">
            Dias da semana
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {DAYS_WEEK.map((day) => {
              const selected = selectedWeekDays.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  onPress={() => handleToggleWeekDay(day)}
                  activeOpacity={0.8}
                >
                  <View
                    className={`px-3 py-2 rounded-full border ${
                      selected
                        ? "border-app-theme-primary bg-app-theme-primary"
                        : "border-gray-600 bg-background-tertiary"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selected ? "text-font-primary" : "text-gray-300"
                      }`}
                    >
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
      <View className="px-2">

        <AppInputController
          control={control}
          name="cutsAllowed"
          leftIcon="cash"
          label="Qtd de usos permitidos"
          placeholder="R$ 0,00"
          placeholderTextColor={colors.gray[600]}
        />

        
        <AppInputController
          control={control}
          name="discountPercentage"
          leftIcon="cash"
          label="Percentual de desconto (opcional)"
          placeholder="$ 0,00"
          placeholderTextColor={colors.gray[600]}
        />
      </View>

      <TouchableOpacity onPress={onAddItemToPlan} activeOpacity={0.8}>
        <View
          className={`h-[40px] bg-app-theme-primary rounded-md items-center justify-center 
                                    ${isItemLoading ? "justify-between" : ""}`}
        >
          <Text className="text-center text-xl text-font-primary font-bold">
            {isItemLoading ? <ActivityIndicator /> : "Salvar"}
          </Text>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

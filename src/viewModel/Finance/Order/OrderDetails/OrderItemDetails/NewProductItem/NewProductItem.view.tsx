import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNewProductItemViewModel } from "./useNewProductItemViewModel";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AppInputController } from "@/shared/components/AppInputControler";
import { colors } from "@/styles/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { moneyMapper } from "@/utils/moneyMapper";
import { AppQuantityControl } from "@/shared/components/AppQuantityControl";
export function NewProductItem({
  product,
  isItemLoading,
  handleOpenProductList,
  onAddProductToOrder,
  employee,
  toUse,
  setToUse,
  courtesy,
  setCourtesy,
  total,
  quantity,
  setQuantity,
  handleToggleCourtesy,
  handleToggleToUse,
  control,
  maskMoneyBR,
  handleOpenEmployeeList,
}: ReturnType<typeof useNewProductItemViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title={`Inserir Produto`}
        iconRight={{ icon: false, path: "" }}
      />

        <Text className="text-app-theme-primary font-bold text-xl">
          Adicionar Item
        </Text>
      <View className="mt-2 mx-2">

        <Text className="text-font-primary mb-2 text-base">Produto:</Text>
        <TouchableOpacity onPress={handleOpenProductList}>
          <View className="mb-2 justify-center  rouded-sm w-full border border-gray-600 px-5 h-[60px] rounded-sm ">
            <Text
              className={`text-gray-600 text-xl 
                      ${product ? "text-font-primary" : "text-gray-600"}`}
            >
              {product ? product.name : "Escolha o produto"}
            </Text>
          </View>
        </TouchableOpacity>

        <View className="px-2">
          <AppInputController
            control={control}
            name="price"
            leftIcon="cash"
            label="Valor"
            placeholder="R$ 0,00"
            placeholderTextColor={colors.gray[600]}
          />
        </View> 

        <TouchableOpacity onPress={handleOpenEmployeeList}>
          <Text className="text-font-primary text-base">Profissional:</Text>

          <View className="my-2 justify-center  rouded-sm w-full border border-gray-600 px-5 h-[60px] rounded-sm ">
            <Text
              className={`text-gray-600 text-xl 
                      ${employee ? "text-font-primary" : "text-gray-600"}`}
            >
              {employee ? employee.name : "Escolha o profissional"}
            </Text>
          </View>
        </TouchableOpacity>

        <View className="ml-1">
          <Text className="text-font-primary text-base mb-2">Quantidade:</Text>

          <AppQuantityControl
            quantity={quantity}
            setQuantity={setQuantity}
            price={Number(product?.price)}

          />
        </View>
        <View className="flex-row w-full  px-2 my-2 items-center">
          <View className="flex-1">
            <Text className="text-app-theme-primary  font-bold text-start text-base">
              Para uso
            </Text>
            <Text className="text-font-primary  text-start text-sm">
              Produtos definidos como para uso NÃO SERÃO contabilizados na
              comanda
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleToggleToUse()}
            activeOpacity={0.8}
            className=""
          >
            <MaterialCommunityIcons
              name={
                toUse ? "toggle-switch-outline" : "toggle-switch-off-outline"
              }
              color={toUse ? colors["app-theme-primary"] : colors.white}
              size={36}
            />
          </TouchableOpacity>
        </View>

        <View className="flex-row w-full  px-2 mb-2 items-center">
          <View className="flex-1">
            <Text className="text-app-theme-primary  font-bold text-start text-base">
              Cortesia
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => handleToggleCourtesy()}
            activeOpacity={0.8}
            className=""
          >
            <MaterialCommunityIcons
              name={
                courtesy ? "toggle-switch-outline" : "toggle-switch-off-outline"
              }
              color={courtesy ? colors["app-theme-primary"] : colors.white}
              size={36}
            />
          </TouchableOpacity>
        </View>

        <View className="border-t-2 border-gray-600 w-full mb-5" />

        <View className="flex-row  items-center justify-between">
          <Text className="text-xl text-app-theme-primary font-bold flex-1">
            Total
          </Text>

          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-2xl text-green-600"
          >
            R$ {moneyMapper(total)}
          </Text>
        </View>

        <TouchableOpacity onPress={onAddProductToOrder} activeOpacity={0.8}>
          <View
            className={`h-[40px] mt-2 bg-app-theme-primary rounded-md items-center justify-center 
                              ${isItemLoading ? "justify-between" : ""}`}
          >
            <Text className="text-center text-xl text-font-primary font-bold">
              {isItemLoading ? <ActivityIndicator /> : "Salvar"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

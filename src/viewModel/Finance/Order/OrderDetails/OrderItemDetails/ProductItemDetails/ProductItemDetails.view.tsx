import { SafeAreaView } from "react-native-safe-area-context";
import { useProductItemDetailsViewModel } from "./useProductItemDetailsViewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { DeleteModal } from "@/shared/components/AppDeleteModal";
import { AppInputController } from "@/shared/components/AppInputControler";
import { colors } from "@/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppQuantityControl } from "@/shared/components/AppQuantityControl";
import { moneyMapper } from "@/utils/moneyMapper";

export function ProductItemDetailsView({
  product,
  isProductSelected,
  isItemLoading,
  handleOpenProductList,
  onUpdateProductToOrder,
  employee,
  handleOpenEmployeeList,
  toUse,
  setToUse,
  courtesy,
  setCourtesy,
  quantity,
  setQuantity,
  order,
  item,
  total,
  maskMoneyBR,
  control,
  isDeleting,
  setIsDeleting,
  onDeleteOrder,
  DeleteModal,
  handleToggleCourtesy,
  showDeleteModal,
  hideDeleteModal,
  modalDeleteVisible,
  handleToggleToUse,
}: ReturnType<typeof useProductItemDetailsViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title={`Editar Produto`}
        iconRightName="trash"
        iconRight={{
          icon: true,
          path: "",
        }}
        action={showDeleteModal}
      />
      <View className="mx-2">
        <Text className="text-app-theme-primary font-bold text-xl">
          Editar item
        </Text>
        <Text className="text-font-primary my-2 text-base">Produto:</Text>
        <TouchableOpacity onPress={handleOpenProductList}>
          <View className="mb-2 justify-center  rouded-sm w-full border border-gray-600 px-5 h-[60px] rounded-sm ">
            <Text
              className={`text-gray-600 text-xl 
                      ${item ? "text-font-primary" : "text-gray-600"}`}
            >
              {item?.name ? item?.name : "Escolha o produto"}
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
                      ${employee?.name ? "text-font-primary" : "text-gray-600"}`}
            >
              {employee?.name ?? "Escolha o profissional"}{" "}
            </Text>
          </View>
        </TouchableOpacity>

        <View className="ml-1">
          <Text className="text-font-primary text-base mb-2">Quantidade:</Text>

          <AppQuantityControl
            quantity={quantity}
            setQuantity={setQuantity}
            price={Number(item?.price)}
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
            0
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

      <TouchableOpacity onPress={onUpdateProductToOrder} activeOpacity={0.8}>
        <View
          className={`h-[40px] mt-2 bg-app-theme-primary rounded-md items-center justify-center 
                              ${isItemLoading ? "justify-between" : ""}`}
        >
          <Text className="text-center text-xl text-font-primary font-bold">
            {isItemLoading ? <ActivityIndicator /> : "Salvar"}
          </Text>
        </View>
      </TouchableOpacity>
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

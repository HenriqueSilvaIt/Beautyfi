import { useCallback, useMemo, useState } from "react";
import { useOrderDetailsViewModel } from "./useOrderDetailsViewModel";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { OrderItemsInterface } from "@/shared/interfaces/http/order";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { moneyMapper } from "@/utils/moneyMapper";
import { Feather, Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { DeleteModal } from "@/shared/components/AppDeleteModal";

type ListItem =
  | { type: "header"; title: string }
  | (OrderItemsInterface & { type: "service" })
  | (OrderItemsInterface & { type: "product" });

export type ButtonProps = {
  id: string;
  label: string;
};
const buttons: ButtonProps[] = [
  { id: "1", label: "+ Produto" },
  { id: "2", label: "+ Serviço" },
  { id: "4", label: "+ Desconto" },
  { id: "5", label: "+ Gorjeta" },
];

export function OrderDetailsView({
  order,
  onDeleteOrder,
  orderByIdRefetch,
  safePush,
  showDeleteModal,
  hideDeleteModal,
  modalDeleteVisible,
  handleOpenDiscountModal,
  handleOpenPaymentFlagCheckbox,
  handleOpenInstallmentCheckbox,
  handleOpenPaymentMethodCheckbox,
  handleOpenClientList,
  handleOpenTipModal,
  installment,
  handleOpenTotalModal,
  onCloseOrder,
  displayTotal,
  paymentCardFlag,
  isDeleting,
  paymentMethod,
  formatIsoDateAndTimeToBR,
  client,
  isLoading,
  isInstallmentAllowed,
}: ReturnType<typeof useOrderDetailsViewModel>) {
  const [selectedFilter, setSelectedFilter] = useState("1");

  const [isLoadingMessage, setIsLoadingMessage] = useState(false);

  const serviceItems =
    order?.items?.filter((item) => item.serviceName && item.servicePrice > 0) ??
    [];

  const productItems =
    order?.items?.filter((item) => item.name && item.price > 0) ?? [];
  const combinedItems: ListItem[] = [
    { type: "header", title: "Serviços" },

    ...serviceItems.map((item) => ({
      ...item,
      type: "service" as const,
    })),

    { type: "header", title: "Produtos" },

    ...productItems.map((item) => ({
      ...item,
      type: "product" as const,
    })),
  ];

  const actions: Record<string, () => void> = {
    "1": () => {
      if (!order?.id) return;

      safePush(
        `/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${order.id}/new-product-item`,
      );
    },

    "2": () => {
      if (!order?.id) return;

      safePush(
        `/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${order.id}/new-service-item`,
      );
    },
    "3": () => safePush(`/order-details/${order.id}`),
    "4": () => handleOpenDiscountModal(),
    "5": () => handleOpenTipModal(),
  };
  // Botões

  const renderButton = ({ item }: { item: ButtonProps }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedFilter(item.id);
        actions[item.id]?.();
      }}
      className={` h-[30px] items-center justify-center rounded-md border border-gray-600 mr-2
        ${selectedFilter === item.id ? "bg-orange-500" : "bg-gray-700"}`}
    >
      <Text className=" px-4 text-font-primary">{item.label}</Text>
    </TouchableOpacity>
  );
  //Serviço

  const renderService = useCallback(
    ({ item }: { item: OrderItemsInterface }) => (
      <View>
        {item.employeeName && item.serviceName && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              safePush(
                `/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${order.id}/service-item-details/${item.serviceId}`,
              )
            }
            className="flex-row rounded-md justify-between items-center px-2 max-h-[100%] bg-background-tertiary"
          >
            <View className="max-w-[100%]">
              <Text
                className="text-base text-font-primary"
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                Serviço: {item.serviceName}
              </Text>
              <Text
                className="text-base text-font-primary"
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                Horário: {formatIsoDateAndTimeToBR(item.dateScheduled)}
              </Text>
              {item.usingSubscription === false && (
                <View className="flex-row gap-2">
                  <Text className="text-font-primary">Cliente de assinatura</Text>
                  <Ionicons
                    name="diamond-outline"
                    color={colors["app-theme-primary"]}
                    size={20}
                  />
                </View>
              )}
              <Text
                className="text-base text-font-primary"
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                Profissional atendente: {item.employeeName}
              </Text>
            </View>
            <View className="items-center ">
              <Text className="text-base text-font-primary text-center">
                Preço: {moneyMapper(item.servicePrice)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    ),
    [],
  );

  //Produto
  const renderProduct = useCallback(
    ({ item }: { item: OrderItemsInterface }) => (
      <TouchableOpacity
        onPress={() =>
          safePush(
            `/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${order.id}/product-item-details/${item.productId}`,
          )
        }
        activeOpacity={0.8}
        className="flex-row rounded-md justify-between items-center p-2 h-[60px] bg-background-tertiary"
      >
        <View className="w-[200px]">
          {item.name && (
            <Text
              className="text-base text-font-primary"
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              Produto: {item.name}
            </Text>
          )}
        </View>
        <View className="items-center p-2">
          {item.price && (
            <View className="items-end">
              <Text className="text-font-primary text-sm">Qtd {item.quantity}</Text>
              <Text className="text-base text-font-primary text-center">
                Preço unitário: {moneyMapper(item.price)}
              </Text>
              <Text className="text-base text-font-primary text-center">
                Preço total: {moneyMapper(item.price * item.quantity)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  const renderItem = ({ item }: { item: ListItem }) => {
    if (
      item.type === "header" &&
      ((item.title === "Serviços" && serviceItems.length > 0) ||
        (item.title === "Produtos" && productItems.length > 0))
    ) {
      return (
        <Text className="text-app-theme-primary font-bold text-xl">
          {item.title}
        </Text>
      );
    }

    if (item.type === "service") {
      return renderService({ item });
    }

    if (item.type === "product") {
      return renderProduct({ item });
    }

    return null;
  };

  const filteredItems = useMemo(() => {
    switch (selectedFilter) {
      case "2": // Serviços
        return serviceItems;

      case "3": // Produtos
        return productItems;

      case "1": // Todos
      default:
        return combinedItems;
    }
  }, [selectedFilter, serviceItems, productItems, combinedItems]);

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title={`Comissão Nº ${order?.orderNumber}`}
        iconRightName="trash"
        iconRight={{
          icon: true,
          path: "",
        }}
        action={showDeleteModal}
      />

      <View className="  flex-row items-center  px-2   justify-between pb-2 border-b border-gray-600 w-full">
        <TouchableOpacity
          onPress={handleOpenClientList}
          className="flex-row items-center gap-2"
        >
          <Image
            source={require("@assets/images/logo.png")}
            className="w-[40px] h-[40px]"
            resizeMode="cover"
          />
          <Text className="text-base text-font-primary">Cliente:</Text>
          <Text className="text-base text-font-primary">{client?.name}</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-1 gap-2 mt-2 ">
        <Text className="text-app-theme-primary text-center font-bold text-xl">
          Itens
        </Text>
        <FlatList<ListItem>
          data={combinedItems}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={orderByIdRefetch}
            />
          }
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ gap: 10, maxHeight: "auto" }}
        />

        <View className="bg-background-tertiary p-5   rounded-md gap-2  ">
          <FlatList
            data={buttons}
            renderItem={renderButton}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 5 }}
          />
          <TouchableOpacity
            onPress={handleOpenPaymentMethodCheckbox}
            activeOpacity={0.8}
            className="flex-row justify-between mt-5"
          >
            <Text className="text-font-primary text-base">Forma de pagamento</Text>
            <View className="flex-row gap-2">
              <Text className="text-font-primary text-base">
                {paymentMethod?.name ? paymentMethod.name : "Dinheiro"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={22}
                color={colors["app-theme-primary"]}
              />
            </View>
          </TouchableOpacity>
          {paymentMethod?.card && (
            <TouchableOpacity
              onPress={handleOpenPaymentFlagCheckbox}
              activeOpacity={0.8}
              className="flex-row justify-between mt-5"
            >
              <Text className="text-font-primary text-base">Bandeira</Text>
              <View className="flex-row gap-2">
                <Text className="text-font-primary text-base">
                  {paymentCardFlag ? paymentCardFlag.name : "escolher bandeira"}
                </Text>
                <Ionicons
                  name="chevron-down"
                  size={22}
                  color={colors["app-theme-primary"]}
                />
              </View>
            </TouchableOpacity>
          {isInstallmentAllowed && (
            <>
              <View className="border-b border-gray-600"></View>
              <TouchableOpacity
                onPress={handleOpenInstallmentCheckbox}
                activeOpacity={0.8}
                className="flex-row justify-between"
              >
                <Text className="text-font-primary text-base">Parcela</Text>
                <View className="flex-row gap-2">
                  <Text className="text-font-primary text-base">
                    {installment === 0 ? "À vista" : `${installment}x`}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={22}
                    color={colors["app-theme-primary"]}
                  />
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View className="flex-row items-center justify-between border-t px-2 pt-2 border-gray-600 ">
          <Text className="text-xl text-font-primary">Valor total</Text>
          <TouchableOpacity
            onPress={() => handleOpenTotalModal()}
            activeOpacity={0.8}
          >
            <View className="flex-row p-5 rounded-md border-gray-600 gap-2 bg-background-tertiary">
              <Text className="text-xl text-font-primary">
                {moneyMapper(displayTotal)}
              </Text>
              <Feather name="edit" size={22} color={colors["app-theme-primary"]} />
            </View>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => onCloseOrder()}
          activeOpacity={0.8}
          className={`h-[40px] px-2 mx-10 bg-app-theme-primary rounded-md items-center justify-center 
                ${isLoadingMessage ? "justify-between" : ""}`}
        >
          <Text className="text-center text-xl text-font-secundary font-bold">
            {isLoadingMessage ? <ActivityIndicator /> : "Fechar comanda"}
          </Text>
        </TouchableOpacity>
      </View>

      <DeleteModal
        loading={isDeleting}
        visible={modalDeleteVisible}
        confirmationButtonText="Sim"
        confirmationButtonColor
        hideModal={hideDeleteModal}
        handleDelete={() => {
          if (!order.id) return;
          onDeleteOrder(order.id);
          hideDeleteModal();
        }}
        description="Tem certeza que deseja deletar a comanda"
        title="Deletar comanda"
      />
    </SafeAreaView>
  );
}

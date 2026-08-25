import { useCallback, useMemo, useState } from "react";
import { useOrderDetailsViewModel } from "./useOrderDetailsViewModel";
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
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
  icon: keyof typeof Ionicons.glyphMap;
};

const buttons: ButtonProps[] = [
  { id: "1", label: "Produto", icon: "cube-outline" },
  { id: "2", label: "Serviço", icon: "cut-outline" },
  { id: "4", label: "Desconto", icon: "pricetag-outline" },
  { id: "5", label: "Gorjeta", icon: "gift-outline" },
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

  // Cálculo do Sinal Pago e Saldo Restante
  const depositPaid = useMemo(() => {
    if (order?.totalDepositPaid && order.totalDepositPaid > 0) {
      return order.totalDepositPaid;
    }
    // Fallback calcula dos itens se não vier no objeto pai
    return (
      order?.items?.reduce((acc, item) => {
        if (item.requiresDeposit && item.depositAmount) {
          return acc + item.depositAmount;
        }
        return acc;
      }, 0) || 0
    );
  }, [order]);

  const remainingToPay = useMemo(() => {
    if (order?.remainingAmountToPay !== undefined && order.remainingAmountToPay >= 0) {
      return order.remainingAmountToPay;
    }
    const total = displayTotal || order?.total || 0;
    return Math.max(0, total - depositPaid);
  }, [order, displayTotal, depositPaid]);

  const renderButton = ({ item }: { item: ButtonProps }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedFilter(item.id);
        actions[item.id]?.();
      }}
      activeOpacity={0.85}
      className={`flex-row items-center gap-1.5 px-4 py-2.5 rounded-xl border mr-2.5 ${
        selectedFilter === item.id
          ? "bg-[#092D5D] border-[#092D5D]"
          : "bg-white border-slate-200 shadow-xs"
      }`}
    >
      <Ionicons
        name={item.icon}
        size={15}
        color={selectedFilter === item.id ? "#ffffff" : "#092D5D"}
      />
      <Text
        className={`text-xs font-bold ${
          selectedFilter === item.id ? "text-white" : "text-slate-800"
        }`}
      >
        + {item.label}
      </Text>
    </TouchableOpacity>
  );

  const renderService = useCallback(
    ({ item }: { item: OrderItemsInterface }) => (
      <View key={item.id} className="mb-2.5">
        {item.employeeName && item.serviceName && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() =>
              safePush(
                `/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${order.id}/service-item-details/${item.serviceId}`,
              )
            }
            className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs"
          >
            <View className="flex-row justify-between items-start mb-2">
              <View className="flex-1 pr-3">
                <Text className="text-slate-900 font-extrabold text-base mb-1">
                  {item.serviceName}
                </Text>
                <View className="flex-row items-center gap-1.5 mb-1">
                  <Ionicons name="time-outline" size={14} color="#092D5D" />
                  <Text className="text-slate-500 text-xs font-medium">
                    {formatIsoDateAndTimeToBR(item.dateScheduled)}
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="person-outline" size={14} color="#64748b" />
                  <Text className="text-slate-600 text-xs font-medium">
                    Profissional: <Text className="font-bold text-slate-900">{item.employeeName}</Text>
                  </Text>
                </View>
              </View>

              <View className="items-end">
                <Text className="text-[#092D5D] font-black text-lg">
                  {moneyMapper(item.servicePrice)}
                </Text>
                {item.usingSubscription === false && (
                  <View className="flex-row items-center gap-1 mt-1 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30">
                    <Ionicons name="diamond-outline" size={12} color="#d97706" />
                    <Text className="text-amber-700 text-[10px] font-bold">Assinante</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Tag do Sinal Pago no item de serviço */}
            {(item.requiresDeposit || Boolean(item.depositAmount)) && (
              <View className="mt-2.5 pt-2.5 border-t border-slate-100 flex-row items-center justify-between">
                <View className="flex-row items-center gap-1.5">
                  <Ionicons name="checkmark-circle" size={15} color="#10b981" />
                  <Text className="text-emerald-600 text-xs font-extrabold">
                    Sinal Pago via PIX
                  </Text>
                </View>
                <Text className="text-emerald-600 text-xs font-black">
                  - {moneyMapper(item.depositAmount || 0)}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      </View>
    ),
    [order?.id, formatIsoDateAndTimeToBR, safePush],
  );

  const renderProduct = useCallback(
    ({ item }: { item: OrderItemsInterface }) => (
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          safePush(
            `/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${order.id}/product-item-details/${item.productId}`,
          )
        }
        activeOpacity={0.85}
        className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs mb-2.5 flex-row justify-between items-center"
      >
        <View className="flex-1 pr-3">
          <Text className="text-slate-900 font-extrabold text-sm mb-1">
            {item.name}
          </Text>
          <Text className="text-slate-500 text-xs">
            Qtd: <Text className="font-bold text-slate-900">{item.quantity}</Text> × {moneyMapper(item.price)}
          </Text>
        </View>

        <Text className="text-[#092D5D] font-black text-base">
          {moneyMapper(item.price * item.quantity)}
        </Text>
      </TouchableOpacity>
    ),
    [order?.id, safePush],
  );

  const renderItem = ({ item }: { item: ListItem }) => {
    if (
      item.type === "header" &&
      ((item.title === "Serviços" && serviceItems.length > 0) ||
        (item.title === "Produtos" && productItems.length > 0))
    ) {
      return (
        <Text className="text-[#092D5D] font-black text-xs uppercase tracking-wider mt-3 mb-1.5 px-1">
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

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppAdminHeader
        title={`Comanda Nº ${order?.orderNumber || ""}`}
        iconRightName="trash"
        iconRight={{
          icon: true,
          path: "",
        }}
        action={showDeleteModal}
      />

      {/* Card Header do Cliente */}
      <View className="px-4 py-3.5 bg-white border-b border-slate-200 flex-row items-center justify-between shadow-xs">
        <TouchableOpacity
          onPress={handleOpenClientList}
          activeOpacity={0.8}
          className="flex-row items-center gap-3 flex-1"
        >
          <Image
            source={
              client?.profileUrl
                ? { uri: client.profileUrl }
                : require("@assets/images/logo.png")
            }
            style={{ width: 44, height: 44, borderRadius: 22 }}
            className="border border-slate-200"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
              Cliente da Comanda
            </Text>
            <Text className="text-slate-900 font-black text-base" numberOfLines={1}>
              {client?.name || "Selecionar Cliente"}
            </Text>
            {client?.phone ? (
              <Text className="text-slate-500 text-xs font-medium" numberOfLines={1}>
                {client.phone}
              </Text>
            ) : null}
          </View>
          <View className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 flex-row items-center gap-1">
            <Text className="text-xs text-[#092D5D] font-bold">Trocar</Text>
            <Ionicons name="swap-horizontal" size={14} color="#092D5D" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 140 }}
      >
        {/* Banner Destaque do Sinal Pago (PIX) */}
        {depositPaid > 0 && (
          <View className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 mb-4 shadow-xs">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="qr-code" size={20} color="#059669" />
                <Text className="text-emerald-950 font-black text-sm uppercase tracking-wide">
                  Sinal Pago via PIX
                </Text>
              </View>
              <View className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300">
                <Text className="text-emerald-800 font-black text-xs">Pago no Agendamento</Text>
              </View>
            </View>

            <View className="flex-row justify-between items-center pt-2.5 border-t border-emerald-200/60">
              <View>
                <Text className="text-slate-600 text-xs font-medium">Sinal Abatido:</Text>
                <Text className="text-emerald-700 font-black text-lg">
                  {moneyMapper(depositPaid)}
                </Text>
              </View>

              <View className="items-end">
                <Text className="text-slate-600 text-xs font-medium">Restante a Cobrar:</Text>
                <Text className="text-[#092D5D] font-black text-xl">
                  {moneyMapper(remainingToPay)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Bar de Adicionar Itens / Ações */}
        <View className="mb-3">
          <FlatList
            data={buttons}
            renderItem={renderButton}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>

        {/* Lista de Itens */}
        <Text className="text-slate-900 font-black text-sm uppercase tracking-wider mb-2">
          Itens da Comanda
        </Text>

        <FlatList<ListItem>
          data={combinedItems}
          scrollEnabled={false}
          refreshControl={
            <RefreshControl refreshing={isLoading} onRefresh={orderByIdRefetch} />
          }
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />

        {/* Configurações de Pagamento da Comanda */}
        <View className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs gap-3">
          <Text className="text-slate-400 text-xs font-extrabold uppercase tracking-wider mb-1">
            Opções de Pagamento
          </Text>

          <TouchableOpacity
            onPress={handleOpenPaymentMethodCheckbox}
            activeOpacity={0.8}
            className="flex-row justify-between items-center py-1"
          >
            <Text className="text-slate-600 text-sm font-semibold">Forma de pagamento</Text>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-slate-900 font-extrabold text-sm">
                {paymentMethod?.name ? paymentMethod.name : "Dinheiro"}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#092D5D" />
            </View>
          </TouchableOpacity>

          {paymentMethod?.card && (
            <TouchableOpacity
              onPress={handleOpenPaymentFlagCheckbox}
              activeOpacity={0.8}
              className="flex-row justify-between items-center py-1 border-t border-slate-100 pt-3"
            >
              <Text className="text-slate-600 text-sm font-semibold">Bandeira</Text>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-slate-900 font-extrabold text-sm">
                  {paymentCardFlag ? paymentCardFlag.name : "Escolher bandeira"}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#092D5D" />
              </View>
            </TouchableOpacity>
          )}

          {isInstallmentAllowed && (
            <TouchableOpacity
              onPress={handleOpenInstallmentCheckbox}
              activeOpacity={0.8}
              className="flex-row justify-between items-center py-1 border-t border-slate-100 pt-3"
            >
              <Text className="text-slate-600 text-sm font-semibold">Parcelamento</Text>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-slate-900 font-extrabold text-sm">
                  {installment === 0 ? "À vista" : `${installment}x`}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#092D5D" />
              </View>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Footer Fixo: Total e Fechar Comanda */}
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 border-t border-slate-200 gap-3.5 shadow-lg">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-slate-400 text-xs font-bold uppercase">
              {depositPaid > 0 ? "Saldo Restante a Cobrar" : "Valor Total"}
            </Text>
            <Text className="text-[#092D5D] text-2xl font-black">
              {moneyMapper(depositPaid > 0 ? remainingToPay : displayTotal)}
            </Text>
            {depositPaid > 0 && (
              <Text className="text-emerald-600 text-[10px] font-bold">
                (Total: {moneyMapper(displayTotal)} - Sinal: {moneyMapper(depositPaid)})
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => handleOpenTotalModal()}
            activeOpacity={0.8}
            className="p-2.5 rounded-xl bg-slate-100 border border-slate-200 flex-row items-center gap-1.5"
          >
            <Text className="text-slate-700 text-xs font-bold">Editar Total</Text>
            <Feather name="edit" size={14} color="#092D5D" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => onCloseOrder()}
          activeOpacity={0.85}
          className="h-16 bg-[#092D5D] border border-[#092D5D] rounded-2xl items-center justify-center shadow-md"
        >
          <Text className="text-center text-lg text-white font-extrabold uppercase tracking-wide">
            {isLoadingMessage ? <ActivityIndicator color="#ffffff" size="large" /> : "Fechar Comanda"}
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
          if (!order?.id) return;
          onDeleteOrder(order.id);
          hideDeleteModal();
        }}
        description="Tem certeza que deseja deletar esta comanda?"
        title="Deletar Comanda"
      />
    </SafeAreaView>
  );
}

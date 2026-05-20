import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import {
  ESubscriptionState,
  StripePlanDTO,
  UserSubscriptionDTO,
} from "@/shared/interfaces/http/stripe";
import { colors } from "@/styles/colors";
import { moneyMapper } from "@/utils/moneyMapper";
import { Ionicons } from "@expo/vector-icons";
import { useCallback, useMemo } from "react";
import {
  FlatList,
  Image,
  Linking,
  RefreshControl,
  Text,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { DeleteModal } from "../AppDeleteModal";
import { AppEmptyList } from "../AppEmptyList";
import { Loading } from "../Loading";

export interface AppSubscriptionCardProps<T> {
  loading: boolean;
  data: T[];
  handleSubscribe?: (priceId: string) => Promise<void>;
  refetch: () => Promise<void>;
  isActive?: StripePlanDTO;
  isClient?: boolean;
  cancelSubscrtipion?: () => Promise<void>;
  updateSubscription?: (priceId: string) => Promise<void>;
  reactSubscription?: () => Promise<void>;
  cancelAtPeriodEnd?: boolean;
  setIsCanceling?: (isCanceling: boolean) => void;
  isCanceling?: boolean;
  setIsUpdating?: (isUpdating: boolean) => void;
  isUpdating?: boolean;
  isReactivating?: boolean;
  setIsReactivating?: (isReactivating: boolean) => void;
  isCreating?: boolean;
  setIsCreating?: (isCreating: boolean) => void;
  isCancelModalVisible?: boolean;
  toggleCancelModal?: () => void;
  isUpdateModalVisible?: boolean;
  toggleUpdateModal?: () => void;
  isCreateModalVisible?: boolean;
  isReactivatingModalVisible?: boolean;
  toggleCreateModal?: () => void;
  toggleReactivateModal?: () => void;
  toggleHideModal?: () => void;
  priceId?: string;
  subscriptionStatus?: string;
  setPriceId?: (priceId: string) => void;
  mySubscription?: UserSubscriptionDTO | null;
}

export function AppSubscriptionCard<T extends StripePlanDTO>({
  data,
  handleSubscribe,
  loading,
  cancelAtPeriodEnd,
  cancelSubscrtipion,
  updateSubscription,
  reactSubscription,
  refetch,
  isClient,
  isActive,
  setIsCanceling,
  isCanceling,
  setIsUpdating,
  isUpdating,
  isReactivating,
  setIsReactivating,
  isCreating,
  setIsCreating,
  isCancelModalVisible,
  toggleCancelModal,
  isUpdateModalVisible,
  toggleUpdateModal,
  isCreateModalVisible,
  toggleCreateModal,
  toggleHideModal,
  toggleReactivateModal,
  isReactivatingModalVisible,
  priceId,
  mySubscription,
  subscriptionStatus,
  setPriceId,
}: AppSubscriptionCardProps<T>) {
  const { safePush } = useSafeNavigation();

  const appTermUrl =
    "https://dom-palagani.notion.site/Pol-tica-de-Privacidade-Dom-Palagani-Barber-2f5522fee97c80c2a85dd2049901538d";
  const subscriptionDpUrl =
    "https://www.notion.so/dom-palagani/Termo-De-Aceite-da-D-P-Clube-333522fee97c80b990ddca024160b7bf";

  function getSubscriptionStatusConfig(status?: ESubscriptionState) {
    switch (status) {
      case ESubscriptionState.ACTIVE:
        return {
          label: "Ativa",
          badge: "bg-green-500/15",
          text: "text-green-400",
        };

      case ESubscriptionState.PAST_DUE:
        return {
          label: "Falha no pagamento",
          badge: "bg-red-500/15",
          text: "text-red-400",
        };

      case ESubscriptionState.PENDING:
        return {
          label: "Pendente",
          badge: "bg-yellow-500/15",
          text: "text-yellow-400",
        };

      case ESubscriptionState.CANCELED:
        return {
          label: "Cancelada",
          badge: "bg-zinc-500/15",
          text: "text-zinc-300",
        };

      case ESubscriptionState.CANCEL_SCHEDULED:
        return {
          label: "Cancelamento agendado",
          badge: "bg-orange-500/15",
          text: "text-orange-400",
        };

      case ESubscriptionState.DEACTIVATED:
        return {
          label: "Desativada",
          badge: "bg-zinc-600/20",
          text: "text-zinc-400",
        };

      case ESubscriptionState.RENOVATED:
        return {
          label: "Renovada",
          badge: "bg-blue-500/15",
          text: "text-blue-400",
        };

      case ESubscriptionState.EXPIRED:
        return {
          label: "Expirada",
          badge: "bg-purple-500/15",
          text: "text-purple-400",
        };

      default:
        return {
          label: "Desconhecido",
          badge: "bg-white/10",
          text: "text-font-primary",
        };
    }
  }

  const status = getSubscriptionStatusConfig(mySubscription?.status);

  const sortedData = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      const isAActive = mySubscription?.priceId === a.priceId;
      const isBActive = mySubscription?.priceId === b.priceId;

      if (isAActive) return -1;
      if (isBActive) return 1;

      return 0;
    });
  }, [data, mySubscription]);
  const renderItem = useCallback(
    ({ item }: { item: T }) => {
      if (!item?.priceId || typeof item.amount !== "number") return null;

      const isMyPlan = mySubscription?.priceId === item.priceId;
      const myPlanStatus = mySubscription?.status;
      const isPlanActive =
        isMyPlan && myPlanStatus === ESubscriptionState.ACTIVE;
      const isCancelled = myPlanStatus === ESubscriptionState.CANCELED;
      const isActive = myPlanStatus === ESubscriptionState.ACTIVE;

      const isCancelScheduled = isMyPlan && cancelAtPeriodEnd;
      const hasNoValidSubscription =
        !mySubscription ||
        isCancelled ||
        myPlanStatus === ESubscriptionState.EXPIRED ||
        myPlanStatus === ESubscriptionState.DEACTIVATED ||
        myPlanStatus === ESubscriptionState.PENDING;

      // =========================
      // ADMIN (não cliente)
      // =========================
      if (!isClient) {
        return (
          <TouchableOpacity
            onPress={() =>
              !isClient
                ? safePush(`/(private)/(crud)/subscriptions/${item.id}`)
                : undefined
            }
            className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4"
          >
            <View className="flex-row gap-2 items-center justify-between">
              <Image
                source={require("@assets/images/logo.png")}
                className="w-[60px] h-[60px]"
                resizeMode="cover"
              />
              <View>
                <Text
                  className="text-font-primary text-base max-w-[220px] font-bold"
                  numberOfLines={4}
                >
                  {item.name}
                </Text>
                <Text className="text-gray-500">
                  Barberia Dom Palagani Assinatura
                </Text>
              </View>
              <View>
                <Ionicons
                  name="chevron-forward"
                  color={colors.white}
                  size={22}
                />
              </View>
            </View>
          </TouchableOpacity>
        );
      }
      // =========================
      // CLIENTE SEM PLANO OU PLANO CANCELADO
      // =========================

      if (hasNoValidSubscription) {
        return (
          <View className="mt-4 mx-2 rounded-2xl bg-orange-500/10 border border-orange-500/20 p-4">
            <View className=" py-2 items-center justify-center">
              <Image
                source={require("@assets/images/logo.png")}
                className="w-[60px] h-[60px]"
                resizeMode="cover"
              />
            </View>
            <Text className="text-sm font-bold text-font-primary max-w-[220x]" numberOfLines={4}>
              {item.name}
            </Text>
            <Text className="mt-1 text-zinc-300">
              R$ {moneyMapper(item.amount)} / mês
            </Text>
            <TouchableOpacity
              onPress={() =>
                safePush(
                  `/(private)/(tabs)/subscription/subscriptions/${item.id}`,
                )
              }
            >
              <View className="shrink-0 rounded-full px-3 py-1">
                <Text className="text-blue-500 underline ">
                  Ver benefícios do plano
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setPriceId?.(item.priceId);
                toggleCreateModal?.();
              }}
              className="mt-2 rounded-2xl border border-white/10 bg-white/5 py-2"
            >
              <Text className="text-sm font-bold text-app-theme-primary text-center">
                Assinar agora
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      // =========================
      // PLANO ATIVO ATUAL
      // =========================
      if (isPlanActive && isMyPlan && !isCancelScheduled) {
        return (
          <View className="mt-4  mx-2 rounded-2xl border border-green-500/20 bg-green-500/10 p-4">
            <Text className="text-sm font-bold text-font-primary max-w-[220px] "  numberOfLines={4}>
              {item.name}
            </Text>
            <Text className="mt-1 text-zinc-300">
              R$ {moneyMapper(item.amount)} / mês
            </Text>
            <Text className="text-sm font-bold text-font-primary">Plano atual</Text>
            <TouchableOpacity
              onPress={() =>
                safePush(
                  `/(private)/(tabs)/subscription/subscriptions/${item.id}`,
                )
              }
            >
              <View className="shrink-0 rounded-full py-1">
                <Text className="text-blue-500 underline ">
                  Ver benefícios do plano
                </Text>
              </View>
            </TouchableOpacity>
            <View className={`shrink-0 rounded-full px-3 py-2 ${status.badge}`}>
              <Text className={`text-xs text-center font-bold ${status.text}`}>
                {status.label}
              </Text>
            </View>

            <TouchableOpacity
              className="mt-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-2"
              onPress={() => toggleCancelModal?.()}
            >
              <Text className="text-sm font-bold text-red-400 text-center">
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      // =========================
      // PLANO CANCELADO (CANCEL_AT_PERIOD_END)
      // =========================
      if (isMyPlan && isCancelScheduled) {
        return (
          <View className="mt-4 mx-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-4">
            <Text
              className="text-center text-sm font-bold text-font-primary"
              numberOfLines={2}
            >
              {item.name}
            </Text>
            <Text className="text-center text-sm font-bold text-font-primary">
              Cancelamento agendado
            </Text>
            <Text className="mt-2 text-center text-xs leading-5 text-zinc-300">
              Sua assinatura será encerrada no final do período.
            </Text>
            <TouchableOpacity
              className="mt-2 rounded-2xl border border-white/10 bg-white/5 py-2"
              onPress={() => toggleReactivateModal?.()}
            >
              <Text className="text-sm font-bold text-orange-400 text-center">
                Reativar assinatura
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      // =========================
      // OUTROS PLANOS DISPONÍVEIS (UPGRADE)
      // =========================
      if (!isMyPlan && item.priceId && isActive && !isCancelled) {
        return (
          <View className="mt-4 mx-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4">
            <Text className="text-sm font-bold text-font-primary max-w-[220px]"
            numberOfLines={4}>{item.name}</Text>
            <Text className="mt-1 text-zinc-300">
              R$ {moneyMapper(item.amount)} / mês
            </Text>
            <TouchableOpacity
              className="mt-2 rounded-2xl border border-blue-500/20 bg-blue-500/10 py-2"
              onPress={() => {
                setPriceId?.(item.priceId);
                toggleUpdateModal?.();
              }}
            >
              <Text className="text-sm font-bold text-blue-400 text-center">
                Atualizar
              </Text>
            </TouchableOpacity>
          </View>
        );
      }

      return null;
    },
    [
      isClient,
      mySubscription,
      cancelAtPeriodEnd,
      toggleCancelModal,
      toggleUpdateModal,
      toggleCreateModal,
      toggleReactivateModal,
      setPriceId,
    ],
  );
  return (
    <>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 10,
          flexGrow: data.length === 0 ? 1 : 0,
          paddingHorizontal: 2,
          borderRadius: 10,
        }}
        data={sortedData}
        keyExtractor={(item, index) =>
          item?.id ? String(item.id) : `fallback-${index}`
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        initialNumToRender={5}
        maxToRenderPerBatch={10}
        ListEmptyComponent={
          loading ? (
            <Loading />
          ) : (
            <AppEmptyList
              iconName="cut-outline"
              title="Lista vazia"
              description="Nenhum plano de assinatura encontrado."
            />
          )
        }
      />
      <DeleteModal
        loading={isCanceling}
        visible={isCancelModalVisible}
        confirmationButtonText="Sim, cancelar assinatura"
        hideModal={toggleHideModal}
        handleDelete={() => {
          cancelSubscrtipion?.();
          toggleHideModal?.();
        }}
        description="Tem certeza que deseja cancelar sua assinatura? Você continuará tendo acesso aos benefícios até o final do período pago."
        title="Cancelar assinatura"
      />
      <DeleteModal
        loading={isReactivating}
        visible={isReactivatingModalVisible}
        confirmationButtonText="Sim, reativar assinatura"
        confirmationButtonColor
        hideModal={toggleHideModal}
        handleDelete={() => {
          reactSubscription?.();
          toggleHideModal?.();
        }}
        description="Tem certeza que deseja reativar sua assinatura? a cobrança da fatura atual será realizada."
        title="Reativar assinatura"
      />
      <DeleteModal
        loading={isCreating}
        visible={isCreateModalVisible}
        confirmationButtonText="Seguir para o pagamento"
        confirmationButtonColor
        hideModal={toggleHideModal}
        handleDelete={() => {
          if (!priceId) return;
          handleSubscribe?.(priceId);
          toggleHideModal?.();
        }}
        description={
          <Text className="text-gray-500 text-center text-sm leading-8">
            Ao adquirir esta assinatura, você declara estar de acordo com os{" "}
            <Text
              className="font-bold text-sm  text-font-primary underline"
              onPress={() => Linking.openURL(appTermUrl)}
            >
              Termos de Assinatura{" "}
            </Text>
            e com os{" "}
            <Text
              className="  text-sm font-bold text-font-primary underline"
              onPress={() => Linking.openURL(subscriptionDpUrl)}
            >
              Termos de Uso do Aplicativo
            </Text>
          </Text>
        }
        title="Adquirir assinatura"
      />
      <DeleteModal
        loading={isUpdating}
        visible={isUpdateModalVisible}
        confirmationButtonText="Atualizar plano"
        confirmationButtonColor
        hideModal={toggleHideModal}
        handleDelete={() => {
          if (!priceId) return;
          updateSubscription?.(priceId);
          toggleHideModal?.();
        }}
        description="Tem certeza que deseja atualizar seu plano de assinatura?"
        title="Atualizar plano de assinatura"
      />
    </>
  );
}

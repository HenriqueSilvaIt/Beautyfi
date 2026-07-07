import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import {
  EOrderStatus,
  OrderHttpResponse,
  OrderInterface,
} from "@/shared/interfaces/http/order";
import { moneyMapper } from "@/utils/moneyMapper";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppEmptyList } from "../AppEmptyList";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

interface AppOrderCardProps {
  data: OrderInterface[];
  formatIsoDateAndTimeToBR: (iso: string) => string;
  refreshing: boolean;
  onRefresh: () => void;
  orderIsRefetching?: boolean;
  orderIsLoading?: boolean;
  orderIsFetchingNextPage?: boolean;
  orderFetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<OrderHttpResponse, unknown>, Error>
  >;
  orderHasNextPage: boolean;
  getOrderTotal: (order: OrderInterface) => any;
}

export function AppOrderCard({
  data,
  formatIsoDateAndTimeToBR,
  refreshing,
  onRefresh,
  orderIsRefetching,
  orderIsFetchingNextPage,
  orderFetchNextPage,
  getOrderTotal,
  orderHasNextPage,
}: AppOrderCardProps) {
  const { safePush } = useSafeNavigation();

  const renderItem = useCallback(
    ({ item, index }: { item: OrderInterface; index: number }) => (
      <TouchableOpacity
        onPress={() =>
          safePush(`/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${item.id}`)
        }
        activeOpacity={0.8}
      >
        <View
          className="flex-row justify-between items-center p-5 rounded-md w-full"
        >
          <View className="flex-1 pr-3">
            {item.orderNumber && (
              <Text className="text-font-primary text-sm font-semibold">
                Nº {item.orderNumber}
              </Text>
            )}
            <Text className="text-font-primary   text-sm">Valor:</Text>
            {item.user?.id && (
              <Text
                className="text-font-primary text-sm"
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                Cliente: {item.user.name}
              </Text>
            )}
          </View>
          <View className="items-end max-w-[45%]">
            {item.moment && (
              <Text className="text-font-primary text-sm">
                {formatIsoDateAndTimeToBR(item.moment)}
              </Text>
            )}
            {item.status && (
              <Text className="text-app-theme-primary font-bold text-base">
                R$ {moneyMapper(getOrderTotal(item))}
              </Text>
            )}
            {item.employee?.name && (
              <Text
                className="text-gray-500  text-sm"
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                Profissional criador: {item.employee?.name}
              </Text>
            )}
            {item.status && (
              <View
                className={`rounded-full gap-2 px-3    mt-2 bg-blue-500/20`}
              >
                <Text className={`text-sm  text-font-primary`}>
                  {item.  status === "OPEN" ? "Aberta" : ""}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={{
        borderRadius: 10,
        borderColor: "#AEAEAE",
      }}
      data={data}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      renderItem={renderItem}
      keyExtractor={(item) => item?.id.toString() ?? ""}
      initialNumToRender={10}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
      refreshing={orderIsRefetching}
      onEndReached={() => {
        if (orderHasNextPage && !orderIsFetchingNextPage) {
          orderFetchNextPage();
        }
      }}
      ListFooterComponent={
        orderIsFetchingNextPage ? <ActivityIndicator /> : null
      }
      ItemSeparatorComponent={() => (
        <View className="border-b border-accent-brand-background-primary mx-5" />
      )}
      ListEmptyComponent={
        <AppEmptyList
          title="Comandas"
          description="Não há comandas em aberto"
          iconName="receipt-outline"
        />
      }
    />
  );
}

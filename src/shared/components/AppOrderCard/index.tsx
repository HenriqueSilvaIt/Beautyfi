import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import {
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
    ({ item }: { item: OrderInterface; index: number }) => (
      <TouchableOpacity
        onPress={() =>
          safePush(`/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${item.id}`)
        }
        activeOpacity={0.8}
      >
        <View
          className="flex-row justify-between items-center p-5 rounded-xl w-full bg-white mb-3 border border-gray-100 shadow-sm"
        >
          <View className="flex-1 pr-3">
            {item.orderNumber && (
              <Text className="text-font-primary text-sm font-bold">
                Comanda Nº {item.orderNumber}
              </Text>
            )}
            <Text className="text-gray-400 text-xs mt-1">Valor Total:</Text>
            <Text className="text-accent-orange font-bold text-lg mt-0.5">
              R$ {moneyMapper(getOrderTotal(item))}
            </Text>
            {item.user?.name && (
              <Text
                className="text-gray-500 text-xs mt-2"
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                Cliente: {item.user.name}
              </Text>
            )}
          </View>

          <View className="items-end max-w-[48%] justify-between h-full">
            {item.moment && (
              <Text className="text-gray-400 text-xs">
                {formatIsoDateAndTimeToBR(item.moment)}
              </Text>
            )}

            {item.employee?.name && (
              <Text
                className="text-gray-500 text-xs text-right mt-1"
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                Por: {item.employee?.name}
              </Text>
            )}

            {item.status && (
              <View
                className={`rounded-full px-3 py-1 mt-2 self-end ${
                  item.status === "OPEN" ? "bg-green-500/10" : "bg-red-500/10"
                }`}
              >
                <Text className={`text-xs font-semibold ${
                  item.status === "OPEN" ? "text-green-600" : "text-red-500"
                }`}>
                  {item.status === "OPEN" ? "Aberta" : "Fechada"}
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
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 80,
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
      ListEmptyComponent={
        <AppEmptyList
          title="Comandas"
          description="Nenhuma comanda encontrada para os filtros selecionados"
          iconName="receipt-outline"
        />
      }
    />
  );
}

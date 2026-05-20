import { SafeAreaView } from "react-native-safe-area-context";
import { useOrderViewModel } from "./useOrderViewModel";
import { AppOrderCard } from "@/shared/components/AppOrderCard";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { Text, TouchableOpacity, View } from "react-native";

export function OrderView({
  orderDataPagged,
  safePush,
  orderRefetch,
  orderIsRefetching,
  orderIsLoading,
  orderIsFetchingNextPage,
  orderFetchNextPage,
  getOrderTotal,
  orderHasNextPage,
  formatIsoDateAndTimeToBR,
}: ReturnType<typeof useOrderViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader title="Comandas" iconRight={{ icon: false, path: "" }} />

      <AppOrderCard
        data={orderDataPagged}
          getOrderTotal={getOrderTotal}
        formatIsoDateAndTimeToBR={formatIsoDateAndTimeToBR}
        refreshing={orderIsLoading}
        onRefresh={orderRefetch}
        orderIsRefetching={orderIsRefetching}
        orderIsLoading={orderIsLoading}
        orderIsFetchingNextPage={orderIsFetchingNextPage}
        orderHasNextPage={orderHasNextPage}
        orderFetchNextPage={orderFetchNextPage}
      />
      <View className="absolute right-4 bottom-10">
        <TouchableOpacity
          activeOpacity={0.8}
          className="w-[60px] h-[60px] rounded-full bg-background-tertiary justify-center items-center shadow"
          onPress={() => safePush("/(private)/(tabs)/(admin-tabs)/finance/order/new-order")}
        >
          <Text className="text-font-primary text-3xl">+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

import { SafeAreaView } from "react-native-safe-area-context";
import { useSubscriptionDetailsViewModel } from "./useSubscriptionViewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { ActivityIndicator, FlatList, Image, View } from "react-native";
import { Text } from "react-native";
import { EmptyInvoiceList } from "../../Invoice/InvoiceList/components/EmptyInvoiceList";
import { AppEmptyList } from "@/shared/components/AppEmptyList";
import { AppPlanItemCard } from "@/shared/components/AppPlanItemCard";

export function SubscriptionDetailsView({
  planData,
  plantItemsPagged,
  planItemsRefetch,
  planItemsError,
  planItemsIsRefetching,
  fetchNextPlanItemsPage,
  planItemsIsFetchingNextPage,
  hasNextPlanItemsPage,
  planItemsIsLoading,
}: ReturnType<typeof useSubscriptionDetailsViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-background-primary ">
      <AppAdminHeader
        title="Items de Assinatura"
        iconRight={{
          icon: false,
          path: "",
        }}
      />

      <View className="p-4 bg-background-tertiary rounded-lg m-4">
        {planData && (
          <View className="flex-row items-center gap-2 px-2">
            <Image
              className="h-[40px] w-[40px]"
              source={require("@assets/images/logo.png")}
            />
            <View className="flex-1 border-gray-700 border-b pb-2">
              <Text
                className="text-base text-font-primary font-bold mb-2"
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                {planData.name}
              </Text>
              <Text
                className="text-gray-600 mb-2"
                ellipsizeMode="tail"
                numberOfLines={3}
              >
                {planData.description}
              </Text>
            </View>
          </View>
        )}

        <View className="mt-4 gap-2">
          <Text className="text-font-primary text-base font-semibold text-start">
            Itens do plano
          </Text>
 <AppPlanItemCard 
            plantItemsPagged={plantItemsPagged}
            onRefetch={planItemsRefetch}
            hasNextPage={hasNextPlanItemsPage}
            isFetchingNextPage={planItemsIsFetchingNextPage}
            isLoading={planItemsIsLoading}
            isRefetching={planItemsIsRefetching}
            fetchNextPage={fetchNextPlanItemsPage}
        />
        </View>
      </View>
    </SafeAreaView>
  );
}
       

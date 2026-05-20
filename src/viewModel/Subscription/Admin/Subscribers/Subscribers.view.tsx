import { SafeAreaView } from "react-native-safe-area-context";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { ActivityIndicator, FlatList } from "react-native";
import { useSubscribersViewModel } from "./useSubscribersViewModel";
import { SubscribersEmptyList } from "./components/SubscribersEmptyList";
import { SubscriberCard } from "./components/SubscriberCard";

export function SubscribersView({
  subscribersMock,
  subscribers,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  setSubscriber,
  refetch,
  isRefetching,
}: ReturnType<typeof useSubscribersViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Assinantes"
        leftIconShown={false}
        iconRight={{
          icon: false,
          path: "",
        }}
      />

      <FlatList
        data={subscribers}
        keyExtractor={(item) => item.customerId}
        renderItem={({ item }) => <SubscriberCard subscriber={item} setSubscriber={setSubscriber} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListEmptyComponent={<SubscribersEmptyList />}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        contentContainerStyle={{
          paddingVertical: 16,
          flexGrow: subscribers.length === 0 ? 1 : 0,
        }}
      />
    </SafeAreaView>
  );
}

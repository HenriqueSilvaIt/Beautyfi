import { SafeAreaView } from "react-native-safe-area-context";
import { useInvoiceListViewModel } from "./useInvoiceListViewModel";
import { FlatList } from "react-native";
import { InvoiceCard } from "./components/InvoiceCard";
import { ActivityIndicator } from "react-native";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { EmptyInvoiceList } from "./components/EmptyInvoiceList";
import { Loading } from "@/shared/components/Loading";
import { useUserStore } from "@/shared/store/user-store";

export function InvoiceListView({
  fetchNextPage,
  invoices,
  invoicesListMock,
  hasNextPage,
  isFetchingNextPage,
  subscriber,
  setSubscriber,
  isLoading,
  refetch,
  isRefetching,
}: ReturnType<typeof useInvoiceListViewModel>) {
  if (isLoading) {
    return <Loading />;
  }
  const { user } = useUserStore();

  const isAdmin =
    user?.roles?.some(
      (role) =>
        role.authority === "ROLE_ADMIN" || role.authority === "ROLE_MODERATOR",
    ) ?? false;

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {isAdmin ? (
        <AppAdminHeader
          customPath="/(private)/(tabs)/(admin-tabs)"
          title="Faturas"
          iconRight={{
            icon: false,
            path: "",
          }}
        />
      ) : (
        <AppAdminHeader
          title="Faturas"
          iconRight={{
            icon: false,
            path: "",
          }}
        />
      )}

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <InvoiceCard invoice={item} setSubscriber={setSubscriber} />
        )}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyInvoiceList />}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={refetch}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        contentContainerStyle={{
          paddingVertical: 16,
          flexGrow: invoices.length === 0 ? 1 : 0,
        }}
      />
    </SafeAreaView>
  );
}

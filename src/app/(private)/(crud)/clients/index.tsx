import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { Loading } from "@/shared/components/Loading";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { useClientViewModel } from "@/viewModel/Admin/Clients/useClientViewModel";
import { AppInput } from "@/shared/components/AppInput";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClientPageList() {
  const {
    clientRefetch,
    clientDataPagged,
    clientIsRefetching,
    clientIsLoading,
    clientHasNextPage,
    clientFetchNextPage,
    clientIsFetchingNextPage,
    isLoading,
    searchValue,
    setSearchValue,
  } = useClientViewModel(undefined);

  if (isLoading) {
    return <Loading />;
  }
  const {safePush} = useSafeNavigation()

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Clientes"
        iconRightName="add"
        action={() => safePush(`/clients/client-create`)}
        iconRight={{ icon: true, path: "/clients/client-create" }}
      />
      <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
        <AppInput
          placeholder="Buscar cliente por nome..."
          leftIcon="search"
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
      <AppCard
        data={clientDataPagged
          .filter((c) => c.id !== undefined)
          .map((c) => ({
            id: c.id!,
            title: c.name,
            imgUrl: c.profileUrl,
            phone: c.phone,
          }))}
        onItemPress={(item) => {
          router.push({
            pathname: "/(private)/(crud)/clients/[id]",
            params: { id: item.id, from: "agenda" },
          });
        }}
        path="/clients/"
        isRefetching={clientIsRefetching}
        fetchNextPage={clientFetchNextPage}
        hasNextPage={clientHasNextPage}
        isFetchingNextPage={clientIsFetchingNextPage}
        onRefetch={clientRefetch}
      />
    </SafeAreaView>
  );
}

import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { useClientViewModel } from "@/viewModel/Admin/Clients/useClientViewModel";
import { router, useLocalSearchParams } from "expo-router";
import { View } from "react-native";

export default function ClientPageList() {
  const {    clientRefetch,
    clientDataPagged,
    clientIsRefetching,
    clientIsLoading,
    clientHasNextPage,
    clientFetchNextPage,
    clientIsFetchingNextPage,
    isLoading,} =
    useClientViewModel(undefined);
  const { safePush } = useSafeNavigation();

  return (
    <View className="flex-1 bg-background-primary">
      <KeyboardContainer>
        <View className="flex-1 bg-background-primary">
          <AppAdminHeader
            title="Clientes"
            iconRightName="add"
            leftIconShown
            action={() => safePush(`/clients/client-create`)}
            iconRight={{ icon: true, path: "/clients/client-create" }}
          />
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
        </View>
      </KeyboardContainer>
    </View>
  );
}

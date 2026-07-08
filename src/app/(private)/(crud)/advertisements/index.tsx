import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useAdvertisementViewModel } from "@/viewModel/Admin/Advertisements/useAdvertisementViewModel";
import { AppInput } from "@/shared/components/AppInput";
import { router } from "expo-router";
import { View } from "react-native";

export default function AdvertisementPageList() {
  const {
    adversetmentPagged,
    advertisementIsLoading,
    advertisementRefetch,
    advertisementIsFetchingNextPage,
    advertisementHasNextPage,
    advertisementFetchNextPage,
    advertisementIsRefetching,
    isRefreshing,
    searchValue,
    setSearchValue,
  } = useAdvertisementViewModel(undefined);

  const {safePush} = useSafeNavigation()
  return (
    <View className="flex-1  bg-background-primary  ">
      <KeyboardContainer>
        <View className="flex-1 bg-background-primary">
          <AppAdminHeader
            title="Selecione a imagem"
            iconRightName="add"
            action={() => safePush(`/advertisements/advertisement-create`)}
            iconRight={{
              icon: true,
              path: "/advertisements/advertisement-create",
            }}
          />
          <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
            <AppInput
              placeholder="Buscar anúncio por nome..."
              leftIcon="search"
              value={searchValue}
              onChangeText={setSearchValue}
            />
          </View>
          <AppCard
            data={adversetmentPagged.map((s) => ({
              id: s.id,
              title: s.title ?? "",
              description: s.description,
              imgUrl: s.imgUrl,
              url: s.url,
            }))}
            onItemPress={(item) => {
              router.push({
                pathname: "/(private)/(crud)/advertisements/[id]",
                params: { id: item.id, from: "agenda" },
              });
            }}
            path="/advertisements/"
            isRefetching={advertisementIsRefetching}
            hasNextPage={advertisementHasNextPage}
            fetchNextPage={advertisementFetchNextPage}
            onRefetch={advertisementRefetch}
            isFetchingNextPage={advertisementIsFetchingNextPage}
          />
        </View>
      </KeyboardContainer>
    </View>
  );
}

import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { Loading } from "@/shared/components/Loading";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useServiceViewModel } from "@/viewModel/Admin/Services/userServiceViewModel";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppInput } from "@/shared/components/AppInput";
import { View } from "react-native";

export default function ServicePageList() {
  const {
    serviceDataPagged,
    serviceRefetch,
    serviceIsFetchingNextPage,
    serviceHasNextPage,
    serviceFetchNextPage,
    serviceIsRefetching,
    isLoading,
    searchValue,
    setSearchValue,
  } = useServiceViewModel(undefined);

  if (isLoading) {
    return <Loading />;
  }
  const {safePush} = useSafeNavigation()

  return (
    <SafeAreaView className="flex-1  bg-background-primary  ">
      <AppAdminHeader
        title="Selecione o serviço"
        iconRightName="add"
        action={() => safePush(`/services/service-create`)}
        iconRight={{ icon: true, path: "/services/service-create" }}
      />
      <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
        <AppInput
          placeholder="Buscar serviço por nome..."
          leftIcon="search"
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
      <AppCard
        data={serviceDataPagged.map((s) => ({
          id: s.id,
          title: s.name,
          description: s.description,
          imgUrl: s.imgUrl,
          price: s.price,
        }))}
        onItemPress={(item) => {
          router.push({
            pathname: "/(private)/(crud)/services/[id]",
            params: { id: item.id, from: "agenda" },
          });
        }}
        path="/services/"
        isRefetching={serviceIsRefetching}
        fetchNextPage={serviceFetchNextPage}
        hasNextPage={serviceHasNextPage}
        isFetchingNextPage={serviceIsFetchingNextPage}
        onRefetch={serviceRefetch}
      />
    </SafeAreaView>
  );
}

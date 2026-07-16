import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { usePackageViewModel } from "@/viewModel/Admin/Packages/usePackageViewModel";
import { AppInput } from "@/shared/components/AppInput";
import { View } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppSearchBar } from "@/shared/components/AppSearchBar";

export default function PackagePageList() {
  const {
    packages,
    packagesIsLoading,
    packageRefetch,
    packageFetchNextPage,
    packageHasNextPage,
    packageIsFetchingNextPage,
    packageIsRefetching,
    searchValue,
    setSearchValue,
  } = usePackageViewModel(undefined);

  const { safePush } = useSafeNavigation();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Selecione o pacote"
        iconRightName="add"
        action={() => safePush(`/packages/package-create`)}
        iconRight={{ icon: true, path: "/packages/package-create" }}
      />
      <View className="px-4 mb-4">
  
        <AppSearchBar
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Buscar pacote por nome..."
        />
      </View>
      <AppCard
        data={packages.map((p) => ({
          id: p.id,
          title: p.name,
          description: p.description,
          imgUrl: p.imgUrl,
          price: Number(p.price),
        }))}
        onItemPress={(item) => {
          router.push({
            pathname: "/(private)/(crud)/packages/[id]",
            params: { id: item.id },
          });
        }}
        path="/packages/"
        isRefetching={packageIsRefetching}
        hasNextPage={packageHasNextPage}
        isFetchingNextPage={packageIsFetchingNextPage}
        isLoading={packagesIsLoading}
        fetchNextPage={packageFetchNextPage}
        onRefetch={packageRefetch}
      />
    </SafeAreaView>
  );
}

import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { usePackageViewModel } from "@/viewModel/Admin/Packages/usePackageViewModel";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PackagePageList() {
  const {
    packages,
    isLoading,
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
      <AppCard
        data={packages.map((p) => ({
          id: p.id,
          title: p.name,
          description: p.description,
          imgUrl: p.imgUrl,
          price: p.price,
        }))}
        onItemPress={(item) => {
          router.push({
            pathname: "/(private)/(crud)/packages/[id]",
            params: { id: item.id },
          });
        }}
        path="/packages/"
        isRefetching={false}
        hasNextPage={false}
        isFetchingNextPage={false}
        isLoading={isLoading}
      />
    </SafeAreaView>
  );
}

import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { Loading } from "@/shared/components/Loading";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useProductViewModel } from "@/viewModel/Admin/Products/useProductViewModel";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProductPageList() {
      const {safePush} = useSafeNavigation()

  const {
    productDataPagged,
    productRefetch,
    isProductRefetching,
    isProductLoading,
    productFechNextPage,
    productHasNextPage,
    productIsFetchingNextPage,
  } = useProductViewModel(undefined);

  if (isProductLoading) {
    return <Loading />;
  }

  
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Selecione o produto"
        iconRightName="add"
        action={() => safePush(`/products/product-create`)}
        iconRight={{ icon: true, path: "/products/product-create" }}
      />
      <AppCard
        data={productDataPagged.map((s) => ({
          id: s.id,
          title: s.name,
          description: s.description,
          imgUrl: s.imgUrl,
          price: s.price,
        }))}
        path="/products/"
         isRefetching={isProductRefetching}
        fetchNextPage={productFechNextPage}
        hasNextPage={productHasNextPage}
        isFetchingNextPage={productIsFetchingNextPage}
        onRefetch={productRefetch}
      />
    </SafeAreaView>
  );
}

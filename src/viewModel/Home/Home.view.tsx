import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { AppHeader } from "../../shared/components/AppHeader";
import { useHomeViewModel } from "./useHomeViewModel";
import { AppCarouselCard } from "../../shared/components/AppCarouselCard";
import { KeyboardContainer } from "../../shared/components/KeyboardContainer";
import { useUserStore } from "@/shared/store/user-store";
import { BusinessTabs } from "@/shared/components/BusinessTabs";
import { Loading } from "@/shared/components/Loading";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { AppButton } from "@/shared/components/AppButton";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { CompanyEmployees } from "@/shared/components/CompanyTabs/CompanyEmployees";

export function HomeView() {
  const {
    currentIndex,
    flatListRef,
    onScroll,
    isLoading,
    employeeDataPagged,
    width,
    companyDetails,
    menuBusiness,
    menuCompany,
    productDataPagged,
    memoAdvertisements,
    memoCompanyServices,
    productData,
    productError,
    refetchProduct,
    isProductRefetching,
    productFetchNextPage,
    isProductLoading,
    setSelectedServices,
    selectedServices,
    serviceError,
    serviceRefetch,
    handleAgendar,
    serviceIsFetchingNextPage,
    serviceHasNextPage,
    serviceIsLoading,
    loadingImage,
    serviceFetchNextPage,
    productIsFetchingNextPage,
    productsInStock,
    productHasNextPage,
    employeeRefetch,
    employeeIsRefetching,
    employeeFetchNextPage,
    employeeHasNextPage,
    employeeIsLoading,
    employeeIsFetchingNextPage,
    resetAutoPlay,
    isAdmin,
    openBottomSheet,
    company,
  } = useHomeViewModel();
  const { user, access_token } = useUserStore();

  if (isLoading) return <Loading />;

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <FlatList
        data={[{ key: "content" }]}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        scrollEnabled
        renderItem={null}
        contentContainerStyle={{
          paddingBottom: 120,
        }}
        ListHeaderComponent={
          <>
            <AppHeader user={user} token={access_token} />

            <Text className="text-gray-200 text-base font-semibold my-5  text-center">
              Novidades
            </Text>

            <View className="mx-5 mb-2">
              {memoAdvertisements.length > 0 && (
                <AppCarouselCard
                  loadingImage={loadingImage}
                  data={memoAdvertisements}
                  currentIndex={currentIndex}
                  onScroll={onScroll}
                  flatListRef={flatListRef}
                  width={width}
                  resetAutoPlay={resetAutoPlay}
                />
              )}
            </View>

         

            {!employeeDataPagged && (
              <> 
                 <Text className="text-gray-200 mt-2 text-base font-semibold  text-center">
              Profissionais
            </Text>
              <CompanyEmployees
                data={employeeDataPagged}
                openBottomSheet={openBottomSheet}
                onRefresh={employeeRefetch}
                fetchNextPage={employeeFetchNextPage}
                hasNextPage={employeeHasNextPage}
                isFetchingNextPage={employeeIsFetchingNextPage}
                isLoading={employeeIsLoading}
                isAdmin={isAdmin}
                refreshing={employeeIsRefetching}
              />
              </>
            )}
            {productDataPagged && memoCompanyServices ? (
              <BusinessTabs
                activeMenu={menuBusiness}
                companyService={memoCompanyServices}
                companyProduct={productsInStock}
                isProductLoading={isProductLoading}
                isProductRefetching={isProductRefetching}
                productError={productError}
                productIsFetchingNextPage={productIsFetchingNextPage}
                productHasNextPage={productHasNextPage}
                productFetchNextPage={productFetchNextPage}
                refetchProduct={refetchProduct}
                serviceError={serviceError}
                serviceIsLoading={serviceIsLoading}
                serviceHasNextPage={serviceHasNextPage}
                serviceIsFetchingNextPage={serviceIsFetchingNextPage}
                serviceIsRefetching={serviceIsFetchingNextPage}
                serviceRefetch={serviceRefetch}
                serviceFetchNextPage={serviceFetchNextPage}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
              />
            ) : (
              <Text className="text-base text-font-primary text-center">
                Sem internet, verifique sua conexão
              </Text>
            )}
          </>
        }
      />
      {selectedServices.length > 0 ? (
        <View
          style={{
            position: "absolute",
            bottom: 30,
            left: 20,
            right: 20,
            zIndex: 9999,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAgendar}
            className="bg-app-theme-primary h-[58px] rounded-2xl items-center justify-center shadow-xl"
          >
            <Text className="text-font-secundary font-bold text-base">
              Agendar {selectedServices.length} serviço
              {selectedServices.length > 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            position: "absolute",
            bottom: 30,
            left: 20,
            right: 20,
            zIndex: 9999,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleAgendar}
            className="bg-background-tertiary h-[58px] rounded-2xl items-center justify-center shadow-xl"
          >
            <Text className="text-font-primary font-bold text-base">
              Selecione um serviço
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

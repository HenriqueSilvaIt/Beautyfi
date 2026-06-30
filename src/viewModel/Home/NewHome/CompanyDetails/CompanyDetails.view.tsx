import React from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CompanyDetailTab, mockPackages, useCompanyDetailsViewModel } from "./useCompanyDetailsViewModel";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { CompanyDetails } from "@/shared/components/CompanyTabs/CompanyDetails";
import { CompanyServices } from "@/shared/components/BusinessTabs/CompanyServices";
import { CompanyProduct } from "@/shared/components/BusinessTabs/CompanyProduct";
import { FlatList } from "react-native-gesture-handler";

const { width: screenWidth } = Dimensions.get("window");

const defaultCarouselImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
];

export function CompanyDetailsView(props: ReturnType<typeof useCompanyDetailsViewModel>) {
  const {
    companyDetailsData,
    companyDetailsLoading,
    companyDetailsError,
    isFavorite,
    handleToggleFavorite,
    handleSelectCompany,
    handleGoBack,
    activeTab,
    setActiveTab,
    selectedServices,
    setSelectedServices,
    servicesList,
    productsList,
    subscriptionPlans,
    handleBookSelectedServices,
    handleBookPackage,
    handleGoToSubscriptionTab,
  } = props;

  if (companyDetailsLoading && !companyDetailsData) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary justify-center items-center">
        <ActivityIndicator size="large" color="#12294A" />
      </SafeAreaView>
    );
  }

  if (companyDetailsError || !companyDetailsData) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary justify-center items-center px-6">
        <Text className="text-gray-200 text-center text-base mb-4">
          Erro ao carregar dados do estabelecimento.
        </Text>
        <TouchableOpacity
          onPress={handleGoBack}
          className="bg-[#12294A] px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Parse db images or fallback to high-quality mock carousel images
  const dbImages = companyDetailsData.imagesUrl
    ? companyDetailsData.imagesUrl.split(",").map((x) => x.trim()).filter(Boolean)
    : [];
  const images = dbImages.length > 0 ? dbImages : defaultCarouselImages;

  const tabs: CompanyDetailTab[] = ["Serviços", "Produtos", "Detalhes", "Assinaturas", "Pacotes"];

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "Serviços":
        return (
          <View className="flex-1 min-h-[300px]">
            {servicesList.length > 0 ? (
              <CompanyServices
                data={servicesList}
                isRefreshing={false}
                onRefresh={props.serviceRefetch}
                fetchNextPage={props.serviceFetchNextPage}
                hasNextPage={props.serviceHasNextPage}
                isFetchingNextPage={props.serviceIsFetchingNextPage}
                isLoading={props.serviceIsLoading}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
              />
            ) : (
              <Text className="text-center text-gray-500 my-8">Nenhum serviço disponível.</Text>
            )}
          </View>
        );
      case "Produtos":
        return (
          <View className="flex-1 min-h-[300px]">
            {productsList.length > 0 ? (
              <CompanyProduct
                data={productsList}
                isRefreshing={props.isProductRefetching}
                onRefresh={props.refetchProduct}
                fetchNextPage={props.productFetchNextPage}
                hasNextPage={props.productHasNextPage}
                isFetchingNextPage={props.productIsFetchingNextPage}
                isLoading={props.productIsLoading}
              />
            ) : (
              <Text className="text-center text-gray-500 my-8">Nenhum produto disponível.</Text>
            )}
          </View>
        );
      case "Detalhes":
        return <CompanyDetails data={[companyDetailsData]} />;
      case "Assinaturas":
        return (
          <View className="px-1 py-3">
            <Text className="text-gray-900 font-bold text-base mb-4">Planos de Assinatura Disponíveis</Text>
            {subscriptionPlans.length > 0 ? (
              subscriptionPlans.map((plan) => (
                <View key={plan.id} className="bg-white p-5 rounded-2xl border border-gray-100 mb-4 shadow-sm">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-gray-900 font-bold text-base flex-1 mr-2">{plan.name}</Text>
                    <View className="bg-green-50 px-2 py-1 rounded">
                      <Text className="text-green-700 font-bold text-xs">Ativo</Text>
                    </View>
                  </View>
                  <Text className="text-gray-500 text-sm leading-relaxed mb-4">{plan.description}</Text>
                  <View className="flex-row justify-between items-center pt-3 border-t border-gray-50">
                    <Text className="text-gray-900 font-extrabold text-base">
                      R$ {Number(plan.amount).toFixed(2).replace(".", ",")} <Text className="text-gray-400 font-normal text-xs">/mês</Text>
                    </Text>
                    <TouchableOpacity
                      onPress={handleGoToSubscriptionTab}
                      className="bg-[#12294A] px-4 py-2 rounded-xl"
                    >
                      <Text className="text-white text-xs font-bold">Assinar Plano</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-center text-gray-500 my-8">Nenhum plano disponível.</Text>
            )}
          </View>
        );
      case "Pacotes":
        return (
          <View className="px-1 py-3">
            <Text className="text-gray-900 font-bold text-base mb-4">Combos e Pacotes Promocionais</Text>
            {mockPackages.map((pkg) => (
              <View key={pkg.id} className="bg-white p-5 rounded-2xl border border-gray-100 mb-4 shadow-sm">
                <Text className="text-gray-900 font-bold text-base mb-1">{pkg.name}</Text>
                <Text className="text-gray-500 text-sm leading-relaxed mb-4">{pkg.description}</Text>
                <View className="flex-row justify-between items-center pt-3 border-t border-gray-50">
                  <Text className="text-gray-900 font-extrabold text-base">
                    R$ {Number(pkg.price).toFixed(2).replace(".", ",")}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleBookPackage(pkg.services)}
                    className="bg-[#12294A] px-4 py-2 rounded-xl"
                  >
                    <Text className="text-white text-xs font-bold">Agendar Combo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-background-primary">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Cover Carousel */}
        <View style={{ height: 260, width: "100%", position: "relative" }}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(img, index) => `detail-img-${index}`}
            renderItem={({ item: img }) => (
              <Image
                source={{ uri: img }}
                resizeMode="cover"
                style={{ width: screenWidth, height: 260 }}
              />
            )}
          />

          {/* Floating Back Button */}
          <TouchableOpacity
            onPress={handleGoBack}
            activeOpacity={0.7}
            className="absolute left-4 top-12 bg-white/90 p-2.5 rounded-full shadow-md"
          >
            <Ionicons name="arrow-back" size={22} color="#1f2937" />
          </TouchableOpacity>

          {/* Floating Favorite Button */}
          <TouchableOpacity
            onPress={handleToggleFavorite}
            activeOpacity={0.7}
            className="absolute right-4 top-12 bg-white/90 p-2.5 rounded-full shadow-md"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? colors["accent-red"] : "#1f2937"}
            />
          </TouchableOpacity>
        </View>

        {/* Content Box */}
        <View className="px-4 pt-5">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-gray-900 text-2xl font-black flex-1 mr-3">
              {companyDetailsData.name}
            </Text>
            {/* Star Badge */}
            <View className="flex-row items-center bg-[#fbbf24]/10 px-2.5 py-1 rounded-lg">
              <Ionicons name="star" size={14} color="#fbbf24" />
              <Text className="text-gray-900 font-bold text-xs ml-1">
                {(companyDetailsData.rating ?? 5.0).toFixed(1)}
              </Text>
            </View>
          </View>

          <Text className="text-gray-500 text-sm mb-5 leading-relaxed">
            {companyDetailsData.description || "Nenhuma descrição fornecida."}
          </Text>

          {/* Horizontal Tabs Menu */}
          <View className="border-b border-gray-100 pb-2 mb-4">
            <FlatList
              data={tabs}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              contentContainerStyle={{ gap: 20 }}
              renderItem={({ item }) => {
                const isSelected = activeTab === item;
                return (
                  <TouchableOpacity
                    onPress={() => setActiveTab(item)}
                    activeOpacity={0.8}
                    className="pb-2"
                    style={isSelected ? { borderBottomWidth: 3, borderBottomColor: "#12294A" } : {}}
                  >
                    <Text
                      className={`text-sm ${
                        isSelected ? "text-[#12294A] font-extrabold" : "text-gray-400 font-semibold"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Tab Content Box */}
          <View className="mt-2">{renderActiveTabContent()}</View>
        </View>
      </ScrollView>

      {/* Floating CTA Bottom Bar */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          paddingHorizontal: 20,
          paddingVertical: 15,
          zIndex: 999,
        }}
      >
        {activeTab === "Serviços" && selectedServices.length > 0 ? (
          <TouchableOpacity
            onPress={handleBookSelectedServices}
            activeOpacity={0.8}
            className="bg-[#12294A] h-[54px] rounded-xl items-center justify-center shadow-lg"
          >
            <Text className="text-white font-bold text-base">
              Agendar {selectedServices.length} Serviço{selectedServices.length > 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSelectCompany}
            activeOpacity={0.8}
            className="bg-[#12294A] h-[54px] rounded-xl items-center justify-center shadow-lg"
          >
            <Text className="text-white font-bold text-base">
              Acessar Estabelecimento
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
import { useState, useRef, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNewHomeViewModel } from "./useNewHomeViewModel";
import { AppCardCompany } from "@/shared/components/AppCardCompany";
import { AppHeader } from "@/shared/components/AppHeader";
import { useUserStore } from "@/shared/store/user-store";
import { Ionicons } from "@expo/vector-icons";
import { AppMapModal } from "@/shared/components/AppMapModal";
import { colors } from "@/styles/colors";
import { Image as ExpoImage } from "expo-image";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { OnboardingChecklistCard } from "@/viewModel/Onboarding/OnboardingChecklistCard";
import { useFocusEffect } from "expo-router";
import { ClientOnboardingModal } from "./ClientOnboardingModal";

const BLURHASH =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayj[ayfjj[j[ayjuayj[";

export function NewHomeView(props: ReturnType<typeof useNewHomeViewModel>) {
  const {
    companiesDataPagged,
    companiesError,
    companiesRefetch,
    companiesIsFetchingNextPage,
    companiesHasNextPage,
    companiesFetchNextPage,
    companiesIsLoading,
    companiesIsRefetching,
    searchText,
    setSearchText,
    categoriesData,
    categoriesIsLoading,
    selectedCategoryId,
    setSelectedCategoryId,
    favoritedCompanyIds,
    handleToggleFavorite,
    favoriteCompanies,
    searchMode,
    setSearchMode,
    addressText,
    setAddressText,
    radius,
    setRadius,
    geoLoading,
    handleAddressSearch,
    handleDismissOnboarding,
    addressSuggestions,
    isSearchingAddress,
    showSuggestions,
    handleSelectSuggestion,
  } = props;

  const { safePush } = useSafeNavigation();
  const { user, access_token } = useUserStore();
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const isAdmin = user?.roles?.some((r) => r.authority === "ROLE_ADMIN" || r.authority === "ROLE_MODERATOR");

  useFocusEffect(
    useCallback(() => {
      companiesRefetch();
    }, [companiesRefetch])
  );

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppHeader user={user} token={access_token} />

      {/* Onboarding Checklist for Admins */}
      {isAdmin && (
        <View className="px-5">
          <OnboardingChecklistCard />
        </View>
      )}

      {/* Tab Switcher (Explorar / Buscar) */}
      <View className="flex-row justify-between bg-gray-100 p-1 mx-5 mt-4 rounded-xl border border-gray-200/50">
        <TouchableOpacity
          onPress={() => setSearchMode("explorar")}
          activeOpacity={0.8}
          className={`flex-1 py-2 rounded-lg items-center ${searchMode === "explorar" ? "bg-white shadow-sm" : ""}`}
        >
          <Text
            className={`text-xs font-bold ${searchMode === "explorar" ? "text-[#092D5D]" : "text-gray-600"}`}
          >
            Explorar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSearchMode("buscar")}
          activeOpacity={0.8}
          className={`flex-1 py-2 rounded-lg items-center ${searchMode === "buscar" ? "bg-white shadow-sm" : ""}`}
        >
          <Text
            className={`text-xs font-bold ${searchMode === "buscar" ? "text-[#092D5D]" : "text-gray-600"}`}
          >
            Buscar Próximos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Condicional Panels */}
      {searchMode === "explorar" ? (
        /* Search Input Section */
        <View className="px-5 mt-4 mb-2">
          <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
            <Ionicons
              name="search-outline"
              size={20}
              color="#9ca3af"
              className="mr-2"
            />
            <TextInput
              placeholder="Buscar por estabelecimento..."
              placeholderTextColor={colors["app-theme-primary"]}

              value={searchText}
              onChangeText={setSearchText}
              className="flex-1 text-gray-800 text-sm p-0 h-5"
            />
            {searchText.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchText("")}
                activeOpacity={0.7}
              >
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      ) : (
        /* Proximity Search Panel */
        <View className="px-5 mt-4 mb-2">
          <View className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm gap-3">
            <Text className="text-[#092D5D] font-bold text-sm">
              Buscar por Proximidade
            </Text>

            <View className="relative z-50">
              <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                <Ionicons
                  name="location-outline"
                  size={20}
                  color="#9ca3af"
                  className="mr-2"
                />
                <TextInput
                  placeholder="Digite seu endereço (ex: Av. Paulista)"
                  placeholderTextColor={colors["app-theme-primary"]}
                  value={addressText}
                  onChangeText={setAddressText}
                  className="flex-1 text-gray-800 text-sm p-0 h-6"
                />
                {isSearchingAddress && (
                  <ActivityIndicator size="small" color="#092D5D" />
                )}
                {addressText.length > 0 && !isSearchingAddress && (
                  <TouchableOpacity
                    onPress={() => setAddressText("")}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="close-circle" size={18} color="#9ca3af" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Autocomplete Suggestions Dropdown */}
              {showSuggestions && addressSuggestions.length > 0 && (
                <View className="bg-white border border-gray-200 rounded-xl mt-1 shadow-lg overflow-hidden z-50">
                  {addressSuggestions.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      onPress={() => handleSelectSuggestion(item)}
                      activeOpacity={0.7}
                      className="px-3 py-2.5 border-b border-gray-100 flex-row items-center gap-2"
                    >
                      <Ionicons name="location-sharp" size={14} color="#CBA35D" />
                      <Text
                        className="text-gray-800 text-xs flex-1"
                        numberOfLines={2}
                      >
                        {item.display_name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-gray-600 text-xs font-semibold">
                Raio de busca:
              </Text>
              <View className="flex-row gap-1.5">
                {[5, 15, 25, 50].map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRadius(r)}
                    activeOpacity={0.7}
                    className={`px-3 py-1 rounded-full border ${
                      radius === r
                        ? "bg-[#CBA35D]/10 border-[#CBA35D]"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-[10px] font-bold ${radius === r ? "text-[#092D5D]" : "text-gray-600"}`}
                    >
                      {r} km
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleAddressSearch}
              disabled={geoLoading}
              activeOpacity={0.8}
              className="bg-[#092D5D] py-3 rounded-xl items-center mt-2"
            >
              <Text className="text-font-secundary text-sm font-bold">
                {geoLoading ? "Buscando..." : "Buscar salões próximos"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Horizontal Categories Menu (Visible in both Explorar & Buscar Próximos) */}
      <View className="mb-4">
        {categoriesIsLoading ? (
          <ActivityIndicator size="small" className="my-2" />
        ) : (
          <FlatList
            data={[{ id: null, name: "Todas" }, ...categoriesData]}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) =>
              item.id === null ? "all" : String(item.id)
            }
            contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
            renderItem={({ item }) => {
              const isSelected = selectedCategoryId === item.id;
              return (
                <TouchableOpacity
                  onPress={() => setSelectedCategoryId(item.id)}
                  activeOpacity={0.8}
                  className={`px-4 py-2 rounded-full border ${
                    isSelected
                      ? "bg-[#092D5D] border-[#092D5D]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isSelected ? "text-font-secundary" : "text-gray-600"
                    }`}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>

      {searchMode === "explorar" &&
        favoriteCompanies &&
        favoriteCompanies.length > 0 && (
          <View className="mb-6">
            <View className="flex-row justify-between items-center px-5 mb-3">
              <Text className="text-[#12294A] text-sm font-bold">
                Favoritos
              </Text>
              <TouchableOpacity
                onPress={() =>
                  safePush("/(private)/(tabs)/(client-tabs)/(menu)/favorites")
                }
                activeOpacity={0.7}
              >
                <Text className="text-[#CBA35D] text-xs font-semibold">
                  Ver todos
                </Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={favoriteCompanies}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => `fav-${item.id}`}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
              renderItem={({ item }) => {
                const images = item.imagesUrl
                  ? item.imagesUrl
                      .split(",")
                      .map((x) => x.trim())
                      .filter(Boolean)
                  : [];
                const firstImage = images[0] || null;

                const handleCardPress = () => {
                  const isLoggedIn = !!access_token;
                  if (!isLoggedIn) {
                    safePush(`/(public)/companies-details/${item.id}`);
                  } else {
                    safePush(`/(private)/companies-details/${item.id}`);
                  }
                };

                return (
                  <TouchableOpacity
                    onPress={handleCardPress}
                    activeOpacity={0.9}
                    className="bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm w-[130px]"
                  >
                    <View className="w-full h-[60px] rounded-xl overflow-hidden bg-gray-50">
                      {firstImage ? (
                        <ExpoImage
                          source={{ uri: firstImage }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                          transition={200}
                          placeholder={{ blurhash: BLURHASH }}
                        />
                      ) : (
                        <ExpoImage
                          source={require("@assets/images/cort.png")}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                          transition={200}
                        />
                      )}
                    </View>
                    <View className="mt-1.5 px-1 flex-row justify-between items-center">
                      <Text
                        className="text-[#12294A] font-bold text-[10px] flex-1 mr-1"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                      <View className="flex-row items-center">
                        <Ionicons name="star" size={10} color="#fbbf24" />
                        <Text className="text-gray-800 text-[9px] font-bold ml-0.5">
                          {(item.rating ?? 5).toFixed(1)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

      <Text className="text-gray-600 text-xs font-bold uppercase tracking-wider mb-4 px-5">
        {searchMode === "buscar"
          ? "Estabelecimentos Encontrados"
          : "Estabelecimentos Recomendados"}
      </Text>

      {companiesIsLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#092D5D" />
        </View>
      ) : (
        <AppCardCompany
          companies={companiesDataPagged}
          isRefetching={companiesIsRefetching}
          fetchNextPage={companiesFetchNextPage}
          hasNextPage={companiesHasNextPage}
          isLoading={companiesIsLoading}
          onRefetch={companiesRefetch}
          isFetchingNextPage={companiesIsFetchingNextPage}
          favoritedCompanyIds={favoritedCompanyIds}
          onToggleFavorite={handleToggleFavorite}
          showPartnerCallout={true}
          onViewMap={(company) => {
            setSelectedCompany(company);
            setIsMapOpen(true);
          }}
        />
      )}

      {/* Map Modal */}
      {selectedCompany &&
        selectedCompany.latitude &&
        selectedCompany.longitude && (
          <AppMapModal
            isOpen={isMapOpen}
            onClose={() => setIsMapOpen(false)}
            latitude={selectedCompany.latitude}
            longitude={selectedCompany.longitude}
            companyName={selectedCompany.name}
            companyAddress={selectedCompany.address}
          />
        )}

      {/* Onboarding Client Modal */}
      <ClientOnboardingModal
        visible={
          !!access_token &&
          Boolean(user?.roles?.some((r) => r.authority === "ROLE_CLIENT")) &&
          user?.firstLogin !== false
        }
        onDismiss={handleDismissOnboarding}
      />
    </SafeAreaView>
  );
}

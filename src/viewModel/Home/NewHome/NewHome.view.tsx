import { useState, useRef } from "react";
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
  const [slideIndex, setSlideIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { width: SCREEN_WIDTH } = Dimensions.get("window");

  const isAdmin = user?.roles?.some((r) => r.authority === "ROLE_ADMIN" || r.authority === "ROLE_MODERATOR");

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
      {!!access_token &&
        user?.roles?.some((r) => r.authority === "ROLE_CLIENT") &&
        user?.firstLogin !== false &&
        (() => {
          const handleNext = () => {
            if (slideIndex < 2) {
              scrollViewRef.current?.scrollTo({
                x: (slideIndex + 1) * SCREEN_WIDTH,
                animated: true,
              });
              setSlideIndex(slideIndex + 1);
            } else {
              handleDismissOnboarding();
            }
          };

          const handleScroll = (event: any) => {
            const contentOffsetX = event.nativeEvent.contentOffset.x;
            const currentIndex = Math.round(contentOffsetX / SCREEN_WIDTH);
            setSlideIndex(currentIndex);
          };

          const slides = [
            {
              title: "Agendamentos 24 horas",
              description:
                "Marque seus horários a qualquer hora do dia ou da noite, em qualquer lugar, sem precisar ligar ou enviar mensagens.",
              icon: "calendar-outline",
              bgColor: "#e0f2fe", // soft sky blue
              iconColor: "#0284c7",
            },
            {
              title: "Encontre Próximos",
              description:
                "Descubra os melhores profissionais e estabelecimentos pertinho de você, com mapa interativo e buscas customizadas.",
              icon: "map-outline",
              bgColor: "#fef3c7", // soft gold/amber
              iconColor: "#d97706",
            },
            {
              title: "Histórico & Controle",
              description:
                "Visualize seus próximos agendamentos, cancele quando necessário e acompanhe todo seu histórico em tempo real.",
              icon: "time-outline",
              bgColor: "#dcfce7", // soft green
              iconColor: "#16a34a",
            },
          ];

          return (
              <Modal transparent animationType="fade" visible={true}>
                <View className="flex-1 bg-[#092D5D]/40 justify-end">
                  {/* Top part holding background illustration/icon based on active index */}
                  <SafeAreaView
                    style={{
                      flex: 1,
                      backgroundColor: slides[slideIndex].bgColor,
                    }}
                    edges={["top"]}
                    className="justify-between pb-6 px-6"
                  >
                    {/* Header (Pular / Skip) */}
                    <View className="flex-row justify-between items-center w-full">
                      <View className="flex-row items-center gap-1.5 bg-black/10 px-3.5 py-1.5 rounded-full">
                        <Ionicons name="sparkles" size={14} color="#092D5D" />
                        <Text className="text-[#092D5D] font-bold text-xs">
                          Novo por aqui?
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={handleDismissOnboarding}
                        activeOpacity={0.7}
                        className="bg-[#092D5D]/10 px-4 py-2 rounded-full"
                      >
                        <Text className="text-[#092D5D] font-bold text-xs">
                          Pular
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Animated content/Illustration area */}
                    <View className="items-center justify-center flex-1 my-4">
                      <View className="bg-white p-8 rounded-full shadow-md items-center justify-center">
                        <Ionicons
                          name={slides[slideIndex].icon as any}
                          size={84}
                          color={slides[slideIndex].iconColor}
                        />
                      </View>
                    </View>
                    <View />
                  </SafeAreaView>

                  {/* Bottom White Card */}
                  <SafeAreaView
                    edges={["bottom"]}
                    className="bg-white rounded-t-[40px] px-8 pt-8 pb-10 shadow-2xl h-[370px] justify-between"
                  >
                    {/* ScrollView of slide texts */}
                    <View className="h-[180px]">
                      <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                        style={{ width: SCREEN_WIDTH - 64 }}
                      >
                        {slides.map((slide, idx) => (
                          <View
                            key={idx}
                            style={{ width: SCREEN_WIDTH - 64 }}
                            className="items-center justify-center px-4"
                          >
                            <Text className="text-[#092D5D] text-2xl font-black text-center mb-3">
                              {slide.title}
                            </Text>
                            <Text className="text-gray-500 text-sm text-center leading-relaxed">
                              {slide.description}
                            </Text>
                          </View>
                        ))}
                      </ScrollView>
                    </View>

                    {/* Action footer */}
                    <View className="flex-row items-center justify-between mt-4">
                      {/* Indicators */}
                      <View className="flex-row gap-1.5">
                        {slides.map((_, idx) => (
                          <View
                            key={idx}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === slideIndex ? "w-6" : "w-2"}`}
                            style={{
                              backgroundColor:
                                idx === slideIndex ? "#092D5D" : "#cbd5e1",
                            }}
                          />
                        ))}
                      </View>

                      {/* Next / Get Started button */}
                      <TouchableOpacity
                        onPress={handleNext}
                        activeOpacity={0.8}
                        className="px-6 py-4 rounded-2xl items-center justify-center bg-[#092D5D] flex-row gap-2"
                      >
                        <Text className="text-white font-extrabold text-sm uppercase tracking-wide">
                          {slideIndex < 2 ? "Avançar" : "Começar"}
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color="white"
                        />
                      </TouchableOpacity>
                    </View>
                  </SafeAreaView>
                </View>
              </Modal>
          );
        })()}
    </SafeAreaView>
  );
}

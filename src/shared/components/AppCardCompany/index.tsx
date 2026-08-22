import { CompanyDTO } from "@/shared/interfaces/http/company";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Image as ExpoImage } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { router } from "expo-router";

function PartnerRegistrationCard() {
  const handleOpenPartnerContact = () => {
    Linking.openURL("https://www.beautyfi.com.br").catch(() => {});
  };

  return (
    <View className="bg-[#092D5D] rounded-3xl border border-[#CBA35D]/40 p-6 my-4 overflow-hidden relative shadow-md">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2 bg-[#CBA35D]/20 px-3 py-1 rounded-full border border-[#CBA35D]/40">
          <Ionicons name="sparkles" size={14} color="#CBA35D" />
          <Text className="text-[#CBA35D] text-xs font-bold uppercase tracking-wider">
            Seja um Parceiro
          </Text>
        </View>
        <Ionicons name="storefront-outline" size={28} color="#CBA35D" />
      </View>

      <Text className="text-white text-xl font-black mb-2">
        Tem um Salão ou Barbearia?
      </Text>

      <Text className="text-gray-300 text-xs leading-5 mb-5">
        Cadastre seu estabelecimento no Beautyfi! Tenha agendamentos 24/7, lembretes automáticos e receba pagamentos via PIX diretamente no seu banco.
      </Text>

      <TouchableOpacity
        onPress={handleOpenPartnerContact}
        activeOpacity={0.85}
        className="bg-[#CBA35D] py-3.5 px-5 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm"
      >
        <Ionicons name="globe-outline" size={18} color="#092D5D" />
        <Text className="text-[#092D5D] font-extrabold text-xs uppercase tracking-wide">
          Cadastrar Meu Estabelecimento
        </Text>
      </TouchableOpacity>
    </View>
  );
}
import { useCompanyStore } from "@/shared/store/company-store";
import { useUserStore } from "@/shared/store/user-store";
import user from "@/app/(private)/(tabs)/(client-tabs)/(menu)/user";

interface AppCardCompanyProps {
  companies: CompanyDTO[];
  onRefetch?: any;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isRefetching: boolean;
  fetchNextPage?: any;
  favoritedCompanyIds: number[];
  onToggleFavorite: (companyId: number) => void;
  onViewMap?: (company: CompanyDTO) => void;
}

const { width: screenWidth } = Dimensions.get("window");
const cardWidth = screenWidth - 40;

// Placeholder blur enquanto a imagem real não chega (fade suave)
const BLURHASH =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayj[ayfjj[j[ayjuayj[";

function Skeleton({ style }: { style?: any }) {
  const opacity = useRef(new Animated.Value(0.35)).current;
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.75,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ backgroundColor: "#E9E4DA", opacity }, style]}
    />
  );
}

function CompanyImageCarousel({
  images,
  companyId,
  onCardPress,
}: {
  images: string[];
  companyId: number;
  onCardPress: () => void;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState<Record<number, boolean>>({});

  return (
    <View style={{ height: 210, width: "100%", position: "relative" }}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
          setActiveIndex(index);
        }}
        keyExtractor={(img, index) => `${companyId}-img-${index}`}
        renderItem={({ item: img, index }) => (
          <TouchableOpacity activeOpacity={0.9} onPress={onCardPress}>
            <View style={{ width: cardWidth, height: 210 }}>
              {!loaded[index] && (
                <Skeleton
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: cardWidth,
                    height: 210,
                  }}
                />
              )}
              <ExpoImage
                source={{ uri: img }}
                style={{ width: cardWidth, height: 210 }}
                contentFit="cover"
                transition={250}
                placeholder={{ blurhash: BLURHASH }}
                cachePolicy="memory-disk"
                onLoadEnd={() =>
                  setLoaded((prev) => ({ ...prev, [index]: true }))
                }
              />
            </View>
          </TouchableOpacity>
        )}
      />
      {images.length > 1 && (
        <View
          style={{
            position: "absolute",
            bottom: 10,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
          }}
        >
          {images.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === activeIndex ? 12 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor:
                  i === activeIndex ? "#CBA35D" : "rgba(255, 255, 255, 0.6)",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}

export function AppCardCompany({
  onRefetch,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isRefetching,
  fetchNextPage,
  companies,
  favoritedCompanyIds,
  onToggleFavorite,
  onViewMap,
}: AppCardCompanyProps) {
  const setSelectedCompanyId = useCompanyStore(
    (state) => state.setSelectedCompanyId,
  );
  const isLoggedIn = useUserStore((state) => !!state.access_token);

  const handleBookService = (companyId: number, serviceId: number) => {
    setSelectedCompanyId(companyId);
    if (!isLoggedIn) {
      router.push("/(public)/login");
    } else {
      router.push({
        pathname: "/(private)/schedule",
        params: { serviceIds: String(serviceId) },
      });
    }
  };

  const handleCardPress = (companyId: number) => {
    if (!isLoggedIn) {
      router.push(`/(public)/companies-details/${companyId}`);
    } else {
      router.push(`/(private)/companies-details/${companyId}`);
    }
  };

  const renderItem = useCallback(
    ({ item }: { item: CompanyDTO }) => {
      const isFav = favoritedCompanyIds.includes(item.id);
      const images = item.imagesUrl
        ? item.imagesUrl
            .split(",")
            .map((x) => x.trim())
            .filter(Boolean)
        : [];

      return (
        <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {/* Cover Carousel */}
          <View style={{ height: 210, width: "100%", position: "relative" }}>
            {images.length > 0 ? (
              <CompanyImageCarousel
                images={images}
                companyId={item.id}
                onCardPress={() => handleCardPress(item.id)}
              />
            ) : (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => handleCardPress(item.id)}
              >
                <ExpoImage
                  source={require("@assets/images/cort.png")}
                  style={{ width: "100%", height: 210 }}
                  contentFit="cover"
                  transition={200}
                />
              </TouchableOpacity>
            )}

            {/* Favorite button */}
            <TouchableOpacity
              onPress={() => onToggleFavorite(item.id)}
              activeOpacity={0.7}
              className="absolute right-3 top-3 bg-white/80 p-2 rounded-full shadow-sm"
            >
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={22}
                color={isFav ? colors["accent-red"] : "#6b7280"}
              />
            </TouchableOpacity>
          </View>

          {/* Details */}
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => handleCardPress(item.id)}
            className="p-4"
          >
            <Text className="text-gray-900 text-lg font-bold mb-1">
              {item.name}
            </Text>

            {/* Rating & Distance */}
            <View className="flex-row items-center justify-between mb-1.5">
              {item.rating !== undefined && (
                <View className="flex-row items-center">
                  <Ionicons name="star" size={16} color="#fbbf24" />
                  <Text className="text-gray-900 font-semibold text-sm ml-1">
                    {(item.rating ?? 0).toFixed(1)}
                  </Text>
                  <Text className="text-gray-600 text-sm ml-1">
                    ({item.reviewsCount ?? 0} avaliações)
                  </Text>
                </View>
              )}
              {item.distanceKm !== undefined && item.distanceKm !== null && (
                <View className="bg-[#FAF8EF] border border-[#CBA35D]/30 px-2 py-0.5 rounded-full flex-row items-center">
                  <Ionicons name="navigate-outline" size={12} color="#092D5D" />
                  <Text className="text-[#092D5D] text-[10px] font-bold ml-1">
                    {item.distanceKm.toFixed(1)} km
                  </Text>
                </View>
              )}
            </View>

            {/* Address & Map */}
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center flex-1 pr-2">
                <Ionicons name="location-outline" size={16} color="#9ca3af" />
                <Text
                  className="text-gray-600 text-sm ml-1 flex-1"
                  numberOfLines={1}
                >
                  {item.address || "Sem endereço cadastrado"}
                </Text>
              </View>
              {item.latitude && item.longitude && onViewMap && (
                <TouchableOpacity
                  onPress={() => onViewMap(item)}
                  activeOpacity={0.7}
                  className="bg-[#CBA35D]/10 border border-[#CBA35D]/20 px-2.5 py-1 rounded-lg"
                >
                  <Text className="text-[#092D5D] text-xs font-bold">
                    Ver no Mapa
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Services List */}
            {(() => {
              const filteredServices = item.services
                ? item.services.filter((s) => s.availableInApp !== false)
                : [];
              if (filteredServices.length === 0) return null;

              return (
                <View className="border-t border-gray-100 pt-3">
                  <Text className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2">
                    Serviços Populares
                  </Text>
                  {filteredServices.slice(0, 3).map((service) => (
                    <View
                      key={service.id}
                      className="flex-row justify-between items-center py-2.5 border-b border-gray-50"
                    >
                      <View className="flex-1 pr-3">
                        <Text className="text-gray-800 font-medium text-sm">
                          {service.name}
                        </Text>
                        <Text className="text-gray-600 text-xs mt-0.5">
                          R$ {Number(service.price).toFixed(2).replace(".", ",")}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleBookService(item.id, service.id)}
                        className="bg-[#12294A] px-3.5 py-1.5 rounded-lg"
                      >
                        <Text className="text-white text-xs font-bold">
                          Agendar
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                  <TouchableOpacity
                    onPress={() => handleCardPress(item.id)}
                    activeOpacity={0.7}
                    className="flex-row justify-center items-center py-3 mt-1 border-t border-gray-100"
                  >
                    <Text className="text-[#CBA35D] text-sm font-semibold mr-1">
                      Ver mais
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#CBA35D" />
                  </TouchableOpacity>
                </View>
              );
            })()}
          </TouchableOpacity>
        </View>
      );
    },
    [favoritedCompanyIds, onToggleFavorite, isLoggedIn],
  );

  return (
    <View className="flex-1">
      <FlatList
        data={companies}
        keyExtractor={(item) => String(item.id)}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && fetchNextPage)
            fetchNextPage();
        }}

        onEndReachedThreshold={2.5}
        refreshing={isRefetching}
        onRefresh={onRefetch}
        contentContainerStyle={{
          paddingBottom: 120,
          gap: 12,
          paddingHorizontal: 20,
          flexGrow: 1,
        }}
        ListFooterComponent={
          <View>
            {isFetchingNextPage && <ActivityIndicator className="my-4" color="#092D5D" />}
            <PartnerRegistrationCard />
          </View>
        }
        renderItem={renderItem}
        // ⚡ performance da lista
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={7}
        removeClippedSubviews
      />
    </View>
  );
}

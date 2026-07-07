import { CompanyDTO } from "@/shared/interfaces/http/company";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { useCallback } from "react";
import { ActivityIndicator, Dimensions, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { router } from "expo-router";
import { useCompanyStore } from "@/shared/store/company-store";
import { useUserStore } from "@/shared/store/user-store";

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
  const setSelectedCompanyId = useCompanyStore((state) => state.setSelectedCompanyId);
  const isLoggedIn = useUserStore((state) => !!state.access_token);

  const handleBookService = (companyId: number, serviceId: number) => {
    setSelectedCompanyId(companyId);
    if (!isLoggedIn) {
      router.push("/(public)/login");
    } else {
      router.push({
        pathname: "/(private)/schedule",
        params: {
          serviceIds: String(serviceId),
        },
      });
    }
  };

  const handleCardPress = (companyId: number) => {
    router.push(`/(public)/companies-details/${companyId}`);
  };

  const renderItem = useCallback(
    ({ item }: { item: CompanyDTO }) => {
      const isFav = favoritedCompanyIds.includes(item.id);
      const images = item.imagesUrl ? item.imagesUrl.split(",").map(x => x.trim()).filter(Boolean) : [];

      return (
        <View className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {/* Cover Carousel */}
          <View style={{ height: 220, width: "100%", position: "relative" }}>
            {images.length > 0 ? (
              <FlatList
                data={images}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={(img, index) => `${item.id}-img-${index}`}
                renderItem={({ item: img }) => (
                  <TouchableOpacity activeOpacity={0.9} onPress={() => handleCardPress(item.id)}>
                    <Image
                      source={{ uri: img }}
                      resizeMode="cover"
                      style={{ width: cardWidth, height: 220 }}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : (
              <TouchableOpacity activeOpacity={0.9} onPress={() => handleCardPress(item.id)}>
                <Image
                  source={require("@assets/images/cort.png")}
                  resizeMode="cover"
                  style={{ width: "100%", height: 220 }}
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
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text className="text-gray-900 font-semibold text-sm ml-1">
                  {(item.rating ?? 5.0).toFixed(1)}
                </Text>
                <Text className="text-gray-600 text-sm ml-1">
                  ({item.reviewsCount ?? 0} avaliações)
                </Text>
              </View>
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
                <Text className="text-gray-500 text-sm ml-1 flex-1" numberOfLines={1}>
                  {item.address || "Sem endereço cadastrado"}
                </Text>
              </View>
              {item.latitude && item.longitude && onViewMap && (
                <TouchableOpacity
                  onPress={() => onViewMap(item)}
                  activeOpacity={0.7}
                  className="bg-[#CBA35D]/10 border border-[#CBA35D]/20 px-2.5 py-1 rounded-lg"
                >
                  <Text className="text-[#092D5D] text-xs font-bold">Ver no Mapa</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Services List */}
            {item.services && item.services.length > 0 && (
              <View className="border-t border-gray-100 pt-3">
                <Text className="text-gray-600 font-semibold text-xs uppercase tracking-wider mb-2">
                  Serviços Populares
                </Text>
                {item.services.map((service) => (
                  <View key={service.id} className="flex-row justify-between items-center py-2.5 border-b border-gray-50">
                    <View className="flex-1 pr-3">
                      <Text className="text-gray-800 font-medium text-sm">
                        {service.name}
                      </Text>
                      <Text className="text-gray-500 text-xs mt-0.5">
                        R$ {Number(service.price).toFixed(2).replace(".", ",")}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleBookService(item.id, service.id)}
                      className="bg-[#12294A] px-3.5 py-1.5 rounded-lg"
                    >
                      <Text className="text-white text-xs font-bold">Agendar</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    },
    [favoritedCompanyIds, onToggleFavorite, isLoggedIn]
  );

  return (
    <View className="flex-1">
      <FlatList
        data={companies}
        keyExtractor={(item) => String(item.id)}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={2.5}
        refreshing={isRefetching}
        contentContainerStyle={{
          paddingBottom: 120,
          gap: 12,
          paddingHorizontal: 20,
          flexGrow: 1,
        }}
        onRefresh={onRefetch}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator className="my-4" /> : null}
        renderItem={renderItem}
      />
    </View>
  );
}

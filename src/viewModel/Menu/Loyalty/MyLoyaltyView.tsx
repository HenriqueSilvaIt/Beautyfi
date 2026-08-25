import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "@/shared/components/AppHeader";
import { Ionicons } from "@expo/vector-icons";
import { useMyLoyaltyViewModel } from "./useMyLoyaltyViewModel";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useUserStore } from "@/shared/store/user-store";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";

export function MyLoyaltyView(props: ReturnType<typeof useMyLoyaltyViewModel>) {
  const { pointsList, isLoading, isRefetching, refetch } = props;
  const { safePush } = useSafeNavigation();
  const { user, access_token } = useUserStore();

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <View className="flex-1 bg-background-primary">
        <AppAdminHeader
          title="Pontos de Fidelidade"
          iconRightName={undefined}
          iconRight={{
            icon: true,
            path: "",
          }}
        />
        
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#CBA35D" />
          </View>
        ) : (
          <FlatList
            data={pointsList}
            keyExtractor={(item, index) =>
              item.id ? String(item.id) : `points-${index}`
            }
            contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
            refreshControl={
              <RefreshControl
                refreshing={isRefetching}
                onRefresh={refetch}
                tintColor="#CBA35D"
              />
            }
            ListHeaderComponent={
              <View className="p-5 rounded-2xl bg-gradient-to-r from-[#092D5D] to-[#1E40AF] border border-[#CBA35D]/30 mb-6">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-12 h-12 rounded-full bg-[#CBA35D]/20 items-center justify-center border border-[#CBA35D]/40">
                    <Ionicons name="trophy" size={24} color="#CBA35D" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-base font-bold">
                      Seu Clube de Fidelidade
                    </Text>
                    <Text className="text-gray-300 text-xs mt-0.5">
                      Acumule pontos em seus estabelecimentos favoritos e troque
                      por prêmios!
                    </Text>
                  </View>
                </View>
              </View>
            }
            ListEmptyComponent={
              <View className="p-8 rounded-2xl bg-background-quartenary border border-white/5 items-center my-6">
                <Ionicons
                  name="gift-outline"
                  size={40}
                  color="#6B7280"
                  className="mb-2"
                />
                <Text className="text-font-primary font-bold text-sm text-center">
                  Você ainda não possui pontos acumulados.
                </Text>
                <Text className="text-font-secondary text-xs text-center mt-1">
                  Agende serviços nos seus estabelecimentos favoritos para
                  começar a pontuar!
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  item.companyId &&
                  safePush(`/(private)/companies-details/${item.companyId}`)
                }
                className="p-4 rounded-2xl bg-background-quartenary border border-white/10 mb-4 flex-row items-center justify-between shadow-sm"
              >
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  {item.companyLogoUrl ? (
                    <Image
                      source={{ uri: item.companyLogoUrl }}
                      className="w-12 h-12 rounded-full border border-[#CBA35D]"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-12 h-12 rounded-full bg-background-tertiary border border-[#CBA35D] items-center justify-center">
                      <Ionicons name="storefront" size={20} color="#CBA35D" />
                    </View>
                  )}

                  <View className="flex-1">
                    <Text
                      className="text-font-primary font-bold text-sm"
                      numberOfLines={1}
                    >
                      {item.companyName || "Estabelecimento Parceiro"}
                    </Text>
                    <Text className="text-font-secondary text-xs mt-0.5">
                      Total histórico: {item.totalPointsEarned || 0} pts
                    </Text>
                  </View>
                </View>

                <View className="px-3.5 py-2 rounded-xl bg-[#CBA35D]/20 border border-[#CBA35D]/40 items-center">
                  <Text className="text-[#CBA35D] font-black text-base">
                    {item.pointsBalance || 0}
                  </Text>
                  <Text className="text-[#CBA35D] font-bold text-[10px] uppercase">
                    Pontos
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

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
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { ClientLoyaltyModal } from "@/viewModel/Admin/Clients/ClientLoyaltyModal";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";

export function MyLoyaltyView(props: ReturnType<typeof useMyLoyaltyViewModel>) {
  const { pointsList, isLoading, isRefetching, refetch, clientId, user } = props;
  const { safePush } = useSafeNavigation();
  const { access_token } = useUserStore();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  const handleOpenStampCard = (item: any) => {
    if (!item.companyId) return;

    openBottomSheet(
      <ClientLoyaltyModal
        clientId={clientId || Number(user?.id) || 0}
        clientName={user?.firstName || user?.firstName || "Meu Cartão"}
        companyId={item.companyId}
        currentStamps={item.stampsBalance || 0}
        readOnly={true}
        onClose={closeBottomSheet}
      />,
      0
    );
  };

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
                      Acumule pontos e carimbos em seus estabelecimentos favoritos e ganhe prêmios!
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
                  Você ainda não possui pontos ou carimbos acumulados.
                </Text>
                <Text className="text-font-secondary text-xs text-center mt-1">
                  Agende serviços nos seus estabelecimentos favoritos para
                  começar a pontuar!
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View className="p-4 rounded-2xl bg-background-quartenary border border-white/10 mb-4 shadow-sm">
                <View className="flex-row items-center justify-between pb-3 border-b border-white/5">
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      item.companyId &&
                      safePush(`/(private)/companies-details/${item.companyId}`)
                    }
                    className="flex-row items-center gap-3 flex-1 pr-2"
                  >
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
                  </TouchableOpacity>

                  <View className="px-3.5 py-2 rounded-xl bg-[#CBA35D]/20 border border-[#CBA35D]/40 items-center">
                    <Text className="text-[#CBA35D] font-black text-base">
                      {item.pointsBalance || 0}
                    </Text>
                    <Text className="text-[#CBA35D] font-bold text-[10px] uppercase">
                      Pontos
                    </Text>
                  </View>
                </View>

                {/* Botão de Ver Cartão Fidelidade (Somente Visualização para o Cliente) */}
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={() => handleOpenStampCard(item)}
                  className="mt-3 py-2.5 px-3.5 rounded-xl bg-[#092D5D]/40 border border-[#CBA35D]/30 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-2">
                    <View className="w-7 h-7 rounded-lg bg-[#CBA35D]/20 items-center justify-center">
                      <Ionicons name="ribbon" size={16} color="#CBA35D" />
                    </View>
                    <Text className="text-font-primary text-xs font-bold">
                      Cartão de Carimbos
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1.5">
                    <View className="px-2.5 py-0.5 rounded-md bg-[#CBA35D]/20 border border-[#CBA35D]/40">
                      <Text className="text-[#CBA35D] text-[11px] font-extrabold">
                        {item.stampsBalance || 0} carimbos
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#CBA35D" />
                  </View>
                </TouchableOpacity>
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

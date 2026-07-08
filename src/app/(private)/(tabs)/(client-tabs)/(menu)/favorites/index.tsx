import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { AppCardCompany } from "@/shared/components/AppCardCompany";
import { getFavoritedCompanyIds, getCompanyById, toggleFavoriteCompany } from "@/shared/services/company.service";
import { CompanyDTO } from "@/shared/interfaces/http/company";

export default function FavoritesScreen() {
  const [loading, setLoading] = useState(false);
  const [favoriteCompanies, setFavoriteCompanies] = useState<CompanyDTO[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const ids = await getFavoritedCompanyIds();
      setFavoriteIds(ids || []);
      if (ids && ids.length > 0) {
        const details = await Promise.all(ids.map(id => getCompanyById(id)));
        // Map CompanyInterface to CompanyDTO structure
        const mapped: CompanyDTO[] = details.map(c => ({
          id: c.id,
          name: c.name,
          description: c.description || "",
          cnpj: c.cnpj || "",
          logoUrl: c.logoUrl || "",
          createdAt: c.createdAt || "",
          updatedAt: c.updatedAt || "",
          address: c.address || "",
          latitude: c.latitude || 0,
          longitude: c.longitude || 0,
          subdomain: c.subdomain || "",
          phone: c.phone || "",
          rating: c.rating || 5,
          reviewsCount: c.reviewsCount || 0,
          imagesUrl: c.imagesUrl || "",
          services: [] // Default empty
        }));
        setFavoriteCompanies(mapped);
      } else {
        setFavoriteCompanies([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (companyId: number) => {
    const isFav = favoriteIds.includes(companyId);
    try {
      await toggleFavoriteCompany(companyId, !isFav);
      // Reload favorites to refresh list
      await loadFavorites();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-5 py-4">
      {/* Header */}
      <View className="flex-row items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="bg-slate-100 p-2.5 rounded-full mr-4"
        >
          <Ionicons name="chevron-back" size={22} color="#1f2937" />
        </TouchableOpacity>
        <Text className="text-slate-800 text-xl font-bold">Meus Favoritos</Text>
      </View>

      {loading && favoriteCompanies.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#092D5D" />
        </View>
      ) : favoriteCompanies.length === 0 ? (
        <View className="flex-1 justify-center items-center gap-2">
          <Ionicons name="heart-outline" size={48} color="#9ca3af" />
          <Text className="text-gray-500 text-sm font-semibold">Nenhum estabelecimento favoritado.</Text>
          <TouchableOpacity
            onPress={() => router.replace("/(private)/(tabs)/(client-tabs)/home")}
            className="mt-4 bg-[#092D5D] px-6 py-2.5 rounded-full"
          >
            <Text className="text-white text-xs font-bold">Explorar Salões</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <AppCardCompany
          companies={favoriteCompanies}
          isRefetching={loading}
          favoritedCompanyIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </SafeAreaView>
  );
}

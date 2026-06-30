import { useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNewHomeViewModel } from "./useNewHomeViewModel";
import { AppCardCompany } from "@/shared/components/AppCardCompany";
import { AppHeader } from "@/shared/components/AppHeader";
import { useUserStore } from "@/shared/store/user-store";
import { Ionicons } from "@expo/vector-icons";
import { AppMapModal } from "@/shared/components/AppMapModal";

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
    searchMode,
    setSearchMode,
    addressText,
    setAddressText,
    radius,
    setRadius,
    geoLoading,
    handleAddressSearch,
  } = props;

  const { user, access_token } = useUserStore();
  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppHeader user={user} token={access_token} />

      {/* Tab Switcher (Explorar / Buscar) */}
      <View className="flex-row justify-between bg-gray-100 p-1 mx-5 mt-4 rounded-xl border border-gray-200/50">
        <TouchableOpacity
          onPress={() => setSearchMode("explorar")}
          activeOpacity={0.8}
          className={`flex-1 py-2 rounded-lg items-center ${searchMode === "explorar" ? "bg-white shadow-sm" : ""}`}
        >
          <Text className={`text-xs font-bold ${searchMode === "explorar" ? "text-[#092D5D]" : "text-gray-500"}`}>
            Explorar
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSearchMode("buscar")}
          activeOpacity={0.8}
          className={`flex-1 py-2 rounded-lg items-center ${searchMode === "buscar" ? "bg-white shadow-sm" : ""}`}
        >
          <Text className={`text-xs font-bold ${searchMode === "buscar" ? "text-[#092D5D]" : "text-gray-500"}`}>
            Buscar Próximos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Condicional Panels */}
      {searchMode === "explorar" ? (
        <>
          {/* Search Input Section */}
          <View className="px-5 mt-4 mb-3">
            <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
              <Ionicons name="search-outline" size={20} color="#9ca3af" className="mr-2" />
              <TextInput
                placeholder="Buscar por estabelecimento..."
                placeholderTextColor="#9ca3af"
                value={searchText}
                onChangeText={setSearchText}
                className="flex-1 text-gray-800 text-sm p-0 h-5"
              />
              {searchText.length > 0 && (
                <TouchableOpacity onPress={() => setSearchText("")} activeOpacity={0.7}>
                  <Ionicons name="close-circle" size={18} color="#9ca3af" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Horizontal Categories Menu */}
          <View className="mb-4">
            {categoriesIsLoading ? (
              <ActivityIndicator size="small" className="my-2" />
            ) : (
              <FlatList
                data={[{ id: null, name: "Todas" }, ...categoriesData]}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => (item.id === null ? "all" : String(item.id))}
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
                          isSelected ? "text-white" : "text-gray-600"
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
        </>
      ) : (
        /* Proximity Search Panel */
        <View className="px-5 mt-4 mb-4">
          <View className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm gap-3">
            <Text className="text-[#092D5D] font-bold text-sm">Buscar por Proximidade</Text>
            
            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
              <Ionicons name="location-outline" size={20} color="#9ca3af" className="mr-2" />
              <TextInput
                placeholder="Digite seu endereço (ex: Av. Paulista)"
                placeholderTextColor="#9ca3af"
                value={addressText}
                onChangeText={setAddressText}
                className="flex-1 text-gray-800 text-sm p-0 h-6"
              />
            </View>
            
            <View className="flex-row items-center justify-between mt-1">
              <Text className="text-gray-500 text-xs font-semibold">Raio de busca:</Text>
              <View className="flex-row gap-1.5">
                {[5, 15, 25, 50].map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRadius(r)}
                    activeOpacity={0.7}
                    className={`px-3 py-1 rounded-full border ${
                      radius === r ? "bg-[#CBA35D]/10 border-[#CBA35D]" : "bg-white border-gray-200"
                    }`}
                  >
                    <Text className={`text-[10px] font-bold ${radius === r ? "text-[#092D5D]" : "text-gray-500"}`}>
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
              <Text className="text-[#FAF8EF] text-sm font-bold">
                {geoLoading ? "Buscando..." : "Buscar salões próximos"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 px-5">
        {searchMode === "buscar" ? "Estabelecimentos Encontrados" : "Estabelecimentos Recomendados"}
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
      {selectedCompany && selectedCompany.latitude && selectedCompany.longitude && (
        <AppMapModal
          isOpen={isMapOpen}
          onClose={() => setIsMapOpen(false)}
          latitude={selectedCompany.latitude}
          longitude={selectedCompany.longitude}
          companyName={selectedCompany.name}
        />
      )}
    </SafeAreaView>
  );
}

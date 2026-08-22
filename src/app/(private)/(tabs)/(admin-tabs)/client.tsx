import { useState } from "react";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { AppSearchBar } from "@/shared/components/AppSearchBar";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useClientViewModel } from "@/viewModel/Admin/Clients/useClientViewModel";
import { ImportClientsContent } from "@/viewModel/Clients/ImportClientsModal";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { router } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";

export default function ClientPageList() {
  const {
    clientRefetch,
    clientDataPagged,
    clientIsRefetching,
    clientIsLoading,
    clientHasNextPage,
    clientFetchNextPage,
    clientIsFetchingNextPage,
    isLoading,
    searchValue,
    setSearchValue,
  } = useClientViewModel(undefined);
  const { safePush } = useSafeNavigation();
  const { openBottomSheet } = useBottomSheetContext();

  const handleOpenImport = () => {
    openBottomSheet(
      <ImportClientsContent onClose={() => {}} />,
      1
    );
  };

  return (
    <View className="flex-1 bg-background-primary">
      <KeyboardContainer>
        <View className="flex-1 bg-background-primary">
          <AppAdminHeader
            title="Clientes"
            iconRightName="add"
            leftIconShown
            action={() => safePush(`/clients/client-create`)}
            iconRight={{ icon: true, path: "/clients/client-create" }}
          />

          {/* Search Bar */}
          <View className="px-4 mb-2 mt-1">
            <AppSearchBar
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder="Buscar cliente por nome..."
            />
          </View>

          {/* Importar Clientes - small link */}
          <TouchableOpacity
            onPress={handleOpenImport}
            activeOpacity={0.7}
            className="flex-row items-center gap-1.5 px-4 mb-3"
          >
            <Ionicons name="cloud-upload-outline" size={15} color={colors["app-theme-secundary"] || "#CBA35D"} />
            <Text className="text-accent-gold text-xs font-semibold">Importar contatos</Text>
            <Ionicons name="chevron-forward" size={12} color={colors["app-theme-secundary"] || "#CBA35D"} />
          </TouchableOpacity>

          <AppCard
            data={clientDataPagged
              .filter((c) => c.id !== undefined)
              .map((c) => ({
                id: c.id!,
                title: c.name,
                imgUrl: c.profileUrl,
                phone: c.phone,
              }))}
            onItemPress={(item) => {
              router.push({
                pathname: "/(private)/(crud)/clients/[id]",
                params: { id: item.id, from: "agenda" },
              });
            }}
            path="/clients/"
            isRefetching={clientIsRefetching}
            fetchNextPage={clientFetchNextPage}
            hasNextPage={clientHasNextPage}
            isFetchingNextPage={clientIsFetchingNextPage}
            onRefetch={clientRefetch}
          />
        </View>
      </KeyboardContainer>
    </View>
  );
}

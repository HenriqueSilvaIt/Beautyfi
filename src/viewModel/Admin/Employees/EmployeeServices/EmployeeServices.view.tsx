import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useEmployeeServicesViewModel } from "./useEmployeeServicesViewModel";
import { useCallback } from "react";
import { CompanyServicesInterface } from "@/shared/interfaces/http/company-services";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppEmptyList } from "@/shared/components/AppEmptyList";
import { useFormContext } from "react-hook-form";
import { EmployeeFormData } from "../employee.scheme";

export function EmployeeServicesView() {
  const {
    services,
    refetch,
    toggleService,
    toggleSelectAll,
    isAllSelected,
    selectedServices,
    isRefetching,
    isLoading,
    handleOpenCustomServiceModal,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useEmployeeServicesViewModel();
  const { watch, setValue } = useFormContext<EmployeeFormData>();

  const employeeId = watch("id");
  const renderItem = useCallback(
    ({ item }: { item: CompanyServicesInterface }) => {
      const checked = selectedServices.some((s) => s.id === item.id);

      return (
        <View className="mx-4 my-1 bg-background-quartenary p-3.5 rounded-xl flex-row items-center justify-between border border-background-tertiary">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleService(Number(item.id))}
            className="flex-1 flex-row items-center"
          >
            {item.imgUrl ? (
              <Image
                source={{ uri: item.imgUrl }}
                resizeMode="cover"
                className="w-12 h-12 rounded-lg bg-background-tertiary mr-3"
              />
            ) : (
              <View className="w-12 h-12 rounded-lg bg-background-tertiary mr-3 items-center justify-center">
                <Ionicons name="cut-outline" size={20} color={colors.gray[400]} />
              </View>
            )}
            <View className="flex-1 pr-2">
              <Text className="text-font-primary text-base font-bold" numberOfLines={1}>
                {item.name}
              </Text>
              {item.price !== undefined && (
                <Text className="text-gray-400 text-xs mt-0.5">
                  Valor padrão: R$ {Number(item.price).toFixed(2).replace(".", ",")}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            {checked && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  handleOpenCustomServiceModal(
                    employeeId ? Number(employeeId) : 1,
                    Number(item.id),
                  )
                }
                className="px-3 py-2 bg-accent-blue/10 rounded-lg flex-row items-center"
              >
                <Ionicons name="create-outline" size={16} color={colors["accent-blue"]} />
                <Text className="text-accent-blue text-xs font-semibold ml-1">Editar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => toggleService(Number(item.id))}
              activeOpacity={0.7}
              className="p-2"
            >
              <Ionicons
                name={checked ? "checkbox" : "square-outline"}
                size={24}
                color={checked ? colors["accent-blue"] : colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [toggleService, selectedServices, handleOpenCustomServiceModal, employeeId],
  );

  return (
    <SafeAreaView className="flex-1">
      <AppAdminHeader
        title="Associar serviço"
        iconRightName={undefined}
        iconRight={{ icon: true, path: "" }}
      />

      <View className=" items-center *:mb-3 ml-2">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleSelectAll}
          className="flex-row gap-2 items-center"
        >
          <Text className="text-base font-bold text-end text-font-primary">
            {isAllSelected ? "Desmarcar todos" : "Selecionar todos"}
          </Text>
          <MaterialCommunityIcons
            size={40}
            name={isAllSelected ? "toggle-switch" : "toggle-switch-off"}
            color={isAllSelected ? colors["accent-blue"] : colors.white}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        contentContainerStyle={{ paddingBottom: 80, gap: 5 }}
        data={services}
        initialNumToRender={5} // ajuda na performance
        maxToRenderPerBatch={10} // controla quantos elementos renderizar por vez
        renderItem={renderItem}
        keyExtractor={(item) => item.id!.toString()}
        ListEmptyComponent={<AppEmptyList />}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator />
          ) : (
            <View className="justify-center items-center px-6 ">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.8}
                className="px-6 py-2 rounded-md bg-app-theme-primary items-center justify-center"
              >
                <Text className="text-font-primary text-center text-base font-bold">
                  Voltar
                </Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

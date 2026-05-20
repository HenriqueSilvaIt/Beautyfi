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
        <View className="flex-row  justify-between py-2  px-2 items-center bg-background-quartenary gap-3">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => toggleService(Number(item.id))}
          >
            <View className="flex-row p-2   items-center">
              <Image
                source={{ uri: item.imgUrl }}
                resizeMode="cover"
                className="w-[60px] h-[60px] mr-2"
              />
              <Text
                className="text-font-primary text-base max-w-[200px]"
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {item.name}
              </Text>
            </View>
          </TouchableOpacity>
          <View className="flex-row gap-2 items-center">
            <TouchableOpacity
              onPress={() => toggleService(Number(item.id))}
              activeOpacity={0.7}
            >
              <Text
                className={`p-3 rounded-xl text-center ${checked ? "text-font-primary" : " text-gray-200"}`}
              >
                {checked ? "✅" : "⬜"} {item.id}
              </Text>
            </TouchableOpacity>

            {checked && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  handleOpenCustomServiceModal(
                    1, // id do profissional atual
                    Number(item.id), // id do serviço
                  )
                }
              >
                <Text className="p-2 rounded-xl text-center bg-background-tertiary text-font-primary">
                  ✏️ Editar
                </Text>
              </TouchableOpacity>
            )}
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

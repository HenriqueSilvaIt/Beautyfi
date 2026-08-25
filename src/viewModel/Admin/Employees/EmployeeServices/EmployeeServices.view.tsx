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
  const { watch } = useFormContext<EmployeeFormData>();

  const employeeId = watch("id");

  const renderItem = useCallback(
    ({ item }: { item: CompanyServicesInterface }) => {
      const checked = selectedServices.some((s) => s.id === item.id);

      return (
        <View
          className={`mx-5 my-1.5 p-4 rounded-2xl border shadow-sm flex-row items-center justify-between ${
            checked
              ? "bg-[#092D5D]/5 border-[#092D5D]"
              : "bg-white border-gray-100"
          }`}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => toggleService(Number(item.id))}
            className="flex-1 flex-row items-center mr-2"
          >
            {item.imgUrl ? (
              <Image
                source={{ uri: item.imgUrl }}
                resizeMode="cover"
                className="w-12 h-12 rounded-2xl bg-gray-100 mr-3.5 border border-gray-200"
              />
            ) : (
              <View className="w-12 h-12 rounded-2xl bg-[#092D5D]/10 border border-[#092D5D]/20 mr-3.5 items-center justify-center">
                <Ionicons name="cut" size={22} color="#092D5D" />
              </View>
            )}
            <View className="flex-1 pr-1">
              <Text className="text-gray-900 text-sm font-extrabold" numberOfLines={1}>
                {item.name}
              </Text>
              {item.price !== undefined && (
                <Text className="text-gray-500 text-xs font-semibold mt-0.5">
                  Preço padrão: R$ {Number(item.price).toFixed(2).replace(".", ",")}
                </Text>
              )}
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center gap-2.5">
            {checked && (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  handleOpenCustomServiceModal(
                    employeeId ? Number(employeeId) : 1,
                    Number(item.id),
                  )
                }
                className="px-3 py-1.5 bg-[#092D5D]/10 border border-[#092D5D]/30 rounded-xl flex-row items-center"
              >
                <Ionicons name="create-outline" size={14} color="#092D5D" />
                <Text className="text-[#092D5D] text-xs font-extrabold ml-1">Preço/Turno</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => toggleService(Number(item.id))}
              activeOpacity={0.7}
              className="items-center justify-center p-1"
            >
              <Ionicons
                name={checked ? "checkmark-circle" : "ellipse-outline"}
                size={26}
                color={checked ? "#092D5D" : "#d1d5db"}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    [toggleService, selectedServices, handleOpenCustomServiceModal, employeeId],
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppAdminHeader
        title="Associar Serviços"
        iconRightName={undefined}
        iconRight={{ icon: true, path: "" }}
      />

      {/* Bar de Selecionar Todos */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-gray-50 border-y border-gray-100 mb-2">
        <Text className="text-gray-700 text-xs font-extrabold uppercase tracking-wider">
          Serviços do Salão ({services.length})
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleSelectAll}
          className="flex-row items-center gap-1.5"
        >
          <Text className="text-xs font-bold text-[#092D5D]">
            {isAllSelected ? "Desmarcar todos" : "Selecionar todos"}
          </Text>
          <MaterialCommunityIcons
            size={28}
            name={isAllSelected ? "toggle-switch" : "toggle-switch-off"}
            color={isAllSelected ? "#092D5D" : "#9ca3af"}
          />
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={{ paddingBottom: 90 }}
        data={services}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        renderItem={renderItem}
        keyExtractor={(item) => item.id!.toString()}
        ListEmptyComponent={<AppEmptyList message="Nenhum serviço cadastrado" />}
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
            <ActivityIndicator color="#092D5D" className="py-4" />
          ) : (
            <View className="justify-center items-center px-5 pt-4">
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.85}
                className="w-full h-14 rounded-2xl bg-[#092D5D] items-center justify-center shadow-md"
              >
                <Text className="text-white font-black text-sm uppercase tracking-wide">
                  Concluir Associação
                </Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

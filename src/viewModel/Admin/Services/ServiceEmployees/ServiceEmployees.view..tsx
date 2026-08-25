import {
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useCallback } from "react";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { router } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppEmptyList } from "@/shared/components/AppEmptyList";
import { useServiceEmployeesViewModel } from "./useServiceEmployeesViewModel";
import { EmployeeInterface } from "@/shared/interfaces/http/employee";

export function ServiceEmployeesView() {
  const {
    employees,
    refetch,
    toggleEmployee,
    toggleSelectAll,
    isAllSelected,
    selectedEmployees,
    isRefetching,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useServiceEmployeesViewModel();

  const renderItem = useCallback(
    ({ item }: { item: EmployeeInterface }) => {
      const checked = selectedEmployees.some((s) => s.id === item.id);

      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleEmployee(Number(item.id))}
          className={`mx-5 my-1.5 p-4 rounded-2xl border shadow-sm flex-row items-center justify-between ${
            checked
              ? "bg-[#092D5D]/5 border-[#092D5D]"
              : "bg-white border-gray-100"
          }`}
        >
          <View className="flex-row items-center flex-1 mr-3">
            {item.avatarUrl ? (
              <Image
                source={{ uri: item.avatarUrl }}
                resizeMode="cover"
                className="w-12 h-12 rounded-full border border-gray-200 mr-3.5 bg-gray-100"
              />
            ) : (
              <View className="w-12 h-12 rounded-full bg-[#092D5D]/10 border border-[#092D5D]/20 items-center justify-center mr-3.5">
                <Ionicons name="person" size={22} color="#092D5D" />
              </View>
            )}

            <View className="flex-1">
              <Text
                className="text-gray-900 text-sm font-extrabold"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text className="text-gray-400 text-xs font-medium mt-0.5" numberOfLines={1}>
                {item.phone || item.email || "Profissional do salão"}
              </Text>
            </View>
          </View>

          <View className="items-center justify-center">
            <Ionicons
              name={checked ? "checkmark-circle" : "ellipse-outline"}
              size={26}
              color={checked ? "#092D5D" : "#d1d5db"}
            />
          </View>
        </TouchableOpacity>
      );
    },
    [toggleEmployee, selectedEmployees],
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppAdminHeader
        title="Associar Profissionais"
        iconRightName={undefined}
        iconRight={{ icon: true, path: "" }}
      />

      {/* Bar de Selecionar Todos */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-gray-50 border-y border-gray-100 mb-2">
        <Text className="text-gray-700 text-xs font-extrabold uppercase tracking-wider">
          Profissionais da Equipe ({employees.length})
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
        data={employees}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
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

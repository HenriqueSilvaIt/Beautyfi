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
import {  MaterialCommunityIcons } from "@expo/vector-icons";
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
          activeOpacity={0.7}
          onPress={() => toggleEmployee(Number(item.id))}
        >
          <View className="flex-row  justify-between py-2  px-2 items-center bg-background-quartenary gap-3">
            <View className="flex-row p-2   items-center">
              <Image
                source={{ uri: item.avatarUrl }}
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
            <View className="max-h-[60-px]">
              <Text
                className={`p-3 rounded-xl text-center ${
                  checked ? " text-font-primary" : "bg-gray-800 text-gray-200"
                }`}
              >
                {checked ? "✅ " : "⬜ "} {item.id}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },
    [toggleEmployee, selectedEmployees],
  );

  return (
    <SafeAreaView className="flex-1">
      <AppAdminHeader
        title="Associar funcionário"
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
        data={employees}
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
          isFetchingNextPage ? <ActivityIndicator />  :
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
        }
      />
    </SafeAreaView>
  );
}

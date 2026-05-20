import {
  ActivityIndicator,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native";
import { EmployeeProps } from "../../../interfaces/http/employee";
import { useCallback } from "react";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { AppEmptyList } from "../../AppEmptyList";

interface CompanyEmployeesProps {
  data: EmployeeProps[];
  refreshing: boolean;
  isAdmin?: boolean;
  onRefresh: () => void;
  openBottomSheet: (content: React.ReactNode, index: number) => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  fetchNextPage?: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<unknown, unknown>, Error>
  >;
}

export function CompanyEmployees({
  data,
  refreshing,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  fetchNextPage,
  openBottomSheet,
  onRefresh,
  isAdmin,
}: CompanyEmployeesProps) {
  const renderItem = useCallback(
    ({ item }: { item: EmployeeProps }) => (
      <TouchableOpacity
        className="px-5 py-2 "
        onPress={() =>
          openBottomSheet(
            <View className="w-full h-full">
              <Image
                source={{ uri: item.avatarUrl }}
                resizeMode="cover"
                className="w-full h-[400px]"
              />

              <Text className="text-font-primary text-center text-2xl font-semibold mt-5">
                {item.name}
              </Text>

              <View className="px-2 mt-5">
                <Text className="text-font-primary text-center text-xl font-semibold">
                  Descrição
                </Text>
                <Text className="text-gray-600 text-sm mt-2">
                  {item.description}
                </Text>
              </View>
            </View>,
            1,
          )
        }
      >
        <View className=" gap-2   items-center  rounded-lg py-2 px-5 justify-between">
          <View className="items-center">
            <Image
              className="h-[40px] w-[40px] rounded-full border-4 border-app-theme-primary"
              source={{ uri: item?.avatarUrl }}
              resizeMode="cover"
            />
            <View>
              <Text className="ml-4 text-font-primary text-base">{item?.name}</Text>
              <Text className="ml-4 text-gray-600 text-base">
                {item.name === "Christian" ? "Gestor" : "Membro"}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <FlatList
      data={data}
      horizontal
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => `employees-${item.id}`}
      nestedScrollEnabled
      scrollEventThrottle={16}
      renderItem={renderItem}
      directionalLockEnabled
      showsHorizontalScrollIndicator={false}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
          fetchNextPage();
        }
      }}
      ListEmptyComponent={<AppEmptyList title="Não há profissionais a exibir" iconName="person-outline"/>}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
}

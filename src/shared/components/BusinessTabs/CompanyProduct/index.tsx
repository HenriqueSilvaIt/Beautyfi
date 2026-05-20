import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import {
  ProductHttpResponse,
  ProductProps,
} from "../../../interfaces/http/product";
import { useCallback } from "react";
import { AppEmptyList } from "../../AppEmptyList";
import { ActivityIndicator } from "react-native";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";

interface CompanyProductAppProps {
  data: ProductProps[];
  isRefreshing: boolean;
  onRefresh: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  fetchNextPage?: (
    options?: RefetchOptions | undefined,
  ) => Promise<
    QueryObserverResult<InfiniteData<ProductHttpResponse, unknown>, Error>
  >;
}

export function CompanyProduct({
  data,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  fetchNextPage,
  isRefreshing,
  onRefresh,
}: CompanyProductAppProps) {
  const safeData = data?.filter(Boolean) ?? [];
  const renderItem = useCallback(
    ({ item }: { item: ProductProps }) => (
      <Pressable className="w-full gap-2 px-10 max-h-[200px]">
        <View className="flex-row border-2 items-center border-gray-600 my-2  gap-2 mx-2 rounded-xl p-3">
          {item.imgUrl ? (
            <Image
              source={{ uri: item.imgUrl }}
              className="h-[60px] w-[60px] rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <Image
              source={require("@assets/images/logo.png")}
              className="h-[60px] w-[60px] rounded-lg"
              resizeMode="cover"
            />
          )}
          <View className="  mt-2 w-full ">
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              className="text-xs  leading-5 text-font-primary font-semibold text-start"
            >
              {item.name}
            </Text>

            <Text className="text-base text-green-400  font-bold text-start">
              R$ {item.price.toFixed(2)}
            </Text>
          </View>
        </View>
      </Pressable>
    ),
    [],
  );

  return (
    <FlatList
      data={safeData}
      nestedScrollEnabled
      directionalLockEnabled
      contentContainerStyle={{ maxHeight: "auto" }}
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
          fetchNextPage();
        } 
      }}
      ListEmptyComponent={
        <AppEmptyList
          title="Não há produtos a exibir"
          iconName="cut-outline"
        />
      }
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      onEndReachedThreshold={0.5}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
}

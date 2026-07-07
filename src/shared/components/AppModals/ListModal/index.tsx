import { moneyMapper } from "@/utils/moneyMapper";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface ListModalItemBase {
  title?: string;
  description?: string;
  imgUrl?: string;
  price?: number;
  id?: number;
  email?: string;
  phone?: string;
}

export interface ListModalProps<T extends ListModalItemBase> {
  data: T[];
  keyExtractor?: (item: T, index: number) => string;
  isRefreshing: boolean;
  getList?: () => Promise<unknown>;
  onItemPress?: (item: T) => void;

  onRefetch?: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<InfiniteData<unknown, unknown>, Error>>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isRefetching?: boolean;
  fetchNextPage?: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<unknown, unknown>, Error>
  >;
}

export function ListModal<T extends ListModalItemBase>({
  data,
  isRefreshing,
  getList,
  onItemPress,
  keyExtractor,
  onRefetch,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isRefetching,
  fetchNextPage,
}: ListModalProps<T>) {
  const renderItem = useCallback(
    ({ item }: { item: T }) => (
      <TouchableOpacity
        onPress={() => onItemPress?.(item)}
        activeOpacity={0.7}
        className="px-2"
      >
        <View className="flex-row px-3 gap-4 items-center bg-background-tertiary rounded-xl mb-3">
          {/* IMAGEM SEGURA */}
          <View className="p-2 flex-row items-center gap-2">
            {item.imgUrl ? (
              <Image
                source={{ uri: item.imgUrl }}
                className="w-[40px] h-[40px] rounded-full"
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require("@assets/images/logo.png")}
                className="w-[40px] h-[40px] rounded-full"
                resizeMode="cover"
              />
            )}

            <View className="flex-1">
              <Text
                className="text-font-primary font-bold text-base"
                numberOfLines={1}
              >
                {item.title ?? "Sem nome"}
              </Text>

              {item.description && (
                <Text className="text-gray-600 mt-1 text-sm" numberOfLines={1}>
                  {item.description}
                </Text>
              )}

              {item.price && (
                <Text className="text-font-primary mt-1 text-sm">
                  R$ {moneyMapper(item.price)}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [onItemPress],
  );

  return (
    <View className="w-full max-h-[80%] bg-background-secondary rounded-2xl p-3">
      <FlatList
        data={data ?? []}
        keyExtractor={
          keyExtractor ??
          ((item, index) => (item.id ? item.id.toString() : index.toString()))
        }
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: data?.length === 0 ? 1 : 0,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={getList} />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-600">Nenhum item encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { AppointmentHttpResponse } from "@/shared/interfaces/http/appointment";
import { colors } from "@/styles/colors";
import { moneyMapper } from "@/utils/moneyMapper";
import { Ionicons } from "@expo/vector-icons";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { useCallback } from "react";
import {
  FlatList,
  Image,
  Linking,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppEmptyList } from "../AppEmptyList";

export interface AppCardItemBase {
  title?: string;
  description?: string;
  imgUrl?: string;
  price?: number;
  id?: number | string;
  email?: string;
  phone?: string;
}

export interface AppCardProps<T extends AppCardItemBase> {
  data: T[];
  path: string;
  onItemPress?: (item: T) => void;
  onRefetch?: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<InfiniteData<unknown, unknown>, Error>>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isRefetching: boolean;
  fetchNextPage?: (
    options?: FetchNextPageOptions,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<unknown, unknown>, Error>
  >;
}

export function AppCard<T extends AppCardItemBase>({
  data,
  path,
  onItemPress,
  onRefetch,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isRefetching,
  fetchNextPage,
}: AppCardProps<T>) {
  const { safePush } = useSafeNavigation();

  const renderItem = useCallback(
    ({ item }: { item: T }) => (
      <TouchableOpacity
        onPress={() => {
          if (onItemPress) return onItemPress(item);
          if (item.id) safePush(`${path}${item.id}`);
        }}
        activeOpacity={0.8}
        className="px-2"
      >
        <View className="flex-row px-3 gap-4 items-center  max-h-[100%] bg-background-tertiary rounded-xl mb-3">
          {item.imgUrl ? (
            <Image
              source={{ uri: item.imgUrl }}
              className="w-[60px] h-[60px] rounded-full my-2 "
              resizeMode="cover"
            />
          ) : (
              <Image
              source={require("@assets/images/logo.png")}
              className="w-[60px] h-[60px] rounded-full my-2 "
              resizeMode="cover"
            />
          )}

          <View className="flex-1">
            {item.title && (
              <Text
                className="text-font-primary font-bold text-base"
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {item.title}
              </Text>
            )}
            {item.description && (
              <Text
                className="text-gray-600 mt-1 text-sm"
                ellipsizeMode="tail"
                numberOfLines={1}
              >
                {item.description}
              </Text>
            )}
            {item.price != null && (
              <Text className="text-font-primary mt-1 text-sm">
                R$ {moneyMapper(item.price)}
              </Text>
            )}
          </View>
          {item.phone && (
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://api.whatsapp.com/send?phone=55${item.phone}`,
                )
              }
            >
              <Ionicons name="logo-whatsapp" size={30} color={colors.white} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    ),
    [onItemPress, path, safePush],
  );

  return (
    <FlatList
      style={{ flex: 1 }}
      contentContainerStyle={{
        paddingVertical: 16,
        flexGrow: data.length === 0 ? 1 : 0,
        paddingBottom: 24,
      }}
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage?.();
        }
      }}
      data={data ?? []} // garante que nunca seja undefined
      keyExtractor={(item, index) =>
        item.id != null ? item.id.toString() : index.toString()
      }
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefetch} />
      }
      ListEmptyComponent={
        isLoading ? null : (
          <AppEmptyList
            iconName="cut-outline"
            title="Lista vazia"
            description="Não há nenhum item na lista"
          />
        )
      }
      renderItem={renderItem}
      initialNumToRender={5}
      maxToRenderPerBatch={10}
    />
  );
}

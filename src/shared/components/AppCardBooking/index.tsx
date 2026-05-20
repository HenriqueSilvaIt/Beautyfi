import { CompanyServicesInterface } from "@/shared/interfaces/http/company-services";
import { moneyMapper } from "@/utils/moneyMapper";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
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
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppEmptyList } from "../AppEmptyList";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";

interface AppCardBookingServiceProps {
  title: string;
  description?: string;
  imgUrl?: string;
  price?: number;
  id?: number;
  phone?: string;
}

interface AppCardBookingProps<T extends AppCardBookingServiceProps> {
  data?: T[];
  onRefetch?: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<InfiniteData<unknown, unknown>, Error>>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isRefetching?: boolean;
  fetchNextPage?: (
    options?: FetchNextPageOptions,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<unknown, unknown>, Error>
  >;
  handleSelect: (item: T) => void;
}

export function AppCardBooking<T extends AppCardBookingServiceProps>({
  data,
  onRefetch,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isRefetching,
  fetchNextPage,
  handleSelect,
}: AppCardBookingProps<T>) {
  const renderItem = useCallback(
    ({ item }: { item: T }) => (
      <TouchableOpacity
        onPress={() => handleSelect(item)}
        activeOpacity={0.8}
        className="px-3"
      >
        <View className="flex-row  px-3 gap-4 items-center bg-background-tertiary rounded-xl mb-3">
          <View className="mt-3">
            { item.imgUrl ? (<Image
              source={{ uri: item.imgUrl }}
              className=" w-[80px] h-[80px] rounded-full"
              resizeMode="cover"
            /> ) : (
           <Image
              source={require("@assets/images/logo.png")}
              className=" w-[80px] h-[80px] rounded-full"
              resizeMode="cover"
            /> 
          )}
          </View>

          <View className="flex-1">
            <Text
              className="text-font-primary font-bold text-base"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.title}
            </Text>

            {item.description && (
              <Text
                className="text-gray-600 mt-1 text-sm"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.description}
              </Text>
            )}

            {item.price && (
              <Text
                className="text-font-primary mt-1 text-sm"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                R$ {moneyMapper(item.price)}
              </Text>
            )}

            {item.phone && (
              <View>
                <Text className="text-font-primary text-2xl ">{item.phone}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    ),
    [handleSelect],
  );

  return (
    <>
      <BottomSheetFlatList
        data={data ?? []}
        style={{
          backgroundColor: "transparent", 
        }}
        contentContainerStyle={{
          paddingVertical: 16,
          flexGrow: data?.length === 0 ? 1 : 0,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage?.();
          }
        }}
        initialNumToRender={5} // ajuda na performance
        maxToRenderPerBatch={10} // controla quantos elementos renderizar por vez
        keyExtractor={(item: any) => item.id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching ? isRefetching : false}
            onRefresh={onRefetch}
          />
        }
        onEndReachedThreshold={0.3}
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
      />
    </>
  );
}

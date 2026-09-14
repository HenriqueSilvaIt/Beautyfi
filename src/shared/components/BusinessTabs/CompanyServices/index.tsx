import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CompanyServicesProps } from "../../../interfaces/http/company-services";
import { router } from "expo-router";
import { useUserStore } from "../../../store/user-store";
import { format } from "date-fns";
import { useCallback, useState, useEffect, useRef } from "react";
import { useScheduleViewModel } from "@/viewModel/Schedule/useSchedule.viewModel";
import { AppEmptyList } from "../../AppEmptyList";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";

interface CompanyServicesAppProps {
  data: CompanyServicesProps[];
  isRefreshing: boolean;
  onRefresh: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  fetchNextPage?: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<unknown, unknown>, Error>
  >;
  selectedServices: number[];
  setSelectedServices: React.Dispatch<React.SetStateAction<number[]>>;
}

export function CompanyServices({
  data,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isRefreshing,
  fetchNextPage,
  onRefresh,
  selectedServices,
  setSelectedServices,
}: CompanyServicesAppProps) {
  const { user, access_token } = useUserStore();

  function toggleService(id: number) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  const renderItem = ({ item }: { item: CompanyServicesProps }) => {
    const isSelected = selectedServices.includes(item.id);

    return (
      <Pressable onPress={() => toggleService(item.id)} 
      className="px-10 w-full">
        <View
          className={`flex-row my-2 mx-3 items-center rounded-xl p-3 border-2 ${
            isSelected ? "border-app-theme-primary" : "border-gray-600"
          }`}
        >
          <View className="items-center">
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
          </View>

          <View className=" gap-1 ml-3">
            <Text
              numberOfLines={4}
              ellipsizeMode="tail"
              className="text-font-primary text-sm font-semibold max-w-[220px] leading-5"
            >
              {item.name}
            </Text>
            <Text numberOfLines={1} className="text-gray-500 text-sm">
              {item.duration} min
            </Text>
            {item.priceDescription ? (
              <Text className="text-sm leading-5" numberOfLines={4}>
                {item.priceDescription
                  ?.split(/(\d+[.,]?\d*)/)
                  .map((part, index) => {
                    const isNumber = /^\d+[.,]?\d*$/.test(part);
                    return (
                      <Text
                        key={index}
                        className={
                          isNumber
                            ? "text-sm text-green-400 font-bold"
                            : "text-gray-600"
                        }
                      >
                        {isNumber ? `R$ ${part}` : part}
                      </Text>
                    );
                  })}
              </Text>
            ) : (
              <Text className="text-green-400 font-bold text-base">
                {item.priceStartingFrom ? "A partir de " : ""}R$ {item.price.toFixed(2).replace(".", ",")}
              </Text>
            )}
          </View>
        </View>
      </Pressable>
    );
  };
  return (
    <FlatList<CompanyServicesProps>
      data={data}
      nestedScrollEnabled
      contentContainerStyle={{ paddingBottom: 120 }}
      showsHorizontalScrollIndicator={false}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
          fetchNextPage();
        }
      }}
      ListEmptyComponent={
        <AppEmptyList
          title="Não há serviços a exibir"
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
      scrollEventThrottle={16}
      directionalLockEnabled
    />
  );
}

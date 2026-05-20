import { StripePlanItemDTO } from "@/shared/interfaces/http/stripe";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { Image, Text, View, FlatList, TouchableOpacity } from "react-native";
import { AppEmptyList } from "../AppEmptyList";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { DeleteModal } from "../AppDeleteModal";

interface AppPlanItemCardProps {
  plantItemsPagged: StripePlanItemDTO[];
  onRefetch?: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<InfiniteData<unknown, unknown>, Error>>;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isLoading?: boolean;
  isRefetching: boolean;
  fetchNextPage?: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<InfiniteData<unknown, unknown>, Error>
  >;
  type?: "admin" | "client";
  handleRemoveItemFromPlan?: (itemId: number) => Promise<void>;
  selectedItemId?: number;
  setSelectedItemId?: (id: number) => void;
  removeModalVisible: boolean;
  handleHideModal?: () => void;
  isRemovingItem: boolean;
}

export function AppPlanItemCard({
  plantItemsPagged,
  onRefetch,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isRefetching,
  fetchNextPage,
  handleRemoveItemFromPlan,
  type,
  selectedItemId,
  setSelectedItemId,
  removeModalVisible,
  handleHideModal,
  isRemovingItem,
}: AppPlanItemCardProps) {
  const isAdmin = type === "admin";

  const renderItem = ({
    item,
    index,
  }: {
    item: StripePlanItemDTO;
    index: number;
  }) => {
    return (
      <View
        className={`mb-2 p-3 ${
          index === plantItemsPagged.length - 1
            ? ""
            : "border-b border-gray-700"
        }`}
      >
        <View className="flex-row items-center gap-3">
          <Image
            source={
              item.productImgUrl
                ? { uri: item.productImgUrl }
                : item.serviceImgUrl
                  ? { uri: item.serviceImgUrl }
                  : require("@assets/images/logo.png")
            }
            className="h-[30px] w-[30px] mb-2"
          />

          <View className="flex-1">
            <Text className="text-md text-font-primary font-medium">
              {item.productName ? item.productName : item.serviceName}
            </Text>

            <View className="flex-row items-center gap-2 mt-2">
              <Text className="text-sm text-gray-500">
                Quantidade permitida: {item.cutsAllowed}
              </Text>
            </View>

            {item.type === "SERVICE" && item.weekDays.length > 0 ? (
              <Text className="text-sm text-app-theme-primary mt-1">
                Disponível: {item.weekDays.join(", ")}
              </Text>
            ) : (
              item.type === "SERVICE" && (
                <Text className="text-sm text-gray-500 mt-1">
                  Disponível em qualquer dia da semana
                </Text>
              )
            )}
          </View>

          {item.discountPercentage > 0 && (
            <View className="ml-auto bg-green-500 px-2 py-1 rounded">
              <Text className="text-xs text-font-primary">
                {item.discountPercentage}% OFF
              </Text>
            </View>
          )}

          {isAdmin && (
            <TouchableOpacity
              className="items-center"
              onPress={() => {
                setSelectedItemId?.(item.id);
                handleHideModal?.();
              }}
            >
              <Ionicons name="trash-outline" size={20} color={colors.danger} />
              <Text className="text-[12px] text-font-primary mt-1">Remover</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={plantItemsPagged}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        refreshing={isRefetching}
        onRefresh={onRefetch}
        ListFooterComponent={
          isFetchingNextPage ? (
            <Text className="text-font-primary text-center my-4">
              Carregando mais itens...
            </Text>
          ) : null
        }
        contentContainerStyle={{
          paddingVertical: 16,
          flexGrow: plantItemsPagged.length === 0 ? 1 : 0,
          justifyContent:
            plantItemsPagged.length === 0 ? "center" : "flex-start", // Centraliza se estiver vazio
        }}
        ListHeaderComponent={() =>
          plantItemsPagged?.find((item) => item.weekDays.length > 0) &&
          !isAdmin && (
            <View className="mb-2 p-3">
              <Text
                className="text-app-theme-primary underline text-sm text-start"
                ellipsizeMode="tail"
                numberOfLines={2}
              >
                Alguns itens possuem dias específicos para serem utilizados,
                confira abaixo:
              </Text>
            </View>
          )
        }
        ListEmptyComponent={
          <AppEmptyList
            title="Nenhum item encontrado"
            iconName="invert-mode-outline"
          />
        }
      />

      {removeModalVisible && (
        <DeleteModal
          loading={isRemovingItem}
          visible={removeModalVisible}
          confirmationButtonText="Remover"
          hideModal={() => handleHideModal?.()}
          handleDelete={() => {
            handleRemoveItemFromPlan?.(Number(selectedItemId));
            handleHideModal?.();
          }}
          description="Tem certeza que deseja remover item do plano?"
          title="Remover item"
        />
      )}
    </>
  );
}

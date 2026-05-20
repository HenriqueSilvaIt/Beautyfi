import { EmployeeOption } from "@/shared/interfaces/http/available-appointments";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";
import { useUserStore } from "@/shared/store/user-store";

interface AppProfissionalSelectorProps {
  employeeId?: number | null;
  employees: EmployeeOption[];
  employeeIsSelected: boolean | undefined;
  handleEmployeeSelect: (employeeId?: number | null) => void;
  type?: "admin" | "client";
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
}

export function AppEmployeeSelector({
  employeeIsSelected,
  employees,
  employeeId,
  handleEmployeeSelect,
  type,
  onRefetch,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  isRefetching,
  fetchNextPage,
}: AppProfissionalSelectorProps) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={employees}
      keyExtractor={(item) => String(item.id)}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage && fetchNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.5}
      refreshing={isRefetching}
      contentContainerStyle={{
        justifyContent: "center",
        flexGrow: employees.length === 1 ? 1 : 0, // ✅ só centraliza com 1 item
      }}
      onRefresh={onRefetch}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator /> : null}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleEmployeeSelect(item.id)}>
          <View
            className={`ml-2 h-[130px] w-[105px]  p-5 mr-5 items-center  justify-center 
          ${
            employeeIsSelected && item.id === employeeId
              ? "border-app-theme-primary"
              : "border-gray-800"
          }
         ${
           type === "admin"
             ? "h-[80px] w-[70px] p-10"
             : "h-[110px] w-[95x] border rounded-md"
         }`}
          >
            <Image
              source={
                item.avatarUrl
                  ? { uri: item.avatarUrl }
                  : require("@assets/images/logo.png") 
              }
              className={`rounded-full border-2
                        ${
                          employeeIsSelected && item.id === employeeId
                            ? "border-app-theme-primary"
                            : "border-gray-800"
                        }
                        ${
                          type === "admin"
                            ? "h-[40px] w-[40px]"
                            : "h-[65px] w-[65px]"
                        }`}
              resizeMode="cover"
            />
            <Text
              className="text-font-primary text-sm font-semibold mt-2 w-[96px] text-center"
              ellipsizeMode="tail"
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}

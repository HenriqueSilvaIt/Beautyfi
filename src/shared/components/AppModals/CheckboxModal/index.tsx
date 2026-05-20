import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { useCallback } from "react";
import {
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface CheckboxItemsProps {
  id: number;
  name: string;
  value?: number;
  buttoName?: string;
}

export interface CheckboxModalProps<T extends CheckboxItemsProps> {
  data: T[];
  keyExtractor?: (item: T, index: number) => string;
  isRefreshing: boolean;
  getList?: () => Promise<void>;
  onItemPress?: (item: T) => void;
  title?: string;
}

export function CheckboxModal<T extends CheckboxItemsProps>({
  data,
  isRefreshing,
  getList,
  onItemPress,
  keyExtractor,
  title
}: CheckboxModalProps<T>) {
  const renderItem = useCallback(
    ({ item }: { item: T }) => (
      <TouchableOpacity
        onPress={() => onItemPress?.(item)}
        activeOpacity={0.7}
        className="flex-row  gap-2 px-2"
      >
        <Ionicons name="checkbox" size={22} color={colors.white} />
        <View>
          <Text className="text-font-primary text-base">{item.name}</Text>
        </View>
      </TouchableOpacity>
    ),
    [onItemPress],
  );

  return (
    <View className="w-full max-h-[80%] bg-background-secondary rounded-2xl p-3">
      <Text className="text-font-primary text-xl">{title}</Text>
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
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={getList} />
        }
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-400">Nenhum item encontrado</Text>
          </View>
        }
      />
    </View>
  );
}

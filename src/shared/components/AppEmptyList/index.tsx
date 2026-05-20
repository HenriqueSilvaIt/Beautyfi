import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface AppEmptyListProps {
  name?: string;
  title?: string;
  description?: string
  iconName?: keyof typeof Ionicons.glyphMap
}

export function AppEmptyList({ name, description, title, iconName}: AppEmptyListProps) {
  return (
    <View className="flex-1 items-center justify-center px-6 py-20">
      <View className="mb-5 rounded-full border border-white/10 bg-white/5 p-5">
        <Ionicons name={iconName} size={34} color="white" />
      </View> 

      <Text className="text-center text-lg font-semibold text-font-primary">
        {title}
      </Text>

      <Text className="mt-2 text-center text-sm leading-6 text-zinc-400">
        {description}
      </Text>
    </View>
  );
}

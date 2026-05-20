import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { getCloudinaryAvatar } from "@/shared/helpers/AppCloudinaryAvatar";

interface AppAvatarProps {
  uri?: string | null;
  onPress?: () => void;
  variant?: "user" | "default";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const sizeClasses = {
  sm: "w-24 h-24",
  md: "w-[140px] h-[140px]",
  lg: "w-44 h-44",
};

export function AppAvatar({
  uri,
  onPress,
  variant = "default",
  size = "md",
  loading,
}: AppAvatarProps) {
  const isUser = variant === "user";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      className={`${sizeClasses[size]} self-center mb-8`}
    >
      <View
        className={`
          ${sizeClasses[size]}
          items-center justify-center
          ${isUser ? "rounded-full" : "rounded-md"}
        `}
      >
        {/* IMAGEM OU ÍCONE */}
        {uri ? (
          <Image
            source={{ uri: getCloudinaryAvatar(uri, size) }}
            resizeMode="cover"
            className={`${sizeClasses[size]} ${isUser ? "rounded-full" : "rounded-md"}`}
          />
        ) : (
          <Ionicons
            name="cloud-upload-outline"
            size={32}
            color={colors.white}
            className="border-white border p-12 rounded-md"
          />
        )}

        {/* LOADING OVERLAY */}
        {loading && (
          <View className="absolute inset-0 bg-black/40 items-center justify-center">
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        )}

        {uri && (
          <Pressable
            onPress={onPress}
            className="absolute -bottom-3 -right-3 border-gray-300 bg-black border-2 p-3 rounded-md z-30"
          >
            <Ionicons name="camera-outline" size={20} color="#fff" />
          </Pressable>
        )}
      </View>
    </TouchableOpacity>
  );
}

import { Image, Text, TouchableOpacity } from "react-native";
import { View } from "react-native";
import { UserProps } from "../../interfaces/user";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useNotificationStore } from "@/shared/store/notification-store";
import { router } from "expo-router";

interface AppHeaderProps {
  user: UserProps | null | undefined;
  token: string | null;
}

export function AppHeader({ user, token }: AppHeaderProps) {
  const dateWeek = format(new Date(), "EE, d", { locale: ptBR });
  const newDateWeek = dateWeek.charAt(0).toUpperCase() + dateWeek.slice(1);
  const { notifications } = useNotificationStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View className="flex-1 max-h-[80px] items-center py-10 px-5 flex-row justify-between w-full border-b-4 border-gray-800 ">
      <View className="flex-1 flex-row">
        <Image
          source={require("@assets/images/logo.png")}
          resizeMode="cover"
          className="w-[50px] h-[50px] mr-2"
        />
     <View className="flex-1 pr-4">
      {token ? (
      <Text
      className="text-xl font-bold"
      ellipsizeMode="tail"
      numberOfLines={1}
     >
      <Text className="text-app-theme-primary">Oi, </Text>
      <Text className="text-app-theme-primary">{user?.firstName}</Text>
    </Text>
      ) : (
    <Text className="text-xl font-bold text-app-theme-primary">
      Seja bem-vindo
    </Text>
    )}

          <Text className="ml-1 mb-2 mt-1 font-semibold text-sm text-app-theme-secundary">
            {newDateWeek} de {format(new Date(), "MMM", { locale: ptBR })}{" "}
            {format(new Date(), "yyyy", { locale: ptBR })}
          </Text>
        </View>
      </View>

      {user && (
        <View className="items-center justify-center relative">
          <TouchableOpacity
            onPress={() => router.push("/(private)/notifications")}
            activeOpacity={0.7}
            className="p-1"
          >
            <Ionicons name="notifications" size={26} color="#9ca3af" />
            {unreadCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center border border-background-primary">
                <Text className="text-[10px] text-white font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

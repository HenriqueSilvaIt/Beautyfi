import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, Stack, Tabs } from "expo-router";
import { useUserStore } from "@/shared/store/user-store";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/styles/colors";

export default function TabsLayout() {
  const { access_token, user } = useUserStore();

  if (!access_token) {
    return <Redirect href="/(public)/home" />;
  }

  const isAdmin = user?.roles?.some(
    (role) => role.authority === "ROLE_ADMIN" || role.authority === "ROLE_MODERATOR"
  ) ?? false;

  return (
      <Stack screenOptions={{ headerShown: false }}>
 

    </Stack>)
}
import { useUserStore } from "@/shared/store/user-store";
import { colors } from "@/styles/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ClientTabsLayout() {
  const { access_token } = useUserStore();
  const colorTheme = colors["app-theme-primary"];
  const insets = useSafeAreaInsets();

  if (!access_token) return <Redirect href="/(public)/home" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorTheme,
        tabBarStyle: {
          backgroundColor: colors["background-primary"],
          height: 70 + insets.bottom,
          paddingBottom: Platform.OS === "ios" ? 8 + insets.bottom : 8,
          paddingTop: 6,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Início",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" color={color} size={22} />
          ),
          tabBarLabelStyle: { fontSize: 11, marginTop: 4 },
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Agendamentos",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-clear-outline" color={color} size={22} />
          ),
          tabBarLabelStyle: { fontSize: 10, marginTop: 4 },
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          title: "Assinatura",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="invoice-clock-outline" color={color} size={22} />
          ),
          tabBarLabelStyle: { fontSize: 11, marginTop: 4 },
        }}
      />
      <Tabs.Screen
        name="(menu)"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" color={color} size={22} />
          ),
          tabBarLabelStyle: { fontSize: 11, marginTop: 4 },
        }}
      />

      
    </Tabs>
  );
}
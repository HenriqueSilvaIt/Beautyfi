import { useUserStore } from "@/shared/store/user-store";
import { colors } from "@/styles/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AdminTabsLayout() {
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
        name="agenda"
        options={{
          title: "Agenda",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name="calendar-number-outline"
              color={focused ? colorTheme : color}
              size={30}
            />
          ),
          tabBarLabelStyle: { fontSize: 11, marginTop: 4 },
        }}
      />
      <Tabs.Screen
        name="client"
        options={{
          title: "Clientes",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" color={color} size={22} />
          ),
          tabBarLabelStyle: { fontSize: 12, marginTop: 4 },
        }}
      />
      <Tabs.Screen
        name="finance"
        options={{
          title: "Financeiro",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="finance" color={color} size={22} />
          ),
          tabBarLabelStyle: { fontSize: 11, marginTop: 4 },
        }}
      />
      <Tabs.Screen
        name="(menu)"
        options={{
          title: "Menu",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" color={color} size={22} />
          ),
          tabBarLabelStyle: { fontSize: 11, marginTop: 4 },
        }}
      />
      <Tabs.Screen
        name="companies-details"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="birthdays/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="cashflow/index"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

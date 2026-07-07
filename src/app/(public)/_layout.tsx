import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { colors } from "../../styles/colors";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PublicLayout() {
  const colorTheme = colors["app-theme-primary"];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorTheme,
        tabBarStyle: {
          backgroundColor: colors["background-primary"],

          // 🔥 altura dinâmica
          height:
            Platform.OS === "ios" ? 70 + insets.bottom : 70 + insets.bottom,

          // 🔥 respeita área segura
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
            <Ionicons name="home-outline" color={color} size={23} />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            marginTop: 4,
          },
        }}
      />

      <Tabs.Screen
        name="login"
        options={{
          title: "Agendamentos",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-clear-outline" color={color} size={23} />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            marginTop: 4,
          },
        }}
      />

      <Tabs.Screen
        name="menu"
        options={{
          title: "Perfil",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle" color={color} size={23} />
          ),
          tabBarLabelStyle: {
            fontSize: 11,
            marginTop: 4,
          },
        }}
      />
      <Tabs.Screen
        name="companies-details/[id]/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="password-recover"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="company-register"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

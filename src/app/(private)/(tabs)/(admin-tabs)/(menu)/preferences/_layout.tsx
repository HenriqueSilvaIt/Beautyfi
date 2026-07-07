import { Stack } from "expo-router";

export default function PreferenceLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="company-edit/index" />
      <Stack.Screen name="whatsapp-config/index" />
    </Stack>
  );
}
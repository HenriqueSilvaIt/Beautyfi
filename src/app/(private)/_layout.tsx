import { router, Stack } from "expo-router";

export default function PrivateLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="(crud)" />
      <Stack.Screen name="schedule/[id]" />
      <Stack.Screen name="company/[id]" />
      <Stack.Screen name="google-signup" />
    </Stack>
  );
}

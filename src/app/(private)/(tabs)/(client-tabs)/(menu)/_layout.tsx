import { Stack } from "expo-router";

export default function MenuLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="address/index" />
      <Stack.Screen name="favorites/index" />
      <Stack.Screen name="history/index" />
      <Stack.Screen name="loyalty/index" />
      <Stack.Screen name="password/index" />
      <Stack.Screen name="user/index" />
    </Stack>
  );
}

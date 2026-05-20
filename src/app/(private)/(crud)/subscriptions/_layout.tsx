import { Stack } from "expo-router";

export default function SubscriptionsAdminLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
   
    </Stack>
  );
}

import { Stack } from "expo-router";

export default function  DashboardsLayout() {
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="index" />
      <Stack.Screen name="total-monthly/index" />
    </Stack>
  );
}

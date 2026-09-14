import { Stack } from "expo-router";

export default function DashboardsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="total-monthly/index" />
      <Stack.Screen name="employee-report/index" />
      <Stack.Screen name="appointments-report/index" />
      <Stack.Screen name="comandas-report/index" />
      <Stack.Screen name="cash-flow-report/index" />
      <Stack.Screen name="ranking-report/index" />
      <Stack.Screen name="payment-methods-report/index" />
      <Stack.Screen name="peak-hours-report/index" />
      <Stack.Screen name="ticket-metrics-report/index" />
    </Stack>
  );
}

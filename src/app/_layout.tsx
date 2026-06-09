import "../styles/global.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetProvider } from "../shared/hooks/useBotttomSheetApp";
import { SnackbarContextProvider } from "../shared/hooks/snackbar.context";
import { Snackbar } from "../shared/components/Snackbar";
import { AppModal } from "@/shared/components/AppModal";
import { useNotifications } from "@/shared/hooks/useNotifications";

import { useOneSignal } from "@/shared/hooks/useOneSignal";
import { STRIPE_PUBLIC_KEY_PROD } from "@env";
import { StripeProvider } from "@stripe/stripe-react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const queryClient = new QueryClient();

export default function RootLayout() {

  useNotifications();
  useOneSignal();

  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StripeProvider
            publishableKey={STRIPE_PUBLIC_KEY_PROD}
            merchantIdentifier="merchant.com.henoliver.dompalaganiapp"
          >
            <SnackbarContextProvider>
              <BottomSheetProvider>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="(public)" />
                    <Stack.Screen name="(private)" />
                  </Stack>
              </BottomSheetProvider>
              <Snackbar />
            </SnackbarContextProvider>
            <AppModal />
          </StripeProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

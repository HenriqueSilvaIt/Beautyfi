import { useEffect } from "react";
import { localNotificationService } from "../services/local-notifications.service";
import * as Notifications from "expo-notifications";
import { Linking } from "react-native";

export function useNotifications() {
  useEffect(() => {
    try {
      localNotificationService.requestPermissions();
      localNotificationService.setupNotificationChannel();
    } catch (e) {
      console.warn("Notification permissions error:", e);
    }

    // Safe handling of initial notification response on app launch
    Notifications.getLastNotificationResponseAsync()
      .then((lastResponse) => {
        if (lastResponse?.notification?.request?.content?.data) {
          const deepLink = lastResponse.notification.request.content.data.deepLink;
          if (deepLink && typeof deepLink === "string") {
            Linking.openURL(deepLink).catch((err) => console.warn("Failed to open deepLink:", err));
          }
        }
      })
      .catch((err) => console.warn("Error getting last notification response:", err));

    // Handle clicks when app is running
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      try {
        const deepLink = response?.notification?.request?.content?.data?.deepLink;
        if (deepLink && typeof deepLink === "string") {
          Linking.openURL(deepLink).catch((err) => console.warn("Failed to open deepLink:", err));
        }
      } catch (err) {
        console.warn("Error handling notification click:", err);
      }
    });

    return () => {
      try {
        subscription.remove();
      } catch (e) {}
    };
  }, []);

  return {};
}
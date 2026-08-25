import { useEffect } from "react";
import { Alert } from "react-native";
import { usePreferencesStore } from "@/shared/store/preferences-store";
import { useNotificationStore } from "@/shared/store/notification-store";
import { useUserStore } from "@/shared/store/user-store";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";
import { router } from "expo-router";

let OneSignal: any;
try {
  OneSignal = require("react-native-onesignal").OneSignal;
} catch (e) {
  console.warn("OneSignal native module not available:", e);
}

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

export function useOneSignal() {
  const { showInAppNewAppointmentModal } = usePreferencesStore();
  const { addNotification } = useNotificationStore();
  const { user } = useUserStore();

  const syncPushToken = async (subId: string) => {
    if (user?.id && subId) {
      try {
        console.log("Syncing push token to backend user profile:", subId);
        // Tenta sincronizar via me/preferences primeiro (sem validações de DTO obrigatório)
        try {
          await styleAppApiClient.patch("/users/me/preferences", {
            notificationToken: subId,
          });
        } catch (prefErr) {
          console.warn("Patch preferences error:", prefErr);
        }

        // Tenta sincronizar enviando também o firstName para passar na validação @NotBlank do UserDTO
        await styleAppApiClient.put(`/users/${user.id}`, {
          firstName: user.firstName || "Usuário",
          notificationToken: subId,
        });
      } catch (err) {
        console.error("Failed to sync push token with backend:", err);
      }
    }
  };

  useEffect(() => {
    if (user?.id && OneSignal) {
      try {
        if (OneSignal.login) {
          OneSignal.login(String(user.id));
        }

        const subId = OneSignal.User?.pushSubscription?.id;
        if (subId) {
          syncPushToken(subId);
        }
      } catch (e) {
        console.warn("Error setting OneSignal user / reading push subscription id:", e);
      }
    }
  }, [user?.id]);

  useEffect(() => {
    if (!ONESIGNAL_APP_ID || !OneSignal) {
      return;
    }

    try {
      OneSignal.initialize(ONESIGNAL_APP_ID);

      const onSubscriptionChange = (event: any) => {
        try {
          const subId = event?.current?.id;
          if (subId) {
            syncPushToken(subId);
          }
        } catch (e) {}
      };

      if (OneSignal?.User?.pushSubscription?.addEventListener) {
        OneSignal.User.pushSubscription.addEventListener("change", onSubscriptionChange);
      }

      // Solicitar permissão de notificação (Android 13+ e iOS)
      if (OneSignal?.Notifications?.requestPermission) {
        OneSignal.Notifications.requestPermission(true).then((granted: boolean) => {
          if (granted) {
            setTimeout(() => {
              const subId = OneSignal?.User?.pushSubscription?.id;
              if (subId) syncPushToken(subId);
            }, 1000);
          }
        }).catch(() => {});
      }

      const handleForegroundWillDisplay = (event: any) => {
        try {
          const notification = event.getNotification();
          const data = notification?.getAdditionalData() as any;

          addNotification({
            id: notification?.getNotificationId() || String(Date.now()),
            title: notification?.getTitle() || "Notificação",
            body: notification?.getBody() || "",
          });

          if (data && (data.type === "NEW_APPOINTMENT" || data.type === "CANCELLED_APPOINTMENT")) {
            if (showInAppNewAppointmentModal) {
              event.preventDefault();
              Alert.alert(
                "🔔 " + (notification.getTitle() || "Atualização de Agendamento!"),
                notification.getBody() || "",
                [
                  {
                    text: "Ver Agendamento",
                    onPress: () => {
                      if (data?.id) {
                        try {
                          router.push(`/(private)/(tabs)/(admin-tabs)/agenda/booking-details/${data.id}`);
                        } catch (e) {
                          router.push("/(private)/(tabs)/(admin-tabs)/agenda");
                        }
                      } else {
                        router.push("/(private)/(tabs)/(admin-tabs)/agenda");
                      }
                    },
                  },
                  {
                    text: "OK",
                    style: "cancel",
                  },
                ],
                { cancelable: false }
              );
            }
          }
        } catch (e) {
          console.warn("Error in foregroundWillDisplay listener:", e);
        }
      };

      const handleClick = (event: any) => {
        try {
          const notification = event?.notification;
          const data = notification?.getAdditionalData() as any;

          if (data && (data.type === "NEW_APPOINTMENT" || data.type === "CANCELLED_APPOINTMENT")) {
            Alert.alert(
              "🔔 " + (notification.getTitle() || "Atualização de Agendamento!"),
              notification.getBody() || "",
              [
                {
                  text: "Ver Agendamento",
                  onPress: () => {
                    if (data?.id) {
                      try {
                        router.push(`/(private)/(tabs)/(admin-tabs)/agenda/booking-details/${data.id}`);
                      } catch (e) {
                        router.push("/(private)/(tabs)/(admin-tabs)/agenda");
                      }
                    } else {
                      router.push("/(private)/(tabs)/(admin-tabs)/agenda");
                    }
                  },
                },
                {
                  text: "OK",
                  style: "cancel",
                },
              ],
              { cancelable: false }
            );
          }
        } catch (e) {
          console.warn("Error in click listener:", e);
        }
      };

      if (OneSignal?.Notifications?.addEventListener) {
        OneSignal.Notifications.addEventListener("foregroundWillDisplay", handleForegroundWillDisplay);
        OneSignal.Notifications.addEventListener("click", handleClick);
      }

      return () => {
        try {
          if (OneSignal?.User?.pushSubscription?.removeEventListener) {
            OneSignal.User.pushSubscription.removeEventListener("change", onSubscriptionChange);
          }
          if (OneSignal?.Notifications?.removeEventListener) {
            OneSignal.Notifications.removeEventListener("foregroundWillDisplay", handleForegroundWillDisplay);
            OneSignal.Notifications.removeEventListener("click", handleClick);
          }
        } catch (e) {}
      };
    } catch (e) {
      console.warn("OneSignal init error:", e);
    }
  }, [user?.id, showInAppNewAppointmentModal]);

  return {};
}

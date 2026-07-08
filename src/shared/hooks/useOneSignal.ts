import { useEffect } from "react"
import { OneSignal } from "react-native-onesignal";
import { Alert } from "react-native";
import { useSettingsStore } from "@/shared/store/settings-store";
import { useNotificationStore } from "@/shared/store/notification-store";
import { useUserStore } from "@/shared/store/user-store";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

export function useOneSignal() {
  const { allowInAppNewAppointmentModal } = useSettingsStore();
  const { addNotification } = useNotificationStore();
  const { user } = useUserStore();

  // Sync token to backend helper
  const syncPushToken = async (subId: string) => {
    if (user?.id && subId) {
      try {
        console.log("Syncing push token to backend user profile:", subId);
        await styleAppApiClient.put(`/users/${user.id}`, {
          notificationToken: subId,
        });
      } catch (err) {
        console.error("Failed to sync push token with backend:", err);
      }
    }
  };

  useEffect(() => {
    try {
      if (!ONESIGNAL_APP_ID) {
        console.warn("OneSignal App ID não definido");
        return;
      }
      OneSignal.initialize(ONESIGNAL_APP_ID);

      // Listen to push subscription updates
      const onSubscriptionChange = (event: any) => {
        const subId = event.current.id;
        if (subId) {
          syncPushToken(subId);
        }
      };
      OneSignal.User.pushSubscription.addEventListener('change', onSubscriptionChange);

      // Initial check on mount
      setTimeout(() => {
        const subId = (OneSignal.User.pushSubscription as any).getSubscriptionId 
          ? (OneSignal.User.pushSubscription as any).getSubscriptionId()
          : (OneSignal.User.pushSubscription as any).getPushSubscriptionId?.();
        if (subId) {
          syncPushToken(subId);
        }
      }, 3000);

      // Event listener para quando o app está aberto em primeiro plano (foreground)
      OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event: any) => {
        const notification = event.getNotification();
        const data = notification.getAdditionalData() as any;

        // Store notification locally
        addNotification({
          id: notification.getNotificationId(),
          title: notification.getTitle() || "Notificação",
          body: notification.getBody() || "",
        });

        if (data && data.type === 'NEW_APPOINTMENT') {
          // Previne a notificação push padrão e mostra o modal se habilitado nas configurações
          event.preventDefault();
          
          if (allowInAppNewAppointmentModal) {
            Alert.alert(
              "🔔 " + (notification.getTitle() || "Novo Agendamento!"),
              notification.getBody() || "",
              [{ text: "Fechar", style: "cancel" }]
            );
          }
        }
      });

      // Event listener para quando clica na notificação em segundo plano
      OneSignal.Notifications.addEventListener('click', (event: any) => {
        const notification = event.notification;
        const data = notification.getAdditionalData() as any;
        
        // Store notification locally
        addNotification({
          id: notification.getNotificationId(),
          title: notification.getTitle() || "Notificação",
          body: notification.getBody() || "",
        });

        if (data && data.type === 'NEW_APPOINTMENT') {
          Alert.alert(
            "🔔 " + (notification.getTitle() || "Novo Agendamento!"),
            notification.getBody() || "",
            [{ text: "Fechar", style: "cancel" }]
          );
        }
      });

      return () => {
        OneSignal.User.pushSubscription.removeEventListener('change', onSubscriptionChange);
      };

    } catch (e) {
      console.warn("OneSignal init error:", e);
    }
  }, [user?.id, allowInAppNewAppointmentModal]);

  return {};
}

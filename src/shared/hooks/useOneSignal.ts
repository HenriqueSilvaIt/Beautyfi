import { useEffect } from "react"
import { OneSignal } from "react-native-onesignal";
import { Alert } from "react-native";

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

export function useOneSignal() {
  useEffect(() => {
    try {
      if (!ONESIGNAL_APP_ID) {
        console.warn("OneSignal App ID não definido");
        return;
      }
      OneSignal.initialize(ONESIGNAL_APP_ID);

      // Event listener para quando o app está aberto em primeiro plano (foreground)
      OneSignal.Notifications.addEventListener('foregroundWillDisplay', (event) => {
        const notification = event.getNotification();
        const data = notification.getAdditionalData() as any;

        if (data && data.type === 'NEW_APPOINTMENT') {
          // Previne a notificação push padrão e mostra o modal
          event.preventDefault();
          
          Alert.alert(
            "🔔 " + (notification.getTitle() || "Novo Agendamento!"),
            notification.getBody() || "",
            [{ text: "Fechar", style: "cancel" }]
          );
        }
      });

      // Event listener para quando clica na notificação em segundo plano
      OneSignal.Notifications.addEventListener('click', (event) => {
        const notification = event.notification;
        const data = notification.getAdditionalData() as any;
        
        if (data && data.type === 'NEW_APPOINTMENT') {
          Alert.alert(
            "🔔 " + (notification.getTitle() || "Novo Agendamento!"),
            notification.getBody() || "",
            [{ text: "Fechar", style: "cancel" }]
          );
        }
      });

    } catch (e) {
      console.warn("OneSignal init error:", e);
    }
  }, []);

  return {};
}

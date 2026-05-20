import { useEffect } from "react"
import {OneSignal} from "react-native-onesignal";

const ONESIGNAL_APP_ID = process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID;

export function useOneSignal() {
  useEffect(() => {
    try {
      if (!ONESIGNAL_APP_ID) {
        console.warn("OneSignal App ID não definido");
        return;
      }
      OneSignal.initialize(ONESIGNAL_APP_ID);
    } catch (e) {
      console.warn("OneSignal init error:", e);
    }
  }, []);

  return {};
}

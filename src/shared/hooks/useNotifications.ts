import { useEffect } from "react"
import { localNotificationService } from "../services/local-notifications.service";
import * as Notifications from "expo-notifications";    
import { Linking } from "react-native";
import { sub } from "date-fns";

// Faz solicitação de permissão para notificação
// quando abrir o app
export function useNotifications() {

useEffect(() =>{

    localNotificationService.requestPermissions();
    localNotificationService.setupNotificationChannel();


    const lastResponse = Notifications.getLastNotificationResponse();
    

   //Ação de click da notificação (deeplink que pega id da noticação quando app 
   // foi fechado)
    if (lastResponse) {

            const deepLink = lastResponse.notification.request.content.data?.deepLink;

        if(deepLink && typeof deepLink === "string") {
            Linking.openURL(deepLink); //abre a pagina do app
        }
    }
    

    //Ação de click da notificação (deeplink que pega id da noticação quando app está aberto
    // ou em segundo plano)
 const subscription =    Notifications.addNotificationResponseReceivedListener((response) =>  {
    //Método que será executado quando clicarmos na nossa noticação 
    // podemos abrir deep link, realizar requisção http

    const deepLink = response.notification.request.content.data?.deepLink;

        if(deepLink && typeof deepLink === "string") {
            Linking.openURL(deepLink); //abre a pagina do app
        }
    }
    
)

 return () => subscription.remove();
}, [])

    return {

    }
}
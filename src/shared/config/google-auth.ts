import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {GOOGLE_WEB_CLIENT_ID} from "@env"
export function configureGoogleAuth() {


  GoogleSignin.configure({
    webClientId: GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
  });

}
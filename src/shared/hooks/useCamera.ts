import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { ImagePickerOptions } from "expo-image-picker";
import { useSnackbarContext } from "./snackbar.context";

interface UseCameraOptions {
  aspect?: [number, number];
  quality?: number;
  allowsEditing?: boolean;
  exif?: boolean;
}
export function useCamera(pickerOptions: ImagePickerOptions) {
  const { notify } = useSnackbarContext();

  const [isLoading, setIsLoading] = useState(false);

  /*Função para solicitar permissão para acessar a camera */
  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      const currentStatus = status === "granted";

      /*Caso o usuário negue a permissão para acessar a camera */
      if (!currentStatus) {
        notify({
          message: "Precisamos da permissão para acessar sua câmera",
          type: "SUCCESS"
        });
      }
      return currentStatus;
    } catch (error) {
          notify({
          message: "Erro ao solicitar permissões da câmera",
          type: "ERROR"
        });
      return false;
    }
  }, []);

  /*Função para abrir a camera de fato */
  const openCamera = useCallback(async (): Promise<string | null> => {
    /*Ele retorna uma string quando conseguimos de fato tirar a foto 
        essa string vai conter o caminho de onde ficou salva a foto para nós renderizarmos na tela ou 
        enviarmos para backend ou nulo caso a pessoa tenha cancelado ou ocorreu algum erro no momento de tirar foto*/

    setIsLoading(true);

    try {
      // Valida se tem permissão de acessar a camera
      const hasPermission = await requestCameraPermission();

      if (!hasPermission) return null;

      const result = await ImagePicker.launchCameraAsync(pickerOptions);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        /*Validamos se o nosso resultado foi cancelado, se o os assets as imagens
               e existe e são maior que zero, retornamos a abaixo a URI o caminho de onde essa imagem foi 
               armazenada */

        notify({
          message: "Foto capturada com sucesso",
          type: "SUCCESS"
        });
       
        return result.assets[0].uri;
      }

      return null;
    } catch (error) {
        notify({
          message: "Erro ao abrir câmera",
          type: "ERROR"
        });
        return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { requestCameraPermission, isLoading, openCamera };
}

import { ImagePickerOptions } from "expo-image-picker";
import { useCallback, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";
import { useSnackbarContext } from "./snackbar.context";

export function useGallery(

  pickerOptions: ImagePickerOptions /*prop da biblioteca */
) {
  const [isLoading, setIsLoading] = useState(false);

  const {notify} = useSnackbarContext();

  // Função para solicitar permissão para acessar a galeria
  const requestGaleryPermission = useCallback(async () => {
    try {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

      const currentStatus = status === "granted";

      /*Caso o usuário negue a permissão para acessar a camera */
      if (!currentStatus) {
        Alert.alert(
            "Permissão negada",
            "Precisamos de permissão para acessar sua galeria de fotos",
            [
                {
                    text: "Cancelar", 
                    style:"cancel",
                },
                {
                    text: "Abrir cofigurações",
                    onPress: () => {
                        Linking.openSettings(); /*abrir configurações
                        de permissão do celular */
                    }
                }
            ]
        )
      }

      return currentStatus;
    } catch (error) {

        notify({
            message: "Erro ao solicitar permissões para acessar suas fotos",
            type: "ERROR"
        })
   
      return false;
    }
  }, []);

  // Função para abrir a galeria

  const openGallery = useCallback(async (): Promise<string | null> => {
    setIsLoading(true);

    try {
      const hasPermission = await requestGaleryPermission();

      /*Caso o usuário negue a permissão para acessar a camera */

      if (!hasPermission) return null;

      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        /*Validamos se o nosso resultado foi cancelado, se o os assets as imagens
               e existe e são maior que zero, retornamos a abaixo a URI o caminho de onde essa imagem foi 
               armazenada */

               
          notify({
            message: "Foto selecionada com sucesso!",
            type: "SUCCESS"
        })

        return result.assets[0].uri;
      }

      return null; /*Como retorna uma string ou null precisamos colocar o nulo */
    } catch (error) {

          notify({
            message: "Erro ao selecionar a foto",
            type: "ERROR"
        })
 
      return null; /*Como retorna uma string ou null precisamos colocar o nulo */
    } finally {
      setIsLoading(false);
    }
  }, []);

  const openGalleryMultiple = useCallback(
    async (customOptions?: ImagePickerOptions): Promise<string[]> => {
      setIsLoading(true);

      try {
        const hasPermission = await requestGaleryPermission();

        if (!hasPermission) return [];

        const opts: ImagePickerOptions = {
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: true,
          quality: 0.8,
          ...pickerOptions,
          ...customOptions,
        };

        const result = await ImagePicker.launchImageLibraryAsync(opts);

        if (!result.canceled && result.assets && result.assets.length > 0) {
          notify({
            message: `${result.assets.length} foto(s) selecionada(s)!`,
            type: "SUCCESS",
          });

          return result.assets.map((a) => a.uri);
        }

        return [];
      } catch (error) {
        notify({
          message: "Erro ao selecionar as fotos",
          type: "ERROR",
        });

        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [pickerOptions, requestGaleryPermission, notify]
  );

  return { openGallery, openGalleryMultiple, isLoading };
}

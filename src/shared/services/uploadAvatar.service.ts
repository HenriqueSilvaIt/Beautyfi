
//Função para fazer upload de imagem de perfil no backend

import { AxiosRequestConfig } from "axios";
import { styleAppApiClient } from "../api/styleAppBackend";

export async function uploadAvatarGeneric<T>(segment: string, avatarUri: string, serviceId?: number) {
  const formData = new FormData();

  const config: AxiosRequestConfig = {
    headers: { "Content-Type": `multipart/form-data` },
  };

  const filename = avatarUri.split("/").pop() || "avatar.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("file", {
    uri: avatarUri,
    name: filename,
    type,
  } as any);

  const { data } = await styleAppApiClient.put<T>(
    `/${segment}/${serviceId}/avatar`,
    formData,
    config
  );

  return data;
}
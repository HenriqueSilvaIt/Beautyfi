import { AxiosRequestConfig } from "axios";
import { styleAppApiClient } from "../api/styleAppBackend";
import {
  UpdateUserPreferencesInterface,
  UpdateUserSignupInterface,
  UserChangePasswordInterface,
  UserInterface,
  UserProps,
} from "../interfaces/user";
import { useUserStore } from "../store/user-store";

export async function getUserLogged() {

  const { data } = await styleAppApiClient.get<UserProps>(
    "/users/authenticated"
  );

  return data;
}

export async function updateUser(dataBody: Partial<UserInterface>, userId?: number) {

  const { data } = await styleAppApiClient.put<UserInterface>(
    `/users/${userId}`,
    dataBody
  );
  return data;
}

export async function userCompleteSignup(dataBody: UpdateUserSignupInterface ) {

    const { data } = await styleAppApiClient.patch<UserInterface>(
    `/users/me/complete-signup`,
    dataBody
  );
}

export async function updateUserPreference(dataBody: UpdateUserPreferencesInterface) {

  const { data } = await styleAppApiClient.patch<UserInterface>(
    `/users/me/preferences`,
    dataBody
  );
  return data;
}


export async function disableUser() {

  const { data } = await styleAppApiClient.patch(
    `/users/disable`
  );
  return data;
}


export async function updatePassword(databody: UserChangePasswordInterface) {

  await styleAppApiClient.post(`/users/change-password`, databody);
}

//Função para fazer upload de imagem de perfil no backend

export async function uploadAvatar(avatarUri: string) {
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

  const { data } = await styleAppApiClient.put<UserInterface>(
    "/users/me/avatar",
    formData,
    config
  );

  return data; 
}


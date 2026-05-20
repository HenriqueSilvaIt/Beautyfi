import {
  userKeys,
  useUploadAvatarMutation,
  useUserLogged,
  useUserLoggedQuery,
} from "@/shared/queries/user/use-user-logged.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { UserFormData, userScheme } from "./user.scheme";
import { UserInterface, UserProps } from "@/shared/interfaces/user";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useImage } from "@/shared/hooks/useImage";
import { CameraType } from "expo-image-picker";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useUserStore } from "@/shared/store/user-store";
import { useMask } from "@/shared/hooks/useMask";
import { queryClient } from "../../../../queryClient";
import { disableUser } from "@/shared/services/user.service";

export function useUserViewModel() {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const { setUser, user, logout } = useUserStore();
  const { notify } = useSnackbarContext();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const { handleError } = useErrorHandler();

  // Estado para armazenar o caminho da imagem que selecionaros ou tirarmos foto
  const avatarRef = useRef<string | null>(null);
  const [visible, setVisible] = useState(false);

  const { DateIsoToBR, DateBRToISO } = useFormatDate();

  const { unmask, maskPhone } = useMask();
  const { userUpdateMutation } = useUserLogged();
  //Função para buscar usuário logado
  const {
    data: userData,
    isLoading: isUserLoading,
    isError,
    refetch,
  } = useUserLoggedQuery();
  const displayAvatar = avatarUri ?? userData?.avatarUrl ?? null;
  const avatarFinal =
    avatarUri ?? userData?.avatarUrl ?? user?.avatarUrl ?? null;
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    // Cast the RESULT of yupResolver to the expected RHF Resolver type
    resolver: yupResolver(userScheme) as unknown as Resolver<UserFormData>,
    defaultValues: {
      firstName: "",
      avatarUrl: "",
      birthDate: "",
      phone: "",
    },
  });

  // Hook global para seleção de imagem (camera ou galeria)

  const { handleSelectImage } = useImage({
    callback: async (uri) => {
      console.log("📸 Nova URI selecionada:", uri);

      // Atualiza estado
      avatarRef.current = uri;

      setAvatarUri(uri);
    },
    cameraType: CameraType.front,
  });

  // Hook global para seleção de imagem (camera ou galeria)

  async function handleSelectAvatar() {
    await handleSelectImage();
  }
  const uploadAvatarMutation = useUploadAvatarMutation();

  // Função para atualizar os dados da empresa
const onUserUpdate = handleSubmit(async (formData) => {
    if (!userData?.id) return;

    try {
      setIsLoading(true);

      const { birthDate, phone, firstName } = formData;

      let avatarUrl: string = userData.avatarUrl ?? "";

      if (avatarUri) {
        const avatarResponse = await uploadAvatarMutation.mutateAsync(
          avatarRef.current ?? "",
        );
        avatarUrl = avatarResponse.avatarUrl ?? "";
      }

      const payload: UserInterface = {
        firstName,
        phone: unmask(phone),
        ...(birthDate && { birthDate: DateBRToISO(birthDate) }),
        avatarUrl,
      };

      const updatedUser = await userUpdateMutation.mutateAsync({
        userId: userData.id,
        data: payload,
      });

      // ✅ Atualiza o cache com o retorno do backend
      queryClient.setQueryData(userKeys.all, (old: any) => ({
        ...old,
        ...updatedUser,
      }));

      // ✅ Atualiza o store com os dados corretos
      setUser((prev: any) => ({
        ...prev,
        firstName: updatedUser.firstName ?? firstName,
        avatarUrl: updatedUser.avatarUrl ?? avatarUrl,
        phone: updatedUser.phone ?? unmask(phone),
      }));

      // ✅ Limpa o avatarUri local para mostrar a imagem do servidor
      setAvatarUri(null);
      avatarRef.current = null;

      notify({ message: "Usuário atualizado com sucesso!", type: "SUCCESS" });
      router.back();

    } catch (error) {
      handleError(error, "Falha ao atualizar usuário");
    } finally {
      setIsLoading(false);
    }
  });

  async function handleDisableMyUser() {
    try {
      await disableUser();

      useUserStore.getState().logout();

      useUserStore.persist.clearStorage();

      queryClient.clear();
      router.replace("/(public)/home");
      notify({
        message: "Sua conta foi desativada com sucesso!",
        type: "WARNING",
      });
    } catch (error) {
      notify({
        message: "Erro ao desativar a conta. Tente novamente.",
        type: "ERROR",
      });
      handleError(error, "Erro ao desativar conta");
    }
  }

  function showModal() {
    setVisible(true);
  }
  function hideModal() {
    setVisible(false);
  }
  useEffect(() => {
    if (!userData) return;

    reset({
      firstName: userData.firstName,
      birthDate: userData.birthDate ? DateIsoToBR(userData.birthDate) : "",
      phone: userData.phone ? maskPhone(userData.phone) : "",
    });
  }, [userData]);

  return {
    control,
    visible,
    showModal,
    hideModal,
    onUserUpdate,
    handleDisableMyUser,
    userData,
    isLoading,
    handleSelectAvatar,
    avatarUri,
    displayAvatar,
    avatarFinal,
  };
}

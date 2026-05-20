import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { ClientInterface } from "@/shared/interfaces/http/client";
import { useCallback, useEffect, useState } from "react";
import { ClientFormData, clientScheme } from "./client.scheme";
import { Resolver, useForm } from "react-hook-form";
import {
  clientKeys,
  useClientMutation,
} from "@/shared/queries/company/use.client.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { CameraType } from "expo-image-picker";
import { useImage } from "@/shared/hooks/useImage";
import { useUploadAvatarGenericMutation } from "@/shared/queries/company/use-uploadAvatar.mutation";
import { useMask } from "@/shared/hooks/useMask";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { queryClient } from "../../../../queryClient";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";

export function useClientViewModel(clientId: number | undefined) {
  console.log("🔎 ID client recebido no hook:", clientId);
  const { from } = useLocalSearchParams<{ from?: string }>();

  const isEditMode = Number.isFinite(clientId);

  const { handleError } = useErrorHandler();

  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useSnackbarContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { unmask, maskPhone } = useMask();
  const { DateIsoToBR, DateBRToISO } = useFormatDate();

  // Estado para armazenar o caminho da imagem que selecionaros ou tirarmos foto
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const uploadClientAvatarMutation =
    useUploadAvatarGenericMutation<ClientInterface>();

  const {
    useGetClientById,
    useGetClientMutation,
    clientPostMutation,
    clientDeleteByIdMutation,
    clientUpdateMutation,
  } = useClientMutation();

  const { data: clientContent } = useGetClientById(Number(clientId));
  const {
    data: clientData,
    error: clientError,
    refetch: clientRefetch,
    isRefetching: clientIsRefetching,
    isLoading: clientIsLoading,
    hasNextPage: clientHasNextPage,
    fetchNextPage: clientFetchNextPage,
    isFetchingNextPage: clientIsFetchingNextPage,
  } = useGetClientMutation();

  const clientDataPagged =
    clientData?.pages.flatMap((page) => page.content ?? []) ?? [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    // Cast the RESULT of yupResolver to the expected RHF Resolver type
    resolver: yupResolver(clientScheme) as unknown as Resolver<ClientFormData>,
    defaultValues: {},
  });

  // Função para atualizar os dados da empresa

  const onClientUpdate = handleSubmit(async (clientData) => {
    try {
      setIsLoading(true);

      const { name, birthDate, phone, profileUrl } = clientData;
      const response = await clientUpdateMutation.mutateAsync({
        clientId: clientId,
        data: {
          name,
          profileUrl,
          phone: unmask(phone ?? ""),
          ...(birthDate && { birthDate: DateBRToISO(birthDate) }),
        },
      });

      // extrai o item atualizado do response
      const updatedItem: ClientInterface = response;

      notify({
        message: "Cliente atualizado com sucesso!",
        type: "SUCCESS",
      });

      queryClient.setQueryData(
        ["clients"],
        (oldData?: InfiniteData<{ content: ClientInterface[] }>) => {
          if (!oldData) return;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              content: page.content.map((item) =>
                item.id === updatedItem.id ? updatedItem : item,
              ),
            })),
          };
        },
      );
      await clientRefetch();

      router.back();
    } catch (error) {
      handleError(error, "Falha ao atualizar cliente");
    } finally {
      setIsLoading(false);
    }
  });

  // Função para criar client
  const onSubmit = handleSubmit(async (clientData) => {
    try {
      setIsLoading(true);
      const payload: ClientInterface = {
        ...clientData,
        ...(clientData.birthDate && {
          birthDate: DateBRToISO(clientData.birthDate),
        }),
      };
      let savedClient: ClientInterface | undefined;

      if (isEditMode && clientId) {
        savedClient = await clientUpdateMutation.mutateAsync({
          clientId,
          data: {
            name: clientData.name,
            profileUrl: clientData.profileUrl,
            phone: unmask(clientData.phone ?? ""),
            ...(clientData.birthDate && {
              birthDate: DateBRToISO(clientData.birthDate),
            }),
          },
        });

        notify({
          message: "Cliente atualizado com sucesso!",
          type: "SUCCESS",
        });
      } else {
        // 🔥 blindagem total
        const createPayload: ClientInterface = {
          name: clientData.name,
          birthDate: clientData.birthDate
            ? DateBRToISO(clientData.birthDate)
            : "",
          profileUrl: clientData.profileUrl,
          phone: unmask(clientData.phone),
        };

        console.log("CREATE PAYLOAD:", createPayload);

        savedClient = await clientPostMutation.mutateAsync(createPayload);

        notify({
          message: "Cliente criado com sucesso!",
          type: "SUCCESS",
        });
      }

      //  Se trocou a imagem, faz upload agora
      if (avatarUri) {
        setIsUploadingAvatar(true);

        const avatarResponse = await uploadClientAvatarMutation.mutateAsync({
          segment: "clients",
          avatarUri: avatarUri,
          id: Number(savedClient.id),
        });

        // sincroniza estado local

        queryClient.setQueryData(
          clientKeys.detail(Number(clientId)),
          (prev?: ClientInterface) => {
            if (!prev) return prev;

            return {
              ...prev,
              imgUrl: avatarResponse.profileUrl,
            };
          },
        );
        setIsUploadingAvatar(false);
      }

      await clientRefetch();
      router.back();
    } catch (error) {
      handleError(error, "Falha ao criar cliente");
    } finally {
      setIsLoading(false);
    }
  });
  // Função para deletar Profissional

  async function onClientDelete(clientId: number) {
    try {
      setIsLoading(true);
      if (clientId) {
        await clientDeleteByIdMutation.mutateAsync(clientId);

        notify({
          message: "Cliente deletado com sucesso",
          type: "SUCCESS",
        });

        await clientRefetch();
        router.back();
      } else {
        notify({
          message: "Falha ao deletar cliente",
          type: "ERROR",
        });
        console.log(`Cliente não existe`);
      }
    } catch (error) {
      handleError(error, "Falha ao deletar cliente");
    } finally {
      setIsLoading(false);
    }
  }

  // Hook global para seleção de imagem (camera ou galeria)

  const { handleSelectImage } = useImage({
    callback: async (uri) => {
      console.log("📸 Nova URI selecionada:", uri);

      // Atualiza estado
      setAvatarUri(uri);
    },
    cameraType: CameraType.front,
  });

  async function handleSelectAvatar() {
    await handleSelectImage();
  }

  useEffect(() => {
    if (!isEditMode || !clientContent) return;

    reset({
      name: clientContent.name,
      birthDate: clientContent.birthDate
        ? DateIsoToBR(clientContent.birthDate)
        : "",
      profileUrl: avatarUri ?? clientContent.profileUrl,
      phone: clientContent.phone ? maskPhone(clientContent.phone) : "",
    });
  }, [clientContent]);

  useEffect(() => {
    if (isEditMode) return;

    reset({
      name: "",
      birthDate: "",
      profileUrl: "",
    });
  }, [isEditMode]);

  return {
    control,
    onClientUpdate,
    onClientDelete,
    onSubmit,
    clientDataPagged,
    isEditMode,
    reset,
    clientContent,
    handleSelectAvatar,
    avatarUri,
    isUploadingAvatar,
    clientId,
    isLoading,
    clientRefetch,
    clientIsRefetching,
    clientIsLoading,
    clientHasNextPage,
    clientFetchNextPage,
    clientIsFetchingNextPage,
  };
}

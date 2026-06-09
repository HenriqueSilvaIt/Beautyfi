import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import {
  AdvertisementCreateDTO,
  AdvertisementInterface,
  AdvertisementProps,
  AdvertisementUpdateDTO,
} from "@/shared/interfaces/http/advertisement";
import {
  advertisementKeys,
  useAdvertisementMutation,
} from "@/shared/queries/company/use-advertisement.mutation";
import { useUploadAvatarGenericMutation } from "@/shared/queries/company/use-uploadAvatar.mutation";
import { yupResolver } from "@hookform/resolvers/yup";
import { CameraType } from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import {
  AdvertisementFormData,
  advertisementScheme,
} from "./advertisement.scheme";
import { useImage } from "@/shared/hooks/useImage";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../../../../queryClient";

export function useAdvertisementViewModel(advertisementId: number | undefined) {
  console.log("🔎 ID recebido no hook:", advertisementId);

  const isEditMode = advertisementId != null 
    && advertisementId !== undefined 
    && !isNaN(Number(advertisementId))
    && Number(advertisementId) > 0;
  const { handleError } = useErrorHandler();

  const { notify } = useSnackbarContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estado para armazenar o caminho da imagem que selecionaros ou tirarmos foto
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const uploadAdvertisementAvatarMutation =
    useUploadAvatarGenericMutation<AdvertisementInterface>();

  const {
    advertisementUpdateMutation,
    useGetAdvertisementsQuery,
    useGetAdvertisementById,
    advertisementPostMutation,
    advertisementDeleteByIdMutation,
  } = useAdvertisementMutation();
  const { data: advertisementContent } = useGetAdvertisementById(
    Number(advertisementId),
  );

  const {
    data: adversetments,
    isLoading: advertisementIsLoading,
    refetch: advertisementRefetch,
    isFetchingNextPage: advertisementIsFetchingNextPage,
    hasNextPage: advertisementHasNextPage,
    fetchNextPage: advertisementFetchNextPage,
    isRefetching: advertisementIsRefetching,
  } = useGetAdvertisementsQuery();

  const adversetmentPagged =
    adversetments?.pages.flatMap((page) => page.content ?? []) ?? [];

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AdvertisementFormData>({
    // Cast the RESULT of yupResolver to the expected RHF Resolver type
    resolver: yupResolver(
      advertisementScheme,
    ) as unknown as Resolver<AdvertisementFormData>,
    defaultValues: {},
  });

  // Função para atualizar os dados
  const onAdvertisementUpdate = handleSubmit(async (advertisementData) => {
    try {
      setIsLoading(true);
      if (!advertisementId) return;

      const updatePayload: AdvertisementInterface = {
        title: advertisementData.title,
        description: advertisementData.description,
        imgUrl: advertisementData.imgUrl,
        url: advertisementData.url,
      };

      const response = await advertisementUpdateMutation.mutateAsync({
        advertisementId,
        data: updatePayload, // ✅ agora é AdvertisementInterface
      });

      // extrai o item atualizado do response
      const updatedItem: AdvertisementInterface = response;

      notify({ message: "Imagem atualizado com sucesso!", type: "SUCCESS" });

      queryClient.setQueryData(
        ["adversetments"],
        (oldData?: InfiniteData<{ content: AdvertisementProps[] }>) => {
          if (!oldData) return oldData;

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
      router.back();
    } catch (error) {
      handleError(error, "Falha ao atualizar anúncio");
    } finally {
      setIsLoading(false);
    }
  });

  // Função para criar serviço
  const onSubmit = handleSubmit(async (advertisementData) => {
  try {
    console.log("SUBMIT DISPARADO");

    setIsLoading(true);

    const payload: AdvertisementInterface = {
      title: advertisementData.title,
      description: advertisementData.description,
      imgUrl: advertisementData.imgUrl,
      url: advertisementData.url,
    };

    let finalId: number;

    if (isEditMode && advertisementId) {
      const response = await advertisementUpdateMutation.mutateAsync({
        advertisementId,
        data: payload,
      });

      finalId = Number(response.id);

      notify({ message: "Imagem atualizada com sucesso!", type: "SUCCESS" });
    } else {
      const response = await advertisementPostMutation.mutateAsync(payload);

      if (!response?.id) {
        throw new Error("ID não retornado na criação");
      }

      finalId = response.id;

      notify({ message: "Imagem criada com sucesso!", type: "SUCCESS" });
    }

    // ✅ upload seguro
    if (avatarUri) {
      setIsUploadingAvatar(true);

      await uploadAdvertisementAvatarMutation.mutateAsync({
        segment: "advertisements",
        avatarUri,
        id: finalId,
      });

      setIsUploadingAvatar(false);
    }
await advertisementRefetch()
    router.back();
  } catch (error) {
    console.log("ERRO NO SUBMIT:", error);
    handleError(error, "Falha ao salvar anúncio");
  } finally {
    setIsLoading(false);
  }
});

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

  // Função para deletar serviço

  async function onAdvertisementDelete(advertisementId: number) {
    try {
      setIsLoading(true);
      if (advertisementId) {
        await advertisementDeleteByIdMutation.mutateAsync(advertisementId);

        notify({
          message: "Imagem deletado com sucesso",
          type: "SUCCESS",
        });

        router.back();
      } else {
        notify({
          message: "Falha ao deletar anúncio",
          type: "ERROR",
        });
        console.log(`Imagem não existe`);
      }
    } catch (error) {
      handleError(error, "Falha ao deletar anúncio");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isEditMode || !advertisementContent) return;

    reset({
      title: advertisementContent.title,
      description: advertisementContent.description,
      imgUrl: advertisementContent.imgUrl,
      url: advertisementContent.url,
    });
  }, [advertisementContent]);

  useEffect(() => {
    if (isEditMode) return;

    reset({
      title: "",
      description: "",
      url: "",
      imgUrl: "",
    });
  }, [isEditMode]);

  return {
    control,
    onAdvertisementUpdate,
    onSubmit,
    onAdvertisementDelete,
    isRefreshing,
    adversetmentPagged,
    isEditMode,
    reset,
    advertisementContent,
    handleSelectAvatar,
    isUploadingAvatar,
    avatarUri,
    advertisementId,
    isLoading,
    advertisementIsLoading,
    advertisementRefetch,
    advertisementIsFetchingNextPage,
    advertisementHasNextPage,
    advertisementFetchNextPage,
    errors,
    advertisementIsRefetching,
  };
}

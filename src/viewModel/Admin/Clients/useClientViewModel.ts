import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { ClientInterface } from "@/shared/interfaces/http/client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClientFormData, clientScheme } from "./client.scheme";
import { Resolver, useForm } from "react-hook-form";
import {
  clientKeys,
  useClientMutation,
} from "@/shared/queries/company/use.client.mutation";
import { useLoyaltyMutation } from "@/shared/queries/company/use-loyalty.mutation";
import { useCompanyStore } from "@/shared/store/company-store";
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

  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);

  const uploadClientAvatarMutation =
    useUploadAvatarGenericMutation<ClientInterface>();

  const {
    useGetClientById,
    useGetClientMutation,
    clientPostMutation,
    clientDeleteByIdMutation,
    clientUpdateMutation,
    clientAnamnesisUpdateMutation,
  } = useClientMutation();

  const { useGetClientPointsQuery } = useLoyaltyMutation();
  const { data: clientLoyaltyPointsData } = useGetClientPointsQuery(
    clientId ? Number(clientId) : undefined,
    selectedCompanyId ? Number(selectedCompanyId) : undefined
  );

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const hasClientToggled = useRef(false);
  const [clientAllowWhatsAppNotification, setClientAllowWhatsAppNotification] = useState(false);

  function handleToggleAllowWhatAppMessage() {
    hasClientToggled.current = true;
    setClientAllowWhatsAppNotification((prev) => !prev);
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

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
  } = useGetClientMutation(debouncedSearch);

  const clientDataPagged =
    clientData?.pages.flatMap((page) => page.content ?? []) ?? [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: yupResolver(clientScheme) as unknown as Resolver<ClientFormData>,
    defaultValues: {},
  });

  const onSaveAnamnesis = handleSubmit(async (formData) => {
    if (!clientId) return;
    try {
      setIsLoading(true);
      await clientAnamnesisUpdateMutation.mutateAsync({
        clientId: Number(clientId),
        anamnesisData: {
          allergies: formData.allergies,
          skinHairType: formData.skinHairType,
          preExistingConditions: formData.preExistingConditions,
          medications: formData.medications,
          observations: formData.observations,
        },
      });

      notify({
        message: "Ficha de Anamnese salva com sucesso!",
        type: "SUCCESS",
      });
      await clientRefetch();
    } catch (error) {
      handleError(error, "Falha ao salvar Ficha de Anamnese");
    } finally {
      setIsLoading(false);
    }
  });

  const onClientUpdate = handleSubmit(async (clientData) => {
    try {
      setIsLoading(true);

      const { name, birthDate, phone, profileUrl } = clientData;
      const response = await clientUpdateMutation.mutateAsync({
        clientId: clientId,
        data: {
          name,
          profileUrl: profileUrl || undefined,
          allowWhatsAppNotification: clientAllowWhatsAppNotification,
          phone: unmask(phone ?? ""),
          ...(birthDate && { birthDate: DateBRToISO(birthDate) }),
        },
      });

      const updatedItem: ClientInterface = response;

      if (clientData.allergies || clientData.skinHairType || clientData.preExistingConditions || clientData.medications || clientData.observations) {
        await clientAnamnesisUpdateMutation.mutateAsync({
          clientId: Number(clientId),
          anamnesisData: {
            allergies: clientData.allergies,
            skinHairType: clientData.skinHairType,
            preExistingConditions: clientData.preExistingConditions,
            medications: clientData.medications,
            observations: clientData.observations,
          },
        });
      }

      notify({
        message: "Cliente atualizado com sucesso!",
        type: "SUCCESS",
      });

      await clientRefetch();
      router.back();
    } catch (error) {
      handleError(error, "Falha ao atualizar cliente");
    } finally {
      setIsLoading(false);
    }
  });

  const onSubmit = handleSubmit(
    async (clientData) => {
      try {
        setIsLoading(true);
        let savedClient: ClientInterface | undefined;

        if (isEditMode && clientId) {
          savedClient = await clientUpdateMutation.mutateAsync({
            clientId,
            data: {
              name: clientData.name,
              profileUrl: clientData.profileUrl || undefined,
              allowWhatsAppNotification: clientAllowWhatsAppNotification,
              phone: unmask(clientData.phone ?? ""),
              ...(clientData.birthDate && {
                birthDate: DateBRToISO(clientData.birthDate),
              }),
            },
          });
        } else {
          const createPayload: ClientInterface = {
            name: clientData.name,
            birthDate: clientData.birthDate
              ? DateBRToISO(clientData.birthDate)
              : "",
            profileUrl: clientData.profileUrl || undefined,
            phone: unmask(clientData.phone),
            allowWhatsAppNotification: clientAllowWhatsAppNotification,
          };

          savedClient = await clientPostMutation.mutateAsync(createPayload);
        }

        if (savedClient?.id && (clientData.allergies || clientData.skinHairType || clientData.preExistingConditions || clientData.medications || clientData.observations)) {
          await clientAnamnesisUpdateMutation.mutateAsync({
            clientId: Number(savedClient.id),
            anamnesisData: {
              allergies: clientData.allergies,
              skinHairType: clientData.skinHairType,
              preExistingConditions: clientData.preExistingConditions,
              medications: clientData.medications,
              observations: clientData.observations,
            },
          });
        }

        notify({
          message: isEditMode ? "Cliente atualizado com sucesso!" : "Cliente criado com sucesso!",
          type: "SUCCESS",
        });

        if (avatarUri && savedClient?.id) {
          setIsUploadingAvatar(true);

          await uploadClientAvatarMutation.mutateAsync({
            segment: "clients",
            avatarUri: avatarUri,
            id: Number(savedClient.id),
          });

          setIsUploadingAvatar(false);
        }

        await clientRefetch();
        router.back();
      } catch (error) {
        handleError(error, "Falha ao salvar cliente");
      } finally {
        setIsLoading(false);
      }
    },
    (errors) => {
      console.log("❌ Erros de validação do formulário de cliente:", errors);
      const firstError = Object.values(errors)[0]?.message;
      if (firstError) {
        notify({
          message: String(firstError),
          type: "ERROR",
        });
      }
    }
  );

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
      }
    } catch (error) {
      handleError(error, "Falha ao deletar cliente");
    } finally {
      setIsLoading(false);
    }
  }

  const { handleSelectImage } = useImage({
    callback: async (uri) => {
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
      allergies: clientContent.anamnesis?.allergies ?? "",
      skinHairType: clientContent.anamnesis?.skinHairType ?? "",
      preExistingConditions: clientContent.anamnesis?.preExistingConditions ?? "",
      medications: clientContent.anamnesis?.medications ?? "",
      observations: clientContent.anamnesis?.observations ?? "",
    });

    if (!hasClientToggled.current) {
      setClientAllowWhatsAppNotification(Boolean(clientContent.allowWhatsAppNotification));
    }
  }, [clientContent]);

  useEffect(() => {
    if (isEditMode) return;

    reset({
      name: "",
      birthDate: "",
      profileUrl: "",
      phone: "",
      allergies: "",
      skinHairType: "",
      preExistingConditions: "",
      medications: "",
      observations: "",
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
    clientAllowWhatsAppNotification,
    setClientAllowWhatsAppNotification,
    handleToggleAllowWhatAppMessage,
    errors,
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
    searchValue,
    setSearchValue,
    clientLoyaltyPointsData,
  };
}

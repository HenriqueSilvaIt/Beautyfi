import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { EmployeeInterface } from "@/shared/interfaces/http/employee";
import {
  employeeKeys,
  useEmployeeMutation,
} from "@/shared/queries/company/use-employee.mutation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { EmployeeFormData } from "./employee.scheme";
import { router, useFocusEffect } from "expo-router";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useImage } from "@/shared/hooks/useImage";
import { CameraType } from "expo-image-picker";
import { useUploadAvatarGenericMutation } from "@/shared/queries/company/use-uploadAvatar.mutation";
import { useMask } from "@/shared/hooks/useMask";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { InfiniteData } from "@tanstack/react-query";
import { queryClient } from "../../../../queryClient";
import { useUserStore } from "@/shared/store/user-store";
import { useAppointmentMutation } from "@/shared/queries/company/use-appointment.mutation";

export function useEmployeeViewModel(employeeId: number | undefined) {
  console.log("🔎 ID employee recebido no hook:", employeeId);

  const isEditMode = Number.isFinite(employeeId);

  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useSnackbarContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { unmask, maskPhone } = useMask();

  // Estado para armazenar o caminho da imagem que selecionaros ou tirarmos foto
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const uploadEmployeeAvatarMutation =
    useUploadAvatarGenericMutation<EmployeeInterface>();

  const {
    useGetEmployeeById,
    useGetEmployeeMutation,
    employeePostMutation,
    employeeDeleteByIdMutation,
    employeeUpdateMutation,
  } = useEmployeeMutation();

  const setEmployeesTimes = useAgendaStore((e) => e.setEmployeeTimes);

  const { data: employeeContent } = useGetEmployeeById(Number(employeeId));

  const { handleError } = useErrorHandler();


  const {
    data: employeeData,
    error: employeeError,
    refetch: employeeRefetch,
    isRefetching: employeeIsRefetching,
    isLoading: employeeIsLoading,
    hasNextPage: employeeHasNextPage,
    fetchNextPage: employeeFetchNextPage,
    isFetchingNextPage: employeeIsFetchingNextPage,
  } = useGetEmployeeMutation();

  const employeeDataPagged =
    employeeData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<EmployeeFormData>();

  const { user } = useUserStore();
  const employeeEmail =
    user?.employeeId === employeeContent?.id ? user?.email : undefined;
  // Função para atualizar os dados da empresa

  const onEmployeeUpdate = handleSubmit(async (employeeData) => {
    try {
      setIsLoading(true);

      const { name, email, password, description, avatarUrl, phone } =
        employeeData;

      const response = await employeeUpdateMutation.mutateAsync({
        employeeId: employeeId,
        data: {
          name,
          email,
          password,
          description,
          avatarUrl,
          phone: unmask(phone ?? ""),
          services: employeeData.services ?? [],
          schedule: employeeData.schedule ?? [],
        },
      });

      const updatedItem: EmployeeInterface = response;

      notify({
        message: "Profissional atualizado com sucesso!",
        type: "SUCCESS",
      });

      queryClient.setQueryData(
        ["employees"],
        (oldData?: InfiniteData<{ content: EmployeeInterface[] }>) => {
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

      router.back();
    } catch (error) {
      handleError(error, "Falha ao atualizar profissional");
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

  // Função para criar employee
  const onSubmit = handleSubmit(async (employeeData) => {
    try {
        console.log("🚨 SCHEDULE ENVIADO:", JSON.stringify(employeeData.schedule, null, 2));

      setIsLoading(true);

      const payload: EmployeeInterface = {
        name: employeeData.name,
        email: employeeData.email,
        password: employeeData.password ?? "",
        description: employeeData.description,
        avatarUrl: employeeData.avatarUrl,
        schedule: employeeData.schedule,
        services: employeeData.services,
        phone: unmask(employeeData.phone ?? ""),
      };

      let updatedEmployee: EmployeeInterface | undefined;

      if (isEditMode && employeeId) {
        // 1️⃣ Atualiza no backend e pega o resultado
        updatedEmployee = await employeeUpdateMutation.mutateAsync({
          employeeId,
          data: payload,
        });

        // 2️⃣ Atualiza estado local
        queryClient.setQueryData(
          ["employees"],
          (oldData?: InfiniteData<{ content: EmployeeInterface[] }>) => {
            if (!oldData) return;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                content: page.content.map((item) =>
                  item.id === updatedEmployee?.id ? updatedEmployee : item,
                ),
              })),
            };
          },
        );

        queryClient.setQueryData(
          employeeKeys.detail(Number(employeeId)),
          (prev?: EmployeeInterface) => {
            if (!prev) return updatedEmployee;
            return { ...prev, ...updatedEmployee };
          },
        );
        notify({
          message: "Profissional atualizado com sucesso!",
          type: "SUCCESS",
        });
      } else {
        updatedEmployee = await employeePostMutation.mutateAsync(payload);

        if (updatedEmployee) {
          queryClient.setQueryData(
            ["employees"],
            (oldData?: InfiniteData<{ content: EmployeeInterface[] }>) => {
              if (!oldData) return;

              return {
                ...oldData,
                pages: oldData.pages.map((page, index) => {
                  // adiciona no primeiro page
                  if (index === 0) {
                    return {
                      ...page,
                      content: [updatedEmployee!, ...page.content],
                    };
                  }
                  return page;
                }),
              };
            },
          );
        }

        notify({
          message: "Profissional criado com sucesso!",
          type: "SUCCESS",
        });
      }

      // 3️⃣ Se trocou a imagem, faz upload agora
      if (avatarUri) {
        setIsUploadingAvatar(true);

        const avatarResponse = await uploadEmployeeAvatarMutation.mutateAsync({
          segment: "employees",
          avatarUri,
          id: Number(updatedEmployee.id),
        });

        setIsUploadingAvatar(false);
      }

      if (updatedEmployee.schedule) {
        setEmployeesTimes(updatedEmployee.schedule);
      }
      await employeeRefetch();

      router.back();
    } catch (error) {
      handleError(
        error,
        isEditMode
          ? "Falha ao atualizar profissional"
          : "Falha ao criar profissional",
      );
    } finally {
      setIsLoading(false);
    }
  });

  // Função para deletar Profissional

  async function onEmployeeDelete(employeeId: number) {
    try {
      setIsLoading(true);
      if (employeeId) {
        await employeeDeleteByIdMutation.mutateAsync(employeeId);

        notify({
          message: "Profissional deletado com sucesso",
          type: "SUCCESS",
        });

        await employeeRefetch();
        router.back();
      } else {
        notify({
          message: "Falha ao deletar profissional",
          type: "ERROR",
        });
        console.log(`Profissional não existe`);
      }
    } catch (error) {
      handleError(error, "Falha ao deletar profissional");
    } finally {
      setIsLoading(false);
    }
  }

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!isEditMode || !employeeContent || hasInitialized.current) return;
    reset({
      name: employeeContent.name,
      email: employeeEmail || employeeContent.email,
      password: employeeContent.password,
      description: employeeContent.description,
      avatarUrl: avatarUri ?? employeeContent.avatarUrl,
      phone: employeeContent.phone ? maskPhone(employeeContent.phone) : "",
      services: employeeContent.services,
      schedule: employeeContent.schedule ?? [],
    });
  }, [employeeContent?.id]);

  useEffect(() => {
    if (isEditMode) return;

    reset({
      name: "",
      email: "",
      password: "",
      description: "",
      avatarUrl: "",
      phone: "",
      schedule: [],
      services: [],
    });
  }, [isEditMode]);

  return {
    control,
    onEmployeeUpdate,
    onEmployeeDelete,
    onSubmit,
    employeeDataPagged,
    isEditMode,
    avatarUri,
    isUploadingAvatar,
    handleSelectAvatar,
    reset,
    employeeContent,
    employeeId,
    employeeRefetch,
    employeeIsRefetching,
    employeeIsLoading,
    employeeHasNextPage,
    employeeFetchNextPage,
    employeeIsFetchingNextPage,
    isLoading,
  };
}

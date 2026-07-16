import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { CompanyServicesInterface } from "@/shared/interfaces/http/company-services";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { useCallback,  useState } from "react";
import {
  Resolver,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { EmployeeFormData } from "../employee.scheme";
import {
  ServiceEmployeeInterface,
  ServiceEmployeeParam,
  ServiceEmployeeParams,
} from "@/shared/interfaces/http/employee";
import {
  EmployeeServicesFormData,
  employeeServicesScheme,
} from "./employeeServices.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProductFormData } from "../../Products/product.scheme";
import { useAppModal } from "@/shared/hooks/useAppModal";
import { useModalStore } from "@/shared/store/modal-store";
import { findByEmployeeAndService } from "@/shared/services/employee.service";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { DAYS } from "@/shared/components/AppModals/CustomDayPriceModal";
import { parseMoney } from "@/utils/moneyMapper";

export function useEmployeeServicesViewModel() {
  const { useGetServiceMutation } = useCompanyServicesMutation();
  const {
    data,
    refetch,
    isLoading,
    error,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isRefetching,
  } = useGetServiceMutation();

  const {
    findByEmployeeAndServiceMutation,
    customServiceDetailsInsertMutation,
    customServiceDetailsUpdateMutation,
  } = useEmployeeMutation();
  const { control, handleSubmit, reset, getValues } =
    useForm<EmployeeServicesFormData>({
      resolver: yupResolver(
        employeeServicesScheme,
      ) as unknown as Resolver<EmployeeServicesFormData>,
      defaultValues: {
        dayPrices: [],
      },
    });

  const { fields, replace } = useFieldArray({ control, name: "dayPrices" });

  const { watch, setValue } = useFormContext<EmployeeFormData>();

  const selectedServices = (watch("services") ?? []) as ServiceEmployeeParam[];
  const services = data?.pages?.flatMap((page) => page.content ?? []) ?? [];
  const [employeeServiceContent, setEmployeeServiceContent] =
    useState<ServiceEmployeeInterface>();
  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();

  const modal = useAppModal();

  const { close, open } = useModalStore();

  const isAllSelected = selectedServices.length === services.length;

  // ✅ Busca dados existentes e popula o form
  async function loadServiceEmployeeData(
    employeeId: number,
    serviceId: number,
  ) {
    try {
      const response = await findByEmployeeAndServiceMutation.mutateAsync({
        employeeId,
        serviceId,
      });

      if (response) {
        const data = response;

        const safeDayPrices = data.dayPrices ?? []; // ← garante array sempre

        const mergedDayPrices = DAYS.map((day) => {
          const existing = safeDayPrices.find((d) => d.dayWeek === day);
          return {
            dayWeek: day,
            customPrice: existing?.customPrice ?? undefined,
            customCommission: existing?.customCommission ?? undefined,
          };
        });

        reset({
          id: data.id,
          employeeId: data.employeeId,
          serviceId: data.serviceId,
          customPrice: data.customPrice,
          customDuration: data.customDuration,
          customCommission: data.customCommission,
          dayPrices: mergedDayPrices, // ← 7 dias sempre presentes
        });
        console.log("1️⃣ reset chamado");
      }
    } catch {
      reset({
        employeeId,
        serviceId,
        dayPrices: DAYS.map((day) => ({
          // ← 7 dias vazios
          dayWeek: day,
          customPrice: undefined,
          customCommission: undefined,
        })),
      });
    }
  }

  // ✅ Salva — insert ou update
  const onSave = handleSubmit(async (formData) => {
    try {
      const payload: ServiceEmployeeParams = {
        employeeId: formData.employeeId!,
        serviceId: formData.serviceId!,
        customPrice: (formData.customPrice !== undefined && formData.customPrice !== null && String(formData.customPrice).trim() !== "")
          ? parseMoney(String(formData.customPrice))
          : undefined,
        customDuration: (formData.customDuration !== undefined && formData.customDuration !== null && String(formData.customDuration).trim() !== "")
          ? parseInt(String(formData.customDuration), 10)
          : undefined,
        customCommission: (formData.customCommission !== undefined && formData.customCommission !== null && String(formData.customCommission).trim() !== "")
          ? parseMoney(String(formData.customCommission))
          : undefined,
        // ✅ Filtra só os dias que têm valor preenchido
        dayPrices: (formData.dayPrices ?? [])
          .filter((dp) => (dp.customPrice != null && String(dp.customPrice).trim() !== "") || (dp.customCommission != null && String(dp.customCommission).trim() !== ""))
          .map((dp) => ({
            dayWeek: dp.dayWeek!,
            customPrice: (dp.customPrice != null && String(dp.customPrice).trim() !== "") ? parseMoney(String(dp.customPrice))! : 0,
            customCommission: (dp.customCommission != null && String(dp.customCommission).trim() !== "") ? parseMoney(String(dp.customCommission))! : 0,
          })),
      };

      if (formData.id) {
        console.log("update passou");
        const data = await customServiceDetailsUpdateMutation.mutateAsync({
          dataBody: payload,
          id: formData.id,
        });
        console.log(data);
      } else {
        const data =
          await customServiceDetailsInsertMutation.mutateAsync(payload);
        console.log("create passou" + data);
      }

      notify({
        message: "Salvo com sucesso!",
        type: "SUCCESS",
      });
      close();
    } catch (error) {
      handleError(error, "Falha ao salvar");
    }
  });

  const handleOpenCustomServiceModal = useCallback(
    async (employeeId?: number, serviceId?: number) => {
      if (employeeId && serviceId) {
        await loadServiceEmployeeData(employeeId, serviceId);
      }
      console.log("2️⃣ após load, antes do setTimeout");

      // Abre APÓS o reset ter sido aplicado
      setTimeout(() => {
        console.log("3️⃣ dentro do setTimeout, abrindo modal");

        modal.showCustomServiceModal({
          title: "Personalizar serviço",
          subtitle: "Deixe vazio para usar valores padrão",
          control,
          buttonLeftTitle: "Cancelar",
          buttonLeftAction: () => close(),
          buttonRightTitle: "Próximo →",
          buttonRightAction: () => {
            close();
            handleOpenCustomDayPriceModal();
          },
        });
      }, 0); // tick depois do reset
    },
    [modal, control],
  );

  const handleOpenCustomDayPriceModal = useCallback(() => {
    modal.showCustomDayPriceModal({
      title: "Preço por dia da semana",
      subtitle: "Deixe vazio para usar valores padrão",
      control,
      buttonLeftTitle: "← Voltar",
      buttonLeftAction: () => {
        close();
        handleOpenCustomServiceModal();
      },
      buttonRightTitle: "Salvar",
      buttonRightAction: async () => {
        await onSave();
      },
    });
  }, [modal, control, handleOpenCustomServiceModal]);

  // Função para Buscar serviços

  const toggleService = useCallback(
    (id: number) => {
      const currentServices = (watch("services") ??
        []) as ServiceEmployeeParam[];

      const currentService = (watch("services") ??
        []) as CompanyServicesInterface[];
      const exists = currentService.some((s) => s.id === id);

      if (exists) {
        const updated = currentService.filter((s) => s.id !== id);
        setValue("services", updated, {
          shouldDirty: true,
          shouldValidate: true,
        });
        return;
      }

      const updated = [...currentServices, { id }];

      setValue("services", updated, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [watch, setValue],
  );

  const toggleSelectAll = useCallback(() => {
    const currentServices = (watch("services") ?? []) as ServiceEmployeeParam[];

    const allSelected = currentServices.length === services.length;

    // Se todos já estiverem selecionados → limpa tudo
    if (allSelected) {
      setValue("services", [], {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    // Se não estiverem todos selecionados → seleciona todos
    const allServices = services.map((service) => ({
      id: service.id,
    }));

    setValue("services", allServices, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [watch, setValue, services]);

  return {
    services,
    isRefetching,
    isLoading,
    error,
    toggleService,
    toggleSelectAll,
    selectedServices,
    refetch,
    isAllSelected,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    handleOpenCustomServiceModal,
    dayPricesFields: fields,
    replaceDayPrices: replace,
  };
}

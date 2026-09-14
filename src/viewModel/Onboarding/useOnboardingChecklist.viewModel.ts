import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useUserStore } from "@/shared/store/user-store";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useQuery } from "@tanstack/react-query";
import { getClients } from "@/shared/services/client.service";
import { getServices } from "@/shared/services/companyservice.service";
import { getAppointments } from "@/shared/services/appointment.service";
import { companyDetails } from "@/shared/services/company.service";
import { useCompanyStore } from "@/shared/store/company-store";
import { CompanyProps } from "@/shared/interfaces/http/company";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  iconName: string;
  isCompleted: boolean;
  actionRoute?: string;
  actionType?: "route" | "modal";
}

const STORAGE_KEY = "beautyfi_onboarding_dismissed";

export function useOnboardingChecklistViewModel() {
  const { user } = useUserStore();
  const { selectedCompanyId } = useCompanyStore();
  const companyId = user?.companyId || selectedCompanyId || 0;
  const { safePush } = useSafeNavigation();

  const [isDismissed, setIsDismissed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((val) => {
      if (val === "true") setIsDismissed(true);
    }).catch(() => {});
  }, []);

  const dismissCard = async () => {
    setIsDismissed(true);
    await AsyncStorage.setItem(STORAGE_KEY, "true").catch(() => {});
  };

  const reopenCard = async () => {
    setIsDismissed(false);
    await AsyncStorage.setItem(STORAGE_KEY, "false").catch(() => {});
  };

  // Queries for real backend data validation (Safe execution)
  const isEnabled = Boolean(companyId && companyId > 0 && user?.id);

  const { data: clientsData } = useQuery({
    queryKey: ["onboarding-clients", companyId],
    queryFn: () => getClients(0, 1),
    enabled: isEnabled,
    staleTime: 1000 * 30,
    retry: false,
  });

  const { data: servicesData } = useQuery({
    queryKey: ["onboarding-services", companyId],
    queryFn: () => getServices(0, 10, undefined, companyId),
    enabled: isEnabled,
    staleTime: 1000 * 30,
    retry: false,
  });

  const { data: appointmentsData } = useQuery({
    queryKey: ["onboarding-appointments", companyId],
    queryFn: () => getAppointments(0, 1, companyId),
    enabled: isEnabled,
    staleTime: 1000 * 30,
    retry: false,
  });

  const { data: companyData } = useQuery({
    queryKey: ["onboarding-company", companyId],
    queryFn: () => companyDetails(companyId),
    enabled: isEnabled,
    staleTime: 1000 * 30,
    retry: false,
  });

  // Step completions logic
  const hasAvatarOrLogo = Boolean(user?.avatarUrl || companyData?.logoUrl);
  const hasGalleryPhotos = Boolean(companyData?.imagesUrl && companyData.imagesUrl.trim().length > 0);
  const hasWorkingHours = Boolean(
    companyData?.openingHourDTOS && (
      (Array.isArray(companyData.openingHourDTOS) && companyData.openingHourDTOS.length > 0) ||
      (typeof companyData.openingHourDTOS === "object" && Object.keys(companyData.openingHourDTOS).length > 0)
    )
  );
  const hasFirstService = Boolean(servicesData && (servicesData.totalElements > 0 || servicesData.content?.length > 0));
  const hasImportedClients = Boolean(clientsData && (clientsData.totalElements > 0 || clientsData.content?.length > 0));
  const hasFirstBooking = Boolean(appointmentsData && (appointmentsData.totalElements > 0 || appointmentsData.content?.length > 0));

  const steps: OnboardingStep[] = [
    {
      id: "photo",
      title: "Adicionar foto de perfil ou logo",
      description: "Personalize seu estabelecimento com uma foto marcante.",
      iconName: "camera-outline",
      isCompleted: hasAvatarOrLogo,
      actionRoute: "/(private)/(tabs)/(admin-tabs)/(menu)/preferences/company-edit",
      actionType: "route",
    },
    {
      id: "gallery",
      title: "Fotos do estabelecimento",
      description: "Adicione fotos da sua estrutura para encantar clientes.",
      iconName: "images-outline",
      isCompleted: hasGalleryPhotos,
      actionRoute: "/(private)/(tabs)/(admin-tabs)/(menu)/preferences/company-edit",
      actionType: "route",
    },
    {
      id: "hours",
      title: "Configurar horário de funcionamento",
      description: "Defina seus dias e horários de atendimento.",
      iconName: "time-outline",
      isCompleted: hasWorkingHours,
      actionRoute: "/(private)/(tabs)/(admin-tabs)/(menu)/preferences/company-edit",
      actionType: "route",
    },
    {
      id: "service",
      title: "Cadastrar o primeiro serviço",
      description: "Adicione cortes, tratamentos ou procedimentos.",
      iconName: "cut-outline",
      isCompleted: hasFirstService,
      actionRoute: "/(private)/(crud)",
      actionType: "route",
    },
    {
      id: "clients",
      title: "Importar clientes",
      description: "Suba sua base do celular ou planilha CSV com LGPD.",
      iconName: "people-outline",
      isCompleted: hasImportedClients,
      actionType: "modal",
    },
    {
      id: "booking",
      title: "Fazer o primeiro agendamento",
      description: "Crie um agendamento de teste para ver a magia acontecer.",
      iconName: "calendar-outline",
      isCompleted: hasFirstBooking,
      actionRoute: "/(private)/(tabs)/(admin-tabs)/agenda",
      actionType: "route",
    },
  ];

  const completedCount = steps.filter((s) => s.isCompleted).length;
  const totalCount = steps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const isAllCompleted = completedCount === totalCount;

  const handleStepPress = (step: OnboardingStep) => {
    if (step.actionType === "modal" && step.id === "clients") {
      setIsImportModalOpen(true);
    } else if (step.actionRoute) {
      safePush(step.actionRoute);
    }
  };

  return {
    steps,
    completedCount,
    totalCount,
    progressPercent,
    isAllCompleted,
    isDismissed,
    dismissCard,
    reopenCard,
    showCelebration,
    setShowCelebration,
    isImportModalOpen,
    setIsImportModalOpen,
    handleStepPress,
  };
}

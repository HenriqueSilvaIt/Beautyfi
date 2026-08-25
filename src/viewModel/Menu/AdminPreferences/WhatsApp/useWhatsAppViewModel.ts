import { useState, useEffect } from "react";
import { Linking } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { EvStatus } from "@/shared/interfaces/http/whatsapp";
import { useWhatsAppMutation } from "@/shared/queries/zap/use-wt-send-message.mutation";
import { connectionState } from "@/shared/services/ev.service";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { useCompanyStore } from "@/shared/store/company-store";
import { useUserLoggedQuery, useUserUserUpdatePreferences } from "@/shared/queries/user/use-user-logged.mutation";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";

export function useWhatsAppViewModel() {
  const [status, setStatus] = useState<EvStatus>(null);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [minutesBefore, setMinutesBefore] = useState(60);
  const [bookingConfirmationEnabled, setBookingConfirmationEnabled] = useState(true);
  const [companyType, setCompanyType] = useState<"MULTI_TENANT" | "WHITE_LABEL" | null>(null);
  const [isSavingReminder, setIsSavingReminder] = useState(false);
  const [isSavingConfirmation, setIsSavingConfirmation] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(true);
  const [isSavingPush, setIsSavingPush] = useState(false);

  const { notify } = useSnackbarContext();
  const { handleError } = useErrorHandler();

  const {
    createInstanceMutation,
    logoutInstanceMutation,
    deleteInstanceMutation,
    useConnectionStateQuery,
  } = useWhatsAppMutation();

  // ✅ usa a mutation e query existentes
  const selectedCompanyId = useCompanyStore((state) => state.selectedCompanyId);
  const { useGetCompanyDetailsQuery, updateReminderConfigMutation } = useCompanyDetailsMutation();
  const { data: companyDetails } = useGetCompanyDetailsQuery(selectedCompanyId || undefined);

  const { data: userLogged } = useUserLoggedQuery();
  const { userUpdatePreferencesMutation } = useUserUserUpdatePreferences();

  const isAwaitingConnection = status === "QRCODE" || status === "CONNECTING";
  const { data: connectionData, isRefetching: isPolling } =
    useConnectionStateQuery(isAwaitingConnection);

  // ─── Helper ───────────────────────────────────────────────────────────────

  function mapState(state?: string): EvStatus {
    switch (state) {
      case "open":
        return "CONNECTED";
      case "connecting":
        return "CONNECTING";
      case "close":
        return "DISCONNECTED";
      default:
        return null;
    }
  }

  // ─── Load status ao entrar na tela ────────────────────────────────────────

  useEffect(() => {
    if (companyDetails) {
      setReminderEnabled(!!companyDetails.reminderEnabled);
      setMinutesBefore(companyDetails.reminderMinutesBefore ?? 60);
      setBookingConfirmationEnabled(companyDetails.bookingConfirmationEnabled !== false);
      setCompanyType(companyDetails.type ?? "MULTI_TENANT");
    }
  }, [companyDetails]);

  useEffect(() => {
    if (userLogged) {
      setPushEnabled(userLogged.allowPushNotifications !== false);
    }
  }, [userLogged]);

  useEffect(() => {
    async function loadInitialStatus() {
      if (companyDetails?.type === "MULTI_TENANT") {
        setStatus("CONNECTED");
        setIsInitialLoading(false);
        return;
      }
      try {
        setIsInitialLoading(true);
        const res = await connectionState();
        setStatus(mapState(res?.instance?.state));
      } catch {
        setStatus(null);
      } finally {
        setIsInitialLoading(false);
      }
    }

    if (companyDetails) {
      loadInitialStatus();
    }
  }, [companyDetails]);

  // ─── Atualiza status pelo polling ─────────────────────────────────────────

  useEffect(() => {
    if (!connectionData) return;
    const mapped = mapState(connectionData?.instance?.state);
    setStatus(mapped);

    if (mapped === "CONNECTED") {
      setQrBase64(null);
      notify({ message: "WhatsApp conectado!", type: "SUCCESS" });
    }
  }, [connectionData]);

  // ─── Connect ──────────────────────────────────────────────────────────────

  async function handleConnect() {
    try {
      const res = await createInstanceMutation.mutateAsync();
      const qr = res?.qrcode?.base64;
      if (qr) {
        setQrBase64(qr);
        setStatus("QRCODE");
      }
    } catch (error: any) {
      if (error?.message?.includes("já está conectado")) {
        setStatus("CONNECTED");
        return;
      }
      handleError(error, "Erro ao gerar QR Code");
    }
  }

  // ─── Disconnect ───────────────────────────────────────────────────────────

  async function handleDisconnect() {
    try {
      await logoutInstanceMutation.mutateAsync();
      setStatus("DISCONNECTED");
      setQrBase64(null);
    } catch (error) {
      handleError(error, "Erro ao desconectar");
    }
  }

  // ─── Delete ───────────────────────────────────────────────────────────────

  async function handleDelete() {
    try {
      await deleteInstanceMutation.mutateAsync();
      setStatus(null);
      setQrBase64(null);
    } catch (error) {
      handleError(error, "Erro ao remover instância");
    }
  }

  // ─── Reminder — toggle ────────────────────────────────────────────────────

  async function handleToggleReminder(value: boolean) {
    const previous = reminderEnabled;
    setReminderEnabled(value); // ✅ optimistic update
    try {
      setIsSavingReminder(true);
      await updateReminderConfigMutation.mutateAsync({
        reminderEnabled: value,
      });
      notify({
        message: value ? "Lembrete ativado!" : "Lembrete desativado!",
        type: "SUCCESS",
      });
    } catch (error) {
      setReminderEnabled(previous); // ✅ reverte se falhar
      handleError(error, "Erro ao salvar configuração");
    } finally {
      setIsSavingReminder(false);
    }
  }

  // ─── Reminder — minutos antes ─────────────────────────────────────────────

  async function handleChangeMinutesBefore(minutes: number) {
    const previous = minutesBefore;
    setMinutesBefore(minutes); // ✅ optimistic update
    try {
      setIsSavingReminder(true);
      await updateReminderConfigMutation.mutateAsync({
        reminderMinutesBefore: minutes,
      });
      notify({ message: "Configuração salva!", type: "SUCCESS" });
    } catch (error) {
      setMinutesBefore(previous); // ✅ reverte se falhar
      handleError(error, "Erro ao salvar configuração");
    } finally {
      setIsSavingReminder(false);
    }
  }

  // ─── Confirmation — toggle ───────────────────────────────────────────────

  async function handleToggleConfirmation(value: boolean) {
    const previous = bookingConfirmationEnabled;
    setBookingConfirmationEnabled(value); // ✅ optimistic update
    try {
      setIsSavingConfirmation(true);
      await updateReminderConfigMutation.mutateAsync({
        bookingConfirmationEnabled: value,
      });
      notify({
        message: value ? "Confirmação ativada!" : "Confirmação desativada!",
        type: "SUCCESS",
      });
    } catch (error) {
      setBookingConfirmationEnabled(previous); // ✅ reverte se falhar
      handleError(error, "Erro ao salvar configuração");
    } finally {
      setIsSavingConfirmation(false);
    }
  }

  // ─── Fetch Entitlements Real Usage & Limit ─────────────────────────────────
  const { data: entitlements } = useQuery({
    queryKey: ["entitlements", selectedCompanyId],
    queryFn: async () => {
      try {
        const { data } = await styleAppApiClient.get("/me/entitlements");
        return data;
      } catch {
        return null;
      }
    },
    enabled: !!selectedCompanyId,
  });

  const remindersCount = entitlements?.usage?.lembretes_mes ?? 0;
  const rawLimit = entitlements?.limits?.lembretes_mes;
  const remindersLimit = (rawLimit != null && rawLimit < 9999) ? rawLimit : (rawLimit ?? 100);
  const planName = entitlements?.planName || "Starter";

  async function handleBuyMessages() {
    try {
      const url = "https://painel.beautyfi.com.br";
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL("https://painel.beautyfi.com.br");
      }
    } catch (error) {
      handleError(error, "Erro ao abrir o painel web www.painel.beautify.com.br");
    }
  }

  async function handleTogglePush(value: boolean) {
    const previous = pushEnabled;
    setPushEnabled(value);
    setIsSavingPush(true);
    try {
      await userUpdatePreferencesMutation.mutateAsync({
        allowPushNotifications: value
      });
      notify({ message: "Preferência de notificação push salva!", type: "SUCCESS" });
    } catch (err) {
      setPushEnabled(previous);
      handleError(err, "Erro ao salvar preferência de push");
    } finally {
      setIsSavingPush(false);
    }
  }

  return {
    // whatsapp
    status,
    setStatus,
    qrBase64,
    isInitialLoading,
    isPolling,
    isLoading:
      createInstanceMutation.isPending ||
      logoutInstanceMutation.isPending ||
      deleteInstanceMutation.isPending,
    handleConnect,
    handleDisconnect,
    handleDelete,
    // reminder
    reminderEnabled,
    minutesBefore,
    isSavingReminder,
    handleToggleReminder,
    handleChangeMinutesBefore,
    // confirmation
    bookingConfirmationEnabled,
    companyType,
    isSavingConfirmation,
    handleToggleConfirmation,
    // usage & Stripe integration
    remindersCount,
    remindersLimit,
    handleBuyMessages,
    // push notifications
    pushEnabled,
    isSavingPush,
    handleTogglePush,
  };
}

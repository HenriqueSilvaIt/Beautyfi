// useWhatsAppViewModel.ts
import { useState, useEffect } from "react";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { EvStatus } from "@/shared/interfaces/http/whatsapp";
import { useWhatsAppMutation } from "@/shared/queries/zap/use-wt-send-message.mutation";
import { connectionState } from "@/shared/services/ev.service";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";

export function useWhatsAppViewModel() {
  const [status, setStatus] = useState<EvStatus>(null);
  const [qrBase64, setQrBase64] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [minutesBefore, setMinutesBefore] = useState(60);
  const [isSavingReminder, setIsSavingReminder] = useState(false);

  const { notify } = useSnackbarContext();
  const { handleError } = useErrorHandler();

  const {
    createInstanceMutation,
    logoutInstanceMutation,
    deleteInstanceMutation,
    useConnectionStateQuery,
  } = useWhatsAppMutation();

  // ✅ usa a mutation já existente
  const { updateReminderConfigMutation } = useCompanyDetailsMutation();

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
    async function loadInitialStatus() {
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

    loadInitialStatus();
  }, []);

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
  };
}

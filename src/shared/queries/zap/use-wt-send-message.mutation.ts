import {
  WtSendMediaHttpParams,
  WtSendMensageHttpParams,
} from "@/shared/interfaces/http/whatsapp";
import {
  connectInstance,
  connectionState,
  createInstance,
  deleteInstance,
  logoutInstance,
  restartInstance,
  sendMedia,
  sendMessage,
} from "@/shared/services/ev.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useWhatsAppMutation() {
  const mutation = useMutation({
    mutationFn: (dataBody: WtSendMensageHttpParams) => sendMessage(dataBody),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  // ─── INSTANCE ───────────────────────────────────────────────────────────────

  const createInstanceMutation = useMutation({
    mutationFn: createInstance,
  });

  const connectInstanceMutation = useMutation({
    mutationFn: connectInstance,
  });

  const restartInstanceMutation = useMutation({
    mutationFn: restartInstance,
  });

  const logoutInstanceMutation = useMutation({
    mutationFn: logoutInstance,
  });

  const deleteInstanceMutation = useMutation({
    mutationFn: deleteInstance,
  });

  // ─── MESSAGES ───────────────────────────────────────────────────────────────

  const sendMessageMutation = useMutation({
    mutationFn: (dto: WtSendMensageHttpParams) => sendMessage(dto),
  });

  const sendMediaMutation = useMutation({
    mutationFn: (dto: WtSendMediaHttpParams) => sendMedia(dto),
  });

  // ─── QUERIES ────────────────────────────────────────────────────────────────

  // connectionState como query — refetch manual ou por intervalo
  function useConnectionStateQuery(enabled = false) {
    return useQuery({
      queryKey: ["ev-connection-state"],
      queryFn: connectionState,
      enabled,
      refetchInterval: enabled ? 5000 : false,
      staleTime: 0,
      retry: false, // ✅ não tenta de novo se instância não existe
    });
  }
  return {
    // instance
    createInstanceMutation,
    connectInstanceMutation,
    restartInstanceMutation,
    logoutInstanceMutation,
    deleteInstanceMutation,
    // messages
    sendMessageMutation,
    sendMediaMutation,
    // queries
    useConnectionStateQuery,
  };
}

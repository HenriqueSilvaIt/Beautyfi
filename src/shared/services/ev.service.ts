import { evolutionApiClient } from "../api/evolutionApi";
import { styleAppApiClient } from "../api/styleAppBackend";
import { WtConnectInstanceHttpResponse, WtConnectionStateHttpResponse, WtCreateInstanceHttpResponse, WtSendMediaHttpParams, WtSendMensageHttpParams, WtSendMensageHttpResponse } from "../interfaces/http/whatsapp";






// ─── INSTANCE ─────────────────────────────────────────────────────────────────

export async function createInstance(): Promise<WtCreateInstanceHttpResponse> {
  const res = await styleAppApiClient.post("/ev/instance/create");
  return res.data;
}

export async function connectInstance(): Promise<WtConnectInstanceHttpResponse> {
  const res = await styleAppApiClient.get("/ev/instance/connect");
  return res.data;
}

export async function restartInstance(): Promise<void> {
  await styleAppApiClient.put("/ev/instance/restart");
}

export async function connectionState(): Promise<WtConnectionStateHttpResponse> {
  const res = await styleAppApiClient.get("/ev/instance/state");
  return res.data;
}

export async function logoutInstance(): Promise<void> {
  await styleAppApiClient.delete("/ev/instance/logout");
}

export async function deleteInstance(): Promise<void> {
  await styleAppApiClient.delete("/ev/instance/delete");
}

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

export async function sendMessage(
  dto: WtSendMensageHttpParams,
): Promise<WtSendMensageHttpResponse> {
  const res = await styleAppApiClient.post("/ev/send", dto);
  return res.data;
}

export async function sendMedia(
  dto: WtSendMediaHttpParams,
): Promise<WtSendMensageHttpResponse> {
  const res = await styleAppApiClient.post("/ev/send/media", dto);
  return res.data;
}
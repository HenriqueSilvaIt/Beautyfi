export interface WtSendMensageHttpParams {
  number: string;
  text: string;
  delay: number;
}

interface WtSendMensageKey {
  remoteJid: string;
  fromMe: boolean;
  id: string;
}

interface WtSendMensageBody {
  conversion: string;
}

export interface WtSendMensageHttpResponse {
  number: string;
  text: string;
  delay: number;
  linkPreview: boolean;
  mentionsEveryOne: boolean;
  key: WtSendMensageKey[];
  pushName: string;
  status: string;
  message: WtSendMensageBody[];
  contextInfo: string;
  messageType: string;
  messageTimestamp: number;
  instanceId: string;
  source: string;
}

// ─── SEND TEXT ────────────────────────────────────────────────────────────────
export interface WtSendMensageHttpParams {
  number: string;
  text: string;
  delay: number;
  linkPreview?: boolean;
}



interface WtMessageKey {
  remoteJid: string;
  fromMe: boolean;
  id: string;
}

// ─── SEND MEDIA ───────────────────────────────────────────────────────────────
export interface WtSendMediaHttpParams {
  number: string;
  mediatype: "image" | "video" | "document" | "audio";
  mimetype: string;
  caption?: string;
  media: string; // URL ou base64
  fileName?: string;
  delay?: number;
}

// ─── CREATE INSTANCE ──────────────────────────────────────────────────────────
export interface WtCreateInstanceHttpParams {
  instanceName: string;
  qrcode?: boolean;
  integration?: "WHATSAPP-BAILEYS" | "WHATSAPP-BUSINESS" | "EVOLUTION";
}

export interface WtCreateInstanceHttpResponse {
  instance: {
    instanceName: string;
    instanceId: string;
    integration: string;
    status: string;
  };
  hash: string;
  qrcode?: WtQrCode;
}

export interface WtQrCode {
  pairingCode: string | null;
  code: string;
  base64: string;
  count: number;
}

// ─── CONNECT INSTANCE ─────────────────────────────────────────────────────────
export interface WtConnectInstanceHttpResponse {
  pairingCode: string | null;
  code: string;
  base64: string;
  count: number;
}

// ─── CONNECTION STATE ──────────────────────────────────────────────────────────
export type WtConnectionState = "open" | "connecting" | "close";

export interface WtConnectionStateHttpResponse {
  instance: {
    instanceName: string;
    state: WtConnectionState;
  };
}

// ─── EV INSTANCE STATUS (frontend) ────────────────────────────────────────────
export type EvStatus = "CONNECTED" | "DISCONNECTED" | "QRCODE" | "CONNECTING" | null;

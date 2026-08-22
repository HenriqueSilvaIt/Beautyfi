export const CSV_MODEL_HEADER = "Nome,Sobrenome,Telefone,Email,Aniversario,Observacoes";
export const CSV_MODEL_EXAMPLE = `Ana,Silva,11999998888,ana.silva@email.com,15/04/1990,Cliente VIP
Carlos,Oliveira,21988887777,carlos@email.com,20/10/1985,Preferência por corte aos sábados`;

export function getCsvTemplateString(): string {
  return `${CSV_MODEL_HEADER}\n${CSV_MODEL_EXAMPLE}`;
}

export interface ParsedCsvRow {
  name: string;
  lastName?: string;
  phone: string;
  email?: string;
  birthDate?: string;
  notes?: string;
  rawLineIndex: number;
  isValid: boolean;
  validationError?: string;
}

export function parseCsvClientData(csvText: string): ParsedCsvRow[] {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length <= 1) return [];

  const headers = lines[0].toLowerCase().split(",").map((h) => h.trim());
  const rows: ParsedCsvRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim().replace(/^["']|["']$/g, ""));
    
    // Map column standard or fallback by index
    const nameIdx = headers.findIndex((h) => h.includes("nome") && !h.includes("sobrenome")) >= 0
      ? headers.findIndex((h) => h.includes("nome") && !h.includes("sobrenome"))
      : 0;
    const lastNameIdx = headers.findIndex((h) => h.includes("sobrenome")) >= 0
      ? headers.findIndex((h) => h.includes("sobrenome"))
      : 1;
    const phoneIdx = headers.findIndex((h) => h.includes("tel") || h.includes("cel") || h.includes("fone")) >= 0
      ? headers.findIndex((h) => h.includes("tel") || h.includes("cel") || h.includes("fone"))
      : 2;
    const emailIdx = headers.findIndex((h) => h.includes("mail")) >= 0
      ? headers.findIndex((h) => h.includes("mail"))
      : 3;
    const birthIdx = headers.findIndex((h) => h.includes("nasc") || h.includes("aniver") || h.includes("data")) >= 0
      ? headers.findIndex((h) => h.includes("nasc") || h.includes("aniver") || h.includes("data"))
      : 4;

    const name = cols[nameIdx] || cols[0] || "";
    const lastName = cols[lastNameIdx] || "";
    const rawPhone = cols[phoneIdx] || cols[1] || "";
    const email = cols[emailIdx] || "";
    const birthDate = cols[birthIdx] || "";

    const digitsOnly = rawPhone.replace(/\D/g, "");
    let normalizedPhone = "";
    let isValid = true;
    let validationError = "";

    if (!name) {
      isValid = false;
      validationError = "Nome não informado";
    } else if (digitsOnly.length < 10) {
      isValid = false;
      validationError = "Telefone inválido (mínimo 10 dígitos)";
    } else {
      if (digitsOnly.length === 10 || digitsOnly.length === 11) {
        normalizedPhone = `+55${digitsOnly}`;
      } else if (digitsOnly.startsWith("55") && (digitsOnly.length === 12 || digitsOnly.length === 13)) {
        normalizedPhone = `+${digitsOnly}`;
      } else {
        normalizedPhone = `+${digitsOnly}`;
      }
    }

    rows.push({
      name,
      lastName,
      phone: normalizedPhone || rawPhone,
      email,
      birthDate,
      rawLineIndex: i + 1,
      isValid,
      validationError,
    });
  }

  return rows;
}

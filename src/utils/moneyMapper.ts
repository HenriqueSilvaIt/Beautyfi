
//Função para atualização do formato da moeda para separar por ; para os centavos
// Ele já substitui o toFixed(2) e o replace(".", ",") toLocaleString é do javascript n precisa instalar
export function moneyMapper(value?: number){
    if (!value || isNaN(value)) return "0,00";

    return value.toLocaleString("pt-br", {
        minimumFractionDigits: 2, /*ESTAMOS dizendo que sempre deve aparecer 2 digitos
        depos da virgula */
        maximumFractionDigits: 2 /*maximo de digito após a vigula é 2  */
    })
}

export function parseQuantity(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function parseMoney(value?: string) {

  if (!value) return;
  // "12,50" -> 12.50
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
}

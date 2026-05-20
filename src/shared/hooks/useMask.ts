export function useMask() {
  function maskDate(value: string) {
    return value
      .replace(/\D/g, "") // só números
      .replace(/^(\d{2})(\d)/, "$1/$2")
      .replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3")
      .replace(/(\d{4}).*/, "$1");
  }

  function maskPhone(value: string): string {
    if (!value) return "";

    // remove tudo que não for número
    const digits = value.replace(/\D/g, "");

    // limita no máximo 11 dígitos
    const limited = digits.slice(0, 11);

    // celular (11 dígitos)
    if (limited.length > 10) {
      return limited.replace(/^(\d{2})(\d{5})(\d{4}).*/, "($1) $2-$3");
    }

    // fixo (10 dígitos)
    if (limited.length > 6) {
      return limited.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    }

    if (limited.length > 2) {
      return limited.replace(/^(\d{2})(\d+)/, "($1) $2");
    }

    if (limited.length > 0) {
      return limited.replace(/^(\d*)/, "($1");
    }

    return limited;
  }

  function unmask(value: string) {
    return value.replace(/\D/g, "");
  }

   function maskMoneyBR(text: string) {

  // pega só números
  const onlyDigits = text.replace(/\D/g, "");

  if (!onlyDigits) return "";

  // transforma em centavos
  const numberValue = Number(onlyDigits) / 100;

  // formata pt-BR
  return numberValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

  return {
    maskPhone,
    unmask,
    maskDate,
    maskMoneyBR
  };
}

import { useEffect, useState } from "react";

/**
 * Retorna um valor "atrasado" que só é atualizado após o delay (ms).
 * Útil para evitar chamadas de API a cada tecla digitada.
 */
export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

import { useRef } from "react";
import { useRouter } from "expo-router";

export function useSafeNavigation() {
  const router = useRouter();
  const isNavigating = useRef(false);

  function safePush(path: string) {
    if (isNavigating.current) return;

    isNavigating.current = true;
    router.push(path);

    // previne clique duplo por 500ms
    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  }

  function safeReplace(path: string) {
    if (isNavigating.current) return;

    isNavigating.current = true;
    router.replace(path);

    setTimeout(() => {
      isNavigating.current = false;
    }, 1000);
  }

  return { safePush, safeReplace };
}

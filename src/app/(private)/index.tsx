import { useUserStore } from "@/shared/store/user-store";
import { Redirect } from "expo-router";

export default function PrivateIndex() {
  const { user, hasHydrated } = useUserStore();

if (!hasHydrated) {
  return null;
}

  const isAdmin =
    user?.roles?.some((role) => role.authority === "ROLE_ADMIN" || role.authority === "ROLE_MODERATOR")  ?? false;


  return (
    <Redirect
      href={
        !isAdmin
          ? "/(private)/(tabs)/(client-tabs)/home" 
          : "/(private)/(tabs)/(admin-tabs)/agenda"
      }
    />
  );
}
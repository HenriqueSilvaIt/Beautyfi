import React from "react";
import { View } from "react-native";
import { useEntitlements, EntitlementsSnapshot } from "@/shared/hooks/useEntitlements";
import { UpgradeLock } from "./UpgradeLock";

interface GateProps {
  feature: keyof EntitlementsSnapshot["features"];
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLockCard?: boolean;
  title?: string;
  description?: string;
}

export function Gate({
  feature,
  children,
  fallback,
  showLockCard = false,
  title,
  description,
}: GateProps) {
  const { can, isLoading } = useEntitlements();

  if (isLoading) {
    return <>{children}</>;
  }

  const isAllowed = can(feature);

  if (isAllowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showLockCard) {
    return <UpgradeLock featureName={feature} title={title} description={description} />;
  }

  return null;
}

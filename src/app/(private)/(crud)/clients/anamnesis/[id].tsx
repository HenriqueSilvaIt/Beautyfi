import React from "react";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { AnamnesisView } from "@/viewModel/Admin/Clients/AnamnesisView";

export default function ClientAnamnesisPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const clientId = id ? Number(id) : undefined;

  if (!clientId) {
    return (
      <View className="flex-1 justify-center items-center bg-background-primary">
        <Text className="text-gray-500 font-bold">ID de cliente inválido.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-primary">
      <AnamnesisView clientId={clientId} />
    </View>
  );
}

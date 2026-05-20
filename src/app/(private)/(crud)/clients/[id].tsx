import { useAgendaStore } from "@/shared/store/agenda-store";
import { ClientView } from "@/viewModel/Admin/Clients/ClientView";
import { useClientViewModel } from "@/viewModel/Admin/Clients/useClientViewModel";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function ClientsDetails() {
  const { id,  } = useLocalSearchParams<{ id?: string }>();

  const clientId = id ? Number(id) : undefined;


  const props = useClientViewModel(clientId);
    // Se employeeId ainda for undefined, dá pra colocar um fallback ou exibir loading
  if (!clientId) return <Text>ID inválido</Text>;



  return (
    <View className="flex-1 bg-background-primary">
      <ClientView {...props} />
    </View>
  );
}

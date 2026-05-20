import { AdvertisementView } from "@/viewModel/Admin/Advertisements/AdvertisementView";
import { useAdvertisementViewModel } from "@/viewModel/Admin/Advertisements/useAdvertisementViewModel";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function AdvertisementDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const advertisementId = id ? Number(id) : undefined;

  const props = useAdvertisementViewModel(advertisementId);
  if (!advertisementId) return <Text>ID inválido</Text>;

  return (
    <View className="flex-1 bg-background-primary">
      <AdvertisementView {...props} />
    </View>
  );
}

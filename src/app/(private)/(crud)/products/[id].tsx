import { ProductView } from "@/viewModel/Admin/Products/ProductView";
import { useProductViewModel } from "@/viewModel/Admin/Products/useProductViewModel";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function ProductDetails() {
  const { id } = useLocalSearchParams<{ id?: string }>();

  const productId = id ? Number(id) : undefined;

  const props = useProductViewModel(productId);
  if (!productId) return <Text>ID inválido</Text>;

  return (
    <View className="flex-1 bg-background-primary">
      <ProductView {...props} />
    </View>
  );
}

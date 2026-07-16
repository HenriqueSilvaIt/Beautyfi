import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AppInputController } from "../../AppInputControler";
import { colors } from "@/styles/colors";
import { Control } from "react-hook-form";
import { OrderFormData } from "@/viewModel/Finance/Order/NewOrder/order.scheme";
import { OrderDetailsFormData } from "@/viewModel/Finance/Order/OrderDetails/orderDetails.scheme";
import { useMask } from "@/shared/hooks/useMask";

export interface AmountModalProps {
  title: string;
  subtitle?: string;
  amount?: number;
  isLoading?: boolean;
  control: Control<OrderDetailsFormData>;
  total?: number;
  buttonTitle: string;
  buttonAction: () => Promise<void>;
  type: "total" | "discount" | "tip";
}

export function AmountModal({
  title,
  subtitle,
  amount,
  total,
  type,
  isLoading,
  control,
  buttonTitle,
  buttonAction,
}: AmountModalProps) {
  const { maskMoneyBR } = useMask();

  return (
    <View className="items-center bg-background-quartenary max-h-[100%] w-[85%] mx-auto max-w-sm p-6">
      <View>
        <Text className="text-app-theme-primary text-xl">{title}</Text>
      </View>

      <Text className="text-font-primary text-sm">{subtitle}</Text>

      {type === "discount" && (
        <View className="w-full">
          <AppInputController
            control={control}
            name="discount"
            label="Valor"
            placeholder="Ex: 20%"
            placeholderTextColor={colors.gray[600]}
          />
        </View>
      )}

      {type === "tip" && (
        <View className="w-full">
          <AppInputController
            control={control}
            name="tip"
            label="Valor"
            placeholder="R$ 0,00"
            placeholderTextColor={colors.gray[600]}
          />
        </View>
      )}

      {type === "total" && (
        <View className="w-full">
          <AppInputController
            control={control}
            name="total"
            label="Valor"
            placeholderTextColor={colors.gray[600]}
          />
        </View>
      )}
      <TouchableOpacity
        onPress={() => {
          buttonAction().catch(console.error);
        }}
        activeOpacity={0.8}
        className={`h-[40px] w-full bg-app-theme-primary rounded-md items-center justify-center 
                      ${isLoading ? "justify-between" : ""}`}
      >
        <Text className="text-center text-xl text-font-secundary font-bold">
          {isLoading ? <ActivityIndicator /> : buttonTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

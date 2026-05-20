import { Text, View } from "react-native";
import { moneyMapper } from "@/utils/moneyMapper";
import { CountUp } from "use-count-up";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
});

type HeaderProps = {
  value: number;
};

export function SellingHeader({ value }: HeaderProps) {
  return (
    <View className="mt-11 px-4">
      <Text className="text-app-theme-primary text-2xl mb-2 font-medium">
        Total vendido
      </Text>
      <Text className="text-font-primary text-6xl font-medium ">
            {moneyMapper(value)}
      </Text>
    </View>
  );
}

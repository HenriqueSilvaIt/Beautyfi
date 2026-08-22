import { Text, View } from "react-native";
import { moneyMapper } from "@/utils/moneyMapper";

type HeaderProps = {
  value: number;
  periodTotal?: number;
  selectedMonthLabel?: string | null;
};

export function SellingHeader({ value, periodTotal, selectedMonthLabel }: HeaderProps) {
  return (
    <View className="mt-4 px-4">
      <Text className="text-app-theme-primary text-xs mb-1 font-bold uppercase tracking-wider">
        {selectedMonthLabel ? `Total Vendido (${selectedMonthLabel})` : "Total Vendido no Período"}
      </Text>
      <Text className="text-font-primary text-5xl font-black mb-1">
        R$ {moneyMapper(value)}
      </Text>
      {selectedMonthLabel && periodTotal !== undefined && (
        <View className="flex-row items-center gap-1.5 mt-1 bg-background-tertiary px-3 py-1.5 rounded-lg border border-slate-800 self-start">
          <Text className="text-gray-400 text-xs font-medium">Total no Período:</Text>
          <Text className="text-app-theme-primary font-bold text-xs">
            R$ {moneyMapper(periodTotal)}
          </Text>
        </View>
      )}
    </View>
  );
}

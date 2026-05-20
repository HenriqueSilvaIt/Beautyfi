
import { useTotalMonthlyViewModel } from "./useTotalMonthlyViewModel";
import { colors } from "@/styles/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, useWindowDimensions } from "react-native";
import { SellingHeader } from "./SellingHeader";
import { useEffect, useMemo, useState } from "react";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";

export function TotalMonthlyView({
  totalMonthly,
}: ReturnType<typeof useTotalMonthlyViewModel>) {
  function formatMonthYear(monthYear: string) {
    const [year, month] = monthYear.split("-");

    const months = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];

    return `${months[Number(month) - 1]}/${year.slice(2)}`;
  }
  const [selectedBar, setSelectedBar] = useState<number | null>(null);

  const barData = useMemo(() => {
    return totalMonthly.map((item, index) => {
      const isSelected = selectedBar === index;
      return {
        value: item.totalSold,
        label: formatMonthYear(item.monthYear),
        frontColor: isSelected
          ? colors["app-theme-primary"]
          : "rgba(255,140,0,0.35)",
        onPress: () => {
          setSelectedBar(index);
          setHighlightValue(item.totalSold); // atualiza header imediatamente
        },
        topLabelComponent: () =>
          isSelected ? (
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
              {item.totalSold}
            </Text>
          ) : null,
      };
    });
  }, [totalMonthly, selectedBar]);

  const [highlightValue, setHighlightValue] = useState(
    barData[barData.length - 1]?.value ?? 0,
  );

  useEffect(() => {
    if (selectedBar !== null) {
      setHighlightValue(barData[selectedBar].value);
    }
  }, [selectedBar]);

  const { width } = useWindowDimensions();

  const maxBarValue = Math.max(...barData.map((b) => b.value), 0);

  // escala proporcional
  const calculatedHeight = Math.min(maxBarValue * 0.5, 300); // nunca acima de 300

  const rangeOptions = barData.map((item) => item.label);
  const [selectedRange, setSelectedRange] = useState<string>(rangeOptions[0]);
  return (
    <SafeAreaView className="flex-1  bg-background-primary">
      <AppAdminHeader title="Vendas" iconRight={{ icon: false, path: "" }} />
      <SellingHeader value={highlightValue} />

      <View className="mt-2 items-center justify-center border-white gap-2 px-2">
  
      </View>
    </SafeAreaView>
  );
}

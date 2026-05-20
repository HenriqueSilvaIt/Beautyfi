import { colors } from "@/styles/colors";
import { BarChart, BarChartPropsType } from "react-native-gifted-charts";

type ChartProps = BarChartPropsType & {
};

type ChartPoint = number;

export function AppBarChart({  ...rest }: ChartProps) {
  return (
    <BarChart
      adjustToWidth
      initialSpacing={0}
      endSpacing={0}
      xAxisThickness={0}
      yAxisThickness={0}
      hideRules
      hideAxesAndRules
      isAnimated
      pointerConfig={{
        pointerStripHeight: 220,
        pointerStripWidth: 1,
        pointerStripUptoDataPoint: true,
        pointerColor: "#FFFFFF",
        pointerStripColor: "#FFFFFF",
        activatePointersOnLongPress: false,
      }}
      {...rest}
    />
  );
}

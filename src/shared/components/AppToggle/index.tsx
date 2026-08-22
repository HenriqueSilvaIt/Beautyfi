import { colors } from "@/styles/colors";
import { Switch, Text, View } from "react-native";

interface AppToggleProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  textTrue?: string;
  textFalse?: string;
  title?: string;
}

export function AppToggle({ value, onValueChange, textTrue, textFalse, title }: AppToggleProps) {
  return (
    <View className="mb-5 rounded-2xl border border-zinc-800 bg-background-tertiary p-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text
            className={`text-base font-semibold ${value ? "text-app-theme-primary" : "text-font-primary"}`}
          >
            {title || "Disponível na vitrine"}
          </Text>
          <Text className="mt-1 text-sm text-gray-600">
            {value
              ? textTrue
              : textFalse}
          </Text>
        </View>
        <Switch
          value={value ?? false}
          onValueChange={onValueChange}
          thumbColor={
            value ? colors["app-theme-primary"] : colors.white
          }
          trackColor={{
            false: colors.gray[800],
            true: colors["app-theme-primary-light"],
          }}
          ios_backgroundColor={colors.gray[800]}
        />
      </View>
    </View>
  );
}

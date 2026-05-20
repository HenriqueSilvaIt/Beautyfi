import { Text, TouchableOpacity, View } from "react-native";
import { SelectionOption, SelectionVariant } from "../../../hooks/useAppModal";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { colors } from "../../../../styles/colors";
export interface SelectionModalProps {
  title: string;
  message?: string;
  options: SelectionOption[];
}

export function SelectionModal({
  title,
  message,
  options,
}: SelectionModalProps) {
  function getButtonClass(variant: SelectionVariant) {
    return clsx(
      "w-full py-3 px-4 rounded-lg items-center flex-row  justify-center mb-2",
      {
        "bg-danger": variant === "danger",
        "bg-accent-blue-dark": variant === "secondary",
        "bg-app-theme-primary": variant === "primary",
      }
    );
  }

  return (
    <View className="bg-white rounded-xl shadow-2xl w-[85%] mx-auto max-w-sm p-6">
      <View className="items-center">
        <Text className="text-lg font-bold text-gray-900 mb-3">{title}</Text>

        {message && (
          <Text className="text-lg text-gray-600 mb-6 leading-6">
            {message}
          </Text>
        )}
      </View>

      <View className="gap-3">
        {options.map((option, index) => (
          <TouchableOpacity
            onPress={option.onPress}
            key={`selection-item-${index}`}
            className={
              getButtonClass(option.variant ?? "primary") /*significa
              ?? "ou primary" porque pode ser undefined*/
            }
          >
            {option.icon && (
              <Ionicons
                name={option.icon}
                color={colors.black}
                className="mr-2"
                size={22}
              />
            )}
            <Text className="font-semibold text-font-secundary">{option.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

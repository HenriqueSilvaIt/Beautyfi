import {
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import { appInputVariant, AppInputVariantProps } from "./input.variant";
import { Ionicons } from "@expo/vector-icons";
import { useAppInputViewModel } from "./useAppInputViewModel";

export interface AppInputProps extends TextInputProps, AppInputVariantProps {
  label?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  containerClassName?: string;
  mask?: (value: string) => void | string;
  error?: string;
  formCrud?: boolean;
  multiline?: boolean; 
  numberOfLines?: number;
  searchBar?: boolean;
}

export function AppInput({
  label,
  leftIcon,
  rightIcon,
  containerClassName,
  className,
  value,
  isError,
  secureTextEntry = false,
  onBlur,
  onFocus,
  onChangeText,
  mask,
  error,
  isDisabled,
  formCrud,
  searchBar,
  ...textInputProps
}: AppInputProps) {
  const {
    getIconColor,
    handleBlur,
    handleFocus,
    handlePasswordToggle,
    handleWrapperPress,
    showPassword,
    handleTextChange,
    isFocused,
  } = useAppInputViewModel({
    onFocus,
    onBlur,
    isError: !!error,
    mask,
    onChangeText,
    isDisabled,
    secureTextEntry,
    value,
  });

  if (searchBar) {
    return (
      <View className={containerClassName || "w-full"}>
        <View className="flex-row items-center bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl shadow-sm">
          {leftIcon && (
            <Ionicons
              color="#6b7280"
              className="mr-3"
              name={leftIcon}
              size={20}
            />
          )}

          <TextInput
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholderTextColor="#9ca3af"
            style={{ flex: 1, color: "#1f2937", fontSize: 14, padding: 0, margin: 0 }}
            onChangeText={handleTextChange}
            value={value}
            {...textInputProps}
          />
        </View>
      </View>
    );
  }

  const styles = appInputVariant({ isFocused, isDisabled, isError });

  return (
    <View className={styles.container({ className: containerClassName })}>
      <Text className={styles.label()}>{label}</Text>
      <Pressable className={styles.wrapper()}>
        {leftIcon && (
          <Ionicons
            color={getIconColor()}
            className="mr-3"
            name={leftIcon}
            size={22}
          />
        )}

        <TextInput
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={styles.input()}
          onChangeText={handleTextChange}
          value={value}
          secureTextEntry={showPassword}
          {...textInputProps}
        />

        {secureTextEntry && !formCrud && (
          <TouchableOpacity onPress={handlePasswordToggle}>
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
      </Pressable>

      {error && (
        <Text className={styles.error()}>
          <Ionicons name="alert-circle-outline"> {error}</Ionicons>
        </Text>
      )}
    </View>
  );
}

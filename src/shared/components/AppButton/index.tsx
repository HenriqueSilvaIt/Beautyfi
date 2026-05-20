import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import { buttonVariants, ButtonVariants } from "./button.variants";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../styles/colors";

interface AppButtonProps extends TouchableOpacityProps, ButtonVariants {
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  children?: string;
  description?: string;
}

export function AppButton({
  leftIcon,
  rightIcon,
  children,
  description,
  variant = "field",
  isLoading,
  isDisabled,
  className,
  size,
  ...rest
}: AppButtonProps) {
  const contentColor =
    variant === "field" ? colors.black : colors["app-theme-primary"];

  const styles = buttonVariants({
    hasIcon: !!leftIcon || !!rightIcon,
    isDisabled,
    isLoading,
    variant,
    size,
  });

  function renderContent() {
    if (isLoading) {
      return <ActivityIndicator size="small" color={contentColor} />;
    }

    return (
      <>
        {leftIcon && (
          <Ionicons name={leftIcon} color={contentColor} size={22} />
        )}

        {size ? (
          <View className="flex-1 ml-3">
            <Text
              className={styles.text()}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ flexShrink: 1 }}
            >
              {children}
            </Text>

            <Text
              className={styles.description()}
              numberOfLines={2}
              ellipsizeMode="tail"
              style={{ flexShrink: 1 }}
            >
              {description}
            </Text>
          </View>
        ) : (
          <Text className={styles.text()}>{children}</Text>
        )}
        {rightIcon && (
          <Ionicons name={rightIcon} color={contentColor} size={22} />
        )}
      </>
    );
  }

  return (
    <TouchableOpacity className={styles.base({ className })} {...rest}>
      {renderContent()}
    </TouchableOpacity>
  );
}

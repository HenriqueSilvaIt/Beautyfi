import { useRef, useState } from "react";
import { BlurEvent, FocusEvent, TextInput } from "react-native";
import { colors } from "../../../styles/colors";

interface AppInputViewModelProps {
  isError?: boolean;
  isDisabled?: boolean;
  error?: string;
  secureTextEntry?: boolean;
  onBlur?: (event: BlurEvent) => void 
  onFocus?: (event: FocusEvent) => void;
  mask?: (text: string) => string | void;
  onChangeText?: (text: string) => string | void;
  value?: string 
}

export function useAppInputViewModel({
  error,
  isDisabled,
  isError,
  mask,
  onBlur,
  onChangeText,
  onFocus,
  secureTextEntry,
  value,
}: AppInputViewModelProps) {
  const [showPassword, setShowPassword] = useState(secureTextEntry);
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);


  function handlePasswordToggle() {
    setShowPassword((prevValue) => !prevValue); 
  }


  function handleWrapperPress() {
    inputRef.current?.focus();
  }


  function handleFocus(event: FocusEvent) {
    setIsFocused(true);
    onFocus?.(event);
  }


  function handleBlur(event: BlurEvent) {
    setIsFocused(false);
    onBlur?.(event);
  }

  function getIconColor() {
    if (isError) return colors.danger; 

    if (isFocused) return colors["app-theme-primary"]; 
    if (value) return colors["app-theme-primary"]; 
    return colors.white;
  }

  function handleTextChange(text: string) {
  
    if (mask) {
  
      onChangeText?.(mask(text) || "");
    } else {
      onChangeText?.(text);
    }
  }

  return {
    getIconColor,
    handleBlur,
    handleFocus,
    handleWrapperPress,
    handlePasswordToggle,
    showPassword,
    handleTextChange,
    isFocused,
  };
}

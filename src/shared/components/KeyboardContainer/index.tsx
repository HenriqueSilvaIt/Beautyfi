import { colors } from "@/styles/colors";
import { FC, ReactNode } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface KeyboardContainerProps {
  children: ReactNode;
  backgroundColor?: string;
}

export const KeyboardContainer: FC<KeyboardContainerProps> = ({
  children,
  backgroundColor,
}) => {
  return (
    <SafeAreaView
      className={`flex-1 ${backgroundColor ? "bg-white" : "bg-background-primary"}`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{
                            paddingBottom: 40,
            }}
            showsVerticalScrollIndicator={false}
          >
           {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

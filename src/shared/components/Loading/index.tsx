import { View, ActivityIndicator, Image } from "react-native";
import { colors } from "../../../styles/colors";
import { KeyboardContainer } from "../KeyboardContainer";

export function Loading() {
  return (
      <View className="flex-1 justify-center bg-background-primary items-center">
        <Image
          className="h-[100px] w-[100px]"
          source={require("@assets/images/logo.png")}
        />
        <ActivityIndicator
          color={colors["app-theme-primary"]}
          className="mt-20"
        />
      </View>
  );
}
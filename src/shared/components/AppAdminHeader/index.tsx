import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

interface AppAdminHeader extends TouchableOpacityProps {
  title: string;
  iconRight: {
    icon: boolean;
    path: string;
  };

  customPath?: string;
  iconRightName?: keyof typeof Ionicons.glyphMap;
  routeIconRight?: string;
  leftIconShown?: boolean;
  action?: () => void | Promise<void>;
}

export function AppAdminHeader({
  title,
  iconRight,
  iconRightName,
  customPath,
  action,
  leftIconShown,
}: AppAdminHeader) {
  const showIcon = iconRight?.icon === true;
function handleBack() {
 if (customPath) {
    router.push(`${customPath}`)
  }
  else {
    router.back();
  }
}
  return (
    <View
      className={`flex-row items-center px-2 border-b mb-2 border-gray-400 h-[60px] ${
        showIcon ? "justify-between" : ""
      } ${leftIconShown ? "px-5" : ""}`}
    >
      {leftIconShown ? (
        ""
      ) : (
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="chevron-back" size={30} color={colors.black} />
        </TouchableOpacity>
      )}

      <Text
        className={`text-font-primary
      text-xl font-bold ${showIcon ? "" : "ml-5"}`}
      >
        {title}
      </Text>
      {showIcon && (
        <TouchableOpacity onPress={action}>
          <Ionicons
            name={iconRightName}
            size={30}
            color={
              iconRightName === "add" ? colors.white : colors["accent-red"]
            }
            className="font-bold"
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

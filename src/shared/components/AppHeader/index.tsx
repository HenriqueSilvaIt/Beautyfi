import { Image, Text } from "react-native";
import { View } from "react-native";
import { UserProps } from "../../interfaces/user";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

interface AppHeaderProps {
  user: UserProps | null | undefined;
  token: string | null;
}

export function AppHeader({ user, token }: AppHeaderProps) {
  const dateWeek = format(new Date(), "EE, d", { locale: ptBR });
  const newDateWeek = dateWeek.charAt(0).toUpperCase() + dateWeek.slice(1);

  return (
    <View className="flex-1 max-h-[80px] items-center py-10 px-5 flex-row justify-between w-full border-b-4 border-gray-800 ">
      <View className="flex-1 flex-row">
        <Image
          source={require("@assets/images/logo.png")}
          resizeMode="cover"
          className="w-[50px] h-[50px] mr-2"
        />
     <View className="flex-1 pr-4">
      {token ? (
      <Text
      className="text-xl font-bold"
      ellipsizeMode="tail"
      numberOfLines={1}
     >
      <Text className="text-app-theme-primary">Oi, </Text>
      <Text className="text-app-theme-primary">{user?.firstName}</Text>
    </Text>
      ) : (
    <Text className="text-xl font-bold text-app-theme-primary">
      Seja bem-vindo
    </Text>
    )}

          <Text className="ml-1 mb-2 mt-1 font-semibold text-sm text-app-theme-secundary">
            {newDateWeek} de {format(new Date(), "MMM", { locale: ptBR })}{" "}
            {format(new Date(), "yyyy", { locale: ptBR })}
          </Text>
        </View>
      </View>

      {/*user && (   
        <View className="items-center">
        <TouchableOpacity className="">
          <Ionicons
            name="notifications"
            size={30}
            color={colors.gray[500]}
          />
        </TouchableOpacity>
      </View>
      ) */}
    </View>
  );
}

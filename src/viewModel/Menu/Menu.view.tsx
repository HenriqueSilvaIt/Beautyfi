import { Image, Linking, Text, TouchableOpacity, View } from "react-native";
import { useMenuViewModel } from "./useMenu.viewModel";
import { KeyboardContainer } from "../../shared/components/KeyboardContainer";
import { AppButton } from "@/shared/components/AppButton";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useUserStore } from "@/shared/store/user-store";
import { getCloudinaryAvatar } from "@/shared/helpers/AppCloudinaryAvatar";
import { sizeClasses } from "@/shared/components/AppAvatar";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";

export function MenuView({
  logoutUser,
  user,
  userData,
}: ReturnType<typeof useMenuViewModel>) {
  const { safePush } = useSafeNavigation();

  const isAdmin =
    user?.roles?.some((role) => role.authority === "ROLE_ADMIN") ?? false;

  const isEmployee =
    user?.roles?.some((role) => role.authority === "ROLE_MODERATOR") ?? false;

  const term =
    "https://dom-palagani.notion.site/Pol-tica-de-Privacidade-Dom-Palagani-Barber-2f5522fee97c80c2a85dd2049901538d";
  return (
    <KeyboardContainer>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
          minHeight: "100%",
        }}
      >
        <View className="my-20 items-center gap-2 bg-background-quartenary py-6 rounded-md">
          {user?.avatarUrl ? (
            <Image
              source={{ uri: getCloudinaryAvatar(user.avatarUrl, "md") }} // ✅ user do store
              className={`${sizeClasses["md"]} rounded-full border border-white`}
              resizeMode="cover"
            />
          ) : (
            <View className="w-[140px] h-[140px] rounded-full border p-6 border-white items-center justify-center">
              <Ionicons name="person" color={colors.white} size={40} />
            </View>
          )}

          <Text className="text-font-primary text-base">{user?.firstName}</Text>
          <Text className="text-font-primary text-sm">{user?.email}</Text>
        </View>
        <View className="gap-2 px-2">
          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="person"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Visualize e atualize seus dados pessoais.."
            onPress={() => safePush("/(private)/(tabs)/(menu)/user")}
          >
            Dados Pessoais
          </AppButton>

          {/*{isAdmin && (
            <AppButton
              className="" /*tem que passar como prop o className 
              leftIcon="information-circle-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Altere os dados de sua empresa facilmente"
              onPress={() => safePush("/(private)/company/[id]")}
            >
              Empresa
            </AppButton>
          )}*/}

          {isAdmin && (
            <AppButton
              className="" /*tem que passar como prop o className */
              leftIcon="reorder-four-sharp"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Cadastre seus clientes, profissionais, serviços..  "
              onPress={() => safePush("/(private)/(crud)")}
            >
              Cadastros
            </AppButton>
          )}

          {!user?.googleUser && !user?.appleId && (
            <AppButton
              className="" /*tem que passar como prop o className */
              leftIcon="lock-closed"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Altere sua senha."
              onPress={() => safePush("/(private)/(tabs)/(menu)/password")}
            >
              Segurança
            </AppButton>
          )}
          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="search"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Visualize o histórico de agendamentos."
            onPress={() => safePush("/(private)/(tabs)/(menu)/history")}
          >
            Histórico
          </AppButton>

          {isAdmin && (
            <AppButton
              className=""
              leftIcon="information-circle-outline"
              rightIcon="chevron-forward"
              variant="admin"
              activeOpacity={0.8}
              size={true}
              description="Ajuste configurações do aplicativo"
              onPress={() => safePush("/(private)/(tabs)/(admin-tabs)/(menu)/preferences/whatsapp-config")}
            >
              Preferencias
            </AppButton>
          )}
          
          <AppButton
            className="" /*tem que passar como prop o className */
            leftIcon="document-text"
            rightIcon="chevron-forward"
            variant="admin"
            activeOpacity={0.8}
            size={true}
            description="Acesse os termos de uso do aplicativo"
            onPress={() => Linking.openURL(term)}
          >
            Termos de uso
          </AppButton>
        </View>
        <View className="items-center mt-20">
          <TouchableOpacity onPress={logoutUser}>
            <Text className="text-base text-accent-red font-semibold">
              Sair
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardContainer>
  );
}

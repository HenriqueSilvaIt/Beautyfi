import { useState } from "react";
import {
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { useMenuViewModel } from "./useMenu.viewModel";
import { KeyboardContainer } from "../../shared/components/KeyboardContainer";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useUserStore } from "@/shared/store/user-store";
import { getCloudinaryAvatar } from "@/shared/helpers/AppCloudinaryAvatar";
import { sizeClasses } from "@/shared/components/AppAvatar";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { OnboardingChecklistCard } from "@/viewModel/Onboarding/OnboardingChecklistCard";
import { useOnboardingChecklistViewModel } from "@/viewModel/Onboarding/useOnboardingChecklist.viewModel";

function MenuItem({
  title,
  description,
  iconName,
  iconBgColor,
  iconColor,
  onPress,
  isLast = false,
}: {
  title: string;
  description: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconBgColor: string;
  iconColor: string;
  onPress: () => void;
  isLast?: boolean;
}) {
  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        className="flex-row items-center px-4 py-3.5"
      >
        <View
          className="w-8 h-8 rounded-lg items-center justify-center mr-3"
          style={{ backgroundColor: iconBgColor }}
        >
          <Ionicons name={iconName} size={18} color={iconColor} />
        </View>
        <View className="flex-1">
          <Text className="text-font-primary text-sm font-semibold">
            {title}
          </Text>
          <Text className="text-font-secondary text-[11px] mt-0.5">
            {description}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color="#6B7280" />
      </TouchableOpacity>
      {!isLast && <View className="h-px bg-white/5 mx-4" />}
    </>
  );
}

export function MenuView({
  logoutUser,
  user,
  userData,
}: ReturnType<typeof useMenuViewModel>) {
  const { safePush } = useSafeNavigation();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { completedCount, totalCount } = useOnboardingChecklistViewModel();

  const isAdmin =
    user?.roles?.some((role) => role.authority === "ROLE_ADMIN") ?? false;

  const isEmployee =
    user?.roles?.some((role) => role.authority === "ROLE_MODERATOR") ?? false;

  const term = "https://www.beautyfi.com.br/politica-de-privacidade";

  const showSecurity = !user?.googleUser && !user?.appleId;

  return (
    <KeyboardContainer>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
          minHeight: "100%",
        }}
      >
        {/* Profile Header */}
        <View className="mt-12 mb-4 mx-4 px-4 py-5 bg-background-quartenary rounded-2xl border border-white/5 items-center">
          {user?.avatarUrl ? (
            <Image
              source={{ uri: getCloudinaryAvatar(user.avatarUrl, "md") }}
              className={`${sizeClasses["md"]} rounded-full border-2 border-accent-gold`}
              resizeMode="cover"
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-background-tertiary border-2 border-accent-gold items-center justify-center">
              <Ionicons name="person" color={colors.white} size={28} />
            </View>
          )}

          <Text className="text-font-primary text-lg font-bold mt-3">
            {user?.firstName || "Usuário"}
          </Text>
          <Text className="text-font-secondary text-sm mb-2">
            {user?.email}
          </Text>

          {(isAdmin || isEmployee) && (
            <View className="px-3 py-1 rounded-full bg-accent-gold/20 border border-accent-gold/30">
              <Text className="text-accent-gold text-[10px] font-bold uppercase tracking-wider">
                {isAdmin ? "Administrador" : "Colaborador"}
              </Text>
            </View>
          )}
        </View>

        {/* Minha Conta */}
        <View className="mx-4 mt-2">
          <Text className="text-font-secondary text-[11px] font-bold uppercase tracking-wider mb-2 mt-4 px-1">
            MINHA CONTA
          </Text>
          <View className="bg-background-quartenary rounded-2xl overflow-hidden">
            <MenuItem
              title="Dados Pessoais"
              description="Visualize e atualize seus dados pessoais"
              iconName="person"
              iconBgColor="rgba(59, 130, 246, 0.15)"
              iconColor="#3B82F6"
              onPress={() => safePush("/(private)/(tabs)/(menu)/user")}
              isLast={isAdmin && !showSecurity}
            />

            {!isAdmin && !isEmployee && (
              <MenuItem
                title="Favoritos"
                description="Visualize seus estabelecimentos favoritos"
                iconName="heart"
                iconBgColor="rgba(59, 130, 246, 0.15)"
                iconColor="#3B82F6"
                onPress={() =>
                  safePush("/(private)/(tabs)/(client-tabs)/(menu)/favorites")
                }
                isLast={false}
              />
            )}

            {!isAdmin && (
              <MenuItem
                title="Endereço"
                description="Configure seu endereço residencial ou trabalho"
                iconName="location"
                iconBgColor="rgba(59, 130, 246, 0.15)"
                iconColor="#3B82F6"
                onPress={() =>
                  safePush("/(private)/(tabs)/(client-tabs)/(menu)/address")
                }
                isLast={!showSecurity && isAdmin}
              />
            )}

            {showSecurity && (
              <MenuItem
                title="Segurança"
                description="Altere sua senha"
                iconName="lock-closed"
                iconBgColor="rgba(59, 130, 246, 0.15)"
                iconColor="#3B82F6"
                onPress={() => safePush("/(private)/(tabs)/(menu)/password")}
                isLast={isAdmin}
              />
            )}

            {!isAdmin && (
              <MenuItem
                title="Fidelidade & Pontos"
                description="Veja seus pontos acumulados e prêmios nos salões"
                iconName="gift-outline"
                iconBgColor="rgba(59, 130, 246, 0.15)"
                iconColor="#3B82F6"
                onPress={() =>
                  safePush("/(private)/(tabs)/(client-tabs)/(menu)/loyalty")
                }
                isLast={false}
              />
            )}

            {!isAdmin && (
              <MenuItem
                title="Histórico"
                description="Visualize o histórico de agendamentos"
                iconName="search"
                iconBgColor="rgba(59, 130, 246, 0.15)"
                iconColor="#3B82F6"
                onPress={() => safePush("/(private)/(tabs)/(menu)/history")}
                isLast={true}
              />
            )}
          </View>
        </View>

        {/* Configuração (Admin Only) */}
        {isAdmin && (
          <View className="mx-4 mt-6">
            <Text className="text-font-secondary text-[11px] font-bold uppercase tracking-wider mb-2 px-1">
              CONFIGURAÇÃO
            </Text>

            <View className="bg-background-quartenary rounded-t-2xl border-b border-white/5">
              <TouchableOpacity
                onPress={() => setShowOnboarding(!showOnboarding)}
                activeOpacity={0.8}
                className="flex-row items-center px-4 py-3.5"
              >
                <View className="w-8 h-8 rounded-lg items-center justify-center mr-3 bg-accent-gold/20">
                  <Ionicons
                    name="trophy-outline"
                    size={18}
                    color="#CBA35D"
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text className="text-font-primary text-sm font-semibold">
                      Primeiros Passos
                    </Text>
                    <View
                      className={`px-2 py-0.5 rounded-full border ${
                        completedCount === totalCount
                          ? "bg-emerald-500/20 border-emerald-500/40"
                          : "bg-[#CBA35D]/20 border-[#CBA35D]/40"
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-black ${
                          completedCount === totalCount
                            ? "text-emerald-400"
                            : "text-[#CBA35D]"
                        }`}
                      >
                        {completedCount}/{totalCount}
                      </Text>
                    </View>
                  </View>
                  <Text className="text-font-secondary text-[11px] mt-0.5">
                    Configure seu salão para receber agendamentos
                  </Text>
                </View>
                <Ionicons
                  name={showOnboarding ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={
                    colors["app-theme-secundary"] || colors["app-theme-primary"] || "#CBA35D"
                  }
                />
              </TouchableOpacity>

              {showOnboarding && (
                <View className="px-4 pb-4">
                  <OnboardingChecklistCard />
                </View>
              )}
            </View>

            <View className="bg-background-quartenary rounded-b-2xl overflow-hidden">
              <MenuItem
                title="Cadastros"
                description="Cadastre clientes, profissionais, serviços"
                iconName="reorder-four-sharp"
                iconBgColor="rgba(203, 163, 93, 0.15)"
                iconColor={colors["app-theme-primary"]}
                onPress={() => safePush("/(private)/(crud)")}
              />
              <MenuItem
                title="Preferências"
                description="Ajuste configurações do aplicativo"
                iconName="information-circle-outline"
                iconBgColor="rgba(203, 163, 93, 0.15)"
                iconColor={colors["app-theme-primary"]}
                onPress={() =>
                  safePush("/(private)/(tabs)/(admin-tabs)/(menu)/preferences")
                }
              />
              <MenuItem
                title="Empresa"
                description="Altere os dados de sua empresa facilmente"
                iconName="storefront-outline"
                iconBgColor="rgba(203, 163, 93, 0.15)"
                iconColor={colors["app-theme-primary"]}
                onPress={() =>
                  safePush(
                    "/(private)/(tabs)/(admin-tabs)/(menu)/preferences/company-edit",
                  )
                }
                isLast
              />
            </View>
          </View>
        )}

        {/* Relatórios (Admin Only) */}
        {isAdmin && (
          <View className="mx-4 mt-6">
            <Text className="text-font-secondary text-[11px] font-bold uppercase tracking-wider mb-2 px-1">
              RELATÓRIOS
            </Text>
            <View className="bg-background-quartenary rounded-2xl overflow-hidden">
              <MenuItem
                title="Aniversariantes"
                description="Aniversariantes do mês atual"
                iconName="gift-outline"
                iconBgColor="rgba(168, 85, 247, 0.15)"
                iconColor="#A855F7"
                onPress={() =>
                  safePush("/(private)/(tabs)/(admin-tabs)/birthdays")
                }
              />
              <MenuItem
                title="Lista de Espera"
                description="Visualize a lista de espera de clientes"
                iconName="time-outline"
                iconBgColor="rgba(168, 85, 247, 0.15)"
                iconColor="#A855F7"
                onPress={() =>
                  safePush("/(private)/(tabs)/(admin-tabs)/(menu)/waitlist")
                }
              />
              <MenuItem
                title="Histórico"
                description="Visualize o histórico de agendamentos"
                iconName="search"
                iconBgColor="rgba(168, 85, 247, 0.15)"
                iconColor="#A855F7"
                onPress={() => safePush("/(private)/(tabs)/(menu)/history")}
                isLast
              />
            </View>
          </View>
        )}

        {/* Outros */}
        <View className="mx-4 mt-6">
          <Text className="text-font-secondary text-[11px] font-bold uppercase tracking-wider mb-2 px-1">
            OUTROS
          </Text>
          <View className="bg-background-quartenary rounded-2xl overflow-hidden">
            <MenuItem
              title="Termos de uso"
              description="Acesse os termos de uso do aplicativo"
              iconName="document-text"
              iconBgColor="rgba(156, 163, 175, 0.15)"
              iconColor="#9CA3AF"
              onPress={() => Linking.openURL(term)}
              isLast
            />
          </View>
        </View>

        {/* Logout Button */}
        <View className="mx-4 mt-8">
          <TouchableOpacity
            onPress={logoutUser}
            activeOpacity={0.8}
            className="flex-row items-center justify-center p-4 rounded-2xl bg-accent-red/10 border border-accent-red/20"
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#EF4444"
              className="mr-2"
            />
            <Text className="text-accent-red font-semibold ml-2">Sair</Text>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text className="text-font-secondary text-[10px] text-center mt-6 mb-2">
          Beautyfi v1.1.2
        </Text>
      </ScrollView>
    </KeyboardContainer>
  );
}

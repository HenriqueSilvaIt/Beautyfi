import { Ionicons } from "@expo/vector-icons";
import { Redirect, Slot } from "expo-router";
import { useUserStore } from "@/shared/store/user-store";
import { View, Text, TouchableOpacity, Linking, StyleSheet } from "react-native";

export default function TabsLayout() {
  const { access_token, user, logout } = useUserStore();

  if (!access_token) {
    return <Redirect href="/(public)/home" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <Slot />
      
      {user?.subscriptionExpired === true && (
        <View style={styles.paywallContainer}>
          <View style={styles.paywallCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="lock-closed" size={32} color="#CBA35D" />
            </View>
            <Text style={styles.paywallTitle}>Período de Teste Expirado</Text>
            <Text style={styles.paywallText}>Seus 14 dias de acesso gratuito ao Beautyfi terminaram. Para reativar seu painel e continuar utilizando o app, escolha um plano de assinatura.</Text>
            
            <TouchableOpacity
              style={styles.paywallBtn}
              activeOpacity={0.8}
              onPress={() => Linking.openURL("https://painel.beautyfi.com.br")}
            >
              <Text style={styles.paywallBtnText}>Escolher Plano</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.logoutBtn}
              activeOpacity={0.7}
              onPress={() => logout()}
            >
              <Text style={styles.logoutBtnText}>Sair da Conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  paywallContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#092D5D",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    zIndex: 99999,
  },
  paywallCard: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#092D5D",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#FAF8EF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
  },
  paywallTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#092D5D",
    marginBottom: 12,
    textAlign: "center",
  },
  paywallText: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 24,
  },
  paywallBtn: {
    width: "100%",
    backgroundColor: "#CBA35D",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  paywallBtnText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  logoutBtn: {
    paddingVertical: 8,
  },
  logoutBtnText: {
    fontSize: 12,
    color: "#94a3b8",
    textDecorationLine: "underline",
  },
});
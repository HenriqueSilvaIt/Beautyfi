import React, { useState } from "react";
import { Alert } from "react-native";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAddressStore } from "@/shared/store/address-store";
import { colors } from "@/styles/colors";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { useUserStore } from "@/shared/store/user-store";
import { useUserLogged } from "@/shared/queries/user/use-user-logged.mutation";

const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search?format=json&limit=8&addressdetails=1&countrycodes=br";

const HEADERS = {
  "User-Agent": "BeautyFi/1.0 (contact@beautyfi.com.br)",
  "Accept-Language": "pt-BR,pt;q=0.9",
};

export default function ClientAddressScreen() {
  const { addressText, latitude, longitude, setAddress, clearAddress } =
    useAddressStore();
  const { user } = useUserStore();
  const { userUpdateMutation } = useUserLogged();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Debounce da busca — 600ms após parar de digitar
  const debouncedQuery = useDebounce(query, 600);

  // Dispara busca quando o valor debounced muda
  React.useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q || q.length < 3) {
      setSuggestions([]);
      return;
    }

    let active = true;
    setLoading(true);

    (async () => {
      try {
        const encoded = encodeURIComponent(q);
        const res = await fetch(`${NOMINATIM_URL}&q=${encoded}`, {
          headers: HEADERS,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (active) setSuggestions(data ?? []);
      } catch (err) {
        console.error("Nominatim error:", err);
        if (active) setSuggestions([]);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [debouncedQuery]);

  const handleSelectSuggestion = async (item: any) => {
    const displayName: string = item.display_name;
    const lat = parseFloat(item.lat);
    const lon = parseFloat(item.lon);

    // Salva no store (local)
    setAddress(displayName, lat, lon);

    // Salva no backend via PUT /users/:id
    if (user?.id) {
      setSaving(true);
      try {
        await userUpdateMutation.mutateAsync({
          userId: user.id,
          data: {
            firstName: user.firstName,
            phone: user.phone,
            // @ts-ignore — campo de endereço do usuário
            address: displayName,
            latitude: lat,
            longitude: lon,
          },
        });
        Alert.alert("Sucesso", "Endereço salvo com sucesso!");
      } catch (err) {
        // Mesmo com erro no backend, o store local já foi atualizado
        Alert.alert("Aviso", "Endereço salvo localmente. Erro ao sincronizar.");
      } finally {
        setSaving(false);
      }
    } else {
      Alert.alert("Sucesso", "Endereço salvo!");
    }

    setSuggestions([]);
    setQuery("");
    router.back();
  };

  const handleClear = () => {
    clearAddress();
    setQuery("");
    setSuggestions([]);
    Alert.alert("Removido", "Endereço removido.");
  };

  const themeColor = colors["app-theme-primary"];

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-5 pt-2">
      <AppAdminHeader title="Endereço" iconRight={{ icon: false, path: "" }} />

      {/* Endereço Cadastrado */}
      <View
        className="rounded-2xl p-4 mb-5 mt-3 border"
        style={{
          backgroundColor: colors["background-tertiary"],
          borderColor: colors["background-quartenary"],
        }}
      >
        <Text
          className="text-xs font-bold uppercase tracking-wider mb-2"
          style={{ color: themeColor }}
        >
          Endereço Cadastrado
        </Text>

        {addressText ? (
          <View>
            <View className="flex-row items-start gap-2 mb-3">
              <Ionicons
                name="location"
                size={16}
                color={themeColor}
                style={{ marginTop: 2 }}
              />
              <Text
                className="text-font-primary text-sm leading-relaxed flex-1"
                numberOfLines={3}
              >
                {addressText}
              </Text>
            </View>

            {latitude != null && longitude != null && (
              <View className="flex-row items-center gap-1 mb-3">
                <Ionicons name="navigate-outline" size={12} color="#6b7280" />
                <Text className="text-gray-500 text-xs">
                  {latitude.toFixed(5)}, {longitude.toFixed(5)}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleClear}
              activeOpacity={0.7}
              className="self-start flex-row items-center gap-1"
            >
              <Ionicons name="trash-outline" size={14} color="#f87171" />
              <Text className="text-red-400 text-xs font-bold">
                Remover endereço
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center gap-2">
            <Ionicons name="location-outline" size={16} color="#6b7280" />
            <Text className="text-gray-500 text-sm">
              Nenhum endereço cadastrado.
            </Text>
          </View>
        )}
      </View>

      {/* Campo de Busca */}
      <Text
        className="text-xs font-bold uppercase tracking-wider mb-2"
        style={{ color: themeColor }}
      >
        Buscar Novo Endereço
      </Text>
      <View
        className="flex-row items-center rounded-xl px-3 py-3 mb-2 border"
        style={{
          backgroundColor: colors["background-tertiary"],
          borderColor:
            query.length >= 3 ? themeColor : colors["background-quartenary"],
        }}
      >
        <Ionicons name="search-outline" size={18} color={themeColor} />
        <TextInput
          placeholder="Digite rua, número, cidade..."
          placeholderTextColor="#6b7280"
          value={query}
          onChangeText={setQuery}
          className="flex-1 text-font-primary text-sm ml-2"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {loading || saving ? (
          <ActivityIndicator size="small" color={themeColor} />
        ) : query.length > 0 ? (
          <TouchableOpacity onPress={() => { setQuery(""); setSuggestions([]); }}>
            <Ionicons name="close-circle" size={18} color="#6b7280" />
          </TouchableOpacity>
        ) : null}
      </View>

      {query.length > 0 && query.length < 3 && (
        <Text className="text-gray-500 text-xs mb-2 ml-1">
          Digite pelo menos 3 caracteres...
        </Text>
      )}

      {/* Lista de Sugestões */}
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => String(item.place_id)}
          className="rounded-2xl overflow-hidden mb-4"
          style={{
            backgroundColor: colors["background-tertiary"],
            borderWidth: 1,
            borderColor: colors["background-quartenary"],
          }}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => handleSelectSuggestion(item)}
              activeOpacity={0.75}
              className={`p-4 flex-row items-start gap-3 ${
                index < suggestions.length - 1
                  ? "border-b border-gray-700/40"
                  : ""
              }`}
            >
              <Ionicons
                name="location-outline"
                size={16}
                color={themeColor}
                style={{ marginTop: 1 }}
              />
              <Text
                className="text-font-primary text-sm flex-1 leading-5"
                numberOfLines={3}
              >
                {item.display_name}
              </Text>
              <Ionicons name="chevron-forward" size={14} color="#6b7280" />
            </TouchableOpacity>
          )}
        />
      )}

      {/* Nenhum resultado */}
      {!loading &&
        suggestions.length === 0 &&
        debouncedQuery.length >= 3 &&
        query === debouncedQuery && (
          <View className="items-center py-8 gap-2">
            <Ionicons name="search" size={32} color="#6b7280" />
            <Text className="text-gray-500 text-sm text-center">
              Nenhum endereço encontrado para{"\n"}"{debouncedQuery}"
            </Text>
          </View>
        )}
    </SafeAreaView>
  );
}

import React, { useState, useEffect } from "react";
import { Alert, ScrollView, ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAddressStore } from "@/shared/store/address-store";
import { colors } from "@/styles/colors";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppInput } from "@/shared/components/AppInput";
import { useUserStore } from "@/shared/store/user-store";
import { useUserLogged } from "@/shared/queries/user/use-user-logged.mutation";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";

export default function ClientAddressScreen() {
  const { addressText, latitude, longitude, setAddress, clearAddress } = useAddressStore();
  const { user } = useUserStore();
  const { userUpdateMutation } = useUserLogged();

  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [complement, setComplement] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Parse existing address on mount if available
  useEffect(() => {
    if (addressText) {
      try {
        // Simple heuristic to split existing address if possible
        // Expected format: "Rua, Numero - Bairro, Cidade - Estado, CEP Cep"
        const parts = addressText.split(" - ");
        if (parts.length >= 3) {
          const streetAndNum = parts[0].split(", ");
          setStreet(streetAndNum[0] || "");
          setNumber(streetAndNum[1] || "");
          
          setNeighborhood(parts[1] || "");
          
          const cityAndState = parts[2].split(", CEP ");
          const cityStateParts = cityAndState[0].split(" - ");
          setCity(cityStateParts[0] || "");
          setState(cityStateParts[1] || "");
          if (cityAndState[1]) {
            setCep(cityAndState[1].replace(/\D/g, ""));
          }
        }
      } catch (e) {
        // Fallback: just put whole text in street
        setStreet(addressText);
      }
    }
  }, [addressText]);

  const handleCepChange = async (val: string) => {
    const cleaned = val.replace(/\D/g, "");
    setCep(cleaned);
    
    if (cleaned.length === 8) {
      setLoading(true);
      try {
        const { data } = await styleAppApiClient.get(`/cep/${cleaned}`);
        if (data && data.cep) {
          setStreet(data.logradouro || "");
          setNeighborhood(data.bairro || "");
          setCity(data.localidade || "");
          setState(data.uf || "");
        } else {
          Alert.alert("Erro", "CEP não encontrado.");
        }
      } catch (err) {
        console.error("Backend CEP error:", err);
        Alert.alert("Erro", "Falha ao buscar CEP. Verifique sua conexão.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    if (!cep || !street || !number || !neighborhood || !city || !state) {
      Alert.alert("Aviso", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      // 1. Get coords from Nominatim geocoding
      const queryAddr = `${street}, ${number}, ${city}, ${state}, Brasil`;
      let lat = -23.5505;
      let lon = -46.6333; // Default fallbacks
      
      try {
        const geoRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(queryAddr)}`,
          { headers: { "User-Agent": "BeautyFi/1.0" } }
        );
        if (geoRes.ok) {
          const geoData = await geoRes.json();
          if (geoData && geoData.length > 0) {
            lat = parseFloat(geoData[0].lat);
            lon = parseFloat(geoData[0].lon);
          }
        }
      } catch (geoErr) {
        console.error("Geocoding failed, using fallback:", geoErr);
      }

      // 2. Format final address string
      const formattedAddress = `${street}, ${number}${complement ? ` - ${complement}` : ""} - ${neighborhood}, ${city} - ${state}, CEP ${cep}`;

      // 3. Save to store (local)
      setAddress(formattedAddress, lat, lon);

      // 4. Save to backend if user is logged in
      if (user?.id) {
        await userUpdateMutation.mutateAsync({
          userId: user.id,
          data: {
            firstName: user.firstName,
            phone: user.phone,
            address: formattedAddress,
            latitude: lat,
            longitude: lon,
          },
        });
        Alert.alert("Sucesso", "Endereço atualizado com sucesso!");
      } else {
        Alert.alert("Sucesso", "Endereço salvo localmente!");
      }
      router.back();
    } catch (err: any) {
      console.error("Save address error:", err);
      Alert.alert("Erro", err.message || "Não foi possível salvar o endereço.");
    } finally {
      setSaving(false);
    }
  };

  const handleClear = () => {
    clearAddress();
    setCep("");
    setStreet("");
    setNumber("");
    setNeighborhood("");
    setCity("");
    setState("");
    setComplement("");
    Alert.alert("Removido", "Endereço removido.");
  };

  const themeColor = colors["app-theme-primary"];

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-5 pt-2">
      <AppAdminHeader title="Meu Endereço" iconRight={{ icon: false, path: "" }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Current Address Card */}
        {addressText ? (
          <View className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-5 mt-2">
            <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Endereço Atual
            </Text>
            <View className="flex-row items-start gap-2 mb-2">
              <Ionicons name="location" size={16} color={themeColor} style={{ marginTop: 2 }} />
              <Text className="text-slate-700 text-xs leading-relaxed flex-1">
                {addressText}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleClear}
              activeOpacity={0.7}
              className="self-start flex-row items-center gap-1 mt-1"
            >
              <Ionicons name="trash-outline" size={14} color="#ef4444" />
              <Text className="text-red-500 text-xs font-bold">Remover endereço</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Form Fields */}
        <Text className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 mt-1">
          Dados de Endereço
        </Text>

        <View className="gap-3">
          {/* CEP */}
          <View className="relative">
            <AppInput
              label="CEP *"
              placeholder="00000-000"
              keyboardType="numeric"
              maxLength={9}
              value={cep}
              onChangeText={handleCepChange}
            />
            {loading && (
              <ActivityIndicator
                size="small"
                color={themeColor}
                style={{ position: "absolute", right: 15, top: 40 }}
              />
            )}
          </View>

          {/* Rua */}
          <AppInput
            label="Logradouro / Rua *"
            placeholder="Digite o nome da rua"
            value={street}
            onChangeText={setStreet}
          />

          {/* Número & Complemento */}
          <View className="flex-row gap-3">
            <View className="flex-[2]">
              <AppInput
                label="Número *"
                placeholder="Ex: 123"
                value={number}
                onChangeText={setNumber}
              />
            </View>
            <View className="flex-[3]">
              <AppInput
                label="Complemento"
                placeholder="Apto, Bloco, etc."
                value={complement}
                onChangeText={setComplement}
              />
            </View>
          </View>

          {/* Bairro */}
          <AppInput
            label="Bairro *"
            placeholder="Digite o bairro"
            value={neighborhood}
            onChangeText={setNeighborhood}
          />

          {/* Cidade & Estado */}
          <View className="flex-row gap-3">
            <View className="flex-[3]">
              <AppInput
                label="Cidade *"
                placeholder="Ex: São Paulo"
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View className="flex-[1]">
              <AppInput
                label="UF *"
                placeholder="SP"
                maxLength={2}
                autoCapitalize="characters"
                value={state}
                onChangeText={setState}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
          className="bg-[#092D5D] py-3.5 rounded-xl items-center mt-6 shadow-sm"
        >
          <Text className="text-white text-sm font-bold">
            {saving ? "Salvando..." : "Salvar Endereço"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

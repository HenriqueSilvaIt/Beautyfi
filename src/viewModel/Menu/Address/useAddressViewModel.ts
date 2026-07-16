import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useAddressStore } from "@/shared/store/address-store";
import { useUserStore } from "@/shared/store/user-store";
import { useUserLogged } from "@/shared/queries/user/use-user-logged.mutation";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";

export function useAddressViewModel() {
  const { addressText, setAddress, clearAddress } = useAddressStore();
  const { user, setUser } = useUserStore();
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

  // Sync with store/backend user address on mount
  useEffect(() => {
    const targetAddress = user?.address || addressText || "";
    if (targetAddress) {
      try {
        const parts = targetAddress.split(" - ");
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
        } else {
          setStreet(targetAddress);
        }
      } catch (e) {
        setStreet(targetAddress);
      }
    }
  }, [addressText, (user as any)?.address]);

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
      const queryAddr = `${street}, ${number}, ${city}, ${state}, Brasil`;
      let lat = -23.5505;
      let lon = -46.6333; // default fallbacks
      
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

      const formattedAddress = `${street}, ${number}${complement ? ` - ${complement}` : ""} - ${neighborhood}, ${city} - ${state}, CEP ${cep}`;

      // Save locally
      setAddress(formattedAddress, lat, lon);

      // Save to backend if user is logged in
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
        
        // Update userStore user state
        setUser((prev) => prev ? { ...prev, address: formattedAddress, latitude: lat, longitude: lon } as any : null);
        
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
    
    if (user?.id) {
      userUpdateMutation.mutate({
        userId: user.id,
        data: {
          firstName: user.firstName,
          phone: user.phone,
          address: "",
          latitude: undefined,
          longitude: undefined,
        },
      });
      setUser((prev) => prev ? { ...prev, address: "", latitude: undefined, longitude: undefined } as any : null);
    }
    Alert.alert("Removido", "Endereço removido.");
  };

  return {
    addressText,
    cep,
    street,
    number,
    neighborhood,
    city,
    state,
    complement,
    loading,
    saving,
    handleCepChange,
    handleSave,
    handleClear,
    setCep,
    setStreet,
    setNumber,
    setNeighborhood,
    setCity,
    setState,
    setComplement,
  };
}

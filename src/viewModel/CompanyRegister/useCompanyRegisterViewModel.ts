import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";
import { useCompanyRegisterStore } from "@/shared/store/company-register-store";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";

export interface AddressSuggestion {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

const CATEGORIES = [
  "Barbearia",
  "Salão de Beleza",
  "Estética",
  "Nail Designer",
  "Sobrancelhas",
  "Massagem",
  "Maquiagem",
  "Depilação",
  "Saúde e Bem-estar",
  "Personal Trainer",
  "Outros",
];

const DEFAULT_SERVICES_BY_CATEGORY: Record<string, string[]> = {
  Barbearia: ["Corte masculino", "Barba", "Sobrancelha", "Hidratação"],
  "Salão de Beleza": [
    "Corte feminino",
    "Coloração",
    "Escova",
    "Hidratação",
    "Manicure",
  ],
  Estética: ["Limpeza de pele", "Peeling", "Botox", "Preenchimento"],
  "Nail Designer": ["Manicure", "Pedicure", "Unhas gel", "Nail art"],
  Sobrancelhas: ["Design de sobrancelhas", "Henna", "Micropigmentação"],
  Massagem: ["Massagem relaxante", "Massagem modeladora", "Drenagem linfática"],
  Maquiagem: ["Maquiagem social", "Maquiagem para noiva", "Aula de maquiagem"],
  Depilação: ["Depilação a cera", "Laser", "Depilação com linha"],
  "Saúde e Bem-estar": [
    "Consulta",
    "Avaliação física",
    "Orientação nutricional",
  ],
  "Personal Trainer": ["Treino personalizado", "Avaliação física"],
  Outros: [],
};

const TEAM_SIZES = [
  { label: "Profissional independente", value: "1" as const },
  { label: "2 a 5 pessoas", value: "2-5" as const },
  { label: "6 a 10 pessoas", value: "6-10" as const },
  { label: "11 a 20 pessoas", value: "11-20" as const },
  { label: "Mais de 20 pessoas", value: "20+" as const },
];

export function useCompanyRegisterViewModel() {
  const { step, nextStep, prevStep, updateData, data, reset } =
    useCompanyRegisterStore();
  const { handleError } = useErrorHandler();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);

  // Auto-sincronizar a string 'address' quando os campos do formulário de endereço mudarem
  useEffect(() => {
    const { street, number, complement, neighborhood, city, state, cep } = data;
    if (street || number || city || cep) {
      const parts = [
        street ? `${street}, ${number || "s/n"}` : "",
        complement ? complement : "",
        neighborhood ? neighborhood : "",
        city ? `${city} - ${state || ""}` : "",
        cep ? `CEP: ${cep}` : "",
      ].filter(Boolean);
      
      updateData({ address: parts.join(", ") });
    }
  }, [
    data.street,
    data.number,
    data.complement,
    data.neighborhood,
    data.city,
    data.state,
    data.cep,
  ]);

  // Derived: default services based on selected categories
  const suggestedServices = Array.from(
    new Set(
      (data.categories ?? []).flatMap(
        (cat) => DEFAULT_SERVICES_BY_CATEGORY[cat] ?? [],
      ),
    ),
  );

  // Busca do CEP via API do ViaCEP do Backend
  const searchCep = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    updateData({ cep: cleanCep });

    if (cleanCep.length === 8) {
      setAddressLoading(true);
      try {
        const { data: json } = await styleAppApiClient.get(`/cep/${cleanCep}`);

        if (!json || !json.cep) {
          Alert.alert("CEP não encontrado", "Por favor, preencha o endereço manualmente.");
          return;
        }

        updateData({
          street: json.logradouro || "",
          neighborhood: json.bairro || "",
          city: json.localidade || "",
          state: json.uf || "",
        });

        // Geocodifica para obter lat/lng automática
        geocodeAddress(json.logradouro || "", json.localidade || "", json.uf || "");
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setAddressLoading(false);
      }
    }
  };

  // Tenta geocodificar o CEP/Cidade para obter latitude e longitude
  const geocodeAddress = async (street: string, city: string, state: string) => {
    try {
      const query = `${street}, ${city}, ${state}, Brasil`;
      const encoded = encodeURIComponent(query);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encoded}`,
        {
          headers: {
            "User-Agent": "BeautyFi/1.0 (contact@beautyfi.com.br)",
            "Accept-Language": "pt-BR,pt;q=0.9",
          },
        }
      );
      if (res.ok) {
        const list = await res.json();
        if (list && list.length > 0) {
          updateData({
            latitude: parseFloat(list[0].lat),
            longitude: parseFloat(list[0].lon),
          });
        }
      }
    } catch (e) {
      console.error("Erro Nominatim Geocode:", e);
    }
  };

  // Final submission - Chamando o signup público de barbeiro
  const submitCompany = async () => {
    if (!data.name?.trim()) {
      Alert.alert("Erro", "Por favor, informe o nome da empresa.");
      return;
    }
    if (!data.firstName?.trim()) {
      Alert.alert("Erro", "Por favor, informe seu primeiro nome.");
      return;
    }
    if (!data.email?.trim()) {
      Alert.alert("Erro", "Por favor, informe seu email.");
      return;
    }
    if (!data.password?.trim() || data.password.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    setIsSubmitting(true);
    try {
      const signupPayload = {
        firstName: data.firstName,
        lastName: data.lastName || "Admin",
        email: data.email,
        password: data.password,
        phone: data.phone || "",
        businessName: data.name,
        address: data.address || `${data.street}, ${data.number} - ${data.neighborhood}, ${data.city} - ${data.state}`,
        latitude: data.latitude ?? -23.55052,
        longitude: data.longitude ?? -46.633308,
      };

      await styleAppApiClient.post(
        "/auth/signup/barber",
        signupPayload,
      );

      // Sucesso
      Alert.alert(
        "Sucesso!",
        "Seu cadastro foi realizado com sucesso! Faça login com seu email e senha para começar.",
        [
          {
            text: "Ir para Login",
            onPress: () => {
              reset();
              router.replace("/login");
            },
          },
        ],
      );
    } catch (err) {
      handleError(err, "Falha ao cadastrar empresa. Verifique se o e-mail já está em uso.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedStep1 =
    !!data.name?.trim() &&
    !!data.firstName?.trim() &&
    !!data.email?.trim() &&
    !!data.password?.trim() &&
    data.password.length >= 6;

  const canProceedStep2 = (data.categories?.length ?? 0) > 0;
  const canProceedStep3 = !!data.teamSize;
  const canProceedStep4 =
    !!data.cep?.trim() &&
    !!data.street?.trim() &&
    !!data.number?.trim() &&
    !!data.city?.trim() &&
    !!data.state?.trim();

  return {
    step,
    nextStep,
    prevStep,
    updateData,
    data,
    isSubmitting,
    submitCompany,
    CATEGORIES,
    TEAM_SIZES,
    suggestedServices,
    searchCep,
    geocodeAddress,
    addressLoading,
    canProceedStep1,
    canProceedStep2,
    canProceedStep3,
    canProceedStep4,
  };
}

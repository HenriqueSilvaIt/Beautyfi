import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import { router } from "expo-router";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { useCompanyStore } from "@/shared/store/company-store";
import * as ImagePicker from "expo-image-picker";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";
import { useCamera } from "@/shared/hooks/useCamera";
import { useGallery } from "@/shared/hooks/useGallery";
import { useAppModal } from "@/shared/hooks/useAppModal";
import { useModalStore } from "@/shared/store/modal-store";
import { useUserStore } from "@/shared/store/user-store";
import { queryClient } from "../../../queryClient";

export function useCompanyEditViewModel() {
  const { user } = useUserStore();
  const companyId = useCompanyStore((state) => state.selectedCompanyId) || Number(user?.companyId);
  const {
    useGetCompanyDetailsQuery,
    useGetCompanyCategoriesQuery,
    mutationUpdate,
    updateOpeningHoursMutation,
    updateSocialMediasMutation,
  } = useCompanyDetailsMutation();

  const { openCamera, isLoading: isCameraLoading } = useCamera({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });
  const { openGallery, openGalleryMultiple, isLoading: isGalleryLoading } = useGallery({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 0.8,
  });

  const { close } = useModalStore();
  const modals = useAppModal();

  const { data: company, isLoading, error } = useGetCompanyDetailsQuery(companyId);

  // Basic info
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [imagesUrl, setImagesUrl] = useState("");
  const [portfolioImagesUrl, setPortfolioImagesUrl] = useState("");

  // Detailed address states
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [addressLoading, setAddressLoading] = useState(false);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  // Opening Hours
  const [hoursList, setHoursList] = useState<any[]>([]);

  // Social Medias
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploadingSpace, setUploadingSpace] = useState(false);
  const [uploadingPortfolio, setUploadingPortfolio] = useState(false);

  // Selected Categories
  const [selectedCategories, setSelectedCategories] = useState<{ id: number; name: string }[]>([]);

  // Load all categories
  const { data: categoriesData } = useGetCompanyCategoriesQuery();
  const allCategories = categoriesData ?? [];

  const cleanImageUrlsString = (rawStr: string) => {
    if (!rawStr) return "";
    return rawStr
      .replace(/[\[\]"']/g, "")
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url.length > 0)
      .join(",");
  };

  // Populate form when data is loaded
  useEffect(() => {
    if (company) {
      setName(company.name || "");
      setCnpj(company.cnpj || "");
      setPhone(company.phone || "");
      setDescription(company.description || "");
      setImagesUrl(cleanImageUrlsString(company.imagesUrl || ""));
      setPortfolioImagesUrl(cleanImageUrlsString(company.portfolioImagesUrl || ""));
      if (company.latitude) setLat(company.latitude);
      if (company.longitude) setLng(company.longitude);

      if (company.address) {
        setAddress(company.address);
        const parts = company.address.split(",").map((p: string) => p.trim());
        if (parts.length >= 4) {
          const cepPart = parts.find((p: string) => p.toLowerCase().includes("cep:"));
          if (cepPart) {
            setCep(cepPart.replace(/[^0-9]/g, ""));
          }
          
          setStreet(parts[0] || "");
          setNumber(parts[1] || "");
          
          if (parts.length === 5) {
            setNeighborhood(parts[2] || "");
            const cityState = parts[3].split("-").map((s) => s.trim());
            setCity(cityState[0] || "");
            setState(cityState[1] || "");
          } else if (parts.length >= 6) {
            setComplement(parts[2] || "");
            setNeighborhood(parts[3] || "");
            const cityState = parts[4].split("-").map((s) => s.trim());
            setCity(cityState[0] || "");
            setState(cityState[1] || "");
          }
        } else {
          setStreet(company.address);
        }
      }

      if (company.openingHourDTOS) {
        const ALL_DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];
        const existingDTOS = company.openingHourDTOS || [];
        const fullList = ALL_DAYS.map((dayName) => {
          const found = existingDTOS.find(
            (dto: any) => dto.dayWeek && dto.dayWeek.toLowerCase() === dayName.toLowerCase()
          );
          if (found) {
            return {
              id: found.id,
              dayWeek: dayName,
              active: true,
              firstHour: found.firstHour || "2026-01-01T09:00:00",
              secondHour: found.secondHour || "2026-01-01T12:00:00",
              thirdHour: found.thirdHour || "2026-01-01T13:00:00",
              lastHour: found.lastHour || "2026-01-01T18:00:00",
            };
          } else {
            return {
              id: null,
              dayWeek: dayName,
              active: false,
              firstHour: "2026-01-01T09:00:00",
              secondHour: "2026-01-01T12:00:00",
              thirdHour: "2026-01-01T13:00:00",
              lastHour: "2026-01-01T18:00:00",
            };
          }
        });
        setHoursList(fullList);
      }

      if (company.socialMediaDTOS) {
        const insta = company.socialMediaDTOS.find((s: any) =>
          s.name.toLowerCase().includes("instagram"),
        );
        const face = company.socialMediaDTOS.find((s: any) =>
          s.name.toLowerCase().includes("facebook"),
        );
        const web = company.socialMediaDTOS.find(
          (s: any) =>
            s.name.toLowerCase().includes("website") ||
            s.name.toLowerCase().includes("site"),
        );
        setInstagram(insta ? insta.mediaUrl : "");
        setFacebook(face ? face.mediaUrl : "");
        setWebsite(web ? web.mediaUrl : "");
      }
      if (company.companyCategories) {
        setSelectedCategories(company.companyCategories);
      }
    }
  }, [company]);

  // Combine address whenever details change
  useEffect(() => {
    if (street || number || city || cep) {
      const parts = [
        street ? `${street}, ${number || "s/n"}` : "",
        complement ? complement : "",
        neighborhood ? neighborhood : "",
        city ? `${city} - ${state || ""}` : "",
        cep ? `CEP: ${cep}` : "",
      ].filter(Boolean);
      setAddress(parts.join(", "));
    }
  }, [street, number, complement, neighborhood, city, state, cep]);

  // Search CEP
  const searchCep = async (cepVal: string) => {
    const cleanCep = cepVal.replace(/\D/g, "");
    setCep(cleanCep);

    if (cleanCep.length === 8) {
      setAddressLoading(true);
      try {
        const { data: json } = await styleAppApiClient.get(`/cep/${cleanCep}`);

        if (!json || !json.cep) {
          Alert.alert("CEP não encontrado", "Por favor, preencha o endereço manualmente.");
          return;
        }

        setStreet(json.logradouro || "");
        setNeighborhood(json.bairro || "");
        setCity(json.localidade || "");
        setState(json.uf || "");

        geocodeAddress(json.logradouro || "", json.localidade || "", json.uf || "");
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setAddressLoading(false);
      }
    }
  };

  const geocodeAddress = async (streetVal: string, cityVal: string, stateVal: string) => {
    const query = `${streetVal}, ${number || ""}, ${cityVal}, ${stateVal}, Brasil`;
    const googleKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (googleKey) {
      try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${googleKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const json = await res.json();
          if (json.results && json.results.length > 0) {
            const location = json.results[0].geometry.location;
            setLat(location.lat);
            setLng(location.lng);
            return;
          }
        }
      } catch (e) {
        console.error("Erro Google Maps Geocode:", e);
      }
    }

    try {
      const fallbackQuery = `${streetVal}, ${cityVal}, ${stateVal}, Brasil`;
      const encoded = encodeURIComponent(fallbackQuery);
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
          setLat(parseFloat(list[0].lat));
          setLng(parseFloat(list[0].lon));
        }
      }
    } catch (e) {
      console.error("Erro Nominatim Geocode:", e);
    }
  };

  const toggleCategory = (cat: { id: number; name: string }) => {
    setSelectedCategories((prev) => {
      const exists = prev.some((c) => c.id === cat.id);
      if (exists) {
        return prev.filter((c) => c.id !== cat.id);
      } else {
        return [...prev, cat];
      }
    });
  };

  const toggleDayActive = (dayWeek: string) => {
    setHoursList((prev) =>
      prev.map((h) => {
        if (h.dayWeek.toLowerCase() === dayWeek.toLowerCase()) {
          return { ...h, active: !h.active };
        }
        return h;
      })
    );
  };

  const handleHourChange = (dayWeek: string, field: string, value: string) => {
    setHoursList((prev) =>
      prev.map((h) => {
        if (h.dayWeek.toLowerCase() === dayWeek.toLowerCase()) {
          const datePart =
            (h[field] ? String(h[field]).split("T")[0] : "2026-01-01") ||
            "2026-01-01";
          const newIso = `${datePart}T${value}:00`;
          return { ...h, [field]: newIso };
        }
        return h;
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    let resolvedLat = lat ?? company?.latitude ?? -23.55052;
    let resolvedLon = lng ?? company?.longitude ?? -46.633308;

    try {
      if (street && number) {
        const queryAddr = `${street}, ${number}, ${city || ""}, ${state || ""}, Brasil`;
        const googleKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

        let resolvedFromGoogle = false;
        if (googleKey) {
          try {
            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(queryAddr)}&key=${googleKey}`;
            const res = await fetch(url);
            if (res.ok) {
              const json = await res.json();
              if (json.results && json.results.length > 0) {
                const location = json.results[0].geometry.location;
                resolvedLat = location.lat;
                resolvedLon = location.lng;
                resolvedFromGoogle = true;
              }
            }
          } catch (e) {
            console.error("Erro Google Maps Geocode ao salvar:", e);
          }
        }

        if (!resolvedFromGoogle) {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(queryAddr)}`,
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
                resolvedLat = parseFloat(list[0].lat);
                resolvedLon = parseFloat(list[0].lon);
              }
            }
          } catch (e) {
            console.error("Erro Nominatim Geocode ao salvar:", e);
          }
        }
      }

      // 1. Update basic details
      await mutationUpdate.mutateAsync({
        ...company,
        name,
        cnpj,
        address,
        phone,
        description,
        imagesUrl,
        portfolioImagesUrl,
        latitude: resolvedLat,
        longitude: resolvedLon,
        companyCategories: selectedCategories,
      });

      // 2. Update opening hours (only active days)
      const activeHoursToSend = hoursList
        .filter((h) => h.active)
        .map((h) => ({
          id: h.id || null,
          dayWeek: h.dayWeek,
          firstHour: h.firstHour,
          secondHour: h.secondHour,
          thirdHour: h.thirdHour,
          lastHour: h.lastHour,
        }));

      await updateOpeningHoursMutation.mutateAsync({
        companyId,
        openingHours: activeHoursToSend,
      });

      // 3. Update social medias
      const updatedSocials: any[] = [];
      if (instagram.trim()) {
        updatedSocials.push({
          name: "Instagram",
          mediaUrl: instagram.trim(),
          icon: "logo-instagram",
        });
      }
      if (facebook.trim()) {
        updatedSocials.push({
          name: "Facebook",
          mediaUrl: facebook.trim(),
          icon: "logo-facebook",
        });
      }
      if (website.trim()) {
        updatedSocials.push({
          name: "Website",
          mediaUrl: website.trim(),
          icon: "globe-outline",
        });
      }
      await updateSocialMediasMutation.mutateAsync({
        companyId,
        socialMedias: updatedSocials,
      });

      queryClient.invalidateQueries({ queryKey: ["company-details", companyId] });
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
      queryClient.invalidateQueries({ queryKey: ["onboarding-company"] });

      Alert.alert("Sucesso", "Dados atualizados com sucesso!");
      router.back();

    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível salvar as alterações.");
    } finally {
      setSaving(false);
    }
  };

  const getFormatTime = (isoString: string) => {
    if (!isoString) return "";
    const parts = isoString.split("T");
    if (parts.length < 2) return "";
    return parts[1].substring(0, 5); // HH:MM
  };

  const [activeHourEdit, setActiveHourEdit] = useState<{ dayWeek: string; field: string; dateValue: Date } | null>(null);

  const openTimePicker = (dayWeek: string, field: string, isoString: string) => {
    let dateVal = new Date();
    if (isoString) {
      try {
        dateVal = new Date(isoString);
        if (isNaN(dateVal.getTime())) {
          dateVal = new Date();
        }
      } catch {
        dateVal = new Date();
      }
    }
    setActiveHourEdit({ dayWeek, field, dateValue: dateVal });
  };

  const handleConfirmTime = (selectedDate: Date) => {
    if (activeHourEdit) {
      const hours = String(selectedDate.getHours()).padStart(2, "0");
      const minutes = String(selectedDate.getMinutes()).padStart(2, "0");
      handleHourChange(activeHourEdit.dayWeek, activeHourEdit.field, `${hours}:${minutes}`);
      setActiveHourEdit(null);
    }
  };

  const uploadSelectedImages = async (uris: string[], type: "space" | "portfolio" = "space") => {
    if (!uris || uris.length === 0) return;

    if (type === "portfolio") setUploadingPortfolio(true);
    else setUploadingSpace(true);

    let lastData: any = null;
    let successCount = 0;

    try {
      for (const uri of uris) {
        const formData = new FormData();
        const filename = uri.split("/").pop() || "upload.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const fileType = match ? `image/${match[1]}` : `image/jpeg`;
        const formattedUri = Platform.OS === "android" && !uri.startsWith("file://") ? `file://${uri}` : uri;

        formData.append("file", {
          uri: formattedUri,
          name: filename,
          type: fileType,
        } as any);

        const res = await styleAppApiClient.put(`/companies/${companyId}/images?type=${type}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          transformRequest: (data) => data,
        });

        if (res.data) {
          lastData = res.data;
          successCount++;
        }
      }

      if (lastData) {
        if (type === "portfolio") {
          const updatedPort = cleanImageUrlsString(lastData.portfolioImagesUrl || "");
          setPortfolioImagesUrl(updatedPort);
        } else {
          const updatedSpace = cleanImageUrlsString(lastData.imagesUrl || "");
          setImagesUrl(updatedSpace);
        }

        // Importante: Invalida o cache do React Query para forçar recarregamento em todas as telas
        queryClient.invalidateQueries({ queryKey: ["company-details", companyId] });
        queryClient.invalidateQueries({ queryKey: ["company", companyId] });
        queryClient.invalidateQueries({ queryKey: ["companies"] });

        Alert.alert(
          "Sucesso",
          `${successCount} foto(s) de ${type === "portfolio" ? "Portfólio" : "Espaço"} enviada(s) e adicionada(s) com sucesso!`
        );
      }
    } catch (err: any) {
      console.error(err);
      const serverMsg = err.response?.data?.message || err.response?.data || err.message;
      Alert.alert("Erro", `Não foi possível enviar a(s) imagem(ns). Detalhe: ${serverMsg}`);
    } finally {
      if (type === "portfolio") setUploadingPortfolio(false);
      else setUploadingSpace(false);
    }
  };

  const handlePickAndUploadImage = async (type: "space" | "portfolio" = "space") => {
    const titleText = type === "portfolio" ? "Fotos de Portfólio" : "Fotos do Espaço";
    modals.showSelection({
      title: `Selecionar ${titleText}`,
      message: `Escolha uma opção para as imagens do ${type === "portfolio" ? "portfólio de trabalhos" : "estabelecimento"}:`,
      options: [
        {
          text: "Galeria (Várias Fotos)",
          icon: "images",
          variant: "primary",
          onPress: async () => {
            close();
            const imageUris = await openGalleryMultiple({
              allowsMultipleSelection: true,
              quality: 0.8,
            });
            if (imageUris && imageUris.length > 0) {
              await uploadSelectedImages(imageUris, type);
            }
          },
        },
        {
          text: "Câmera",
          icon: "camera",
          variant: "primary",
          onPress: async () => {
            close();
            const imageUri = await openCamera();
            if (imageUri) {
              await uploadSelectedImages([imageUri], type);
            }
          },
        },
      ],
    });
  };

  const handleRemoveImage = (indexToRemove: number, type: "space" | "portfolio" = "space") => {
    if (type === "portfolio") {
      const list = portfolioImagesUrl.split(",").map((url) => url.trim()).filter((url) => url.length > 0);
      const updated = list.filter((_, idx) => idx !== indexToRemove).join(",");
      setPortfolioImagesUrl(updated);
    } else {
      const list = imagesUrl.split(",").map((url) => url.trim()).filter((url) => url.length > 0);
      const updated = list.filter((_, idx) => idx !== indexToRemove).join(",");
      setImagesUrl(updated);
    }
  };

  return {
    company,
    isLoading,
    error,
    name, setName,
    cnpj, setCnpj,
    address, setAddress,
    phone, setPhone,
    description, setDescription,
    imagesUrl, setImagesUrl,
    portfolioImagesUrl, setPortfolioImagesUrl,
    hoursList,
    instagram, setInstagram,
    facebook, setFacebook,
    website, setWebsite,
    saving,
    uploadingSpace,
    uploadingPortfolio,
    toggleDayActive,
    handleHourChange,
    handleSave,
    getFormatTime,
    handlePickAndUploadImage,
    handleRemoveImage,
    activeHourEdit,
    setActiveHourEdit,
    openTimePicker,
    handleConfirmTime,
    selectedCategories,
    toggleCategory,
    allCategories,
    cep, setCep,
    street, setStreet,
    number, setNumber,
    complement, setComplement,
    neighborhood, setNeighborhood,
    city, setCity,
    state, setState,
    addressLoading,
    searchCep,
  };
}

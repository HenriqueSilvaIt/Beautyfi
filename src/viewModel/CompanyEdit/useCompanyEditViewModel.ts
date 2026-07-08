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

export function useCompanyEditViewModel() {
  const companyId = useCompanyStore((state) => state.selectedCompanyId) || 1;
  const {
    useGetCompanyDetailsQuery,
    mutationUpdate,
    updateOpeningHoursMutation,
    updateSocialMediasMutation,
  } = useCompanyDetailsMutation();

  const { openCamera, isLoading: isCameraLoading } = useCamera({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });
  const { openGallery, isLoading: isGalleryLoading } = useGallery({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
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

  // Opening Hours
  const [hoursList, setHoursList] = useState<any[]>([]);

  // Social Medias
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [website, setWebsite] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Populate form when data is loaded
  useEffect(() => {
    if (company) {
      setName(company.name || "");
      setCnpj(company.cnpj || "");
      setAddress(company.address || "");
      setPhone(company.phone || "");
      setDescription(company.description || "");
      setImagesUrl(company.imagesUrl || "");

      if (company.openingHourDTOS) {
        setHoursList(company.openingHourDTOS);
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
    }
  }, [company]);

  const handleHourChange = (id: number, field: string, value: string) => {
    setHoursList((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const datePart =
            (h[field] ? String(h[field]).split("T")[0] : "2026-01-01") ||
            "2026-01-01";
          const newIso = `${datePart}T${value}:00`;
          return { ...h, [field]: newIso };
        }
        return h;
      }),
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // 1. Update basic details
      await mutationUpdate.mutateAsync({
        ...company,
        name,
        cnpj,
        address,
        phone,
        description,
        imagesUrl,
      });

      // 2. Update opening hours
      await updateOpeningHoursMutation.mutateAsync({
        companyId,
        openingHours: hoursList,
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

  const [activeHourEdit, setActiveHourEdit] = useState<{ id: number; field: string; dateValue: Date } | null>(null);

  const openTimePicker = (id: number, field: string, isoString: string) => {
    let dateVal = new Date();
    if (isoString) {
      try {
        // Se a string ISO for válida
        dateVal = new Date(isoString);
        if (isNaN(dateVal.getTime())) {
          dateVal = new Date();
        }
      } catch {
        dateVal = new Date();
      }
    }
    setActiveHourEdit({ id, field, dateValue: dateVal });
  };

  const handleConfirmTime = (selectedDate: Date) => {
    if (activeHourEdit) {
      const hours = String(selectedDate.getHours()).padStart(2, "0");
      const minutes = String(selectedDate.getMinutes()).padStart(2, "0");
      handleHourChange(activeHourEdit.id, activeHourEdit.field, `${hours}:${minutes}`);
      setActiveHourEdit(null);
    }
  };

  const uploadSelectedImage = async (uri: string) => {
    setUploading(true);
    try {
      const formData = new FormData();
      const filename = uri.split("/").pop() || "upload.jpg";
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image/jpeg`;

      // Formatar URI para Android se necessário
      const formattedUri = Platform.OS === "android" && !uri.startsWith("file://") ? `file://${uri}` : uri;

      formData.append("file", {
        uri: formattedUri,
        name: filename,
        type: type,
      } as any);

      const res = await styleAppApiClient.put(`/companies/${companyId}/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data && res.data.imagesUrl !== undefined) {
        setImagesUrl(res.data.imagesUrl || "");
        Alert.alert("Sucesso", "Imagem da empresa enviada com sucesso!");
      }
    } catch (err: any) {
      console.error(err);
      const serverMsg = err.response?.data?.message || err.response?.data || err.message;
      Alert.alert("Erro", `Não foi possível enviar a imagem. Detalhe: ${serverMsg}`);
    } finally {
      setUploading(false);
    }
  };

  const handlePickAndUploadImage = async () => {
    modals.showSelection({
      title: "Selecionar foto",
      message: "Escolha uma opção para a foto do estabelecimento:",
      options: [
        {
          text: "Galeria",
          icon: "images",
          variant: "primary",
          onPress: async () => {
            close();
            const imageUri = await openGallery();
            if (imageUri) {
              await uploadSelectedImage(imageUri);
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
              await uploadSelectedImage(imageUri);
            }
          },
        },
      ],
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const list = imagesUrl.split(",").map(url => url.trim()).filter(url => url.length > 0);
    const updated = list.filter((_, idx) => idx !== indexToRemove).join(",");
    setImagesUrl(updated);
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
    hoursList,
    instagram, setInstagram,
    facebook, setFacebook,
    website, setWebsite,
    saving,
    uploading,
    handleHourChange,
    handleSave,
    getFormatTime,
    handlePickAndUploadImage,
    handleRemoveImage,
    activeHourEdit,
    setActiveHourEdit,
    openTimePicker,
    handleConfirmTime,
  };
}

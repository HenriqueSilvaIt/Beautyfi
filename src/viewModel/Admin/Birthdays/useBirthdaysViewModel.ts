import { useEffect, useState } from "react";
import { Linking } from "react-native";
import { styleAppApiClient } from "@/shared/api/styleAppBackend";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";

export interface ClientBirthday {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  profileUrl?: string;
}

export function useBirthdaysViewModel() {
  const user = useUserStore((s) => s.user);
  const companyId = user?.companyId || 1;

  const { useGetCompanyDetailsQuery } = useCompanyDetailsMutation();
  const { data: company } = useGetCompanyDetailsQuery(companyId);
  const companyLogo = company?.logoUrl;


  const currentMonthVal = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthVal);
  const [birthdays, setBirthdays] = useState<ClientBirthday[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const loadBirthdays = async () => {
    setLoading(true);
    try {
      const response = await styleAppApiClient.get<ClientBirthday[]>(
        `/clients/birthdays?companyId=${companyId}&month=${selectedMonth}`
      );
      setBirthdays(response.data);
    } catch (e) {
      console.error("Error loading birthdays from backend, using empty list:", e);
      setBirthdays([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBirthdays();
  }, [selectedMonth]);

  const getDayOfBirth = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length < 3) return "";
    return `${parts[2]}/${parts[1]}`;
  };

  const handleSendWhatsApp = (phone: string, clientName: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, "");
    const formattedPhone = cleanPhone.length === 11 || cleanPhone.length === 10
      ? `55${cleanPhone}`
      : cleanPhone;
    const companyName = company?.name || "";
    const msg = `Olá ${clientName}! Nós da ${companyName || "nossa equipe"} desejamos a você um feliz aniversário! Muitas felicidades, paz e saúde. Parabéns! 🎂🎉`;
    const url = `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(msg)}`;
    Linking.openURL(url).catch((err) => console.error("Error opening WhatsApp URL", err));
  };

  return {
    selectedMonth,
    setSelectedMonth,
    birthdays,
    loading,
    dropdownOpen,
    setDropdownOpen,
    companyLogo,
    getDayOfBirth,
    loadBirthdays,
    handleSendWhatsApp,
  };
}

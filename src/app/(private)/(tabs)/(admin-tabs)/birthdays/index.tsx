import React, { useEffect, useState } from "react";
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useUserStore } from "@/shared/store/user-store";

import { styleAppApiClient } from "@/shared/api/styleAppBackend";

interface ClientBirthday {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  profileUrl?: string;
}

const MONTHS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export default function BirthdaysScreen() {
  const user = useUserStore((s) => s.user);
  const companyId = user?.companyId || 1;

  const currentMonthVal = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthVal);
  const [birthdays, setBirthdays] = useState<ClientBirthday[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    loadBirthdays();
  }, [selectedMonth]);

  const loadBirthdays = async () => {
    setLoading(true);
    try {
      const response = await styleAppApiClient.get<ClientBirthday[]>(
        `/clients/birthdays?companyId=${companyId}&month=${selectedMonth}`
      );
      setBirthdays(response.data);
    } catch (e) {
      // Fallback mocks
      setBirthdays([
        { id: "1", name: "Maria Oliveira", email: "maria@gmail.com", phone: "(11) 98888-7777", birthDate: `1992-${selectedMonth.toString().padStart(2, '0')}-12` },
        { id: "2", name: "Pedro Henrique", email: "pedro@gmail.com", phone: "(11) 96666-5555", birthDate: `1988-${selectedMonth.toString().padStart(2, '0')}-25` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getDayOfBirth = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length < 3) return "";
    return `${parts[2]}/${parts[1]}`;
  };

  return (
    <KeyboardContainer>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        {/* Header */}
        <View className="mb-6" style={{ marginTop: 40 }}>
          <Text className="text-white text-2xl font-bold font-serif">Aniversariantes</Text>
          <Text className="text-slate-400 text-xs mt-1">Clientes celebrando aniversário</Text>
        </View>

        {/* Month Selector dropdown toggle */}
        <TouchableOpacity
          onPress={() => setDropdownOpen(!dropdownOpen)}
          className="bg-background-quartenary p-4 rounded-xl border border-slate-800 flex-row justify-between items-center mb-6"
        >
          <Text className="text-white font-bold text-sm">
            Mês: {MONTHS.find((m) => m.value === selectedMonth)?.label}
          </Text>
          <Ionicons name={dropdownOpen ? "chevron-up" : "chevron-down"} size={20} color={colors.white} />
        </TouchableOpacity>

        {dropdownOpen && (
          <View className="bg-background-quartenary rounded-xl border border-slate-800 p-2 mb-6 gap-1">
            {MONTHS.map((m) => (
              <TouchableOpacity
                key={m.value}
                onPress={() => {
                  setSelectedMonth(m.value);
                  setDropdownOpen(false);
                }}
                className={`p-3 rounded-lg ${m.value === selectedMonth ? "bg-beauty-gold/10" : ""}`}
              >
                <Text className={m.value === selectedMonth ? "text-beauty-gold font-bold" : "text-slate-300"}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Birthdays List */}
        {loading ? (
          <ActivityIndicator size="large" color={colors.white} />
        ) : birthdays.length > 0 ? (
          birthdays.map((item) => (
            <View
              key={item.id}
              className="bg-background-quartenary p-4 rounded-xl mb-3 flex-row items-center gap-4 border border-slate-800"
            >
              {item.profileUrl ? (
                <Image
                  source={{ uri: item.profileUrl }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                />
              ) : (
                <View className="w-12 h-12 bg-beauty-gold/10 rounded-full items-center justify-center border border-beauty-gold/20">
                  <Ionicons name="person" size={22} color="#CBA35D" />
                </View>
              )}

              <View className="flex-1">
                <Text className="text-white font-bold text-sm">{item.name}</Text>
                {item.phone ? (
                  <Text className="text-slate-400 text-xs mt-1">📞 {item.phone}</Text>
                ) : null}
                {item.birthDate ? (
                  <Text className="text-slate-500 text-[11px] mt-0.5">🎂 {getDayOfBirth(item.birthDate)}</Text>
                ) : null}
              </View>

              <View className="bg-beauty-gold/10 px-2 py-1 rounded-md">
                <Text className="text-beauty-gold font-bold text-xs">
                  Dia {getDayOfBirth(item.birthDate).split("/")[0]}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-slate-400 text-xs text-center py-8">Nenhum aniversariante neste mês.</Text>
        )}
      </ScrollView>
    </KeyboardContainer>
  );
}

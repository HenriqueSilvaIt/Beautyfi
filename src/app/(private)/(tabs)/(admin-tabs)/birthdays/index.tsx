import React from "react";
import { ScrollView, Text, View, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useBirthdaysViewModel } from "@/viewModel/Admin/Birthdays/useBirthdaysViewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";

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
  const {
    selectedMonth,
    setSelectedMonth,
    birthdays,
    loading,
    dropdownOpen,
    setDropdownOpen,
    companyLogo,
    getDayOfBirth,
    handleSendWhatsApp,
  } = useBirthdaysViewModel();

  return (
    <KeyboardContainer>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }} style={{ backgroundColor: "#FFFFFF" }}>
        {/* Header */}
 <AppAdminHeader
          title="Aniversariantes"
          leftIconShown={false}
          iconRight={{
            icon: false,
            path: "",
          }}
        />          <Text className="text-font-primary text-xs mt-1">Clientes celebrando aniversário</Text>

        {/* Month Selector dropdown toggle */}
        <TouchableOpacity
          onPress={() => setDropdownOpen(!dropdownOpen)}
          className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex-row justify-between items-center mb-6"
        >
          <Text className="text-gray-800 font-bold text-sm">
            Mês: {MONTHS.find((m) => m.value === selectedMonth)?.label}
          </Text>
          <Ionicons name={dropdownOpen ? "chevron-up" : "chevron-down"} size={20} color="#12294A" />
        </TouchableOpacity>

        {dropdownOpen && (
          <View className="bg-white rounded-xl border border-gray-200 p-2 mb-6 gap-1 shadow-sm">
            {MONTHS.map((m) => (
              <TouchableOpacity
                key={m.value}
                onPress={() => {
                  setSelectedMonth(m.value);
                  setDropdownOpen(false);
                }}
                className={`p-3 rounded-lg ${m.value === selectedMonth ? "bg-[#CBA35D]/10" : ""}`}
              >
                <Text className={m.value === selectedMonth ? "text-[#092D5D] font-bold" : "text-gray-600"}>
                  {m.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Birthdays List */}
        {loading ? (
          <ActivityIndicator size="large" color="#12294A" />
        ) : birthdays.length > 0 ? (
          birthdays.map((item) => (
            <View
              key={item.id}
              className="bg-white p-4 rounded-xl mb-3 flex-row items-center gap-4 border border-gray-600 shadow-sm"
            >
              {item.profileUrl ? (
                <Image
                  source={{ uri: item.profileUrl }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                />
              ) : companyLogo ? (
                <Image
                  source={{ uri: companyLogo }}
                  style={{ width: 48, height: 48, borderRadius: 24 }}
                />
              ) : (
                <View className="w-12 h-12 bg-[#CBA35D]/10 rounded-full items-center justify-center border border-[#CBA35D]/20">
                  <Ionicons name="person" size={22} color="#CBA35D" />
                </View>
              )}

              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-sm">{item.name}</Text>
                {item.phone ? (
                  <Text className="text-font-primary text-xs mt-1">📞 {item.phone}</Text>
                ) : null}
                {item.birthDate ? (
                  <Text className="text-gray-600 text-[11px] mt-0.5">🎂 {getDayOfBirth(item.birthDate)}</Text>
                ) : null}
              </View>

              <View className="flex-row items-center gap-2">
                {item.phone ? (
                  <TouchableOpacity
                    onPress={() => handleSendWhatsApp(item.phone, item.name)}
                    activeOpacity={0.7}
                    className="bg-emerald-50 border border-emerald-200/60 p-2.5 rounded-xl items-center justify-center"
                  >
                    <Ionicons name="logo-whatsapp" size={20} color="#25D366" />
                  </TouchableOpacity>
                ) : null}

                <View className="bg-[#FAF8EF] border border-[#CBA35D]/30 px-3 py-1.5 rounded-lg">
                  <Text className="text-[#092D5D] font-extrabold text-sm">
                    Dia {getDayOfBirth(item.birthDate).split("/")[0]}
                  </Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-font-primary text-xs text-center py-8">Nenhum aniversariante neste mês.</Text>
        )}
      </ScrollView>
    </KeyboardContainer>
  );
}

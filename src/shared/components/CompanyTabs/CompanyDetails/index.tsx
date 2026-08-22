import {
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { CompanyProps, CompanyReviewProps } from "../../../interfaces/http/company";
import { EmployeeProps } from "../../../interfaces/http/employee";
import { useBottomSheetContext } from "../../../hooks/useBotttomSheetApp";

interface CompanyDetailsProps {
  data: CompanyProps[];
  employees?: EmployeeProps[];
  reviews?: CompanyReviewProps[];
}

function getSocialMediaInfo(name?: string, mediaUrl?: string) {
  const text = (name || mediaUrl || "").toLowerCase();

  if (text.includes("instagram")) {
    return {
      icon: "logo-instagram" as const,
      color: "#E1306C",
      bgColor: "bg-pink-50 border-pink-100",
      label: "Instagram",
    };
  }
  if (text.includes("whatsapp") || text.includes("whats")) {
    return {
      icon: "logo-whatsapp" as const,
      color: "#25D366",
      bgColor: "bg-emerald-50 border-emerald-100",
      label: "WhatsApp",
    };
  }
  if (text.includes("facebook") || text.includes("fb")) {
    return {
      icon: "logo-facebook" as const,
      color: "#1877F2",
      bgColor: "bg-blue-50 border-blue-100",
      label: "Facebook",
    };
  }
  if (text.includes("tiktok")) {
    return {
      icon: "logo-tiktok" as const,
      color: "#000000",
      bgColor: "bg-gray-100 border-gray-200",
      label: "TikTok",
    };
  }
  if (text.includes("youtube") || text.includes("yt")) {
    return {
      icon: "logo-youtube" as const,
      color: "#FF0000",
      bgColor: "bg-red-50 border-red-100",
      label: "YouTube",
    };
  }
  if (text.includes("twitter") || text.includes("x.com")) {
    return {
      icon: "logo-twitter" as const,
      color: "#1DA1F2",
      bgColor: "bg-sky-50 border-sky-100",
      label: "Twitter / X",
    };
  }

  return {
    icon: "globe-outline" as const,
    color: "#092D5D",
    bgColor: "bg-gray-50 border-gray-100",
    label: name || "Website Oficial",
  };
}

export function CompanyDetails({ data, employees }: CompanyDetailsProps) {
  const company = data[0];
  if (!company) return null;

  const { openBottomSheet } = useBottomSheetContext();

  return (
    <View className="w-full pb-24 gap-4">
      {/* INFORMAÇÕES */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="w-8 h-8 rounded-lg bg-[#092D5D]/10 justify-center items-center">
            <Ionicons name="information-circle-outline" size={18} color="#092D5D" />
          </View>
          <Text className="text-base font-black text-[#092D5D]">Sobre o Estabelecimento</Text>
        </View>
        <Text className="text-gray-900 font-extrabold text-base mb-1">{company.name}</Text>
        <Text className="text-gray-600 text-xs leading-relaxed">
          {company.description || "Sem descrição disponível."}
        </Text>
      </View>

      {/* HORÁRIO DE ATENDIMENTO */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="w-8 h-8 rounded-lg bg-[#CBA35D]/20 justify-center items-center">
            <Ionicons name="time-outline" size={18} color="#092D5D" />
          </View>
          <Text className="text-base font-black text-[#092D5D]">Horário de Atendimento</Text>
        </View>

        {company.openingHourDTOS && company.openingHourDTOS.length > 0 ? (
          company.openingHourDTOS.map((hour) => (
            <View
              key={hour.id}
              className="flex-row justify-between items-center py-2.5 border-b border-gray-100 last:border-0"
            >
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full bg-emerald-500" />
                <Text className="text-gray-800 font-bold text-xs">{hour.dayWeek}</Text>
              </View>
              <View className="items-end">
                <Text className="text-gray-700 font-semibold text-xs">
                  {format(new Date(hour.firstHour), "HH:mm")} -{" "}
                  {format(new Date(hour.secondHour), "HH:mm")}
                </Text>
                <Text className="text-gray-500 font-medium text-[11px]">
                  {format(new Date(hour.thirdHour), "HH:mm")} -{" "}
                  {format(new Date(hour.lastHour), "HH:mm")}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text className="text-gray-400 text-xs">Horário de funcionamento não informado.</Text>
        )}
      </View>

      {/* ENDEREÇO */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <View className="flex-row items-center gap-2 mb-2">
          <View className="w-8 h-8 rounded-lg bg-[#092D5D]/10 justify-center items-center">
            <Ionicons name="location-outline" size={18} color="#092D5D" />
          </View>
          <Text className="text-base font-black text-[#092D5D]">Endereço</Text>
        </View>
        <Text className="text-gray-600 text-xs leading-relaxed">{company.address}</Text>
      </View>

      {/* FORMAS DE PAGAMENTO */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="w-8 h-8 rounded-lg bg-[#CBA35D]/20 justify-center items-center">
            <Ionicons name="card-outline" size={18} color="#092D5D" />
          </View>
          <Text className="text-base font-black text-[#092D5D]">Formas de Pagamento</Text>
        </View>

        {company.paymentMethodDTOS && company.paymentMethodDTOS.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {company.paymentMethodDTOS.map((method) => (
              <View
                key={method.id}
                className="px-3.5 py-2 rounded-xl bg-gray-50 border border-gray-200 flex-row items-center gap-1.5"
              >
                <Ionicons name="checkmark-circle" size={14} color="#CBA35D" />
                <Text className="text-gray-800 font-bold text-xs">{method.name}</Text>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-400 text-xs">Nenhuma forma de pagamento cadastrada.</Text>
        )}
      </View>

      {/* REDES SOCIAIS (ICON + NAME + OPEN ICON RIGHT) */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="w-8 h-8 rounded-lg bg-[#092D5D]/10 justify-center items-center">
            <Ionicons name="share-social-outline" size={18} color="#092D5D" />
          </View>
          <Text className="text-base font-black text-[#092D5D]">Redes Sociais & Contato</Text>
        </View>

        {company.socialMediaDTOS && company.socialMediaDTOS.length > 0 ? (
          <View className="gap-2.5">
            {company.socialMediaDTOS.map((media) => {
              const info = getSocialMediaInfo(media.name, media.mediaUrl);
              return (
                <TouchableOpacity
                  key={media.id}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (media.mediaUrl) {
                      Linking.openURL(media.mediaUrl).catch((e) =>
                        console.log("Erro ao abrir rede social:", e)
                      );
                    }
                  }}
                  className={`flex-row items-center justify-between p-3.5 rounded-xl border ${info.bgColor}`}
                >
                  <View className="flex-row items-center gap-3">
                    <View
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#ffffff",
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                      }}
                    >
                      <Ionicons name={info.icon} size={20} color={info.color} />
                    </View>
                    <Text className="text-gray-900 font-extrabold text-sm">
                      {info.label}
                    </Text>
                  </View>

                  <Ionicons name="open-outline" size={18} color="#6b7280" />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text className="text-gray-400 text-xs">Nenhuma rede social informada.</Text>
        )}
      </View>

      {/* PROFISSIONAIS (FIXED HEIGHT FOR AVATAR) */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
        <View className="flex-row items-center gap-2 mb-3">
          <View className="w-8 h-8 rounded-lg bg-[#CBA35D]/20 justify-center items-center">
            <Ionicons name="people-outline" size={18} color="#092D5D" />
          </View>
          <Text className="text-base font-black text-[#092D5D]">Equipe Profissional</Text>
        </View>

        {employees && employees.length > 0 ? (
          <View className="gap-2.5">
            {employees.map((emp) => (
              <TouchableOpacity
                key={emp.id}
                activeOpacity={0.8}
                onPress={() =>
                  openBottomSheet(
                    <View className="w-full h-full p-5 items-center bg-white">
                      {emp.avatarUrl ? (
                        <Image
                          source={{ uri: emp.avatarUrl }}
                          resizeMode="cover"
                          style={{
                            width: "100%",
                            height: 280,
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: "#e5e7eb",
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            width: "100%",
                            height: 280,
                            borderRadius: 16,
                            backgroundColor: "#f3f4f6",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons name="person" size={80} color="#9ca3af" />
                        </View>
                      )}
                      <Text className="text-gray-900 text-2xl font-black mt-4">{emp.name}</Text>
                      <Text className="text-[#092D5D] text-xs font-bold mt-0.5">
                        {emp.name === "Christian" ? "Gestor do Estabelecimento" : "Profissional Atendente"}
                      </Text>
                      {emp.description ? (
                        <View className="w-full mt-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                          <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Sobre</Text>
                          <Text className="text-gray-700 text-xs leading-relaxed">{emp.description}</Text>
                        </View>
                      ) : null}
                    </View>,
                    1
                  )
                }
                className="flex-row items-center justify-between bg-gray-50 p-3.5 rounded-xl border border-gray-200/80"
              >
                <View className="flex-row items-center gap-3">
                  {emp.avatarUrl ? (
                    <Image
                      source={{ uri: emp.avatarUrl }}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        borderWidth: 1.5,
                        borderColor: "#CBA35D",
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: "#e5e7eb",
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 1.5,
                        borderColor: "#d1d5db",
                      }}
                    >
                      <Ionicons name="person" size={22} color="#6b7280" />
                    </View>
                  )}
                  <View>
                    <Text className="text-gray-900 font-extrabold text-sm">{emp.name}</Text>
                    <Text className="text-gray-500 text-[11px] font-semibold">
                      {emp.name === "Christian" ? "Gestor" : "Profissional Atendente"}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text className="text-gray-400 text-xs">Nenhum profissional cadastrado.</Text>
        )}
      </View>
    </View>
  );
}

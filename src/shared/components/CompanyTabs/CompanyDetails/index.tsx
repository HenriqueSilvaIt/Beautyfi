import { useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../styles/colors";
import { CompanyProps, CompanyReviewProps } from "../../../interfaces/http/company";
import { EmployeeProps } from "../../../interfaces/http/employee";
import { useBottomSheetContext } from "../../../hooks/useBotttomSheetApp";
import { useCompanyDetailsMutation } from "../../../queries/company/use-company.mutation";
import { useUserStore } from "../../../store/user-store";

interface CompanyDetailsProps {
  data: CompanyProps[];
  employees?: EmployeeProps[];
  reviews?: CompanyReviewProps[];
}

export function CompanyDetails({ data, employees, reviews }: CompanyDetailsProps) {
  const company = data[0];
  if (!company) return null;

  const { openBottomSheet } = useBottomSheetContext();
  const { user } = useUserStore();
  const { createCompanyReviewMutation } = useCompanyDetailsMutation();

  const isAdmin = user?.roles?.some((role) => role.authority === "ROLE_ADMIN") ?? false;

  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSubmitReview = async () => {
    setIsSubmittingReview(true);
    try {
      await createCompanyReviewMutation.mutateAsync({
        companyId: company.id,
        rating: newRating,
        comment: newComment.trim(),
      });
      setNewComment("");
      setNewRating(5);
      alert("Avaliação enviada com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar avaliação.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <View className="w-full px-4 pb-24">
      {/* INFORMAÇÕES */}
      <View className="border-b border-gray-700 pb-3 mb-4">
        <Text className="text-xl font-bold text-font-primary mb-1">Informações</Text>
        <Text className="text-gray-600">{company.name}</Text>
        <Text className="text-gray-500 text-sm mt-1">{company.description}</Text>
      </View>

      {/* HORÁRIO */}
      <View className="border-b border-gray-700 pb-3 mb-4">
        <Text className="text-xl font-bold text-font-primary mb-2">
          Horário de atendimento
        </Text>

        {company.openingHourDTOS?.map((hour) => (
          <View key={hour.id} className="flex-row justify-between mb-1">
            <Text className="text-font-primary">{hour.dayWeek}</Text>

            <View>
              <Text className="text-font-primary text-sm">
                {format(new Date(hour.firstHour), "HH:mm")} -{" "}
                {format(new Date(hour.secondHour), "HH:mm")}
              </Text>
              <Text className="text-font-primary text-sm">
                {format(new Date(hour.thirdHour), "HH:mm")} -{" "}
                {format(new Date(hour.lastHour), "HH:mm")}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* ENDEREÇO */}
      <View className="border-b border-gray-700 pb-3 mb-4">
        <Text className="text-xl font-bold text-font-primary mb-1">Endereço</Text>
        <Text className="text-font-primary">{company.address}</Text>
      </View>

      {/* PAGAMENTO */}
      <View className="border-b border-gray-700 pb-3 mb-4">
        <Text className="text-xl font-bold text-font-primary mb-1">
          Formas de pagamento
        </Text>

        {company.paymentMethodDTOS?.map((method) => (
          <Text key={method.id} className="text-font-primary">
            • {method.name}
          </Text>
        ))}
      </View>

      {/* REDES SOCIAIS */}
      <View className="border-b border-gray-700 pb-4 mb-4">
        <Text className="text-xl font-bold text-font-primary mb-2">
          Redes Sociais
        </Text>

        {company.socialMediaDTOS?.map((media) => (
          <TouchableOpacity
            key={media.id}
            onPress={() => Linking.openURL(media.mediaUrl)}
            className="flex-row items-center mb-2"
          >
            <Ionicons
              name={media.icon as any}
              size={20}
              color={colors.white}
            />
            <Text className="text-font-primary ml-2">{media.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* PROFISSIONAIS */}
      <View className="border-b border-gray-700 pb-4 mb-4">
        <Text className="text-xl font-bold text-font-primary mb-3">Profissionais</Text>
        {employees && employees.length > 0 ? (
          <View className="gap-3">
            {employees.map((emp) => (
              <TouchableOpacity
                key={emp.id}
                activeOpacity={0.7}
                onPress={() => openBottomSheet(
                  <View className="w-full h-full p-4 items-center">
                    {emp.avatarUrl ? (
                      <Image
                        source={{ uri: emp.avatarUrl }}
                        resizeMode="cover"
                        className="w-full h-[350px] rounded-2xl"
                      />
                    ) : (
                      <View className="w-full h-[350px] bg-gray-700 rounded-2xl justify-center items-center">
                        <Ionicons name="person" size={80} color="#9ca3af" />
                      </View>
                    )}
                    <Text className="text-font-primary text-2xl font-bold mt-5">{emp.name}</Text>
                    <Text className="text-gray-500 text-sm mt-1">
                      {emp.name === "Christian" ? "Gestor" : "Profissional"}
                    </Text>
                    {emp.description ? (
                      <View className="w-full mt-5 px-2">
                        <Text className="text-font-primary font-bold text-lg mb-1">Sobre</Text>
                        <Text className="text-gray-600 text-sm leading-relaxed">{emp.description}</Text>
                      </View>
                    ) : null}
                  </View>,
                  1
                )}
                className="flex-row items-center bg-white/5 border border-gray-700 p-3 rounded-xl"
              >
                {emp.avatarUrl ? (
                  <Image
                    source={{ uri: emp.avatarUrl }}
                    className="w-12 h-12 rounded-full border border-app-theme-primary"
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-gray-700 justify-center items-center">
                    <Ionicons name="person" size={20} color="#9ca3af" />
                  </View>
                )}
                <View className="ml-3">
                  <Text className="text-font-primary font-bold text-base">{emp.name}</Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    {emp.name === "Christian" ? "Gestor" : "Profissional"}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500 text-sm">Nenhum profissional disponível.</Text>
        )}
      </View>

      {/* AVALIAÇÕES - Removido daqui, agora na aba dedicada */}
    </View>
  );
}

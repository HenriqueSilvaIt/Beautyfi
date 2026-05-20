import {
  Dimensions,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CompanyProps } from "../../../interfaces/http/company";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../../../styles/colors";

interface CompanyDetailsProps {
  data: CompanyProps[];
}

export function CompanyDetails({ data }: CompanyDetailsProps) {
  const company = data[0];

  if (!company) return null;

  const { height } = Dimensions.get("window");

  return (

      <View className="w-full px-4 pb-24">
        {/* INFORMAÇÕES */}
        <View className="border-b border-gray-700 pb-3 mb-4">
          <Text className="text-xl font-bold text-font-primary mb-1">Informações</Text>
          <Text className="text-gray-400">{company.name}</Text>
          <Text className="text-gray-500 text-sm">{company.description}</Text>
        </View>

        {/* HORÁRIO */}
        <View className="border-b border-gray-700 pb-3 mb-4">
          <Text className="text-xl font-bold text-font-primary mb-2">
            Horário de atendimento
          </Text>

          {company.openingHourDTOS.map((hour) => (
            <View key={hour.id} className="flex-row justify-between mb-1">
              <Text className="text-font-primary">{hour.dayWeek}</Text>

              <View>
                <Text className="text-font-primary text-sm">
                  {format(hour.firstHour, "HH:mm")} -{" "}
                  {format(hour.secondHour, "HH:mm")}
                </Text>
                <Text className="text-font-primary text-sm">
                  {format(hour.thirdHour, "HH:mm")} -{" "}
                  {format(hour.lastHour, "HH:mm")}
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
        <View>
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
      </View>
  );
}

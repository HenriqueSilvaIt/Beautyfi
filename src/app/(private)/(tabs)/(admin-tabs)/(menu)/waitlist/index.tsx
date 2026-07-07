import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format, addDays } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useGetWaitListQuery } from "@/shared/queries/company/use-waitlist.mutation";
import { getCloudinaryAvatar } from "@/shared/helpers/AppCloudinaryAvatar";
import { colors } from "@/styles/colors";
import { AppEmptyList } from "@/shared/components/AppEmptyList";
import { router } from "expo-router";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";

export default function WaitListAdminScreen() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(addDays(new Date(), 7));

  const [isStartPickerVisible, setStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setEndPickerVisible] = useState(false);

  const startStr = format(startDate, "yyyy-MM-dd");
  const endStr = format(endDate, "yyyy-MM-dd");

  const { data: waitlistData, isLoading, refetch } = useGetWaitListQuery(startStr, endStr);

  const handleOpenWhatsApp = (phone?: string, clientName?: string) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/\D/g, "");
    const message = encodeURIComponent(`Olá ${clientName || ""}, vimos que você entrou na lista de espera. Temos um horário disponível!`);
    const url = `https://wa.me/${cleanPhone}?text=${message}`;
    Linking.openURL(url).catch(() => {
      alert("Não foi possível abrir o WhatsApp");
    });
  };

  const renderWaitlistCard = ({ item }: { item: any }) => {
    const formattedDate = format(new Date(item.requestedDate + "T12:00:00"), "dd/MM/yyyy");

    return (
      <View className="bg-background-quartenary p-4 mb-4 rounded-lg gap-3 border border-gray-700">
        <View className="flex-row justify-between items-center border-b border-gray-600 pb-2">
          <View className="flex-row items-center gap-2">
            <Ionicons name="calendar-outline" color={colors["app-theme-primary"]} size={18} />
            <Text className="text-font-primary font-bold text-base">{formattedDate}</Text>
          </View>
          <Text className="text-gray-600 text-sm">Profissional: {item.employeeName || "Qualquer"}</Text>
        </View>

        {item.users && item.users.length > 0 ? (
          item.users.map((client: any) => (
            <View key={client.id} className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center gap-3 flex-1">
                {client.avatarUrl ? (
                  <Image
                    source={{ uri: getCloudinaryAvatar(client.avatarUrl, "sm") }}
                    className="w-10 h-10 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-10 h-10 rounded-full bg-gray-600 items-center justify-center">
                    <Ionicons name="person" color="white" size={16} />
                  </View>
                )}
                <View className="flex-1">
                  <Text className="text-font-primary font-semibold text-sm">{client.name}</Text>
                  {client.phone && <Text className="text-gray-600 text-xs">{client.phone}</Text>}
                </View>
              </View>

              {client.phone && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => handleOpenWhatsApp(client.phone, client.name)}
                  className="bg-green-500/20 p-2 rounded-full border border-green-500/40"
                >
                  <Ionicons name="logo-whatsapp" color="#25D366" size={20} />
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text className="text-gray-600 text-xs italic">Nenhum cliente associado</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-4">
      {/* Header */}
      <AppAdminHeader
                 title="Lista de espera"
                 iconRight={{ icon: false, path: "" }}
               />
      {/* Date Filter Bar */}
      <View className="flex-row gap-3 mb-6">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setStartPickerVisible(true)}
          className="flex-1 bg-background-quartenary p-3 rounded-lg border border-gray-700 flex-row items-center justify-between"
            >
          <View>
            <Text className="text-font-primary  text-[10px]">INÍCIO</Text>
            <Text className="text-font-primary font-semibold text-sm">
              {format(startDate, "dd/MM/yyyy")}
            </Text>
          </View>
          <Ionicons name="calendar-outline" color="white" size={16} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setEndPickerVisible(true)}
          className="flex-1 bg-background-quartenary p-3 rounded-lg border border-gray-700 flex-row items-center justify-between"
        >
          <View>
            <Text className="text-gray-600 text-[10px]">FIM</Text>
            <Text className="text-font-primary font-semibold text-sm">
                {format(endDate, "dd/MM/yyyy")}
              </Text>
          </View>
          <Ionicons name="calendar-outline" color="white" size={16} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={colors["app-theme-primary"] || "white"} />
        </View>
      ) : (
        <FlatList
          data={waitlistData}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderWaitlistCard}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <AppEmptyList
              name="waitlist"
              iconName="time-outline"
              title="Lista de espera vazia"
              description="Nenhum cliente na lista de espera para o período selecionado."
            />
          }
        />
      )}

      {/* DateTime Pickers */}
      <DateTimePickerModal
        isVisible={isStartPickerVisible}
        mode="date"
        date={startDate}
        onConfirm={(date) => {
          setStartDate(date);
          setStartPickerVisible(false);
        }}
        onCancel={() => setStartPickerVisible(false)}
      />

      <DateTimePickerModal
        isVisible={isEndPickerVisible}
        mode="date"
        date={endDate}
        onConfirm={(date) => {
          setEndDate(date);
          setEndPickerVisible(false);
        }}
        onCancel={() => setEndPickerVisible(false)}
      />
    </SafeAreaView>
  );
}

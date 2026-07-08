import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useNotificationStore } from "@/shared/store/notification-store";
import { colors } from "@/styles/colors";
import { format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppDate } from "@/shared/components/AppDate"; // Reused date component

export default function NotificationsScreen() {
  const { notifications, markAllAsRead, clearNotifications } = useNotificationStore();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Mark all notifications as read when entering the screen
  useEffect(() => {
    markAllAsRead();
  }, []);

  // Filter notifications by selected date if set
  const filteredNotifications = notifications.filter((item) => {
    if (!selectedDate) return true;
    try {
      const itemDate = parseISO(item.date);
      return isSameDay(itemDate, selectedDate);
    } catch {
      return false;
    }
  });

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-5 py-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            className="bg-white/10 p-2.5 rounded-full mr-4"
          >
            <Ionicons name="arrow-back" size={22} color="#ffffff" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Notificações</Text>
        </View>

        {notifications.length > 0 && (
          <TouchableOpacity
            onPress={clearNotifications}
            activeOpacity={0.7}
            className="flex-row items-center gap-1 bg-red-500/10 px-3 py-1.5 rounded-full"
          >
            <Ionicons name="trash-outline" size={14} color="#ef4444" />
            <Text className="text-red-500 text-xs font-bold">Limpar tudo</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Date Filter Selection Row */}
      <View className="mb-5 flex-row items-center justify-between bg-white/5 border border-gray-700/60 p-3 rounded-2xl">
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
          className="flex-row items-center flex-1"
        >
          <Ionicons name="calendar-outline" size={20} color="#CBA35D" className="mr-2" style={{ marginRight: 8 }} />
          <Text className="text-white text-sm font-semibold">
            {selectedDate
              ? `Filtrando por: ${selectedDate.toLocaleDateString("pt-BR")}`
              : "Filtrar por data..."}
          </Text>
        </TouchableOpacity>
        {selectedDate && (
          <TouchableOpacity
            onPress={() => setSelectedDate(null)}
            className="ml-3 bg-white/10 p-1.5 rounded-full"
          >
            <Ionicons name="close" size={14} color="#ffffff" />
          </TouchableOpacity>
        )}
      </View>

      {/* List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => {
          let formattedTime = "";
          try {
            formattedTime = format(parseISO(item.date), "HH:mm", { locale: ptBR });
          } catch {}

          return (
            <View className="bg-white/5 border border-gray-700/40 rounded-2xl p-4 mb-3 flex-row items-start gap-4">
              <View className="bg-app-theme-primary/10 p-3 rounded-full mt-1">
                <Ionicons name="notifications" size={20} color="#CBA35D" />
              </View>
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-white text-sm font-bold flex-1 pr-2" numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text className="text-gray-600 text-xs">{formattedTime}</Text>
                </View>
                <Text className="text-gray-300 text-xs leading-relaxed">
                  {item.body}
                </Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Ionicons name="notifications-off-outline" size={48} color="#4b5563" />
            <Text className="text-gray-500 text-sm mt-4 text-center">
              Nenhuma notificação encontrada{selectedDate ? " para esta data" : ""}.
            </Text>
          </View>
        }
      />
      <AppDate
        open={showDatePicker}
        date={selectedDate || new Date()}
        onConfirm={(date) => {
          setSelectedDate(date);
          setShowDatePicker(false);
        }}
        onCancel={() => setShowDatePicker(false)}
      />
    </SafeAreaView>
  );
}

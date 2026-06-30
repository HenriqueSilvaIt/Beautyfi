import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  addDays,
  format,
  startOfWeek,
} from "date-fns";
import { Alert, FlatList, Text, TouchableOpacity, View } from "react-native";

interface AppDaySelectorProps {
  selectedDay: Date | null;

  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  handleDateSelect: (date: Date) => void;
}

export function AppDaySelector({
  handleDateSelect,
  currentDate,
  selectedDay,
  setCurrentDate,
}: AppDaySelectorProps) {
  const { formatWeekDay, formatDay, formatMonth, formatYear } = useFormatDate();

  const localDate = format(new Date().toISOString(), "yyyy-MM-dd");

  // ➤ Avançar 1 semana (7 dias)
  const nextWeek = () => {
    setCurrentDate(addDays(currentDate, 7));
  };

  // ➤ Voltar 1 semana
  const prevWeek = () => {
    setCurrentDate(addDays(currentDate, -7));
  };

  function getWeekDays(date: Date) {
    const start = startOfWeek(date, { weekStartsOn: 1 }); // 1 = segunda
    return Array.from({ length: 7 }).map((_, i) => addDays(start, i));
  }

  const weekDays = getWeekDays(currentDate);

  return (
    <View className="">
      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity onPress={prevWeek}>
          <Ionicons name="chevron-back" size={24} color={colors.black} />
        </TouchableOpacity>

        <View className="flex-row gap-1">
          <Text className="text-font-primary text-lg font-bold">
            {formatMonth(currentDate)}
          </Text>
          <Text className="text-font-primary text-lg font-bold">
            {formatYear(currentDate)}
          </Text>
        </View>

        <TouchableOpacity onPress={nextWeek}>
          <Ionicons name="chevron-forward" size={24} color={colors.black} />
        </TouchableOpacity>
      </View>
      <View className="items-center justify-center">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={weekDays}
          keyExtractor={(item) => item.toISOString()}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 2,
            flexGrow: 1,
          }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleDateSelect(item)}
              className="mx-1 items-center"
            >
              <View className="items-center">
                <Text className="text-gray-600 text-sm text-center w-full">
                  {formatWeekDay(item)}
                </Text>

                <Text
                  className={` mt-1 text-lg font-bold text-font-primary rounded-full h-[34px] w-[34px] text-center leading-[34px]
            ${selectedDay?.toDateString() === item.toDateString() && "text-font-secundary bg-app-theme-primary"}
            ${item.toDateString() === localDate && "text-app-theme-primary"}`}
                >
                  {formatDay(item)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

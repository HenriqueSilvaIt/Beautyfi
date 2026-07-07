import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { AppDate } from "../AppDate";

interface AppDateSelectorProps {
  selectedDay: Date;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
  formatDateToBR: (date: Date) => string;
  setDate: (date: Date) => void;
}

export function AppDateSelector({
  selectedDay,
  showDatePicker,
  setShowDatePicker,
  formatDateToBR,
  setDate,
}: AppDateSelectorProps) {
  return (
    <>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.8}
      >
        <View className=" rounded-md flex-row gap-2 p-2">
          <Ionicons name="calendar-outline" size={24} color={colors.white} />
          {selectedDay && (
            <Text className="text-font-primary font-semibold text-base">
              {formatDateToBR(selectedDay)}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {showDatePicker && (
        <AppDate
          open={showDatePicker}
          date={selectedDay || new Date()}
          onConfirm={(date) => {
            setDate(date);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      )}
    </>
  );
}

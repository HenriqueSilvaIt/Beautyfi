import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { AppTime } from "../AppTime";

interface AppTimeSelectorProps {
  showTimePicker: boolean;
  setShowTimePicker: (value: boolean) => void;
  timeStringToDate: (time: string | null) => Date;
  dateToTimeString: (date: Date) => string;
  time: string | null;
  setTime: (time: string) => void;
}
export function AppTimeSelector({
  showTimePicker,
  setShowTimePicker,
  time,
  setTime,
  timeStringToDate,
  dateToTimeString,
}: AppTimeSelectorProps) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setShowTimePicker(true)}
      >
        <View className=" rounded-md flex-row p-2 gap-2">
          <Ionicons name="time-outline" size={28} color={colors.white} />
          <Text
            className={`text-font-primary font-semibold text-base
                    ${time && `text-base`}`}
          >
            {time ?? "Selecione um horário"}
          </Text>
        </View>
      </TouchableOpacity>
      {showTimePicker && (
        <AppTime
          open={showTimePicker}
          date={timeStringToDate(time)}
          onConfirm={(date) => {
            setTime(dateToTimeString(date));
            setShowTimePicker(false);
          }}
          onCancel={() => setShowTimePicker(false)}
        />
      )}
    </>
  );
}

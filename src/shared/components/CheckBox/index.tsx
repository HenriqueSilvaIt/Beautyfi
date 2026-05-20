import { View, Text, TouchableOpacity } from "react-native";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { EDayWeek, DAYS_WEEK } from "@/shared/interfaces/http/employee";
interface Props {
  control: Control<any>;
  name: string;
}

export function WorkDaysCheck({ control, name }: Props) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value = [], onChange } }) => {
        const days = value as EDayWeek[];

        return (
          <View>
            {DAYS_WEEK.map((day) => {
              const checked = days.includes(day);

              return (
                <TouchableOpacity
            
                  key={day}
                  onPress={() => {
                    if (checked)
                      onChange(days.filter((d) => d !== day));
                    else onChange([...days, day]);
                  }}
                >
                  <Text>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );
      }}
    />
  );
}
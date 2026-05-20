import React, { useState } from "react";
import { Text, View } from "react-native";
import { Controller, Control, Path, FieldValues } from "react-hook-form";

interface TimeInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
}

export function TimeInput<T extends FieldValues>({
  control,
  name,
  label,
}: TimeInputProps<T>) {
  const [visible, setVisible] = useState(false);

  const openPicker = () => setVisible(true);
  const closePicker = () => setVisible(false);
/*
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View className="mb-4  w-full px-11 rounded-xl justify-center gap-5">
          {/* Custom Label *          <View className="">
            <Text className="text-base text-center text-font-primary font-semibold">{label}</Text>
          </View>

          <TextInput
            value={value}
            placeholder="hh:mm"
            onFocus={openPicker}
            mode="flat"
            showSoftInputOnFocus={false}
            style={{
              textAlign: "center", // Centraliza o texto dentro do input
              textAlignVertical: "center", // Centraliza o texto verticalmente
            }}
          />

          <TimePickerModal
            visible={visible}
            onDismiss={closePicker}
            onConfirm={({ hours, minutes }) => {
              const formatted = `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")}`;
              onChange(formatted);
              closePicker();
            }}
            hours={value ? Number(value.split(":")[0]) : 0}
            minutes={value ? Number(value.split(":")[1]) : 0}
            label={label}
            use24HourClock
          />
        </View>
      )}
    />
  ); */
}

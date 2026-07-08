import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export function AppSearchBar({ value, onChangeText, placeholder }: Props) {
  return (
    <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-3 py-2.5 shadow-sm">
      <Ionicons name="search-outline" size={20} color="#9ca3af" style={{ marginRight: 8 }} />
      <TextInput
        placeholder={placeholder || "Buscar..."}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        className="flex-1 text-gray-800 text-sm p-0 h-5"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} activeOpacity={0.7}>
          <Ionicons name="close-circle" size={18} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
}

import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useState } from "react";

interface AppQuantityControl {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  price: number;
}

export function AppQuantityControl({
  quantity,
  setQuantity,
  price,
}: AppQuantityControl) {
function increase() {
  setQuantity(prev => prev + 1);
}

function decrease() {
  setQuantity(prev => Math.max(1, prev - 1));
}
  return (
    <View className="flex-row items-center gap-3">
      {/* Botão diminuir */}
      <TouchableOpacity
        onPress={decrease}
        className="w-8 h-8 rounded-md bg-gray-700 items-center justify-center"
      >
        <Feather name="minus" size={18} color={colors.white} />
      </TouchableOpacity>

      {/* Quantidade */}
      <Text className="text-font-primary text-lg font-bold">{quantity}</Text>

      {/* Botão aumentar */}
      <TouchableOpacity
        onPress={increase}
        className="w-8 h-8 rounded-md bg-orange-500 items-center justify-center"
      >
        <Feather name="plus" size={18} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
}

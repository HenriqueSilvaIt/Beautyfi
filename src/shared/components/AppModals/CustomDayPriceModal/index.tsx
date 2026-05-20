import { EmployeeServicesFormData } from "@/viewModel/Admin/Employees/EmployeeServices/employeeServices.scheme";
import { Control, FieldArrayWithId, useFieldArray } from "react-hook-form";
import { ActivityIndicator, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { AppInputController } from "../../AppInputControler";
import { colors } from "@/styles/colors";

export interface CustomDayPriceModalProps {
  title?: string;
  mainTitle?: string
  subtitle?: string;
  isLoading?: boolean;
  control: Control<EmployeeServicesFormData>;
  buttonLeftTitle: string;
  buttonLeftAction?: () => void;
  buttonRightTitle: string;
  buttonRightAction?: () => Promise<void>;
}
export const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];


export function CustomDayPriceModal({
  title,
  subtitle,
  isLoading,
  control,
  buttonRightAction,
  buttonRightTitle,
  buttonLeftTitle,
  buttonLeftAction,
  mainTitle
}: CustomDayPriceModalProps) {

const { fields } = useFieldArray({
  control,
  name: "dayPrices",
});

  return (
    <View className="items-center bg-background-quartenary w-[85%] mx-auto max-w-sm p-6 rounded-xl">
     {title && (<Text className="text-app-theme-primary text-xl font-bold mb-1">{title}</Text> )} 
      <Text className="text-font-primary text-sm mb-1">Coloque valores diferentes por dia</Text>
      <Text className="text-app-theme-primary text-sm mb-3">{subtitle}</Text>

      <ScrollView className="w-full" style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
        {fields.map((field, index) => (
          <View key={field.id} className="mb-3">
            <Text className="text-font-primary font-semibold mb-1">{field.dayWeek}</Text>
            <View className="flex-row gap-2">
              <View className="flex-1">
                <AppInputController
                  control={control}
                  name={`dayPrices.${index}.customPrice`}
                  label="Preço"
                  placeholder="R$ 0,00"
                  placeholderTextColor={colors.gray[600]}
                />
              </View>
              <View className="flex-1">
                <AppInputController
                  control={control}
                  name={`dayPrices.${index}.customCommission`}
                  label="Comissão %"
                  placeholder="0%"
                  placeholderTextColor={colors.gray[600]}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View className="gap-2 w-full mt-3">
        <TouchableOpacity
          onPress={buttonLeftAction}
          activeOpacity={0.8}
          className="h-[40px] w-full bg-background-tertiary rounded-md items-center justify-center"
        >
          <Text className="text-center text-base text-font-primary font-bold">
            {buttonLeftTitle}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={buttonRightAction}
          activeOpacity={0.8}
          className="h-[40px] w-full bg-app-theme-primary rounded-md items-center justify-center"
        >
          <Text className="text-center text-base text-font-primary font-bold">
            {isLoading ? <ActivityIndicator color="white" /> : buttonRightTitle}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
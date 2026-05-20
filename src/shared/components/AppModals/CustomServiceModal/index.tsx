import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { AppInputController } from "../../AppInputControler";
import { colors } from "@/styles/colors";
import { Control } from "react-hook-form";
import { EmployeeServicesFormData } from "@/viewModel/Admin/Employees/EmployeeServices/employeeServices.scheme";

export interface CustomServiceModalProps {
  title: string;
  subtitle?: string;
  customPrice?: number;
  customDuration?: number;
  customCommission?: number;
  isLoading?: boolean;
  control: Control<EmployeeServicesFormData>;
  buttonLeftTitle: string;
  buttonLeftAction?: () => void;
  buttonRightTitle: string;
  buttonRightAction?: () => void;
}

export function CustomServiceModal({
  title,
  subtitle,
  isLoading,
  control,
  buttonRightAction,
  buttonRightTitle,
  buttonLeftTitle,
  buttonLeftAction,
}: CustomServiceModalProps) {
  return (
    <View className="items-center bg-background-quartenary max-h-[100%] w-[85%] mx-auto max-w-sm p-6">
      <View>
        <Text className="text-app-theme-primary text-xl">{title}</Text>
      </View>

      <Text
        className="text-font-primary text-sm"
        ellipsizeMode="tail"
        numberOfLines={2}
      >
        Coloque valores direntes para o profissional
      </Text>

      <Text
        className=" text-sm text-app-theme-primary"
        ellipsizeMode="tail"
        numberOfLines={2}
        
      >
        {subtitle}
      </Text>

      <View className="w-full">
        <AppInputController
          control={control}
          name="customCommission"
          label="Comissão (%)"
          placeholder="Ex: 20%"
          placeholderTextColor={colors.gray[600]}
        />
      </View>

      <View className="w-full">
        <AppInputController
          control={control}
          name="customPrice"
          label="Preço"
          placeholder="R$ 0,00"
          placeholderTextColor={colors.gray[600]}
        />
      </View>

      <View className="w-full">
        <AppInputController
          control={control}
          name="customDuration"
          label="Duração "
          placeholder="0"
          placeholderTextColor={colors.gray[600]}
        />
      </View>

      <View className="gap-2 w-full mt-2">
        <TouchableOpacity
          onPress={buttonLeftAction}
          activeOpacity={0.8}
          className={`h-[40px] w-full bg-app-theme-primary rounded-md items-center justify-center 
                      ${isLoading ? "justify-between" : ""}`}
        >
          <Text className="text-center text-xl text-font-primary font-bold">
            {isLoading ? <ActivityIndicator /> : buttonLeftTitle}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={buttonRightAction}
          activeOpacity={0.8}
          className={`h-[40px] w-full bg-app-theme-primary rounded-md items-center justify-center 
                      ${isLoading ? "justify-between" : ""}`}
        >
          <Text className="text-center text-xl text-font-primary font-bold">
            {isLoading ? <ActivityIndicator /> : buttonRightTitle}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

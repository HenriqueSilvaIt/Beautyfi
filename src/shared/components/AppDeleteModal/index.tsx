import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../styles/colors";
import { AppointmentProps } from "@/shared/interfaces/http/appointment";
import { hide } from "expo-splash-screen";
import { ReactNode } from "react";

interface Params {
  visible?: boolean;
  hideModal?: () => void;
  handleDeleteAppointment?: (data: AppointmentProps[]) => Promise<void>;
  handleDelete?: () => void;
  loading?: boolean;
  title: string;
  description: ReactNode;
  confirmationButtonText: string;
  cancelbuttonText?: string;
  confirmationButtonColor?: boolean;
  appointments?: AppointmentProps[];
}

export function DeleteModal({
  visible,
  hideModal,
  handleDeleteAppointment,
  handleDelete,
  loading,
  title,
  description,
  confirmationButtonText,
  cancelbuttonText,
  confirmationButtonColor,
  appointments,
}: Params) {
  return (
    <View className="flex-1 absolute">
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={hideModal}
      >
        <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
          <View className="flex-1 items-center justify-center bg-black/20">
            <View
              className=" flex-1 m-5 bg-background-secondary rounded-[16] p-8
                        items-center shadow-lg max-w-[90%] max-h-[40%] z-9"
            >
              <View
                className="w-full flex-row justify-between items-center
                                border-b boder-gray-300 pb-6"
              >
                <View className="flex-row gap-6 items-center">
                  <MaterialIcons
                    name="error-outline"
                    className="mr-4"
                    color={colors.gray[400]}
                    size={25}
                  />
                  <Text className="text-font-primary text-lg">{title}</Text>
                </View>
                <TouchableOpacity onPress={hideModal}>
                  <MaterialIcons
                    name="close"
                    color={colors.gray[400]}
                    size={25}
                  />
                </TouchableOpacity>
              </View>
              <View
                className="p-3 flex-1 border-b border-gray-300 
                            items-center justify-center"
              >
                <Text className="text-gray-500 text-center text-sm leading-8">
                  {description}
                </Text>
              </View>

              <View
                className="flex-row justify-end
                        gap-4 w-full p-6 pb-0 pr-0"
              >
                <TouchableOpacity
                  onPress={hideModal}
                  className="w-[100] bg-none
                            border-2 border-app-theme-primary items-center justify-center p-3 rounded-[6]"
                >
                  <Text className="text-app-theme-primary text-center">
                    {" "}
                    {cancelbuttonText ?? "Cancelar"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    if (handleDeleteAppointment && appointments) {
                      await handleDeleteAppointment(appointments);
                      hideModal?.();
                    } else if (handleDelete) {
                      await handleDelete();
                      hideModal?.();
                    }
                  }}
                  className={`w-[100] items-center justify-center p-3 rounded-md
    ${confirmationButtonColor ? "bg-app-theme-primary" : "bg-accent-red-background-primary"}`}
                >
                  <Text className="text-font-primary text-sm text-center">
                    {loading ? <ActivityIndicator /> : confirmationButtonText}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

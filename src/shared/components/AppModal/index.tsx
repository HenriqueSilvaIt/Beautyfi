import { Modal, Pressable, TouchableWithoutFeedback, View } from "react-native";
import { useModalStore } from "../../store/modal-store";

export function AppModal() {
  const { isOpen, config, content, close } = useModalStore();

  if (!isOpen || !content) {
    return null; /*Se não existir
        nada no iOpen ou content não vai renderizar nada */
  }

  return (
    <Modal
      visible={isOpen}
      animationType={config?.animationType}
      transparent={config?.transparent}
      statusBarTranslucent={config?.statusBarTranslucent}
      onRequestClose={close}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-6">
        {/* Clickable Backdrop Overlay */}
        <Pressable 
          style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} 
          onPress={close} 
        />
        
        {/* Modal Container */}
        <Pressable
          style={{ width: "100%", alignItems: "center" }}
          onPress={(e) => e.stopPropagation()}
        >
          {content}
        </Pressable>
      </View>
    </Modal>
  );
}

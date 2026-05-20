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
      <TouchableWithoutFeedback style={{ flex: 1 }} onPress={close}>
        <View
          className="flex-1 bg-black/80 justify-center items-center
            px-6 w-full max-h-[100%]"
        >
          <Pressable
            style={{ width: "100%", alignItems: "center" }}
            onPress={(e) => e.stopPropagation()}
          >
            {/*Esse touchable n tem nada no on press porque ele evita que quando
            clicarmos no contéudo do nosso modal ele n feche o nosso modal */}
            {content}
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

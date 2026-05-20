import AppDetails from "@/shared/components/AppDetails";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useUserViewModel } from "./useUser.viewModel";
import { UserFormData } from "./user.scheme";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { DeleteModal } from "@/shared/components/AppDeleteModal";

export function UserView({
  control,
  isLoading,
  onUserUpdate,
  handleDisableMyUser,
  handleSelectAvatar,
  visible,
  showModal,
  hideModal,
  userData,
  avatarFinal,
  displayAvatar
}: ReturnType<typeof useUserViewModel>) {

  return (
    <KeyboardContainer>
      <View className="px-2 flex-1">
        <AppDetails<UserFormData>
          control={control}
          isLoading={isLoading}
          userData={userData}
          imageSelect={handleSelectAvatar}
          onSubmit={onUserUpdate}
          avatarUri={avatarFinal}
          isEditMode={undefined}
          id={undefined}
          message="Salvar"
          titleMessage="Altere seus dados"
          fields={[
            {
              name: "firstName",
              label: "Nome",
              leftIcon: "person",
              placeholder: "Digite o nome",
            },
            {
              name: "birthDate",
              label: "Data de nascimento",
              leftIcon: "calendar-number",
              placeholder: "DD/MM/AAAA",
            },
            {
              name: "phone",
              label: "Telefone",
              leftIcon: "phone-portrait-outline",
              placeholder: "(DDD) 00000-0000",
            },
          ]}
          onDelete={undefined}
        />

        <TouchableOpacity
          className="items-center justify-center  rounded-md p-5 gap-2 mt-5"
          onPress={() => showModal()}
        >
          <Ionicons name="trash-outline" size={24} color={colors.danger} />
          <Text className="text-sm d rounded-sm p-2 text-font-primary">Excluir conta</Text>
        </TouchableOpacity>
      </View>

      <DeleteModal
        loading={isLoading}
        visible={visible}
        hideModal={hideModal}
        handleDelete={async () => {
          await handleDisableMyUser();
        }}
        description="Sua conta será desativada imediatamente e permanentemente excluída em até 30 dias."
        title="Deletar conta?"
        confirmationButtonText="Apagar"
      />
    </KeyboardContainer>
  );
}

import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useClientViewModel } from "./useClientViewModel";
import { View } from "react-native";
import AppDetails from "@/shared/components/AppDetails";
import { ClientFormData } from "./client.scheme";

export function ClientView({
  control,
  isLoading,
  onSubmit,
  isEditMode,
  clientContent,
  isUploadingAvatar,
  handleSelectAvatar,
  avatarUri,
  clientId,
  clientAllowWhatsAppNotification,
  setClientAllowWhatsAppNotification,
  handleToggleAllowWhatAppMessage,
  onClientDelete,
  clientLoyaltyPointsData,
}: ReturnType<typeof useClientViewModel>) {
  return (
    <>
      <KeyboardContainer>
        <View className="flex-1 bg-background-primary">
          <AppDetails<ClientFormData>
            control={control}
            isLoading={isLoading}
            onSubmit={onSubmit}
            isEditMode={isEditMode}
            dontShowImageSelect={false}
            id={clientId}
            isUploadingAvatar={isUploadingAvatar}
            imageSelect={handleSelectAvatar}
            avatarUri={avatarUri}
            clientContent={clientContent}
            onDelete={onClientDelete}
            title="cliente"
            clientAllowWhatsAppNotification={clientAllowWhatsAppNotification}
            setClientAllowWhatsAppNotification={setClientAllowWhatsAppNotification}
            handleToggleAllowWhatAppMessage={handleToggleAllowWhatAppMessage}
            clientLoyaltyPointsData={clientLoyaltyPointsData}
            fields={[
              {
                name: "name",
                label: "Nome do Cliente",
                leftIcon: "person",
                placeholder: "Digite o nome",
                type: "client",
              },
              {
                name: "email",
                label: "E-mail (opcional)",
                leftIcon: "mail-outline",
                placeholder: "mail@mail.com",
              },
              {
                name: "birthDate",
                label: "Data de nascimento",
                leftIcon: "calendar",
                placeholder: "DD/MM/AAAA",
                type: "date",
              },
              {
                name: "phone",
                label: "Telefone",
                leftIcon: "phone-portrait-outline",
                placeholder: "(DDD) 00000-0000",
              },
            ]}
          />
        </View>
      </KeyboardContainer>
    </>
  );
}

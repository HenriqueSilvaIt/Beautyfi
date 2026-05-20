import AppDetails from "@/shared/components/AppDetails";
import { View } from "react-native";
import { AdvertisementFormData } from "./advertisement.scheme";
import { useAdvertisementViewModel } from "./useAdvertisementViewModel";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";

export function AdvertisementView({
  control,
  isLoading,
  errors,
  onSubmit,
  isEditMode,
  handleSelectAvatar,
  advertisementContent,
  avatarUri,
  advertisementId,
  isUploadingAvatar,
  onAdvertisementDelete,
}: ReturnType<typeof useAdvertisementViewModel>) {
  return (
    <KeyboardContainer>
      <View className="flex-1 bg-background-primary">
        <AppDetails<AdvertisementFormData>
          control={control}
          isLoading={isLoading}
          onSubmit={onSubmit}
          isEditMode={isEditMode}
          advertisementContent={advertisementContent}
          imageSelect={handleSelectAvatar}
          dontShowImageSelect={false}
          isUploadingAvatar={isUploadingAvatar}
          avatarUri={avatarUri}
          id={advertisementId}
          title="Divulgação"
          fields={[
            {
              name: "title",
              label: "Título",
              leftIcon: "storefront-outline",
              placeholder: "Digite o nome",
            },
            {
              name: "description",
              label: "Descrição",
              leftIcon: "reader",
              placeholder: "Descrição",
            },
            {
              name: "url",
              label: "URL (opcional)",
              leftIcon: "logo-web-component",
              placeholder: "https://..",
            },
          ]}
          onDelete={onAdvertisementDelete}
        />
      </View>
    </KeyboardContainer>
  );
}

import { View } from "react-native";
import { useServiceViewModel } from "./userServiceViewModel";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import AppDetails from "@/shared/components/AppDetails";
import { ServiceFormData } from "./service.scheme";

export function ServiceView({
  control,
  onSubmit,
  isEditMode,
  serviceContent,
  serviceId,
  handleSelectAvatar,
  isUploadingAvatar,
  avatarUri,
  availableInApp,
  setAvailableInApp,
  isLoading,
  onServiceDelete,
  serviceRefetch,
  handleToggleAvailableInApp,
}: ReturnType<typeof useServiceViewModel>) {
  return (
    <>
      <KeyboardContainer>
        <View className="flex-1 bg-background-primary">
          <AppDetails<ServiceFormData>
            control={control}
            isLoading={isLoading}
            onSubmit={onSubmit}
            serviceContent={serviceContent}
            imageSelect={handleSelectAvatar}
            isUploadingAvatar={isUploadingAvatar}
            avatarUri={avatarUri}
            isEditMode={isEditMode}
            id={serviceId}
            dontShowImageSelect={false}
            title="serviço"
            setAvailableInApp={setAvailableInApp}
            availableInApp={availableInApp}
            handleToggleAvailableInApp={handleToggleAvailableInApp}
            fields={[
              {
                name: "name",
                label: "Nome do Serviço",
                leftIcon: "person",
                placeholder: "Digite o nome",
              },
              {
                name: "description",
                label: "Descrição",
                leftIcon: "reader",
                placeholder: "Descrição",
              },
              {
                name: "duration",
                label: "Duração (min)",
                leftIcon: "time",
                placeholder: "0",
                type: "service",
              },

              {
                name: "price",
                label: "Preço",
                leftIcon: "cash",
                placeholder: "R$ 0,00",
              },

              {
                name: "priceDescription",
                label: "Descrição do preço (opcional)",
                leftIcon: "cash",
                placeholder: "Terça a Quinta é R$ 0,00",
                multiline: true,
                numberOfLines: 4,
              },
              {
                name: "commissionServiceFee",
                label: "% Comissão",
                leftIcon: "cash",
                placeholder: "0,00",
              },
            ]}
            onDelete={onServiceDelete}
          />
        </View>
      </KeyboardContainer>
    </>
  );
}

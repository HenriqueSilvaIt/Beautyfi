import AppDetails from "@/shared/components/AppDetails";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { View } from "react-native";
import { useEmployeeViewModel } from "./useEmployeeeViewModel";
import { EmployeeFormData } from "./employee.scheme";

export function EmployeeView({
  control,
  isLoading,
  isEditMode,
  onSubmit,
  avatarUri,
  employeeContent,
  handleSelectAvatar,
  isUploadingAvatar,
  employeeDataPagged,
  employeeRefetch,
  employeeId,
  onEmployeeDelete,
}: ReturnType<typeof useEmployeeViewModel>) {
  return (
    <>
      <KeyboardContainer>
        <View className="flex-1 bg-background-primary">
          <AppDetails<EmployeeFormData>
            control={control!}
            isLoading={isLoading}
            onSubmit={onSubmit || (async () => {})}
            isEditMode={isEditMode}
            id={employeeId}
            imageSelect={handleSelectAvatar}
            employeeContent={employeeContent}
            isUploadingAvatar={isUploadingAvatar}
            avatarUri={avatarUri}
            dontShowImageSelect={false}
            onDelete={onEmployeeDelete}
            title="profissional"
            fields={[
              {
                name: "name",
                label: "Nome do Profissional",
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
                name: "phone",
                label: "Telefone",
                leftIcon: "phone-portrait-outline",
                placeholder: "(DDD) 00000-0000",
              },
              {
                name: "email",
                leftIcon: "mail-outline",
                label: "E-mail",
                placeholder: "mail@exemple.com.br",
                type: "employee",
              },
              {
                leftIcon: "lock-closed-outline",
                label: "Senha",
                name: "password",
                placeholder: "Sua senha (opcional)",
              },
            ]}
          />
        </View>
      </KeyboardContainer>
    </>
  );
}

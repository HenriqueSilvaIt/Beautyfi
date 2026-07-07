import { View } from "react-native";
import { usePackageViewModel } from "./usePackageViewModel";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import AppDetails from "@/shared/components/AppDetails";
import { PackageFormData } from "./package.scheme";

export function PackageView({
  control,
  onSubmit,
  isEditMode,
  packageId,
  isLoading,
  onPackageDelete,
}: ReturnType<typeof usePackageViewModel>) {
  return (
    <KeyboardContainer>
      <View className="flex-1 bg-background-primary">
        <AppDetails<PackageFormData>
          control={control}
          isLoading={isLoading}
          onSubmit={onSubmit}
          isEditMode={isEditMode}
          id={packageId}
          dontShowImageSelect={true}
          title="pacote"
          fields={[
            {
              name: "name",
              label: "Nome do Pacote",
              leftIcon: "cube",
              placeholder: "Ex: Combo Cabelo & Barba",
            },
            {
              name: "description",
              label: "Descrição",
              leftIcon: "reader",
              placeholder: "Descreva o que está incluso no pacote",
            },
            {
              name: "price",
              label: "Preço",
              leftIcon: "cash",
              placeholder: "R$ 0,00",
            },
            {
              name: "duration",
              label: "Duração Média (min)",
              leftIcon: "time",
              placeholder: "60",
            },
            {
              name: "servicesIncluded",
              label: "Serviços Inclusos (Vírgula)",
              leftIcon: "checkbox",
              placeholder: "Corte, Barba, Sobrancelha",
            },
          ]}
          onDelete={onPackageDelete}
        />
      </View>
    </KeyboardContainer>
  );
}

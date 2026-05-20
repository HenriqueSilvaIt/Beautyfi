import AppDetails from "@/shared/components/AppDetails";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { View } from "react-native";
import { ProductFormData } from "./product.scheme";
import { useProductViewModel } from "./useProductViewModel";

export function ProductView({
  control,
  onSubmit,
  productId,
  isLoading,
  onProductDelete,
  handleSelectAvatar,
  avatarUri,
  productContent,
  isUploadingAvatar,
  productRefetch,
  isProductRefetching,
  productError,
  isProductLoading,
  isEditMode,
  isRefreshing,
  availableInApp,
  handleToggleAvailableInApp,
  setAvailableInApp,
}: ReturnType<typeof useProductViewModel>) {
  return (
    <>
      <KeyboardContainer>
        <View className="flex-1 bg-background-primary">
          <AppDetails<ProductFormData>
            control={control}
            setAvailableInApp={setAvailableInApp}
            availableInApp={availableInApp}
            handleToggleAvailableInApp={handleToggleAvailableInApp}
            isLoading={isLoading}
            onSubmit={onSubmit}
            isEditMode={isEditMode}
            productContent={productContent}
            imageSelect={handleSelectAvatar}
            isUploadingAvatar={isUploadingAvatar}
            avatarUri={avatarUri}
            dontShowImageSelect={false}
            id={productId}
            title="produto"
            fields={[
              {
                name: "name",
                label: "Nome do Produto",
                leftIcon: "storefront-outline",
                placeholder: "Digite o nome",
                type: "product"
              },
              {
                name: "description",
                label: "Descrição",
                leftIcon: "reader",
                placeholder: "Descrição",
              },
              {
                name: "quantity",
                label: "Quantidade",
                leftIcon: "calculator",
                placeholder: "Digite a quantidade de produtos",
              },
              {
                name: "price",
                label: "Preço",
                leftIcon: "cash",
                placeholder: "R$ 0,00",
              },
              {
                name: "commission",
                label: "Comissão (%)",
                leftIcon: "cash",
                placeholder: "0,00",
              },
              {
                name: "barCode",
                label: "Código de barras",
                leftIcon: "barcode-outline",
                placeholder: "184939223423",
              },
            ]}
            onDelete={onProductDelete}
          />
        </View>
      </KeyboardContainer>
    </>
  );
}

import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { ProductInterface } from "@/shared/interfaces/http/product";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useEffect, useRef, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { ProductFormData, productSchema } from "./product.scheme";
import {
  productKeys,
  useProductMutation,
} from "@/shared/queries/company/use-product.mutation";
import { router, useFocusEffect } from "expo-router";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useUploadAvatarGenericMutation } from "@/shared/queries/company/use-uploadAvatar.mutation";
import { CameraType } from "expo-image-picker";
import { useImage } from "@/shared/hooks/useImage";
import { parseMoney, parseQuantity } from "@/utils/moneyMapper";
import { queryClient } from "../../../../queryClient";
import { InfiniteData } from "@tanstack/react-query";
import { COMPANY_ID } from "@env";

export function useProductViewModel(productId: number | undefined) {
  console.log("🔎 ID recebido no hook:", productId);

  const productIdNumber = productId ? Number(productId) : undefined;
  const isEditMode = productIdNumber != null && !isNaN(productIdNumber);
  const { handleError } = useErrorHandler();

  const [isLoading, setIsLoading] = useState(false);
  const { notify } = useSnackbarContext();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estado para armazenar o caminho da imagem que selecionaros ou tirarmos foto
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [availableInApp, setAvailableInApp] = useState(false);
  const [priceStartingFrom, setPriceStartingFrom] = useState(false);

  // Search states for debounce
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const uploadProductAvatarMutation =
    useUploadAvatarGenericMutation<ProductInterface>();

  const {
    productUpdateMutation,
    useGetProductsMutation,
    useGetProductById,
    productPostMutation,
    productDeleteByIdMutation,
  } = useProductMutation();

  const COMPANY_ID_NUMBER = Number(COMPANY_ID)
    ? Number(COMPANY_ID)
    : (Number(process.env.EXPO_PUBLIC_COMPANY_ID) ?? 0);
  const { data: productContent } = useGetProductById(productIdNumber ?? 0);
  const {
    data: productData,
    error: productError,
    refetch: productRefetch,
    isRefetching: isProductRefetching,
    isLoading: isProductLoading,
    fetchNextPage: productFechNextPage,
    hasNextPage: productHasNextPage,
    isFetchingNextPage: productIsFetchingNextPage,
  } = useGetProductsMutation(undefined, debouncedSearch);

  const productDataPagged =
    productData?.pages.flatMap((pages) => pages.content ?? [])?? [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    // Cast the RESULT of yupResolver to the expected RHF Resolver type
    resolver: yupResolver(
      productSchema,
    ) as unknown as Resolver<ProductFormData>,
    defaultValues: {},
  });


   const hasUserToggled = useRef(false);
   const hasUserToggledStartingFrom = useRef(false);
  
    function handleToggleAvailableInApp() {
      hasUserToggled.current = true;
      setAvailableInApp((prev) => !prev);
    }

    function handleTogglePriceStartingFrom() {
      hasUserToggledStartingFrom.current = true;
      setPriceStartingFrom((prev) => !prev);
    }

  // Função para atualizar os dados
  const onProductUpdate = handleSubmit(async (productData) => {
    try {
      setIsLoading(true);
      if (!productId) return;

      const updatePayload: ProductInterface = {
        name: productData.name,
        description: productData.description,
        quantity: parseQuantity(productData.quantity ?? ""),
        imgUrl: productData.imgUrl,
        barCode: productData.barCode,
        availableInApp: availableInApp,
        priceStartingFrom: priceStartingFrom,
        commission: parseMoney(productData.commission ?? ""),
        price: parseMoney(productData.price ?? ""),
        companyId: COMPANY_ID_NUMBER,
      };

      const response = await productUpdateMutation.mutateAsync({
        productId,
        dataBody: updatePayload, // ✅ agora é ProductInterface
      });

      // extrai o item atualizado do response
      const updatedItem: ProductInterface = response;

      notify({ message: "Produto atualizado com sucesso!", type: "SUCCESS" });

      queryClient.setQueryData(
        ["products"],
        (oldData?: InfiniteData<{ content: ProductInterface[] }>) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              content: page.content.map((item) =>
                item.id === updatedItem.id ? updatedItem : item,
              ),
            })),
          };
        },
      );
      router.back();
    } catch (error) {
      handleError(error, "Falha ao atualizar produto");
    } finally {
      setIsLoading(false);
    }
  });

  // Função para Buscar produto

  // Hook global para seleção de imagem (camera ou galeria)

  const { handleSelectImage } = useImage({
    callback: async (uri) => {
      console.log("📸 Nova URI selecionada:", uri);

      // Atualiza estado
      setAvatarUri(uri);
    },
    cameraType: CameraType.front,
  });

  async function handleSelectAvatar() {
    await handleSelectImage();
  }

  // Função para criar serviço
  const onSubmit = handleSubmit(async (productData) => {
    try {
      console.log("CHAMOU");
      setIsLoading(true);

      let finalProduct = productId;

      if (isEditMode && productIdNumber) {
        const updatePayload: ProductInterface = {
          name: productData.name,
          description: productData.description,
          quantity: parseQuantity(productData.quantity ?? ""),
          imgUrl: productData.imgUrl,
          availableInApp: availableInApp,
          priceStartingFrom: priceStartingFrom,
          barCode: productData.barCode,
          commission: parseMoney(productData.commission ?? ""),
          price: parseMoney(productData.price ?? ""),
          companyId: COMPANY_ID_NUMBER,
        };
        console.log("Update" + JSON.stringify(updatePayload));

        const productUpdateResponse = await productUpdateMutation.mutateAsync({
          productId: productIdNumber,
          dataBody: updatePayload,
        });
        finalProduct = productUpdateResponse.id;
        console.log("product update"  + JSON.stringify(productUpdateResponse))
      } else {
        // 🔥 blindagem total
        const createPayload: ProductInterface = {
          name: productData.name,
          description: productData.description,
          quantity: parseQuantity(productData.quantity ?? ""),
          imgUrl: productData.imgUrl,
          barCode: productData.barCode,
          commission: parseMoney(productData.commission) ?? 0,
          availableInApp: availableInApp,
          priceStartingFrom: priceStartingFrom,
          price: parseMoney(productData.price),
          companyId: COMPANY_ID_NUMBER,
        };

        console.log("CREATE PAYLOAD:", createPayload);

        const productCreateResponse =
          await productPostMutation.mutateAsync(createPayload);
        finalProduct = productCreateResponse?.id;
      }

      //  Se trocou a imagem, faz upload agora
      if (avatarUri && finalProduct) {
        setIsUploadingAvatar(true);

        const avatarResponse = await uploadProductAvatarMutation.mutateAsync({
          segment: "products",
          avatarUri: avatarUri,
          id: finalProduct,
        });

        console.log("Product image" + avatarResponse);

        // sincroniza estado local

        setIsUploadingAvatar(false);
      }
      notify({
        message: isEditMode
          ? "Produto atualizado com sucesso!"
          : "Produto criado com sucesso!",
        type: "SUCCESS",
      });

      await productRefetch();
      router.back();
    } catch (error) {
      handleError(error, "Falha ao criar ou atualizar produto");
    } finally {
      setIsLoading(false);
    }
  });

  // Função para deletar serviço

  async function onProductDelete(productId: number) {
    try {
      setIsLoading(true);
      if (productId) {
        await productDeleteByIdMutation.mutateAsync(productId);

        notify({
          message: "Produto deletado com sucesso",
          type: "SUCCESS",
        });

        router.back();
      } else {
        notify({
          message: "Falha ao deletar produto",
          type: "ERROR",
        });
        console.log(`Produto não existe`);
      }
      await productRefetch();
    } catch (error) {
      handleError(error, "Falha ao deletar produto");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isEditMode || !productContent) return;

    reset({
      name: productContent.name,
      description: productContent.description,
      quantity: String(productContent.quantity),
      barCode: productContent.barCode,
      imgUrl: avatarUri ?? productContent.imgUrl,
      commission: String(productContent.commission),
      price: String(productContent.price),
    });

      //  só aplica o valor do servidor se o usuário não tocou ainda

     if (!hasUserToggled.current) {
       setAvailableInApp(Boolean(productContent.availableInApp));
     }
     if (!hasUserToggledStartingFrom.current) {
       setPriceStartingFrom(Boolean(productContent.priceStartingFrom));
     }
  }, [productContent]);

  useEffect(() => {
    if (isEditMode) return;

    reset({
      name: "",
      description: "",
      quantity: "",
      imgUrl: "",
      barCode: "",
      commission: "",
      price: "",
    });
  }, [isEditMode]);

  return {
    control,
    onProductUpdate,
    onSubmit,
    onProductDelete,
    productError,
    isRefreshing,
    productData,
    isEditMode,
    reset,
    productContent,
    handleSelectAvatar,
    isUploadingAvatar,
    avatarUri,
    productId,
    isLoading,
    productRefetch,
    isProductRefetching,
    isProductLoading,
    productFechNextPage,
    productHasNextPage,
    productIsFetchingNextPage,
    productDataPagged,
    availableInApp,
    handleToggleAvailableInApp,
    setAvailableInApp,
    priceStartingFrom,
    handleTogglePriceStartingFrom,
    setPriceStartingFrom,
    searchValue,
    setSearchValue,
  };
}

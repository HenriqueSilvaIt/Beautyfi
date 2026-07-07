import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  deleteProductById,
  getProductById,
  getProducts,
  postProducts,
  updateProducts,
} from "@/shared/services/product.service";
import { ProductInterface } from "@/shared/interfaces/http/product";
import { queryClient } from "../../../../queryClient";

interface UpdateProductVariables {
  productId: number;
  dataBody: ProductInterface;
}

export const productKeys = {
  detail: (id: number) => ["product", id] as const,
};
export function useProductMutation() {
  function useGetProductById(id: number) {
    return useQuery<ProductInterface>({
      queryKey: productKeys.detail(id),
      queryFn: () => {
        if (!id) throw new Error("Id is required");
        return getProductById(id);
      },
      enabled: Number.isFinite(id) && id > 0,
      staleTime: 0, // 5 minutos em cache, evita refetch imediato
      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }

  function useGetProductsMutation(search: string = "") {
    return useInfiniteQuery({
      queryKey: ["products", search],
      queryFn: ({ pageParam = 0 }) => getProducts(pageParam, 10, search),
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        if (lastPage.last) return undefined;
        return lastPage.number + 1;
      },
      staleTime: 0, // ✅ sempre considera dado stale — notifica mudanças
      gcTime: 1000 * 60 * 5, // ✅ mantém no cache por 5 min sem refetch desnecessário      refetchOnWindowFocus: false, // não refaz consulta ao voltar para a tela
    });
  }

  const productUpdateMutation = useMutation({
    mutationFn: ({ productId, dataBody }: UpdateProductVariables) =>
      updateProducts(dataBody, productId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", response.id] });

      queryClient.invalidateQueries({
        queryKey: productKeys.detail(Number(response?.id)),
      });
    },

    onError: (error) => {
      console.error(error);
    },
  });

  const productPostMutation = useMutation({
    mutationFn: (data: ProductInterface) => postProducts(data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", response.id] });

      queryClient.invalidateQueries({
        queryKey: productKeys.detail(Number(response.id)), // ✅ invalida o detalhe específico
      });

      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const productDeleteByIdMutation = useMutation({
    mutationFn: (productId: number) => deleteProductById(productId),
    onSuccess: (_, productId) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({
        queryKey: productKeys.detail(productId), // ✅ limpa o cache do item deletado
      });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return {
    productPostMutation,
    useGetProductById,
    useGetProductsMutation,
    productDeleteByIdMutation,
    productUpdateMutation,
  };
}

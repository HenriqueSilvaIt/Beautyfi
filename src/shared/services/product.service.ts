import { styleAppApiClient } from "../api/styleAppBackend";
import { ProductHttpResponse, ProductInterface } from "../interfaces/http/product";
import { useCompanyStore } from "../store/company-store";
import { useUserStore } from "../store/user-store";

function getCompanyId() {
  const user = useUserStore.getState().user;
  if (user?.companyId) return user.companyId;
  return useCompanyStore.getState().selectedCompanyId || 0;
}

export async function getProducts(
    page: number = 0,
    size: number = 10,
    name?: string,
    companyId?: number,
) {
    const resolvedCompanyId = companyId || getCompanyId();
    const {data} = await styleAppApiClient.get<ProductHttpResponse>(`/products/${resolvedCompanyId}/company?sort=name,asc`,
        {params: {
            page,
            size,
            name
        }}
    );

    console.log(`data`)

    return data;
}


export async function getProductById(productId: number) {

    const {data} = await styleAppApiClient.get<ProductInterface>(`/products/${productId}`) 
        return data;
    

}


export async function postProducts (dataBody: ProductInterface) {


    const {data} = await styleAppApiClient.post<ProductInterface>("/products", dataBody) 
        return data;

}

export async function updateProducts(dataBody: ProductInterface, productId: number) {

  const { data } = await styleAppApiClient.put<ProductInterface>(`/products/${productId}`, dataBody);
  return data;
}

export async function deleteProductById (productId: number) {

    await styleAppApiClient.delete<ProductHttpResponse>(`/products/${productId}`) 
    

}


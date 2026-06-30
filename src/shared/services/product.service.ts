import { COMPANY_ID } from "@env";
import { styleAppApiClient } from "../api/styleAppBackend";
import { useCompanyStore } from "../store/company-store";
import { ProductHttpResponse, ProductInterface } from "../interfaces/http/product";

const COMPANY_ID_NUMBER = Number(COMPANY_ID)
  ? Number(COMPANY_ID)
  : (Number(process.env.EXPO_PUBLIC_COMPANY_ID) ?? 0);
export async function getProducts(
    page: number = 0,
    size: number = 10,
) {
  const companyId = useCompanyStore.getState().selectedCompanyId || COMPANY_ID_NUMBER;
  const {data} = await styleAppApiClient.get<ProductHttpResponse>(`/products/${companyId}/company?sort=name,asc`,
        {params: {
            page,
            size
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


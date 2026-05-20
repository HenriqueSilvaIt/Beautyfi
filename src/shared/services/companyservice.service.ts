import { AxiosRequestConfig } from "axios";
import { styleAppApiClient } from "../api/styleAppBackend";
import { CompanyServiceHttpResponse, CompanyServicesInterface, CreateServiceDTO } from "../interfaces/http/company-services";
import { useUserStore } from "../store/user-store";



export async function getServiceById(serviceId: number) {

    const {data} = await styleAppApiClient.get<CompanyServicesInterface>(`/services/${serviceId}`) 
        return data;
    

}


export async function getServices (
    page: number = 0,
    size: number = 10,
) {

    const {data} = await styleAppApiClient.get<CompanyServiceHttpResponse>("/services?sort=name,asc", 
         {
    params: {
      page,
      size
    }
  } ) 
        return data;
    

}


export async function getServicesByEmployeeId (employeeId?: number) {

    const {data} = await styleAppApiClient.get<CompanyServiceHttpResponse>(`/services/employee/${employeeId}`) 
        return data;
    

}


export async function postServices (dataBody: CreateServiceDTO) {


    const {data} = await styleAppApiClient.post<CompanyServicesInterface>("/services", dataBody) 
        return data;

}


export async function updateServices(dataBody: CompanyServicesInterface, serviceId?: number) {

  const { data } = await styleAppApiClient.put<CompanyServicesInterface>(`/services/${serviceId}`, dataBody);
  return data;
}

export async function deleteServiceById (serviceId: number) {

    await styleAppApiClient.delete<CompanyServiceHttpResponse>(`/services/${serviceId}`) 
    

}


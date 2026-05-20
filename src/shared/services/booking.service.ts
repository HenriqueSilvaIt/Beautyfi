import { AxiosRequestConfig } from "axios";
import { styleAppApiClient } from "../api/styleAppBackend";
import { AppointmentBlockHttpParams, AppointmentHttpParams, AppointmentProps } from "../interfaces/http/appointment";
import { useUserStore } from "../store/user-store";


export async function booking(dataBody: AppointmentHttpParams) {
 
      
    const {data} = await styleAppApiClient.post<AppointmentProps>("/appointments", dataBody);

    return {data};
}


export async function blockBookingAdmin(dataBody: AppointmentBlockHttpParams) {
 

    const {data} = await styleAppApiClient.post<AppointmentProps>("/appointments/admin", dataBody);

    return {data};
}

export async function bookingAdmin(dataBody: AppointmentHttpParams) {
 
      
    const {data} = await styleAppApiClient.post<AppointmentProps>("/appointments/admin", dataBody );

    return {data};
}
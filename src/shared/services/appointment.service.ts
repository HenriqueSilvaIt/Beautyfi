import { AxiosRequestConfig } from "axios";
import { styleAppApiClient } from "../api/styleAppBackend";
import {
  AppointmentHttpParams,
  AppointmentHttpResponse,
  AppointmentHttpStatusParams,
  AppointmentProps,
  AppointmentUpdateHttpParams,
} from "../interfaces/http/appointment";
import { useUserStore } from "../store/user-store";
import {
  AvailableAppointmentsHttpParams,
  AvailableAppointmentsHttpResponse,
} from "../interfaces/http/available-appointments";

export async function getAppointmentAdmin(
  date: string,
  employeeId?: number | null,
) {
  const { data } = await styleAppApiClient.get<AppointmentHttpResponse>(
    `/appointments/admin?dateBooking=${date}&employeeId=${employeeId}`,
    {
      params: {
        size: 100,
      },
    },
  );

  return data;
}

export async function getAppointments(page: number = 0, size: number = 10) {
  const { data } = await styleAppApiClient.get<AppointmentHttpResponse>(
    `/appointments`,
    {
      params: {
        page, // Passando o page aqui
        size, // Definindo o tamanho por página
      },
    },
  );

  return data;
}

export async function getAvailableAppointments(
  { employeeId, serviceIds, date }: AvailableAppointmentsHttpParams,
  page = 0,
  size = 10,
) {
  console.log("🌐 Request params:", { serviceIds, date, employeeId, page });

  const { data } =
    await styleAppApiClient.get<AvailableAppointmentsHttpResponse>(
      "/appointments/available",
      {
        params: {
          serviceIds: serviceIds?.join(","), // → "1,2,3"
          date,
          ...(employeeId != null ? { employeeId } : {}),
          page,
          size,
        },
      },
    );
  console.log(
    "🌐 Response:",
    data.content,
    "elementos",
    data.content?.length,
    "content",
  );

  return data;
}

export  async function getAppointmentById(id: number) {
  const { data }  = await styleAppApiClient.get<AppointmentProps>(
    `/appointments/${id}`,
  );    
  
  return data;
}


export async function udpdateAppointment(id: number, dataBody: AppointmentUpdateHttpParams) {
  const { data } = await styleAppApiClient.put<AppointmentProps>(
    `/appointments/${id}`,
    dataBody,
  );

  return data;
}

export async function cancelAppointmentById(id: number) {
  const { data } = await styleAppApiClient.patch<AppointmentHttpResponse>(
    `appointments/cancel/${id}`,
  );

  return { data };
}
export async function deleteAppointment(id: number) {
  const access_token = useUserStore.getState().access_token;

  if (!access_token) {
    throw new Error("Token de acesso não encontrado");
  }

  const config: AxiosRequestConfig = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  await styleAppApiClient.delete(`appointments/${id}`, config);
}

export async function getMonthlyAppointments(startDate: string, endDate: string) {
  const { data } = await styleAppApiClient.get("/appointments/reports/monthly", {
    params: { startDate, endDate }
  });
  return data;
}

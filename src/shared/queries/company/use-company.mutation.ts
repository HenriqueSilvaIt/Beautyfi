import { useMutation } from "@tanstack/react-query";
import {
  companyDetails,
  createCompany,
  getCompanyById,
  updateCompany,
  updateReminderConfig,
} from "../../services/company.service";
import { CompanyInterface } from "@/shared/interfaces/http/company";

export function useCompanyDetailsMutation() {
    
  const mutation = useMutation({
    mutationFn: () => companyDetails(),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });


  const getCompanyByIdMutation = useMutation( {
    mutationFn: (id: number) => getCompanyById(id),
    onSuccess: (response) => {
      console.log(response);
    }, 
    onError: (error) => {
      console.error(error);
    }

  })
  const mutationCreate = useMutation({
    mutationFn: (props: CompanyInterface) => createCompany(props),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (props: CompanyInterface) => updateCompany(props),
    onSuccess: (response) => {
      console.log(response);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const updateReminderConfigMutation = useMutation({
  mutationFn: (dto: { reminderEnabled?: boolean; reminderMinutesBefore?: number }) =>
    updateReminderConfig(dto),
});
  return {
    mutation,
    mutationUpdate,
    getCompanyByIdMutation,
    updateReminderConfigMutation,
    mutationCreate,
  };
}

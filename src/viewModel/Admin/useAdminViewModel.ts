import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { Resolver, useForm,  } from "react-hook-form";
import { CompanyFormData, companyScheme } from "./admin.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { CompanyProps } from "@/shared/interfaces/http/company";
import { useEffect, useState } from "react";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useMask } from "@/shared/hooks/useMask";

export function useAdminViewModel() {
  const {  mutation, mutationUpdate } = useCompanyDetailsMutation();

  const [companyDetails, setCompanyDetails] = useState<CompanyProps[]>([]);
  const {maskPhone} = useMask();

  const {handleError} = useErrorHandler();

const company = companyDetails[0];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CompanyFormData>({
    // Cast the RESULT of yupResolver to the expected RHF Resolver type
    resolver: yupResolver(
      companyScheme
    ) as unknown as Resolver<CompanyFormData>,
    defaultValues: { },
  });

  // Função para buscar detalhes da empresa

  async function getCompanyDetails() {
    try {
      const data = await mutation.mutateAsync();

      setCompanyDetails([data]);
    } catch (error) {
      handleError(error, "Falha ao buscar dados da empresa");
    }
  }


 
  
  // Atualiza formulário quando company chegar
  // Quando a empresa carregar → popula formulário
  useEffect(() => {
    if (company) {
      reset(company);
    }
  }, [company, reset]);

  useEffect(() => {
    getCompanyDetails()
  }, [])


    // Função para atualizar os dados da empresa

  const onUpdate = handleSubmit(async (userData) => {
    const mutationResponse = await mutationUpdate.mutateAsync(userData);

    console.log(mutationResponse);
  });


  return {
    control,
    onUpdate,
    errors,

  };
}

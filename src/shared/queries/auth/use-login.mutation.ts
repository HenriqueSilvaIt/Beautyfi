import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserStore } from "../../store/user-store";
import { LoginHttpParams } from "../../interfaces/http/login";
import { login, recoverPassword } from "../../services/auth.service";

export function useLoginMutation() {
  /*Persisti o dado do usuário no dispositivo*/
  const { setSession } = useUserStore();
const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userFormData: LoginHttpParams) => login(userFormData),

    onSuccess: async (response) => {
      // 1️⃣ salva token
      setSession(response);

      // 2️⃣ força buscar usuário logado
      await queryClient.invalidateQueries({
        queryKey: ["user-logged"],
      });
    },

    onError: (error: any) => {
      if (error.response) {
        console.log("Erro response:", error.response.data);
      } else if (error.request) {
        console.log("Erro request:", error.request);
      } else {
        console.log("Erro geral:", error.message);
      }
    },
  });
} 

export function useRecoverPasswordMutation() {
  
  return useMutation({
    mutationFn: (email: string) => recoverPassword(email),
    onSuccess: async (response) => {
      console.log(response);
    },
    onError: async (error) => {
      console.log(error);
    }
  })
}
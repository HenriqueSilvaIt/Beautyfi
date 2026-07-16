import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import {
  StripePlanDTO,
  StripePlanParam,
  SubscriptionStripeDTO,
} from "@/shared/interfaces/http/stripe";
import {
  useGetSubscriptionPlansQuery,
  useStripeMutation,
} from "@/shared/queries/stripe/use-stripe-mutataion";
import { useStripe } from "@stripe/stripe-react-native";
import { useCallback, useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { Alert } from "react-native";
import {
  SubscriptionAdminFormData,
  subscriptionAdminSchema,
} from "./subscription-admin-scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { set } from "date-fns";
import { router } from "expo-router";
import { moneyMapper, parseMoney, parseQuantity } from "@/utils/moneyMapper";
import { useUserStore } from "@/shared/store/user-store";

export function useSubscriptionAdminViewModel(stripePlanId?: number) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const isEditMode = Number.isFinite(stripePlanId);

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [priceId, setPriceId] = useState<string>();

  const user = useUserStore((state) => state.user);
  const companyId = user?.companyId;

  const { data, isLoading, error, refetch } = useGetSubscriptionPlansQuery(companyId ?? undefined);
  // Função para atualizar manualmente os dados
  // Função para refresh manual (pull-to-refresh)
  const onGetSubscriptions = async () => {
    await refetch();
  };
  const {
    createPlanMutation,
    getPlanByIdMutation,
    updatePlanMutation,
    deletePlanMutation,
    createCustomerMutation,
    createSubscritpionMutation,
    listSubscriptionsMutation,
    paymentIntentMutation,
    updateSubscriptionMutation,
    useGetPlanByIdQuery,
  } = useStripeMutation();
  const { data: stripePlan } = useGetPlanByIdQuery(stripePlanId);

  const { notify } = useSnackbarContext();
  const { handleError } = useErrorHandler();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubscriptionAdminFormData>({
    // Cast the RESULT of yupResolver to the expected RHF Resolver type
    resolver: yupResolver(
      subscriptionAdminSchema,
    ) as unknown as Resolver<SubscriptionAdminFormData>,
    defaultValues: {},
  });

  const onSubmit = handleSubmit(async (subscriptionData) => {
    try {
      setLoading(true);
      let finalStripePlanId = stripePlanId;
      if (isEditMode && stripePlanId) {
        const updateStripePlan: StripePlanParam = {
          name: subscriptionData.name,
          description: subscriptionData.description ?? "",
          amount: parseMoney(subscriptionData.amount ?? 0) ?? 0,
          commissionPercentage: parseMoney(subscriptionData.amount ?? 0),
          cutsAllowed: parseQuantity(subscriptionData.cutsAllowed),
        };
        const response = await updatePlanMutation.mutateAsync({
          id: Number(stripePlanId),
          dataBody: updateStripePlan,
        });
        finalStripePlanId = response.id;
        notify({ message: "Plano atualizado com sucesso!", type: "SUCCESS" });
      } else {
        const payload: StripePlanParam = {
          name: subscriptionData.name,
          description: subscriptionData.description ?? "",
          amount: parseMoney(subscriptionData.amount ?? 0) ?? 0,
          commissionPercentage: parseMoney(subscriptionData.amount ?? 0),
          cutsAllowed: parseQuantity(subscriptionData.cutsAllowed),
        };

        const response = await createPlanMutation.mutateAsync(payload);
        finalStripePlanId = response.id;
        notify({ message: "Plano criado com sucesso!", type: "SUCCESS" });
      }
      await refetch();
      router.back();
    } catch (error) {
      handleError(error, "Ocorreu um erro ao criar o plano.");
      throw error;
    } finally {
      setLoading(false);
    }
  });

  async function onDeletePlanById() {
    try {
      await deletePlanMutation.mutateAsync(Number(stripePlanId));
      notify({ message: "Plano deletado com sucesso!", type: "SUCCESS" });
      await refetch();
      router.back();
    } catch (error) {
      handleError(error, "Ocorreu um erro ao deletar o plano.");
      throw error;
    }
  }

  async function handleSubscribe(stripePriceId: string) {
    try {
      setLoading(true);

      // 1️⃣ Cria a assinatura no backend
      const response: SubscriptionStripeDTO =
        await createSubscritpionMutation.mutateAsync({
          priceId: stripePriceId,
        });

      if (!response.clientSecret) {
        throw new Error(
          "Não foi possível obter o client secret da assinatura.",
        );
      }

      // 2️⃣ Inicializa PaymentSheet
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: response.clientSecret,
        merchantDisplayName: "Dom Palagani",
        allowsDelayedPaymentMethods: true, // para métodos como boleto/pix ou cartões que autorizam depois
      });

      if (initError) throw new Error(initError.message);

      // 3️⃣ Abre PaymentSheet para o usuário
      const { error: paymentError } = await presentPaymentSheet();

      if (paymentError) throw new Error(paymentError.message);
      await refetch();

      Alert.alert("Sucesso", "Assinatura criada e pagamento concluído!");
    } catch (error: any) {
      console.error("Erro na assinatura:", error);
      Alert.alert("Erro", error.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!stripePlan) return;
    console.log("Stripe Plan carregado, populando formulário:", stripePlan);

    reset({
      cutsAllowed: String(stripePlan.cutsAllowed),
      amount: String(moneyMapper(stripePlan.amount)),
      name: stripePlan.name,
      commissionPercentage: stripePlan.commissionPercentage != null ? String(stripePlan.commissionPercentage)  : "",
      description: stripePlan.description,
    });
  }, [stripePlan]);

  useEffect(() => {
    if (isEditMode) return;

    reset({
      name: "",
      description: "",
      cutsAllowed: "",
      commissionPercentage: "",
      amount: "",
    });
  }, [isEditMode]);

  return {
    createPlanMutation,
    createCustomerMutation,
    createSubscritpionMutation,
    listSubscriptionsMutation,
    paymentIntentMutation,
    updateSubscriptionMutation,
    handleSubscribe,
    clientSecret,
    onSubmit,
    refetch,
    loading,
    onDeletePlanById,
    setPriceId,
    stripePlanId,
    priceId,
    data,
    onGetSubscriptions,
    stripePlan,
    isEditMode,
    control,
    isRefreshing: isLoading,
    error,
  };
}

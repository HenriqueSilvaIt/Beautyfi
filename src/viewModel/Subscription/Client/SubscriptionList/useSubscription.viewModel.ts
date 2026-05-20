import {
  StripePlanDTO,
  SubscriptionStripeDTO,
  UserSubscriptionDTO,
} from "@/shared/interfaces/http/stripe";
import {
  useGetSubscriptionPlansQuery,
  useStripeMutation,
} from "@/shared/queries/stripe/use-stripe-mutataion";
import { useStripe } from "@stripe/stripe-react-native";

import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

export function useSubscriptionlistViewModel() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [userSubscription, setUserSubscription] =
    useState<UserSubscriptionDTO>();
  const [priceId, setPriceId] = useState<string>();
  const {
    data: subscriptionPlans,
    isLoading: isSubscriptionPlansLoading,
    error: subscriptionPlansError,
    refetch: refetchSubscriptionPlans,
  } = useGetSubscriptionPlansQuery();
  // Função para atualizar manualmente os dados
  const onGetSubscriptions = async () => {
    await refetchMySubscription(); // atualiza os dados
  };

  function normalizePlans(plans?: StripePlanDTO[]) {
    if (!Array.isArray(plans)) return [];

    return plans.filter(
      (p) =>
        p &&
        typeof p.id !== "undefined" &&
        typeof p.priceId === "string" &&
        typeof p.amount === "number",
    );
  }
  const subscriptions = normalizePlans(subscriptionPlans);
  const {
    createPlanMutation,
    createCustomerMutation,
    createSubscritpionMutation,
    listSubscriptionsMutation,
    paymentIntentMutation,
    updateSubscriptionMutation,
    useGetMyPlanPlanMutation,
    cancelSubscriptionMutation,
    reactivateSubscriptionMutation,
    useGetMySubscriptionPlanQuery,
  } = useStripeMutation();

  const {
    data: mySubscription,
    isLoading: isMySubscriptionLoading,
    error: mySubscriptionError,
    refetch: refetchMySubscription,
  } = useGetMySubscriptionPlanQuery();

  const [isCanceling, setIsCanceling] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isReactivating, setIsReactivating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [isReactivatingModalVisible, setIsReactivatingModalVisible] =
    useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  function toggleUpdateModal() {
    setIsUpdateModalVisible(true);
  }

  function toggleCancelModal() {
    setIsCancelModalVisible(true);
  }

  function toggleReactivateModal() {
    setIsReactivatingModalVisible(true);
  }

  function toggleCreateModal() {
    setIsCreateModalVisible(true);
  }

  function toggleHideModal() {
    setIsCancelModalVisible(false);
    setIsReactivatingModalVisible(false);
    setIsUpdateModalVisible(false);
    setIsCreateModalVisible(false);
  }

  const isActive = subscriptionPlans?.find(
    (plan) => plan?.priceId && plan.priceId === mySubscription?.priceId,
  );

  const subscriptionStatus = mySubscription?.status;

  const cancelAtPeriodEnd = mySubscription?.cancelAtPeriodEnd;

  async function cancelSubscription() {
    try {
      setIsCanceling(true);

      if (!userSubscription) {
        throw new Error("Nenhuma assinatura ativa encontrada para cancelar.");
      }

      const response = await cancelSubscriptionMutation.mutateAsync(
        userSubscription.stripeSubscriptionId,
      );
      await refetchMySubscription(); // Atualiza os dados da assinatura após o cancelamento
      await onGetMySubscription();
      Alert.alert("Sucesso", "Assinatura cancelada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao cancelar assinatura:", error);

      Alert.alert(
        "Erro",
        error.message || "Ocorreu um erro inesperado ao cancelar a assinatura.",
      );
    } finally {
      setIsCanceling(false);
    }
  }

  async function reactSubscription() {
    try {
      setIsReactivating(true);

      if (!userSubscription) {
        throw new Error("Nenhuma assinatura ativa encontrada para cancelar.");
      }

      const response = await reactivateSubscriptionMutation.mutateAsync(
        userSubscription.stripeSubscriptionId,
      );
      await refetchMySubscription(); // Atualiza os dados da assinatura após o cancelamento
      await onGetMySubscription();
      Alert.alert("Sucesso", "Assinatura reativada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao reativar assinatura:", error);

      Alert.alert(
        "Erro",
        error.message || "Ocorreu um erro inesperado ao reativar a assinatura.",
      );
    } finally {
      setIsReactivating(false);
    }
  }

  async function updateSubscription(newPriceId: string) {
    try {
      setLoading(true);
      if (!userSubscription) {
        throw new Error("Nenhuma assinatura ativa encontrada para atualizar.");
      }
      const response = await updateSubscriptionMutation.mutateAsync({
        subscriptionId: userSubscription.stripeSubscriptionId,
        newPriceId: newPriceId,
      });
      await refetchMySubscription(); // Atualiza os dados da assinatura após a atualização
      await onGetMySubscription();
      Alert.alert("Sucesso", "Assinatura atualizada com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar assinatura:", error);
      Alert.alert(
        "Erro",
        error.message ||
          "Ocorreu um erro inesperado ao atualizar a assinatura.",
      );
    } finally {
      setLoading(false);
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

      if (paymentError) {
        if (paymentError.code === "Canceled") {
          Alert.alert("Aviso", "Pagamento cancelado");
        } else {
          Alert.alert("Erro", "Erro no pagamento");
        }
      } else {
        await refetchMySubscription(); // Atualiza os dados da assinatura após o cancelamento
        await onGetMySubscription();
        Alert.alert("Sucesso", "Assinatura criada e pagamento concluído!");
      }
    } catch (error: any) {
      console.error("Erro na assinatura:", error);
      Alert.alert("Erro", error.message || "Ocorreu um erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  async function onGetMySubscription() {
    try {
      setLoading(true);

      const data = await useGetMyPlanPlanMutation.mutateAsync();
      if (data) {
        setUserSubscription(data);
      }
      console.log("Dados da minha assinatura (mutation):", data);
    } catch (error) {
      console.error("Erro ao obter minha assinatura:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    onGetMySubscription();

    console.log(
      "useEffect executado: buscando minha assinatura..." +
        JSON.stringify(userSubscription),
    );
  }, []);

  return {
    createCustomerMutation,
    createSubscritpionMutation,
    listSubscriptionsMutation,
    paymentIntentMutation,
    updateSubscriptionMutation,
    handleSubscribe,
    clientSecret,
    refetchSubscriptionPlans,
    loading,
    setPriceId,
    priceId,
    data: subscriptionPlans,
    subscriptions,
    updateSubscription,
    cancelSubscription,
    onGetSubscriptions,
    isActive,
    isRefreshing: isSubscriptionPlansLoading,
    error: subscriptionPlansError,
    isLoading: isSubscriptionPlansLoading || isMySubscriptionLoading,
    cancelAtPeriodEnd,
    setIsCanceling,
    isCanceling,
    setIsUpdating,
    isUpdating,
    isCreating,
    setIsCreating,
    isReactivating,
    setIsReactivating,
    isCancelModalVisible,
    toggleCancelModal,
    isUpdateModalVisible,
    toggleUpdateModal,
    isCreateModalVisible,
    toggleCreateModal,
    toggleReactivateModal,
    reactSubscription,
    isReactivatingModalVisible,
    setIsReactivatingModalVisible,
    toggleHideModal,
    subscriptionStatus,
    mySubscription,
  };
}

import { useState, useMemo } from "react";
import { Linking } from "react-native";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import {
  useGetSubscriptionPlansQuery,
  useStripeMutation,
} from "@/shared/queries/stripe/use-stripe-mutataion";
import { ESubscriptionState, StripePlanDTO } from "@/shared/interfaces/http/stripe";

export function useCompanySubscriptionViewModel() {
  const { notify } = useSnackbarContext();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);

  const {
    useGetMySubscriptionPlanQuery,
    cancelSubscriptionMutation,
    reactivateSubscriptionMutation,
  } = useStripeMutation();

  const {
    data: mySubscription,
    isLoading: isLoadingMySubscription,
    isRefetching,
    refetch,
  } = useGetMySubscriptionPlanQuery();

  const {
    data: saasPlans,
    isLoading: isLoadingSaasPlans,
  } = useGetSubscriptionPlansQuery(undefined, true);

  // Formata data (aceita ISO string, timestamp em segundos ou ms)
  const formatPeriodDate = (dateValue?: string | number | null) => {
    if (!dateValue) return "";
    try {
      let d: Date;
      if (typeof dateValue === "number") {
        d = dateValue < 10000000000 ? new Date(dateValue * 1000) : new Date(dateValue);
      } else if (!isNaN(Number(dateValue)) && !dateValue.includes("-") && !dateValue.includes("/")) {
        const num = Number(dateValue);
        d = num < 10000000000 ? new Date(num * 1000) : new Date(num);
      } else {
        d = new Date(dateValue);
      }

      if (isNaN(d.getTime())) return String(dateValue);

      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return String(dateValue);
    }
  };

  const formatCurrency = (amount?: number | null) => {
    if (amount === undefined || amount === null) return "R$ 89,90";
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(amount);
  };

  // Encontra o plano SaaS correspondente pelo priceId
  const matchedPlan: StripePlanDTO | undefined = useMemo(() => {
    if (!saasPlans || !mySubscription) return undefined;
    return saasPlans.find(
      (p) =>
        (mySubscription.priceId && p.priceId === mySubscription.priceId) ||
        (mySubscription.priceId && p.productId === mySubscription.priceId)
    );
  }, [saasPlans, mySubscription]);

  const planName = matchedPlan?.name || "Beautyfi Pro";
  const planDescription =
    matchedPlan?.description || "Acesso completo à plataforma de gestão Beautyfi para seu estabelecimento.";
  const planPriceFormatted = matchedPlan?.amount
    ? formatCurrency(matchedPlan.amount)
    : "R$ 89,90";

  const periodStartFormatted = formatPeriodDate(mySubscription?.periodStart);
  const periodEndFormatted = formatPeriodDate(mySubscription?.periodEnd);

  // Status computation
  const rawStatus = mySubscription?.status;
  const isCancelScheduled =
    rawStatus === ESubscriptionState.CANCEL_SCHEDULED ||
    mySubscription?.cancelAtPeriodEnd === true;

  const isActive =
    !isCancelScheduled &&
    (rawStatus === ESubscriptionState.ACTIVE ||
      rawStatus === ESubscriptionState.RENOVATED ||
      (mySubscription && rawStatus !== ESubscriptionState.CANCELED && rawStatus !== ESubscriptionState.EXPIRED));

  const isCanceled =
    rawStatus === ESubscriptionState.CANCELED ||
    rawStatus === ESubscriptionState.EXPIRED ||
    rawStatus === ESubscriptionState.DEACTIVATED;

  const isPastDue = rawStatus === ESubscriptionState.PAST_DUE;
  const isTrial = rawStatus === ESubscriptionState.PENDING || (!mySubscription && !isLoadingMySubscription);

  // Ações de cancelamento e reativação
  const handleCancelSubscription = async () => {
    if (!mySubscription?.stripeSubscriptionId) {
      notify({
        message: "Identificador da assinatura não encontrado. Entre em contato com o suporte.",
        type: "ERROR",
      });
      return;
    }

    try {
      await cancelSubscriptionMutation.mutateAsync(mySubscription.stripeSubscriptionId);
      setShowCancelModal(false);
      await refetch();
      notify({
        message: "Assinatura cancelada com sucesso. Seu acesso continuará ativo até o fim do período já pago.",
        type: "SUCCESS",
        time: 5000,
      });
    } catch (error: any) {
      console.error("Erro ao cancelar assinatura:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Não foi possível processar o cancelamento da assinatura. Tente novamente ou fale com o suporte.";
      notify({
        message: errorMessage,
        type: "ERROR",
      });
    }
  };

  const handleReactivateSubscription = async () => {
    if (!mySubscription?.stripeSubscriptionId) {
      notify({
        message: "Identificador da assinatura não encontrado. Entre em contato com o suporte.",
        type: "ERROR",
      });
      return;
    }

    try {
      await reactivateSubscriptionMutation.mutateAsync(mySubscription.stripeSubscriptionId);
      setShowReactivateModal(false);
      await refetch();
      notify({
        message: "Assinatura reativada com sucesso! Seu plano continuará sendo renovado automaticamente.",
        type: "SUCCESS",
        time: 5000,
      });
    } catch (error: any) {
      console.error("Erro ao reativar assinatura:", error);
      const errorMessage =
        error?.response?.data?.message ||
        "Não foi possível reativar a assinatura. Tente novamente ou fale com o suporte.";
      notify({
        message: errorMessage,
        type: "ERROR",
      });
    }
  };

  const handleContactSupport = () => {
    const text = encodeURIComponent(
      `Olá, gostaria de tirar dúvidas sobre a assinatura do Beautyfi para o meu estabelecimento.`
    );
    Linking.openURL(`https://api.whatsapp.com/send?phone=5511999999999&text=${text}`);
  };

  return {
    mySubscription,
    matchedPlan,
    planName,
    planDescription,
    planPriceFormatted,
    periodStartFormatted,
    periodEndFormatted,
    isActive,
    isCancelScheduled,
    isCanceled,
    isPastDue,
    isTrial,
    isLoading: isLoadingMySubscription || isLoadingSaasPlans,
    isRefetching,
    isCancelling: cancelSubscriptionMutation.isPending,
    isReactivating: reactivateSubscriptionMutation.isPending,
    showCancelModal,
    setShowCancelModal,
    showReactivateModal,
    setShowReactivateModal,
    handleCancelSubscription,
    handleReactivateSubscription,
    handleContactSupport,
    refetch,
  };
}

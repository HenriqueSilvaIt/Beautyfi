import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  EStripeInvoiceState,
  SubscriberInvoiceDetailsDTO,
} from "@/shared/interfaces/http/stripe";
import { create } from "zustand";
import { DeleteModal } from "@/shared/components/AppDeleteModal";
import { moneyMapper } from "@/utils/moneyMapper";
import { useUserStore } from "@/shared/store/user-store";

interface InvoiceDetailsProps {
  invoice: SubscriberInvoiceDetailsDTO;
  onRefund: (invoiceId?: string) => Promise<void>;
  isRefunding?: boolean;
  toggleRefundModal?: () => void;
  toggleHideModal?: () => void;
  isRefundModalVisible?: boolean;
}

function getStatusStyle(status: EStripeInvoiceState) {
  switch (status) {
    case EStripeInvoiceState.PAID:
      return {
        label: "Pago",
        badge: "bg-green-500/20",
        text: "text-green-400",
      };

    case EStripeInvoiceState.OPEN:
      return {
        label: "Em aberto",
        badge: "bg-blue-500/20",
        text: "text-blue-400",
      };

    case EStripeInvoiceState.PAST_DUE:
      return {
        label: "Vencido",
        badge: "bg-orange-500/20",
        text: "text-orange-400",
      };

    case EStripeInvoiceState.OVERDUE:
      return {
        label: "Inadimplente",
        badge: "bg-red-500/20",
        text: "text-red-400",
      };

    default:
      return {
        label: "Pendente",
        badge: "bg-zinc-500/20",
        text: "text-zinc-300",
      };
  }
}

export function InvoiceDetailsCard({
  invoice,
  onRefund,
  isRefunding,
  isRefundModalVisible,
  toggleHideModal,
  toggleRefundModal,
}: InvoiceDetailsProps) {
  const status = getStatusStyle(invoice?.status);
  const { user } = useUserStore();
  const isAdmin =
    user?.roles?.some(
      (role) =>
        role.authority === "ROLE_ADMIN" || role.authority === "ROLE_MODERATOR",
    ) ?? false;

  let amountFormatted;
  if (invoice?.total) {
    amountFormatted = invoice.total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  let createdDate;
  if (invoice?.created) {
    createdDate = new Date(invoice.created).toLocaleDateString("pt-BR");
  }

  return (
    <View className="mx-4 rounded-3xl border border-white/10 bg-zinc-900 p-5">
      {/* Header */}
      <View className="border-b border-white/10 pb-5">
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-zinc-400">
            Fatura #{invoice?.id}
          </Text>
          <View className="gap-2">
            <View className={`rounded-full gap-2 px-3 py-1 ${status.badge}`}>
              <Text className={`text-xs font-bold ${status.text}`}>
                {status.label}
              </Text>
            </View>
            {invoice.refunded && (
              <View className="rounded-full  px-3 py-1  bg-blue-500/20 ">
                <Text className="text-font-primary text-xs font-bold">
                  Reembolsado
                </Text>
              </View>
            )}
          </View>
        </View>

        <Text className="mt-4 text-4xl font-bold text-font-primary">
          {amountFormatted}
        </Text>

        <Text className="mt-1 text-sm text-zinc-400">
          Valor total da cobrança
        </Text>
      </View>

      {/* Resumo financeiro */}
      <View className="mt-5 gap-4">
        <View className="flex-row justify-between">
          <Text className="text-zinc-400">Subtotal</Text>
          <Text className="font-semibold text-font-primary">
            R$ {moneyMapper(invoice?.subTotal)}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-zinc-400">Total devido</Text>
          <Text className="font-semibold text-orange-400">
            R$ {moneyMapper(invoice?.amountDue)}
          </Text>
        </View>

        <View className="flex-row justify-between">
          <Text className="text-zinc-400">Pago</Text>
          <Text className="font-semibold text-green-400">
            R$ {moneyMapper(invoice?.amountPaid)}
          </Text>
        </View>
      </View>

      {/* Informações */}
      <View className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
        <Text className="mb-3 text-sm font-bold text-font-primary">Detalhes</Text>

        <View className="gap-3">
          <View className="flex-row justify-between">
            <Text className="text-zinc-400">Data</Text>
            <Text className="text-font-primary">{createdDate}</Text>
          </View>

          <View className="justify-start">
            <Text className="text-zinc-400 text-sm ">Cód. da fatura:</Text>
            <Text className="max-w-[x'100%] text-[10px] text-right text-zinc-300">
              {invoice?.stripeInvoiceId}
            </Text>
          </View>

          <View className="justify-start">
            <Text className="text-zinc-400 text-sm ">Cód. do pagamento:</Text>
            <Text className="max-w-[100%]  text-[10px] text-right text-zinc-300">
              {invoice?.paymentIntentId}
            </Text>
          </View>
        </View>
      </View>

      {/* Ações */}
      <View className="mt-6 gap-3">
        <TouchableOpacity
          className="flex-row items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-4"
          onPress={() => Linking.openURL(invoice?.hostedInvoiceUrl)}
        >
          <Ionicons name="document-text-outline" size={18} color="white" />
          <Text className="ml-2 font-semibold text-font-primary">
            Visualizar PDF da fatura
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-4"
          onPress={() => Linking.openURL(invoice?.invoicePdfUrl)}
        >
          <Ionicons name="download-outline" size={18} color="white" />
          <Text className="ml-2 font-semibold text-font-primary">
            Baixar PDF da fatura
          </Text>
        </TouchableOpacity>

        {isAdmin && !invoice.refunded && (
          <TouchableOpacity
            className="flex-row items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 py-4"
            onPress={() => toggleRefundModal?.()}
            disabled={isRefunding}
          >
            <Ionicons
              name="return-down-back-outline"
              size={18}
              color="#f87171"
            />
            <Text className="ml-2 font-bold text-red-400">
              {isRefunding
                ? "Processando reembolso..."
                : "Reembolsar pagamento"}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <DeleteModal
        loading={isRefunding}
        visible={isRefundModalVisible}
        confirmationButtonText="Confirmar"
        confirmationButtonColor
        hideModal={toggleHideModal}
        handleDelete={() => {
          if (invoice.stripeInvoiceId) {
            onRefund(invoice.stripeInvoiceId);
          }
          toggleHideModal?.();
        }}
        description="Tem certeza que deseja reembolsar a fatura?"
        title="Reembolsar fatura"
      />
    </View>
  );
}

import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import {
  EStripeInvoiceState,
  SubscriberInvoiceDTO,
} from "@/shared/interfaces/http/stripe";
import { Text, TouchableOpacity, View } from "react-native";

export interface InvoiceCardProps {
  invoice: SubscriberInvoiceDTO;
  setSubscriber: (invocieId?: string) => void
}

export function getInvoiceStatusConfig(status: EStripeInvoiceState) {

  const {safePush} = useSafeNavigation()
  switch (status) {
    case EStripeInvoiceState.PAID:
      return {
        label: "Pago",
        badgeStyle: "bg-green-500/20",
        textStyle: "text-green-400",
      };

    case EStripeInvoiceState.OPEN:
      return {
        label: "Em aberto",
        badgeStyle: "bg-blue-500/20",
        textStyle: "text-blue-400",
      };

    case EStripeInvoiceState.PENDING:
      return {
        label: "Pendente",
        badgeStyle: "bg-yellow-500/20",
        textStyle: "text-yellow-400",
      };

    case EStripeInvoiceState.PAST_DUE:
      return {
        label: "Vencido",
        badgeStyle: "bg-orange-500/20",
        textStyle: "text-orange-400",
      };

    case EStripeInvoiceState.OVERDUE:
      return {
        label: "Inadimplente",
        badgeStyle: "bg-red-500/20",
        textStyle: "text-red-400",
      };

    case EStripeInvoiceState.VOID:
      return {
        label: "Cancelado",
        badgeStyle: "bg-zinc-500/20",
        textStyle: "text-zinc-300",
      };

    default:
      return {
        label: "Desconhecido",
        badgeStyle: "bg-white/10",
        textStyle: "text-font-primary",
      };
  }
}

export function InvoiceCard({ invoice, setSubscriber }: InvoiceCardProps) {
  const status = getInvoiceStatusConfig(invoice.status);

  const formattedDate = new Date(invoice.created).toLocaleDateString("pt-BR");

  const { formatIsoDateTimeToBR } = useFormatDate();

  const formattedAmount = invoice.amountDue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const { safePush } = useSafeNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        safePush(
          `/(private)/(tabs)/(client-tabs)/subscription/subscription-invoice/${invoice.stripeInvoiceId}`,
        )
      }}
      activeOpacity={0.8}
      className="mx-4 mb-4 rounded-3xl border border-white/10 bg-zinc-900 p-5"
    >
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-semibold text-font-primary">
          Fatura #{invoice.id}
        </Text>

        <View className={`rounded-full px-3 py-1 ${status.badgeStyle}`}>
          <Text className={`text-xs font-semibold ${status.textStyle}`}>
            {status.label}
          </Text>
        </View>
      </View>

      <Text className="mt-4 text-3xl font-bold text-font-primary">
        {formattedAmount}
      </Text>

      <View className="mt-5 flex-row justify-between">
        <View>
          <View>
            <Text className="text-xs text-zinc-500">Data de Contratação</Text>
            <Text className="text-sm font-medium text-zinc-200">
              {formattedDate}
            </Text>
          </View>
          <View>
            <Text className="text-xs text-zinc-500">Próximo vencimento</Text>
            <Text className="text-sm font-medium text-zinc-200">
              {formatIsoDateTimeToBR(invoice.periodEnd)}
            </Text>
          </View>
        </View>
        <View>
          <Text className="text-xs text-zinc-500">Cod. Pagamento</Text>
          <Text className="text-sm font-medium text-zinc-200">
            {invoice.paymentIntentId ? invoice.paymentIntentId.slice(-8) : "--"}
          </Text>
        </View>
      </View>

      <View className="mt-4 border-t border-white/10 pt-4">
        <Text className="text-xs text-zinc-500">Código da Fatura</Text>
        <Text numberOfLines={1} className="text-sm text-zinc-300">
          {invoice.stripeInvoiceId}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

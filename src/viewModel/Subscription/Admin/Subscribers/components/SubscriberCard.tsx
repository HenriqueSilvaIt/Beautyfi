import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import {
  AdminSubscribersDTO,
  ESubscriptionState,
} from "@/shared/interfaces/http/stripe";
import { Ionicons } from "@expo/vector-icons";
import { Image, Text, Touchable, TouchableOpacity, View } from "react-native";

export interface SubscriberCardProps {
  subscriber: AdminSubscribersDTO;
  setSubscriber: (customerId: string) => void;
}


export function getSubscriptionStatusConfig(status: ESubscriptionState) {
  switch (status) {
    case ESubscriptionState.ACTIVE:
      return {
        label: "Ativa",
        badge: "bg-emerald-500/15 border border-emerald-500/30",
        text: "text-emerald-500 font-bold",
      };

    case ESubscriptionState.PAST_DUE:
      return {
        label: "Falha no pagamento",
        badge: "bg-red-500/15 border border-red-500/30",
        text: "text-red-500 font-bold",
      };

    case ESubscriptionState.PENDING:
      return {
        label: "Pendente",
        badge: "bg-amber-500/15 border border-amber-500/30",
        text: "text-amber-500 font-bold",
      };

    case ESubscriptionState.CANCELED:
      return {
        label: "Cancelada",
        badge: "bg-zinc-500/15 border border-zinc-500/30",
        text: "text-zinc-400 font-bold",
      };

    case ESubscriptionState.CANCEL_SCHEDULED:
      return {
        label: "Cancelamento agendado",
        badge: "bg-orange-500/15 border border-orange-500/30",
        text: "text-orange-500 font-bold",
      };

    case ESubscriptionState.DEACTIVATED:
      return {
        label: "Desativada",
        badge: "bg-zinc-600/20 border border-zinc-600/30",
        text: "text-zinc-400 font-bold",
      };

    case ESubscriptionState.RENOVATED:
      return {
        label: "Renovada",
        badge: "bg-blue-500/15 border border-blue-500/30",
        text: "text-blue-500 font-bold",
      };

    case ESubscriptionState.EXPIRED:
      return {
        label: "Expirada",
        badge: "bg-purple-500/15 border border-purple-500/30",
        text: "text-purple-500 font-bold",
      };

    default:
      return {
        label: "Desconhecido",
        badge: "bg-gray-500/15 border border-gray-500/30",
        text: "text-gray-400 font-bold",
      };
  }
}

export function SubscriberCard({
  subscriber,
  setSubscriber,
}: SubscriberCardProps) {
  const status = getSubscriptionStatusConfig(subscriber.subscriptionStatus);
  const { safePush } = useSafeNavigation();

  const amountFormatted = (subscriber?.amount ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const startDate = subscriber?.startDate
    ? new Date(subscriber.startDate).toLocaleDateString("pt-BR")
    : "Não informado";

  const endDate = subscriber?.endDate
    ? new Date(subscriber.endDate).toLocaleDateString("pt-BR")
    : "Não informado";

  return (
    <View className="mx-4 mb-4 rounded-3xl border border-zinc-800 bg-background-tertiary p-5 shadow-sm">
      {/* Header: User Info & Status */}
      <View className="flex-row items-center justify-between border-b border-zinc-800/80 pb-4">
        <View className="flex-row items-center gap-3 flex-1">
          {subscriber.avatarUrl ? (
            <Image
              source={{ uri: subscriber.avatarUrl }}
              resizeMode="cover"
              className="w-12 h-12 rounded-full border border-zinc-700"
            />
          ) : (
            <View className="w-12 h-12 rounded-full bg-zinc-800 items-center justify-center border border-zinc-700">
              <Ionicons name="person" size={20} color="#A1A1AA" />
            </View>
          )}

          <View className="flex-1 pr-2">
            <Text
              className="text-base font-bold text-font-primary"
              numberOfLines={1}
            >
              {subscriber.userName}
            </Text>
            <Text
              className="text-xs text-zinc-400 mt-0.5"
              numberOfLines={1}
            >
              {subscriber.userEmail}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            setSubscriber(subscriber.customerId);
            safePush("/(private)/(tabs)/(client-tabs)/subscription/subscription-invoice");
          }}
          activeOpacity={0.7}
          className="flex-row items-center gap-1.5 rounded-full px-3 py-1.5 bg-accent-purple/15 border border-accent-purple/30"
        >
          <Ionicons name="document-text-outline" size={14} color="#8B5CF6" />
          <Text className="text-xs font-bold text-accent-purple">
            Faturas
          </Text>
        </TouchableOpacity>
      </View>

      {/* Plan Info & Status Pill */}
      <View className="mt-4 flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Plano Contratado
          </Text>
          <Text className="mt-1 text-lg font-extrabold text-font-primary">
            {subscriber.planName}
          </Text>
          <Text className="mt-0.5 text-sm font-semibold text-app-theme-primary">
            {amountFormatted} <Text className="text-xs text-zinc-400 font-normal">/ mês</Text>
          </Text>
        </View>

        <View className={`rounded-full px-3 py-1.5 ${status.badge}`}>
          <Text className={`text-xs text-center ${status.text}`}>
            {status.label}
          </Text>
        </View>
      </View>

      {/* Plan Usage Card */}
      <View className="mt-4 rounded-2xl border border-zinc-800 bg-background-primary p-4">
        <View className="flex-row items-center justify-between border-b border-zinc-800/60 pb-2.5">
          <Text className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Uso do Plano
          </Text>
          <Text className="text-xs font-bold text-app-theme-primary">
            {subscriber.cutsUsed} de {subscriber.cutsAllowed} cortes
          </Text>
        </View>

        <View className="mt-3 flex-row justify-between items-center">
          <Text className="text-xs text-zinc-400">Cortes já utilizados</Text>
          <Text className="text-sm font-bold text-font-primary">{subscriber.cutsUsed}</Text>
        </View>

        <View className="mt-2 flex-row justify-between items-center">
          <Text className="text-xs text-zinc-400">Cortes disponíveis</Text>
          <Text className="text-sm font-bold text-emerald-500">{subscriber.cutsAllowed - subscriber.cutsUsed}</Text>
        </View>
      </View>

      {/* Validity */}
      <View className="mt-4 flex-row items-center justify-between pt-1">
        <Text className="text-xs text-zinc-400">Vigência da assinatura</Text>
        <Text className="text-xs font-semibold text-font-primary">
          {startDate} ~ {endDate}
        </Text>
      </View>
    </View>
  );
}

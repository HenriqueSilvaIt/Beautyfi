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
        badge: "bg-green-500/15",
        text: "text-green-400",
      };

    case ESubscriptionState.PAST_DUE:
      return {
        label: "Falha no pagamento",
        badge: "bg-red-500/15",
        text: "text-red-400",
      };

    case ESubscriptionState.PENDING:
      return {
        label: "Pendente",
        badge: "bg-yellow-500/15",
        text: "text-yellow-400",
      };

    case ESubscriptionState.CANCELED:
      return {
        label: "Cancelada",
        badge: "bg-zinc-500/15",
        text: "text-zinc-300",
      };

    case ESubscriptionState.CANCEL_SCHEDULED:
      return {
        label: "Cancelamento agendado",
        badge: "bg-orange-500/15",
        text: "text-orange-400",
      };

    case ESubscriptionState.DEACTIVATED:
      return {
        label: "Desativada",
        badge: "bg-zinc-600/20",
        text: "text-zinc-400",
      };

    case ESubscriptionState.RENOVATED:
      return {
        label: "Renovada",
        badge: "bg-blue-500/15",
        text: "text-blue-400",
      };

    case ESubscriptionState.EXPIRED:
      return {
        label: "Expirada",
        badge: "bg-purple-500/15",
        text: "text-purple-400",
      };

    default:
      return {
        label: "Desconhecido",
        badge: "bg-white/10",
        text: "text-font-primary",
      };
  }
}

export function SubscriberCard({
  subscriber,
  setSubscriber,
}: SubscriberCardProps) {
  const status = getSubscriptionStatusConfig(subscriber.subscriptionStatus);


  const {safePush} = useSafeNavigation();
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
    <View className="mx-4 mb-4 rounded-3xl border border-white/10 bg-zinc-900 p-5">
      <View className="flex-row items-center justify-between border-b border-white/10 pb-4">
        <View className="flex-row items-center gap-3">
          <View className="h-max-[100%] w-max-[100%] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
            {subscriber.avatarUrl ? (
              <Image
                source={{ uri: subscriber.avatarUrl }}
                resizeMode="cover"
                className="w-[50px] h-[50px] rounded-full"
              />
            ) : (
              <View className="h-max-[100%] w-max-[100%] items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Ionicons
                  size={22}
                  name="person-circle"
                  className="bg-gray-500 rounded-full"
                />
              </View>
            )}
          </View>

          <View className="gap-2 ">
            <Text
              className="text-base font-bold text-font-primary"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subscriber.userName}
            </Text>

            <Text
              className="text-xs text-zinc-400"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subscriber.userEmail}
            </Text>
            <View className={`shrink-0 rounded-full px-3 py-1 ${status.badge}`}>
              <Text className={`text-xs text-center font-bold ${status.text}`}>
                {status.label}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                (setSubscriber(subscriber.customerId),
                 safePush(
                    "/(private)/(tabs)/(client-tabs)/subscription/subscription-invoice",
                  ));
              }}
              activeOpacity={0.8}
              className={`shrink-0 rounded-full px-3 py-1 bg-blue-500/15`}
            >
              <Text className={`text-xs font-bold text-center  text-font-primary`}>
                Faturas
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="mt-4">
        <Text className="text-xs text-zinc-500">Plano</Text>

        <Text className="mt-1 text-lg font-bold text-font-primary">
          {subscriber.planName}
        </Text>

        <Text className="mt-1 text-sm text-zinc-400">
          {amountFormatted} / mês
        </Text>
      </View>

      <View className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
        <Text className="text-sm font-semibold text-font-primary">Uso do plano</Text>

        <View className="mt-3 flex-row justify-between">
          <Text className="text-zinc-400">Cortes usados</Text>
          <Text className="font-bold text-font-primary">{subscriber.cutsUsed}</Text>
        </View>

        <View className="mt-2 flex-row justify-between">
          <Text className="text-zinc-400">Cortes disponíveis</Text>
          <Text className="font-bold text-font-primary">{subscriber.cutsAllowed}</Text>
        </View>
      </View>

      <View className="mt-5">
        <Text className="text-xs text-zinc-500">Vigência</Text>

        <Text className="mt-1 text-sm text-zinc-300">
          {startDate} até {endDate}
        </Text>
      </View>
    </View>
  );
}

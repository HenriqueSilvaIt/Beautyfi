import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { Loading } from "@/shared/components/Loading";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { usePaymentCrudMutation } from "@/shared/queries/finance/use-payment-crud.mutation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CardFlagsPageList() {
  const { safePush } = useSafeNavigation();
  const { useGetPaymentCardFlagsQuery } = usePaymentCrudMutation();
  const { data: cardFlags, isLoading, refetch, isRefetching } = useGetPaymentCardFlagsQuery();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Bandeiras de Cartão"
        iconRightName="add"
        action={() => safePush(`/(private)/(crud)/finance/card-flags/0`)}
        iconRight={{ icon: true, path: "/(private)/(crud)/finance/card-flags/0" }}
      />
      <AppCard
        data={(cardFlags ?? []).map((s) => ({
          id: s.id,
          title: s.name,
          description: `Taxa: ${s.fee ?? 0}% • Recebimento: ${s.dayDelay ?? 0} dias (${s.dayType === "WORKING_DAYS" ? "Úteis" : "Corridos"})`,
        }))}
        path="/(private)/(crud)/finance/card-flags/"
        isRefetching={isRefetching}
        onRefetch={async () => {
          await refetch();
          return {} as any;
        }}
      />
    </SafeAreaView>
  );
}

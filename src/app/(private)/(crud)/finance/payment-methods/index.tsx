import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { Loading } from "@/shared/components/Loading";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { usePaymentCrudMutation } from "@/shared/queries/finance/use-payment-crud.mutation";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaymentMethodsPageList() {
  const { safePush } = useSafeNavigation();
  const { useGetPaymentMethodsQuery } = usePaymentCrudMutation();
  const { data: paymentMethods, isLoading, refetch, isRefetching } = useGetPaymentMethodsQuery();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Métodos de Pagamento"
        iconRightName="add"
        action={() => safePush(`/(private)/(crud)/finance/payment-methods/0`)}
        iconRight={{ icon: true, path: "/(private)/(crud)/finance/payment-methods/0" }}
      />
      <AppCard
        data={(paymentMethods ?? []).map((s) => ({
          id: s.id,
          title: s.name,
          description: s.card ? "Cartão (Bandeira necessária)" : `Taxa padrão: ${s.fee ?? 0}%`,
        }))}
        path="/(private)/(crud)/finance/payment-methods/"
        isRefetching={isRefetching}
        onRefetch={async () => {
          await refetch();
          return {} as any;
        }}
      />
    </SafeAreaView>
  );
}

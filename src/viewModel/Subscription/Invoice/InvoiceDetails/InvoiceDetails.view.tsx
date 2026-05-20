import { SafeAreaView } from "react-native-safe-area-context";
import { useInvoiceDetailsViewModel } from "./useInvoiceDetailsViewModel";
import { InvoiceDetailsCard } from "./components/InvoiceDetailsCard";
import { Text, View } from "react-native";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { ScrollView } from "react-native";

export function InvoiceDetailsView({
  invoice,
  invoiceDetailsMock,
  error,
  refetch,
  isLoading,
  isRefetching,
  onCreateRefund,
  isRefunding,
  setIsRefunding,
  toggleHideModal,
  toggleRefundModal,
  isRefundModalVisible,
}: ReturnType<typeof useInvoiceDetailsViewModel>) {
  if (!invoice) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary items-center justify-center">
        <View className=" mx-4 rounded-3xl border border-white/10 bg-zinc-900 p-3">
          <Text className="text-center text-zinc-400">
            Carregando detalhes da fatura...
          </Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <ScrollView className="flex-1 bg-background-primary">
      <SafeAreaView>
        <AppAdminHeader
          title="Datalhes da fatura"
          leftIconShown={false}
          iconRight={{
            icon: false,
            path: "",
          }}
        />
        <InvoiceDetailsCard
          invoice={invoice}
          onRefund={() => onCreateRefund()}
          isRefunding={false}
          isRefundModalVisible={isRefundModalVisible}
          toggleHideModal={toggleHideModal}
          toggleRefundModal={toggleRefundModal}
        />
      </SafeAreaView>
    </ScrollView>
  );
}

import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppSubscriptionCard } from "@/shared/components/AppSubscriptionCard";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useSubscriptionAdminViewModel } from "@/viewModel/Subscription/Admin/useSubscriptionAdmin.viewModel";

import { SafeAreaView } from "react-native-safe-area-context";

export default function SubscriptionPageList() {
  const { data, onGetSubscriptions, isRefreshing  } =
    useSubscriptionAdminViewModel();
  const {safePush} = useSafeNavigation()


  return (
    <SafeAreaView className="flex-1  bg-background-primary  ">
      <AppAdminHeader
        title="Selecione o plano"
        iconRightName="add"
        action={() => safePush(`/subscriptions/new-subscription`)}
        iconRight={{ icon: true, path: "/subscriptions/new-subscription" }}
      />
      <AppSubscriptionCard
        data={data ?? []}
        loading={isRefreshing}
        refetch={onGetSubscriptions}
        isUpdateModalVisible={false}
        isCancelModalVisible={false}
        isReactivatingModalVisible={false}
        isCreateModalVisible={false}

      />    
    </SafeAreaView>
  );
}

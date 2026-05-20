import { useSubscriptionlistViewModel } from "./useSubscription.viewModel";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { Loading } from "@/shared/components/Loading";
import { AppSubscriptionCard } from "@/shared/components/AppSubscriptionCard";

export function SubscriptionListView({
  handleSubscribe,
  updateSubscription,
  cancelSubscription,
  reactSubscription,
  loading,
  isActive,
  setPriceId,
  priceId,
  onGetSubscriptions,
  subscriptions,
  refetchSubscriptionPlans,
  cancelAtPeriodEnd,
  isLoading,
  error,
  isReactivatingModalVisible,
  setIsReactivatingModalVisible,
  setIsCanceling,
  isCanceling,
  setIsUpdating,
  isUpdating,
  isReactivating,
  setIsReactivating,
  isCreating,
  setIsCreating,
  isCancelModalVisible,
  toggleCancelModal,
  isUpdateModalVisible,
  toggleUpdateModal,
  isCreateModalVisible,
  toggleCreateModal,
  toggleReactivateModal,
  toggleHideModal,
  mySubscription,
  subscriptionStatus,
}: ReturnType<typeof useSubscriptionlistViewModel>) {
  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary ">
      <AppAdminHeader
        title="Planos de Assinatura"
        iconRight={{
          icon: false,
          path: "",
        }}
      />

      <AppSubscriptionCard
        isReactivating={isReactivating}
        setIsReactivating={setIsReactivating}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        updateSubscription={updateSubscription}
        cancelSubscrtipion={cancelSubscription}
        reactSubscription={reactSubscription}
        cancelAtPeriodEnd={cancelAtPeriodEnd}
        data={subscriptions ?? []} 
        isActive={isActive}
        isClient={true}
        mySubscription={mySubscription}
        handleSubscribe={handleSubscribe}
        loading={loading}
        setIsCanceling={setIsCanceling}
        isCanceling={isCanceling}
        setIsUpdating={setIsUpdating}
        isUpdating={isUpdating}
        refetch={onGetSubscriptions}
        isCancelModalVisible={isCancelModalVisible}
        toggleCancelModal={toggleCancelModal}
        isUpdateModalVisible={isUpdateModalVisible}
        toggleUpdateModal={toggleUpdateModal}
        isCreateModalVisible={isCreateModalVisible}
        isReactivatingModalVisible={isReactivatingModalVisible}
        toggleCreateModal={toggleCreateModal}
        toggleHideModal={toggleHideModal}
        toggleReactivateModal={toggleReactivateModal}
        priceId={priceId}
        setPriceId={setPriceId}
        subscriptionStatus={subscriptionStatus}
      />
    </SafeAreaView>
  );
}

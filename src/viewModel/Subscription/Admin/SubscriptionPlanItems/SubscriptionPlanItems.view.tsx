import { AppPlanItemCard } from "@/shared/components/AppPlanItemCard";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useSubscriptionPlanItemsViewModel } from "./useSubscriptionPlanItemsViewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export function SubscriptionPlanItemsView({
  plantItemsPagged,
  planItemsRefetch,
  planItemsError,
  planItemsIsRefetching,
  fetchNextPlanItemsPage,
  planItemsIsFetchingNextPage,
  handleRemoveItemFromPlan,
  selectedItemId,
  setSelectedItemId,
  handleHideModal,
  removeModalVisible,
  isRemovingItem,
  hasNextPlanItemsPage,
  safePush,
  planId,
  planItemsIsLoading,
}: ReturnType<typeof useSubscriptionPlanItemsViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-background-primary ">
      <AppAdminHeader
        title="Items de Assinatura"
        iconRightName="add"
        iconRight={{
          icon: true,
          path: "",
        }}
        action={() =>
          safePush(
            `/(private)/(crud)/subscriptions/subscription-plan-items/new-plan-item/${planId}`,
          )
        }
      />

      <AppPlanItemCard
        handleRemoveItemFromPlan={handleRemoveItemFromPlan}
        plantItemsPagged={plantItemsPagged}
        onRefetch={planItemsRefetch}
        hasNextPage={hasNextPlanItemsPage}
        isFetchingNextPage={planItemsIsFetchingNextPage}
        isLoading={planItemsIsLoading}
        isRefetching={planItemsIsRefetching}
        fetchNextPage={fetchNextPlanItemsPage}
        type="admin"
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
        handleHideModal={handleHideModal}
        removeModalVisible={removeModalVisible}
        isRemovingItem={isRemovingItem}
      />


    </SafeAreaView>
  );
}

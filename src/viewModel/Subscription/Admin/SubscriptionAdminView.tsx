import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useSubscriptionAdminViewModel } from "./useSubscriptionAdmin.viewModel";
import { View } from "react-native";
import AppDetails from "@/shared/components/AppDetails";
import { SubscriptionAdminFormData } from "./subscription-admin-scheme";
import { Loading } from "@/shared/components/Loading";

export function SubscriptionAdminView({
  onSubmit,
  stripePlan,
  control,
  loading,
  stripePlanId,
  onDeletePlanById,
  isEditMode,
  isRefreshing,
}: ReturnType<typeof useSubscriptionAdminViewModel>) {
  return (
    <>
      {isRefreshing ? (
        <Loading />
      ) : (
        <KeyboardContainer>
          <View className="flex-1 bg-background-primary">
            <AppDetails<SubscriptionAdminFormData>
              control={control}
              isLoading={loading}
              onSubmit={onSubmit}
              stripePlanContent={stripePlan}
              isEditMode={isEditMode}
              id={stripePlanId}
              title="plano"
              dontShowImageSelect={true}
              fields={[
                {
                  name: "name",
                  label: "Nome do plano",
                  leftIcon: "person",
                  placeholder: "Digite o nome",
                  type: "subscription-details"
                },
                {
                  name: "description",
                  label: "Descrição",
                  leftIcon: "reader",
                  placeholder: "Descrição",
                  multiline: true,
                  numberOfLines: 3,
                },

                {
                  name: "amount",
                  label: "Preço",
                  leftIcon: "cash",
                  placeholder: "R$ 0,00",
                },
                {
                  name: "cutsAllowed",
                  label: "Quantidade de serviços permitidos",
                  leftIcon: "cut",
                  placeholder: "0",
                },
                  {
                  name: "commissionPercentage",
                  label: "Comissão",
                  leftIcon: "cash",
                  placeholder: "R$ 0,00",
                },
              ]}
              onDelete={onDeletePlanById}
            />
          </View>
        </KeyboardContainer>
      )}
    </>
  );
}

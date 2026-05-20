import { employeePlanScheme, SubscriptionPlanEmployeeFormData } from "@/viewModel/Subscription/Admin/SubscriptionPlanEmployees/subscription-plan-employees.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "expo-router";
import { FormProvider, Resolver, useForm } from "react-hook-form";

export default function ServicesLayout() {
  const methods = useForm<SubscriptionPlanEmployeeFormData>({
    resolver: yupResolver(
      employeePlanScheme,
    ) as unknown as Resolver<SubscriptionPlanEmployeeFormData>,
    defaultValues: {},
  });

  return (
    <FormProvider {...methods}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
      </Stack>
    </FormProvider>
  );
}

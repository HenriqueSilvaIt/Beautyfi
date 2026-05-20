import {
  ServiceFormData,
  serviceScheme,
} from "@/viewModel/Admin/Services/service.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "expo-router";
import { FormProvider, Resolver, useForm } from "react-hook-form";

export default function ServicesLayout() {
  const methods = useForm<ServiceFormData>({
    resolver: yupResolver(
      serviceScheme,
    ) as unknown as Resolver<ServiceFormData>,
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

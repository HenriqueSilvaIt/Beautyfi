import {
  PackageFormData,
  packageScheme,
} from "@/viewModel/Admin/Packages/package.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "expo-router";
import { FormProvider, Resolver, useForm } from "react-hook-form";

export default function PackagesLayout() {
  const methods = useForm<PackageFormData>({
    resolver: yupResolver(
      packageScheme,
    ) as unknown as Resolver<PackageFormData>,
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

import {
  EmployeeFormData,
  employeeScheme,
} from "@/viewModel/Admin/Employees/employee.scheme";
import { yupResolver } from "@hookform/resolvers/yup";
import { Stack } from "expo-router";
import { FormProvider, Resolver, useForm } from "react-hook-form";

export default function EmployeeLayout() {
  const methods = useForm<EmployeeFormData>({
    resolver: yupResolver(
      employeeScheme,
    ) as unknown as Resolver<EmployeeFormData>,
    defaultValues: {},
  });

  return (
    <FormProvider {...methods}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
           <Stack.Screen name="working-days" />

      </Stack>
    </FormProvider>
  );
}

import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppCard } from "@/shared/components/AppCard";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { Loading } from "@/shared/components/Loading";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useEmployeeViewModel } from "@/viewModel/Admin/Employees/useEmployeeeViewModel";
import { AppInput } from "@/shared/components/AppInput";
import { router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EmployeesPageList() {
  const {
    employeeDataPagged,
    employeeRefetch,
    employeeIsRefetching,
    employeeIsLoading,
    employeeHasNextPage,
    employeeFetchNextPage,
    employeeIsFetchingNextPage,
    searchValue,
    setSearchValue,
  } = useEmployeeViewModel(undefined);

  if (employeeIsLoading) {
    return <Loading />;
  }

  const {safePush} = useSafeNavigation();
  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Selecione o profissional"
        iconRightName="add"
        action={() => safePush(`/employees/employee-create`)}
        iconRight={{ icon: true, path: "/employees/employee-create" }}
      />
      <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
        <AppInput
          placeholder="Buscar profissional por nome..."
          leftIcon="search"
          value={searchValue}
          onChangeText={setSearchValue}
        />
      </View>
      <AppCard
        data={employeeDataPagged
          .filter((e) => e.id !== undefined)
          .map((e) => ({
            id: e.id!,
            title: e.name,
            description: e.description,
            imgUrl: e.avatarUrl,
          }))}
        path="/employees/"
        isRefetching={employeeIsRefetching}
        fetchNextPage={employeeFetchNextPage}
        isFetchingNextPage={employeeIsFetchingNextPage}
        hasNextPage={employeeHasNextPage}
        onRefetch={employeeRefetch}
      />
    </SafeAreaView>
  );
}

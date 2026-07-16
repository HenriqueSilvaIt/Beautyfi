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
import { AppSearchBar } from "@/shared/components/AppSearchBar";

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

  const { safePush } = useSafeNavigation();

  if (employeeIsLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Selecione o profissional"
        iconRightName="add"
        action={() => safePush(`/employees/employee-create`)}
        iconRight={{ icon: true, path: "/employees/employee-create" }}
      />
      <View className="px-4 mb-4">

        <AppSearchBar
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Buscar profissional por nome..."
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

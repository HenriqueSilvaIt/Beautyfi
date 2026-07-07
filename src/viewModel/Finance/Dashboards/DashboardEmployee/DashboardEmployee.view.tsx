import { SafeAreaView } from "react-native-safe-area-context";
import { useDashboardEmployeeViewModel } from "./useDashboardEmployeeViewModel";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { moneyMapper } from "@/utils/moneyMapper";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppDate } from "@/shared/components/AppDate";
import { useCallback } from "react";
import { DashboardEmployeeDTO } from "@/shared/interfaces/http/finance";

export function DashboardEmployeeView({
  reportData,
  setShowStartDatePicker,
  setShowEndDatePicker,
  showStartDatePicker,
  showEndDatePicker,
  DateIsoToBR,
  formatDateToISO,
  onGetReportData,
  dateParam,
  setDateParam,
}: ReturnType<typeof useDashboardEmployeeViewModel>) {
  const startDate = DateIsoToBR(dateParam.startDate ?? "");
  console.log(startDate);

  const endDate = DateIsoToBR(dateParam.endDate ?? "");

  const renderItem = useCallback(
    ({ item }: { item: DashboardEmployeeDTO }) => (
      <View className="p-5 bg-background-quartenary gap-2 border  border-zinc-800 shadow-l">
        <View className="flex-row gap-2 justify-between w-full">
   
            <Text className="text-gray-600 text-base">Profissional</Text>
          <Text className="text-gray-600 text-base">{item.employeeName}</Text>
        </View>

        <View className="flex-row justify-between w-full">
          <Text className="text-font-primary text-sm ">Total realizado/vendido</Text>
          <Text className="text-font-primary font-bold text-base">
            R$ {moneyMapper(Number(item.totalSold))}
          </Text>
        </View>

        <View className="flex-row justify-between w-full mt-2">
          <Text className="text-font-primary text-sm ">Comissão gerada</Text>
          <Text className="text-font-primary font-bold text-base">
            R$ {moneyMapper(Number(item.totalOrder))}
          </Text>
        </View>

        <View className="flex-row justify-between w-full">
          <Text className="text-font-primary text-sm ">
            Total comanda profissional
          </Text>
          <Text className="text-font-primary font-bold text-base">
            R$ {moneyMapper(Number(item.totalOrderEmployee))}
          </Text>
        </View>

        <View className="flex-row justify-between w-full mt-2">
          <Text className="text-font-primary text-sm ">Gorjetas/Bonificações</Text>
          <Text className="text-font-primary font-bold text-base">
            R$ {moneyMapper(Number(item.tips))}
          </Text>
        </View>

        <View className="flex-row justify-between w-full">
          <Text className="text-font-primary text-sm  ">
            Total descontado do profissional
          </Text>
          <Text className="text-font-primary font-bold text-base">
            R$ {moneyMapper(Number(item.totalEmployeeDiscount))}
          </Text>
        </View>

        <View className="flex-row justify-between w-full">
          <Text className="text-font-primary text-sm ">Total de assinatura</Text>
          <Text className="text-font-primary font-bold text-base">
            R$ {moneyMapper(Number(item.totalSubscription))}
          </Text>
        </View>

        <View className="flex-row justify-between w-full mt-2">
          <Text className="text-font-primary  text-sm ">Total do profissional</Text>
          <Text className="text-font-primary font-bold text-base">
            R$ {moneyMapper(Number(item.totalEmployee))}
          </Text>
        </View>

        <View className="flex-row justify-between w-full mt-2">
          <Text className="text-font-primary text-sm ">Total da empresa</Text>
          <Text className="text-font-primary font-bold text-base">
            R$ {moneyMapper(Number(item.totalCompany))}
          </Text>
        </View>
      </View>
    ),
    [],
  );

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <AppAdminHeader
        title="Resumo vendas"
        iconRight={{ icon: false, path: "" }}
      />

      <View className="flex-row  justify-center w-full gap-6 px-2">
        <TouchableOpacity
          onPress={() => setShowStartDatePicker(true)}
          activeOpacity={0.8}
        >
          <Text className="mb-1  font-semibold text-center text-base text-gray-600">
            Data de Inicio
          </Text>
          <View className=" justify-center bg-background-tertiary rounded-md w-[140px] h-[50px]">
            <Text className="text-center text-base text-font-primary">
              {startDate}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowEndDatePicker(true)}
          activeOpacity={0.8}
        >
          <Text className="mb-1  font-semibold text-center text-base text-gray-600">
            Data de Final
          </Text>
          <View className=" justify-center bg-background-tertiary rounded-md w-[140px] h-[50px]">
            <Text className="text-center text-base text-font-primary">{endDate}</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View className="justify-center items-center my-6 ">
        <TouchableOpacity
          onPress={onGetReportData}
          activeOpacity={0.8}
          className="px-6 py-2 rounded-md w-full bg-app-theme-primary items-center justify-center"
        >
          <Text className="text-font-primary  text-center text-xl font-bold">
            Buscar
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={reportData}
        contentContainerStyle={{ paddingBottom: 20, gap: 10 }}
        renderItem={renderItem}
        initialNumToRender={5} // ajuda na performance
        maxToRenderPerBatch={10} // controla quantos elementos renderizar por vez
        keyExtractor={(item) => item.employeeId!.toString()}
        showsVerticalScrollIndicator={false}
      />

      {showStartDatePicker && (
        <AppDate
          open={showStartDatePicker}
          date={new Date()}
          onConfirm={(date) => {
            const formattedDate = formatDateToISO(date);

            // Se você tiver dois pickers separados, use apenas o campo que abriu
            setDateParam((prev) => ({
              ...prev, // mantém endDate
              startDate: formattedDate,
            }));

            setShowStartDatePicker(false);
          }}
          onCancel={() => setShowStartDatePicker(false)}
        />
      )}

      {showEndDatePicker && (
        <AppDate
          open={showEndDatePicker}
          date={dateParam.endDate ? new Date(dateParam.endDate) : new Date()}
          onConfirm={(date) => {
            const formattedDate = formatDateToISO(date);

            setDateParam((prev) => ({
              ...prev, // mantém startDate
              endDate: formattedDate,
            }));

            setShowEndDatePicker(false);
          }}
          onCancel={() => setShowEndDatePicker(false)}
        />
      )}
    </SafeAreaView>
  );
}

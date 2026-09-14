import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppointmentsReportViewModel } from "./useAppointmentsReportViewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { View } from "react-native";
import { ActivityIndicator, FlatList, Text, TouchableOpacity } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { colors } from "@/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { AppEmptyList } from "@/shared/components/AppEmptyList";
import { format } from "date-fns";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { AppDate } from "@/shared/components/AppDate";

// Selector component for professional
function EmployeeSelectorForm({
  employees,
  selectedId,
  onSelect,
  onClose,
  themeColor,
}: {
  employees: any[];
  selectedId: number | null;
  onSelect: (id: number | null, name: string) => void;
  onClose: () => void;
  themeColor: string;
}) {
  return (
    <View className="p-6 gap-4 bg-background-quartenary flex-1 rounded-t-3xl border-t border-slate-800">
      <View className="flex-row justify-between items-center border-b border-slate-800 pb-3 mb-2">
        <Text className="text-font-primary font-bold text-lg">
          Filtrar por profissional
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          className="py-4 border-b border-slate-800"
          onPress={() => {
            onSelect(null, "Todos");
          }}
        >
          <Text className="text-font-primary text-sm font-semibold">Todos</Text>
        </TouchableOpacity>
        {employees.map((emp) => (
          <TouchableOpacity
            key={emp.id}
            className="py-4 border-b border-slate-800"
            onPress={() => {
              onSelect(emp.id ?? null, emp.name);
            }}
          >
            <Text
              style={{
                color: selectedId === emp.id ? themeColor : colors["font-primary"],
                fontWeight: selectedId === emp.id ? "700" : "400",
              }}
              className="text-sm"
            >
              {emp.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export function AppointmentReportView({
  monthlyLoading,
  selectedBar,
  setSelectedBar,
  highlightValue,
  periodTotalCount,
  selectedMonthLabel,
  barData,
  maxBarValue,
  appointmentsList,
  dateStart,
  setDateStart,
  dateEnd,
  setDateEnd,
  selectedEmployeeId,
  setSelectedEmployeeId,
  selectedEmployeeName,
  setSelectedEmployeeName,
  employeeList,
  showAll,
}: ReturnType<typeof useAppointmentsReportViewModel>) {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();
  const themeColor = colors["app-theme-primary"];

  const handleOpenEmployeeSheet = () => {
    openBottomSheet(
      <EmployeeSelectorForm
        employees={employeeList}
        selectedId={selectedEmployeeId}
        onSelect={(id, name) => {
          setSelectedEmployeeId(id);
          setSelectedEmployeeName(name);
          setSelectedBar(null);
          closeBottomSheet();
        }}
        onClose={closeBottomSheet}
        themeColor={themeColor}
      />,
      0
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary px-4">
      {/* Header */}
      <AppAdminHeader
        title="Relatório de Agendamentos"
        iconRight={{ icon: false, path: "" }}
      />

      {/* KPI Card */}
      <View className="mt-4 bg-background-quartenary p-5 rounded-xl border border-gray-700">
        <Text className="text-app-theme-primary text-xs mb-1 font-bold uppercase tracking-wider">
          {selectedMonthLabel ? `Total de Agendamentos (${selectedMonthLabel})` : "Total de Agendamentos no Período"}
        </Text>
        <Text className="text-font-primary text-5xl font-black mb-1">
          {selectedBar !== null ? highlightValue : periodTotalCount}
        </Text>
        {selectedMonthLabel && (
          <View className="flex-row items-center gap-1.5 mt-1 bg-background-tertiary px-3 py-1.5 rounded-lg border border-slate-800 self-start">
            <Text className="text-gray-400 text-xs font-medium">Total no Período:</Text>
            <Text className="text-app-theme-primary font-bold text-xs">
              {periodTotalCount} agendamentos
            </Text>
          </View>
        )}
      </View>

      {/* Gráfico Estilo Nubank (Pure Views) */}
      <View className="mt-4 h-[150px]">
        <Text className="text-gray-600 text-xs mb-3 font-semibold">VOLUME MENSAL</Text>
        {monthlyLoading ? (
          <ActivityIndicator size="large" color={colors["app-theme-primary"]} />
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "flex-end", paddingRight: 20 }}
          >
            {barData.map((item: any, index: number) => {
              const isSelected = selectedBar === index;
              const barHeight = (item.value / maxBarValue) * 80 + 10;

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.8}
                  onPress={() => setSelectedBar(index)}
                  className="items-center mr-6 justify-end"
                >
                  {isSelected && (
                    <Text className="text-font-primary text-[10px] font-bold mb-1">
                      {item.value} agend.
                    </Text>
                  )}
                  <View
                    style={{ height: barHeight }}
                    className={`w-8 rounded-t-md ${
                      isSelected ? "bg-app-theme-primary" : "bg-app-theme-primary/30"
                    }`}
                  />
                  <Text className={`text-xs mt-2 ${isSelected ? "text-font-primary font-bold" : "text-gray-600"}`}>
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      {/* ─── Filtros ─────────────────────────────────────────── */}
      <View className="mt-4 gap-2">
        <Text className="text-gray-600 text-xs font-semibold">FILTROS</Text>
        <View className="flex-row gap-2 flex-wrap">
          {/* Profissional */}
          {showAll && (
            <TouchableOpacity
              onPress={handleOpenEmployeeSheet}
              className="flex-row items-center gap-1 bg-background-tertiary px-3 py-2 rounded-lg"
            >
              <Ionicons name="person-outline" size={14} color={themeColor} />
              <Text className="text-font-primary text-xs">{selectedEmployeeName}</Text>
            </TouchableOpacity>
          )}

          {/* Data início */}
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            className="flex-row items-center gap-1 bg-background-tertiary px-3 py-2 rounded-lg"
          >
            <Ionicons name="calendar-outline" size={14} color={themeColor} />
            <Text className="text-font-primary text-xs">
              {format(dateStart, "dd/MM/yy")}
            </Text>
          </TouchableOpacity>
          <Text className="text-gray-400 self-center text-xs">→</Text>
          {/* Data fim */}
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            className="flex-row items-center gap-1 bg-background-tertiary px-3 py-2 rounded-lg"
          >
            <Ionicons name="calendar-outline" size={14} color={themeColor} />
            <Text className="text-font-primary text-xs">
              {format(dateEnd, "dd/MM/yy")}
            </Text>
          </TouchableOpacity>

          {/* Limpar seleção de barra */}
          {selectedBar !== null && (
            <TouchableOpacity
              onPress={() => setSelectedBar(null)}
              className="flex-row items-center gap-1 bg-red-900/40 px-3 py-2 rounded-lg"
            >
              <Ionicons name="close-circle-outline" size={14} color="red" />
              <Text className="text-red-400 text-xs">Limpar mês</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Pickers de data */}
      {showStartPicker && (
        <AppDate
          open={showStartPicker}
          date={dateStart}
          onConfirm={(d) => {
            if (d) { setDateStart(d); setSelectedBar(null); }
            setShowStartPicker(false);
          }}
          onCancel={() => setShowStartPicker(false)}
        />
      )}
      {showEndPicker && (
        <AppDate
          open={showEndPicker}
          date={dateEnd}
          onConfirm={(d) => {
            if (d) { setDateEnd(d); setSelectedBar(null); }
            setShowEndPicker(false);
          }}
          onCancel={() => setShowEndPicker(false)}
        />
      )}

      {/* Detalhe dos Agendamentos */}
      <View className="flex-1 mt-6 border-t border-gray-800 pt-4">
        <Text className="text-gray-600 text-xs mb-4 font-semibold">DETALHE DOS AGENDAMENTOS</Text>

        <FlatList
          data={appointmentsList}
          keyExtractor={(item) => item.id?.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => {
            const dateStr = item.dateScheduled ? format(new Date(item.dateScheduled), "dd MMM HH:mm") : "";
            return (
              <View className="flex-row items-center justify-between py-4 border-b border-gray-800">
                <View className="flex-row items-center gap-3">
                  <View className="bg-gray-800 p-2 rounded-full">
                    <Ionicons name="calendar" color="white" size={18} />
                  </View>
                  <View>
                    <Text className="text-font-primary font-semibold text-sm">
                      {item.services && item.services.length > 0
                        ? item.services.map((s: any) => s.service?.name || s.name || "Serviço").join(", ")
                        : "Serviço"}
                    </Text>
                    <Text className="text-gray-600 text-xs">
                      {dateStr} • {item.user ? `${item.user.firstName} ${item.user.lastName || ""}`.trim() : "Cliente"}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-font-primary font-bold text-sm">
                    {item.employee?.name || "Profissional"}
                  </Text>
                  <Text className="text-app-theme-primary text-xs">
                    {item.status === "SCHEDULED" ? "Agendado" : item.status === "CONFIRMED" ? "Confirmado" : item.status}
                  </Text>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <AppEmptyList
              name="agenda"
              iconName="calendar-outline"
              title="Sem agendamentos"
              description="Nenhum agendamento encontrado para o período."
            />
          }
        />
      </View>
    </SafeAreaView>
)
}

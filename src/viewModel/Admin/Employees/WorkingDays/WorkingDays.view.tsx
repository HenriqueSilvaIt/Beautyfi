import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppButton } from "@/shared/components/AppButton";
import { useFormContext, useWatch } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { EmployeeFormData } from "../employee.scheme";
import {
  DAYS_WEEK,
  EDayWeek,
  EmployeeWorkDays,
} from "@/shared/interfaces/http/employee";
import { useCallback, useMemo, useState } from "react";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { ScrollView } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { AppTime } from "@/shared/components/AppTime";

type Period = {
  start: string; // "09:00:00"
  end: string; // "12:00:00"
};

type DaySchedule = {
  day: EDayWeek;
  times: Period[];
};

type EditingTime = {
  day: EDayWeek;
  periodIndex: number;
  field: "start" | "end";
  value: string; // "09:00:00"
};

export function WorkingDaysView() {
  const { watch, setValue } = useFormContext<EmployeeFormData>();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [editingTime, setEditingTime] = useState<EditingTime | null>(null);
  const selectedDays = watch("schedule") ?? [];
  const isAllSelected = selectedDays.length === DAYS_WEEK.length;
  const { timeStringToDate, dateToTimeString } = useFormatDate();

  const scheduleTes = watch("schedule");
  console.log(scheduleTes);
  // Forma correta de observar o campo
  const schedule = useWatch({
    name: "schedule",
  }) as EmployeeWorkDays[];
  const scheduleByDay = useMemo(() => {
    const map = new Map<EDayWeek, DaySchedule>();
    schedule.forEach((s) => map.set(s.day, s));
    return map;
  }, [schedule]);
  console.log(JSON.stringify(schedule));

  const safeSchedule = schedule ?? [];

  // Apenas dias que têm horários
  const daysWithTimes = useMemo(
    () => schedule.filter((d) => d.times.length > 0),
    [schedule],
  );

  const toggleDay = useCallback(
    (day: EDayWeek) => {
      const current = (watch("schedule") ?? []) as EmployeeWorkDays[];

      const exists = current.some((d) => d.day === day);

      if (exists) {
        // remove o dia
        const updated = current.filter((d) => d.day !== day);
        setValue("schedule", updated, {
          shouldDirty: true,
          shouldValidate: true,
        });
        return;
      }

      // adiciona o dia com times vazio
      const updated = [
        ...current,
        { day, times: [{ start: "09:00:00", end: "18:00:00" }] },
      ];

      // opcional: manter na ordem do DAYS_WEEK
      updated.sort(
        (a, b) => DAYS_WEEK.indexOf(a.day) - DAYS_WEEK.indexOf(b.day),
      );

      setValue("schedule", updated, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue, watch],
  );

  const toggleSelectAllDays = useCallback(() => {
  // ✅ Lê direto do form ao invés de watch() — evita closure stale
  const current = (watch("schedule") ?? []) as EmployeeWorkDays[];
  const allSelected = current.length === DAYS_WEEK.length;

  if (allSelected) {
    setValue("schedule", [], { shouldDirty: true, shouldValidate: true });
    return;
  }

  // ✅ Mescla com dias já existentes — preserva horários customizados
  const allDays: EmployeeWorkDays[] = DAYS_WEEK.map((day) => {
    // se o dia já existe, mantém os horários que o usuário configurou
    const existing = current.find((d) => d.day === day);
    if (existing) return existing;

    // novo dia — cria com horário padrão
    return {
      day,
      times: [
        { start: "09:00:00", end: "12:00:00" },
        { start: "13:00:00", end: "18:00:00" },
      ],
    };
  });

  setValue("schedule", allDays, { shouldDirty: true, shouldValidate: true });
}, [watch, setValue]);

  const updateScheduleTime = useCallback(
    (payload: EditingTime, newValue: string) => {
      const current = (watch("schedule") ?? []) as EmployeeWorkDays[];

      const updated = current.map((d) => {
        if (d.day !== payload.day) return d;

        const times = [...(d.times ?? [])];

        const period = times[payload.periodIndex];
        if (!period) return d;

        times[payload.periodIndex] = {
          ...period,
          [payload.field]: newValue,
        };

        return { ...d, times };
      });

      setValue("schedule", updated, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue, watch],
  );

  const addSecondPeriod = useCallback(
    (day: EDayWeek) => {
      const current = (watch("schedule") ?? []) as EmployeeWorkDays[];

      const updated = current.map((d) => {
        if (d.day !== day) return d;

        const times = d.times ?? [];

        // se já tem 2 períodos, não faz nada
        if (times.length >= 2) return d;

        // se tem 1 período (09-18), transforma em 09-12 e adiciona 13-18
        if (times.length === 1) {
          return {
            ...d,
            times: [
              { start: "09:00:00", end: "12:00:00" },
              { start: "13:00:00", end: "18:00:00" },
            ],
          };
        }

        // se não tem nenhum horário ainda, cria direto com 2 períodos
        return {
          ...d,
          times: [
            { start: "09:00:00", end: "12:00:00" },
            { start: "13:00:00", end: "18:00:00" },
          ],
        };
      });

      setValue("schedule", updated, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue, watch],
  );

  const removeSecondPeriod = useCallback(
    (day: EDayWeek) => {
      const current = (watch("schedule") ?? []) as EmployeeWorkDays[];

      const updated = current.map((d) => {
        if (d.day !== day) return d;

        const times = d.times ?? [];

        // se não tem 2 períodos, não faz nada
        if (times.length < 2) return d;

        // volta para 09:00 às 18:00
        return {
          ...d,
          times: [{ start: "09:00:00", end: "18:00:00" }],
        };
      });

      setValue("schedule", updated, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue, watch],
  );

  // helper pra formatar "09:00:00" => "09:00"
  const formatHour = (t: string) => t?.slice(0, 5);

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-white">
      <AppAdminHeader
        title="Horário de Atendimento"
        iconRightName={undefined}
        iconRight={{ icon: true, path: "" }}
      />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 80 }}
        className="bg-white flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm mb-5">
          <Text className="text-gray-900 font-black text-xl mb-1">
            Dias e Turnos de Trabalho
          </Text>
          <Text className="text-gray-500 text-xs font-medium mb-4 leading-4">
            Selecione os dias em que o profissional atende e toque nos horários para ajustar.
          </Text>

          <View className="flex-row items-center justify-between mb-4 pb-3.5 border-b border-gray-100">
            <Text className="text-[#092D5D] text-xs font-black uppercase tracking-wider">
              Dias de Atendimento
            </Text>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={toggleSelectAllDays}
              className="flex-row items-center gap-1.5 rounded-full border border-[#092D5D]/20 bg-[#092D5D]/10 px-4 py-2"
            >
              <Text className="text-xs font-extrabold text-[#092D5D]">
                {isAllSelected ? "Desmarcar todos" : "Selecionar todos"}
              </Text>
              <MaterialCommunityIcons
                size={22}
                name={isAllSelected ? "toggle-switch" : "toggle-switch-off"}
                color={isAllSelected ? "#092D5D" : "#9ca3af"}
              />
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {DAYS_WEEK.map((day) => {
              const checked = safeSchedule.some((d) => d.day === day);
              const daySchedule = safeSchedule.find((d) => d.day === day);
              const times = daySchedule?.times ?? [];

              return (
                <View
                  key={day}
                  className={`rounded-2xl border p-4.5 shadow-sm ${
                    checked
                      ? "border-[#092D5D] bg-[#092D5D]/5"
                      : "border-gray-200/80 bg-white"
                  }`}
                >
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => toggleDay(day)}
                    className="flex-row items-center justify-between py-1"
                  >
                    <Text className={`text-sm font-black ${checked ? "text-[#092D5D]" : "text-gray-700"}`}>
                      {day}
                    </Text>
                    <MaterialCommunityIcons
                      name={checked ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                      size={24}
                      color={checked ? "#092D5D" : "#9ca3af"}
                    />
                  </TouchableOpacity>

                  {checked && (
                    <View className="mt-3 pt-3.5 border-t border-gray-200/60">
                      {times.length === 0 ? (
                        <Text className="text-gray-400 text-xs font-medium py-1">
                          Nenhum horário definido ainda.
                        </Text>
                      ) : (
                        <View className="gap-3">
                          {times.map((p, index) => (
                            <View
                              key={`${day}-${p.start}-${p.end}-${index}`}
                              className="flex-row flex-wrap items-center justify-between gap-3 rounded-2xl bg-white border border-gray-200/90 p-3.5 shadow-sm"
                            >
                              <View className="flex-row items-center gap-2">
                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={() => {
                                    setEditingTime({
                                      day,
                                      periodIndex: index,
                                      field: "start",
                                      value: p.start,
                                    });
                                    setShowTimePicker(true);
                                  }}
                                  className="rounded-xl bg-[#092D5D] px-3.5 py-2.5 shadow-sm flex-row items-center gap-1.5"
                                >
                                  <MaterialCommunityIcons name="clock-outline" size={15} color="white" />
                                  <Text className="text-white text-xs font-black">
                                    {formatHour(p.start)}
                                  </Text>
                                </TouchableOpacity>

                                <Text className="text-gray-400 text-xs font-bold px-0.5">até</Text>

                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={() => {
                                    setEditingTime({
                                      day,
                                      periodIndex: index,
                                      field: "end",
                                      value: p.end,
                                    });
                                    setShowTimePicker(true);
                                  }}
                                  className="rounded-xl bg-[#092D5D] px-3.5 py-2.5 shadow-sm flex-row items-center gap-1.5"
                                >
                                  <MaterialCommunityIcons name="clock-outline" size={15} color="white" />
                                  <Text className="text-white text-xs font-black">
                                    {formatHour(p.end)}
                                  </Text>
                                </TouchableOpacity>
                              </View>

                              {index === 1 && times.length === 2 && (
                                <TouchableOpacity
                                  activeOpacity={0.8}
                                  onPress={() => removeSecondPeriod(day)}
                                  className="rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 flex-row items-center gap-1"
                                >
                                  <MaterialCommunityIcons name="delete-outline" size={15} color="#EF4444" />
                                  <Text className="text-red-600 text-xs font-bold">
                                    Remover
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          ))}

                          {times.length === 1 && (
                            <TouchableOpacity
                              activeOpacity={0.85}
                              onPress={() => addSecondPeriod(day)}
                              className="self-start rounded-xl border border-[#092D5D] bg-white px-4 py-2.5 mt-1 flex-row items-center gap-1.5"
                            >
                              <MaterialCommunityIcons name="plus-circle-outline" size={16} color="#092D5D" />
                              <Text className="text-[#092D5D] text-xs font-extrabold">
                                + 2º Período (Tarde)
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Card Dica / Resumo */}
        <View className="rounded-2xl bg-amber-50 border border-amber-200/80 p-4.5 mb-6 flex-row items-start gap-3">
          <MaterialCommunityIcons name="lightbulb-on-outline" size={22} color="#B45309" />
          <View className="flex-1">
            <Text className="text-amber-900 font-extrabold text-xs uppercase mb-0.5">Dica de Atendimento</Text>
            <Text className="text-amber-800 text-xs font-medium leading-4">
              Toque em qualquer botão de horário para ajustar as horas de entrada e saída do profissional.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.85}
          className="h-14 bg-[#092D5D] rounded-2xl items-center justify-center shadow-md mb-6"
        >
          <Text className="text-white font-black text-sm uppercase tracking-wide">
            Salvar e Voltar
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {showTimePicker && editingTime && (
        <AppTime
          open={showTimePicker}
          date={timeStringToDate(editingTime.value)}
          onConfirm={(date) => {
            const newTime = dateToTimeString(date);
            updateScheduleTime(editingTime, newTime);

            setShowTimePicker(false);
            setEditingTime(null);
          }}
          onCancel={() => {
            setShowTimePicker(false);
            setEditingTime(null);
          }}
        />
      )}
    </SafeAreaView>
  );
}

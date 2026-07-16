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
    <SafeAreaView style={{ flex: 1 }} className="bg-background-primary">
      <AppAdminHeader
        title="Horário de trabalho"
        iconRightName={undefined}
        iconRight={{ icon: true, path: "" }}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        className="px-4 pt-4"
      >
        <View className="rounded-3xl border border-zinc-800 bg-background-tertiary p-4 shadow-sm shadow-black/10">
          <Text className="text-font-primary font-semibold text-lg mb-3">
            Dias da semana
          </Text>
          <Text className="text-font-primary/70 text-sm mb-4">
            Selecione os dias em que o profissional trabalha e ajuste os horários.
          </Text>

          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-font-primary font-bold">Todos os dias</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleSelectAllDays}
              className="flex-row items-center gap-2 rounded-2xl border border-app-theme-primary bg-background-primary px-4 py-2"
            >
              <Text className="text-sm font-semibold text-app-theme-primary">
                {isAllSelected ? "Desmarcar" : "Selecionar todos"}
              </Text>
              <MaterialCommunityIcons
                size={22}
                name={isAllSelected ? "toggle-switch" : "toggle-switch-off"}
                color={isAllSelected ? colors["app-theme-primary"] : colors.white}
              />
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            {DAYS_WEEK.map((day) => {
              const checked = safeSchedule.some((d) => d.day === day);
              const daySchedule = safeSchedule.find((d) => d.day === day);
              const times = daySchedule?.times ?? [];

              return (
                <View
                  key={day}
                  className={`rounded-3xl border my-2 px-4 py-4  ${
                    checked
                      ? "border-app-theme-primary bg-slate-950/70"
                      : "border-zinc-800 bg-background-quartenary"
                  }`}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => toggleDay(day)}
                    className="flex-row items-center justify-between"
                  >
                    <Text className={`text-base font-semibold ${checked ? "text-white" : "text-font-primary/80"}`}>
                      {checked ? "✅" : "⬜"} {day}
                    </Text>
                    <MaterialCommunityIcons
                      name={checked ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"}
                      size={24}
                      color={checked ? colors["app-theme-primary"] : colors.gray[400]}
                    />
                  </TouchableOpacity>

                  {checked && (
                    <View className="mt-4 space-y-3 ">
                      {times.length === 0 ? (
                        <Text className="text-white/80 text-sm">
                          Nenhum horário definido ainda.
                        </Text>
                      ) : (
                        <View className="space-y-3 gap-2">
                          {times.map((p, index) => (
                            <View
                              key={`${day}-${p.start}-${p.end}-${index}`}
                              className="flex-row flex-wrap items-center justify-between gap-2 rounded-3xl bg-slate-900/90 px-3 py-3"
                            >
                              <TouchableOpacity
                                onPress={() => {
                                  setEditingTime({
                                    day,
                                    periodIndex: index,
                                    field: "start",
                                    value: p.start,
                                  });
                                  setShowTimePicker(true);
                                }}
                                className="rounded-full bg-app-theme-primary px-4 py-2"
                              >
                                <Text className="text-white text-sm font-semibold">
                                  {formatHour(p.start)}
                                </Text>
                              </TouchableOpacity>

                              <Text className="text-white/70">até</Text>

                              <TouchableOpacity
                                onPress={() => {
                                  setEditingTime({
                                    day,
                                    periodIndex: index,
                                    field: "end",
                                    value: p.end,
                                  });
                                  setShowTimePicker(true);
                                }}
                                className="rounded-full bg-app-theme-primary px-4 py-2"
                              >
                                <Text className="text-white text-sm font-semibold">
                                  {formatHour(p.end)}
                                </Text>
                              </TouchableOpacity>

                              {index === 1 && times.length === 2 && (
                                <TouchableOpacity
                                  onPress={() => removeSecondPeriod(day)}
                                  className="rounded-full bg-red-500 px-3 py-2"
                                >
                                  <Text className="text-white text-xs">
                                    Remover
                                  </Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          ))}

                          {times.length === 1 && (
                            <TouchableOpacity
                              onPress={() => addSecondPeriod(day)}
                              className="self-start rounded-full border border-app-theme-primary bg-background-primary px-4 py-2"
                            >
                              <Text className="text-app-theme-primary text-sm">
                                + 2º período
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

        <View className="mt-6 rounded-3xl bg-background-tertiary p-4 shadow-sm shadow-black/10">
          <Text className="text-font-primary font-semibold mb-2">Resumo</Text>
          <Text className="text-font-primary/70 text-sm leading-6">
            Toque em qualquer horário para editar e use os botões para adicionar ou remover períodos.
          </Text>
        </View>

        <View className="mt-6 px-1">
          <AppButton
            onPress={() => router.back()}
            leftIcon="arrow-back"
            size
            variant="admin"
          >
            Voltar
          </AppButton>
        </View>
      </ScrollView>

      {showTimePicker && editingTime && (
        <AppTime
          open={showTimePicker}
          date={timeStringToDate(editingTime.value)}
          onConfirm={(date) => {
            const newTime = dateToTimeString(date); // "HH:mm:00" ou "HH:mm:ss"
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

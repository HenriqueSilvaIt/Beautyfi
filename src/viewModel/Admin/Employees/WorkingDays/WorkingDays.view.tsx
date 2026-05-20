import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
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
import { useAgendaStore } from "@/shared/store/agenda-store";
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
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        className="flex-1 px-2"
      >
        <AppAdminHeader
          title="Horário de trabalho"
          iconRightName={undefined}
          iconRight={{ icon: true, path: "" }}
        />
        <View className="px-4 my-3">
          <Text className="text-font-primary font-semibold mb-2">Dias da semana</Text>

          <View className=" items-center *:mb-3 ml-2">
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={toggleSelectAllDays}
              className="flex-row gap-2 items-center"
            >
              <Text className="text-base font-bold text-end text-font-primary">
                {isAllSelected ? "Desmarcar todos" : "Selecionar todos"}
              </Text>
              <MaterialCommunityIcons
                size={40}
                name={isAllSelected ? "toggle-switch" : "toggle-switch-off"}
                color={isAllSelected ? colors["accent-blue"] : colors.white}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap ">
            {DAYS_WEEK.map((day) => {
              const checked = safeSchedule.some((d) => d.day === day);
              const daySchedule = safeSchedule.find((d) => d.day === day);
              const times = daySchedule?.times ?? [];
              console.log(`🗓️ ${day} times:`, JSON.stringify(times)); // ← aqui

              return (
                <View
                  key={day}
                  className=" bg-background-tertiary mb-2 border-white border  items-center w-full  "
                >
                  <View className="min-h-[40px] justify-center">
                    <Text
                      onPress={() => toggleDay(day)}
                      className={`pr-3 rounded-xl text-center   ${
                        checked ? " text-font-primary" : "bg-gray-800 text-gray-200"
                      }`}
                    >
                      {checked ? "✅ " : "⬜ "} {day}
                    </Text>
                  </View>
                  {/* Horários do dia */}

                  {checked && (
                    <View
                      className={` items-center w-full justify-center flex-col
                      ${times.length === 1 && "flex-col"}`}
                    >
                      {times.length === 0 ? (
                        <Text className="text-font-primary/80 text-sm">
                          Nenhum horário adicionado
                        </Text>
                      ) : (
                        <>
                          {/* Lista os períodos */}

                          <View className="flex-row flex-wrap    px-5">
                            {times.map((p, index) => (
                              <View
                                key={`${day}-${p.start}-${p.end}-${index}`}
                                className="flex-row items-center justify-center mb-1"
                              >
                                {/* START */}
                                <Text
                                  onPress={() => {
                                    setEditingTime({
                                      day,
                                      periodIndex: index,
                                      field: "start",
                                      value: p.start,
                                    });
                                    setShowTimePicker(true);
                                  }}
                                  className="px-3 py-2 rounded-l-full bg-black/20 text-font-primary text-sm"
                                >
                                  {formatHour(p.start)}
                                </Text>
                                <Text className="text-font-primary px-1">|</Text>

                                {/* END */}
                                <Text
                                  onPress={() => {
                                    setEditingTime({
                                      day,
                                      periodIndex: index,
                                      field: "end",
                                      value: p.end,
                                    });
                                    setShowTimePicker(true);
                                  }}
                                  className="px-3  rounded-r-full bg-black/20 text-font-primary text-sm text-center"
                                >
                                  {formatHour(p.end)}
                                </Text>
                                {index === 1 && times.length === 2 && (
                                  <Text
                                    onPress={() => removeSecondPeriod(day)}
                                    className="rounded-full text-font-primary text-sm text-center"
                                  >
                                    ❌
                                  </Text>
                                )}
                              </View>
                            ))}
                          </View>

                          {/* ✅ Botão + abaixo do primeiro período */}
                          {times.length === 1 && (
                            <Text
                              onPress={() => addSecondPeriod(day)}
                              className="rounded-full text-font-primary text-sm pb-2 px-2"
                            >
                              ➕ 2º período
                            </Text>
                          )}
                        </>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
          <View className="justify-center items-center  px-6 ">
            <TouchableOpacity
              onPress={() => router.back()}
              activeOpacity={0.8}
              className="px-6  py-2 rounded-md bg-app-theme-primary items-center justify-center"
            >
              <Text className="text-font-primary text-center text-base font-bold">
                Voltar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

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
      </ScrollView>
    </SafeAreaView>
  );
}

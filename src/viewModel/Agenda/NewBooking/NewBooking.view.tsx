import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useNewBookingViewModel } from "./useNewBokingViewModel";
import { useState } from "react";
import { AppInputController } from "@/shared/components/AppInputControler";
import { AppDate } from "@/shared/components/AppDate";
import { AppTime } from "@/shared/components/AppTime";

export function NewBookingView() {
  const {
    handleOpenClientList,
    handleOpenServiceList,
    createBooking,
    isListLoading,
    control,
  } = useNewBookingViewModel();

  const { formatDateToBR, timeStringToDate, dateToTimeString } =
    useFormatDate();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { fitIn, setFitIn } = useAgendaStore();

  const selectedDay = useAgendaStore((s) => s.selectedDay);
  const setDate = useAgendaStore((s) => s.setDay);

  const time = useAgendaStore((s) => s.time);
  const setTime = useAgendaStore((s) => s.setTime);
  const employee = useAgendaStore((s) => s.employee);
  const client = useAgendaStore((s) => s.client);
  const service = useAgendaStore((s) => s.service);

  console.log(` ` + employee);
  console.log(` ` + JSON.stringify({ client }));

  console.log(`c ` + JSON.stringify(client));
  console.log(selectedDay);

  return (
    <KeyboardContainer>
      <ScrollView className="my-5 px-[2px]" keyboardShouldPersistTaps="handled">
        <AppAdminHeader
          title="Novo agendamento"
          iconRightName={undefined}
          iconRight={{
            icon: true,
            path: "",
          }}
        />

        <View className=" items-center justify-center mb-5">
          <Text className="text-font-primary text-xl text-center border-b-2 semi-bold border-app-theme-primary">
            Data e Hora
          </Text>
        </View>

        <View className="items-center justify-center mb-5 bg-background-tertiary w-full min-h-[40px] rounded-md p-2">
          <View className=" gap-4 flex-row justify-center items-center">
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              activeOpacity={0.8}
            >
              <View className=" rounded-md flex-row gap-2 p-2">
                <Ionicons name="calendar" size={24} color={colors.white} />
                {selectedDay && (
                  <Text className="text-font-primary font-semibold text-base">
                    {formatDateToBR(selectedDay)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowTimePicker(true)}
            >
              <View className=" rounded-md flex-row p-2 gap-2">
                <Ionicons name="time" size={28} color={colors.white} />
                <Text
                  className={`text-font-primary font-semibold text-base
                    ${time && `text-base`}`}
                >
                  {time ?? "Selecione um horário"}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            className={`flex-row gap-3 items-center justify-between  px-4 py-2 rounded-md
        ${fitIn ? "bg-green-600" : "bg-gray-800"}`}
          >
            <Text className="text-base text-font-primary">
              {fitIn ? "Encaixe ativado" : "Encaixe desativado"}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setFitIn(!fitIn)}>
            <MaterialCommunityIcons
              name={
                fitIn ? "toggle-switch-outline" : "toggle-switch-off-outline"
              }
              size={40}
              color={fitIn ? "green" : "white"}
            />
          </TouchableOpacity>
          {fitIn && (
            <View className="rounded-sm">
              <Text className="text-app-theme-primary  text-center text-sm">
                Se encaixe estiver ativo, não será levado em consideração
                horários ocupados na agenda.
              </Text>
            </View>
          )}
        </View>

        <View className=" items-center justify-center mb-5">
          <Text className="text-font-primary text-xl text-center border-b-2 font-semibold border-app-theme-primary">
            Profissional
          </Text>
        </View>

        {employee && (
          <View className="gap-2 items-center justify-center mb-5 bg-background-tertiary w-full rounded-md flex-row flex-wrap p-2">
            <Image
              source={{ uri: employee.avatarUrl }}
              resizeMode="cover"
              className="h-[40px] w-[40px] rounded-full"
            />

            <Text className="text-base text-font-primary">{employee.name}</Text>
          </View>
        )}

        <View className=" items-center justify-center  gap-2 ">
          <Text className="text-font-primary text-xl text-center border-b-2 font-semibold border-app-theme-primary">
            Cliente
          </Text>
          <Text className="text-gray-600 text-base text-center ">
            Selecione para alterar o cliente:
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleOpenClientList()}
        >
          <View className="gap-2 items-center justify-center mb-5 bg-background-tertiary w-full rounded-md flex-row flex-wrap p-2">
            {client?.profileUrl ? (
              <Image
                source={{ uri: client?.profileUrl }}
                resizeMode="cover"
                className={`h-[40px] w-[40px] rounded-full border-2 
                ${client ? "border-app-theme-primary" : "border-gray-800"}  `}
              />
            ) : (
              <View className="w-[40px] h-[40px] rounded-full border border-white items-center justify-center">
                <Text>👤</Text>
              </View>
            )}
            <Text className="text-base text-font-primary">
              {client ? client.name : "Selecione um cliente"}
            </Text>
          </View>
        </TouchableOpacity>

        <View className=" items-center justify-center  gap-2 ">
          <Text className="text-font-primary text-xl text-center border-b-2 font-semibold border-app-theme-primary">
            Serviço
          </Text>
          <Text className="text-gray-600 text-base text-center ">
            Selecione para alterar o serviço:
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.8} onPress={handleOpenServiceList}>
          <View className="gap-2 items-center justify-center mb-5 bg-background-tertiary w-full rounded-md flex-row flex-wrap p-2">
            {service?.imgUrl ? (
              <Image
                source={{ uri: service?.imgUrl }}
                resizeMode="cover"
                className={`h-[40px] w-[40px] rounded-full border-2 
                ${service ? "border-app-theme-primary" : "border-gray-800"}  `}
              />
            ) : (
              <View className="w-[40px] h-[40px] rounded-full border border-white items-center justify-center">
                <Text>👤</Text>
              </View>
            )}
            <Text className="text-base text-font-primary">
              {service ? service.name : "Selecione um serviço"}
            </Text>
          </View>
        </TouchableOpacity>

       

        <AppInputController
          leftIcon="information-circle-outline"
          label="Informações adicionais"
          control={control}
          name="additionalInfo"
          placeholder="Adicionar informações"
          className="max-w-20"
          placeholderTextColor={colors.gray[600]}
          multiline={true}
          numberOfLines={3}
        />

        <View className="justify-center items-center px-6 ">
          <TouchableOpacity
            onPress={createBooking}
            activeOpacity={0.8}
            className="px-6 py-2 rounded-md bg-app-theme-primary items-center justify-center"
          >
            <Text className="text-font-primary text-center text-base font-bold">
              Agendar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showDatePicker && (
        <AppDate
          open={showDatePicker}
          date={selectedDay || new Date()}
          onConfirm={(date) => {
            setDate(date);
            setShowDatePicker(false);
          }}
          onCancel={() => setShowDatePicker(false)}
        />
      )}

      {showTimePicker && (
        <AppTime
          open={showTimePicker}
          date={timeStringToDate(time)}
          onConfirm={(date) => {
            setTime(dateToTimeString(date));
            setShowTimePicker(false);
          }}
          onCancel={() => setShowTimePicker(false)}
        />
      )}
    </KeyboardContainer>
  );
}

import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { useBookingDetailsViewModel } from "./useBookingDetailsViewModel";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { AppInputController } from "@/shared/components/AppInputControler";
import { AppDate } from "@/shared/components/AppDate";
import { AppTime } from "@/shared/components/AppTime";
import { useFormatDate } from "@/shared/hooks/useFormatDate";
import { useState } from "react";
import { useAgendaStore } from "@/shared/store/agenda-store";
import { moneyMapper } from "@/utils/moneyMapper";
import { DeleteModal } from "@/shared/components/AppDeleteModal";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { router } from "expo-router";
import { Loading } from "@/shared/components/Loading";
import { AppTimeSelector } from "@/shared/components/AppTimeSelector";
import { AppDateSelector } from "@/shared/components/AppDateSelector";

export function BookingDetailsView({
  appointment,
  selectedDay,
  setTime,
  time,
  fitIn,
  control,
  service,
  // actions
  detailsLoading,
  handleOpenClientList,
  isDeleteLoading,
  handleDeleteAppointment,
  setIsDeleteLoading,
  handleOpenServiceList,
  formatDateToBR,
  timeStringToDate,
  dateToTimeString,
  hideModal,
  showModal,
  selectedAppointmentCancelId,
  modalVisible,
  updateBooking,
  isListLoading,
}: ReturnType<typeof useBookingDetailsViewModel>) {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const { setFitIn } = useAgendaStore();
  const { safePush } = useSafeNavigation();

  const setDate = useAgendaStore((s) => s.setDay);

  const employee = useAgendaStore((s) => s.employee);
  const client = useAgendaStore((s) => s.client);

  if (detailsLoading) {
    return <Loading />;
  }

  return (
    <KeyboardContainer>
      <ScrollView className="bg-background-primary flex-1">
        <AppAdminHeader
          title={`Comanda Nº ${appointment?.orderNumber}`}
          iconRightName="trash"
          iconRight={{
            icon: true,
            path: "",
          }}
          action={() => showModal(appointment!.id)}
        />
        <View className=" items-center justify-center mb-5">
          <Text
            className="text-font-primary text-xl text-center border-b-2 semi-bold
           border-app-theme-primary"
          >
            Data e Hora
          </Text>
        </View>
        <View className="items-center justify-center mb-5 bg-background-tertiary w-full min-h-[40px] rounded-md p-2">
          <View className=" gap-4 flex-row justify-center items-center">
            <AppDateSelector
              selectedDay={selectedDay}
              setShowDatePicker={setShowDatePicker}
              formatDateToBR={formatDateToBR}
              setDate={setDate}
              showDatePicker={showDatePicker}
            />
            <AppTimeSelector
              showTimePicker={showTimePicker}
              setShowTimePicker={setShowTimePicker}
              time={time}
              setTime={setTime}
              timeStringToDate={timeStringToDate}
              dateToTimeString={dateToTimeString}
            />
          </View>

          <View
            className={`flex-row gap-3 items-center justify-between  px-4 py-2 rounded-md
        ${fitIn ? "bg-green-600" : "bg-gray-800"}`}
          >
            <Text className="text-base text-font-secundary">
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

        {/* Cliente */}
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
              <View className="bg-background-agenda w-[40px] h-[40px] rounded-full border border-white items-center justify-center">
                <Ionicons
                  name="person"
                  size={22}
                  color={colors["app-theme-primary"]}
                />
              </View>
            )}
            <Text className="text-base font-bold text-font-primary">
              {client ? client?.name : "Selecione um cliente"}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Profissional */}
        <View className=" items-center justify-center mb-2">
          <Text className="text-font-primary text-xl text-center border-b-2 font-semibold border-app-theme-primary">
            Profissional
          </Text>
        </View>
        {employee && (
          <View className="gap-2 items-center justify-center mb-2 bg-background-tertiary w-full rounded-md flex-row flex-wrap p-2">
            {employee.avatarUrl ? (
              <Image
                source={{ uri: employee.avatarUrl }}
                resizeMode="cover"
                className="h-[40px] w-[40px] rounded-full"
              />
            ) : (
              <View className="bg-background-agenda w-[40px] h-[40px] rounded-full border border-white items-center justify-center">
                <Text>👤</Text>
              </View>
            )}
            <Text className="text-base text-font-primary">{employee.name}</Text>
          </View>
        )}

        {/* Serviço */}
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
              <View className="bg-background-agenda h-[40px] w-[40px] rounded-full items-center justify-center">
                <Ionicons
                  name="cut"
                  size={22}
                  color={colors["app-theme-primary"]}
                />
              </View>
            )}
            <View className={`flex-col ${service ? "gap-1" : ""}`}>
              <Text className="text-base text-font-primary">
                {service ? service.name : "Selecione um serviço"}
              </Text>
              {service && (
                <Text className="text-base text-font-primary">
                  R$ {moneyMapper(service.price)}
                </Text>
              )}
            </View>
          </View>
        </TouchableOpacity>

        <View className="pl-2 ">
          {/* Informações adicionais */}
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
        </View>
      </ScrollView>

      {/* Botões de ação */}
      <View className="flex-row items-center justify-center gap-4 py-2">
        <TouchableOpacity
          onPress={updateBooking}
          activeOpacity={0.8}
          className="bg-app-theme-primary p-3 rounded-2xl"
        >
          <Text className="text-font-secundary font-semibold  text-base">
            Salvar alterações
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            hideModal();
            safePush(
              `/(private)/(tabs)/(admin-tabs)/finance/order/order-details/${appointment?.orderId ?? appointment?.id}`,
            );
          }}
          activeOpacity={0.8}
          className="bg-app-theme-primary p-3 rounded-2xl"
        >
          <Text className="text-font-secundary font-semibold  text-base">
            Acessar comanda
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal de confirmação de cancelamento */}
      {modalVisible && (
        <DeleteModal
          loading={isDeleteLoading}
          visible={modalVisible}
          confirmationButtonText="Confirmar"
          confirmationButtonColor
          cancelbuttonText="Não cancelar"
          hideModal={hideModal}
          appointment={appointment}
          handleDeleteAppointment={async (appointmentsToDelete) => {
            const appointmentToDelete = Array.isArray(appointmentsToDelete)
              ? appointmentsToDelete[0]
              : appointmentsToDelete;

            if (appointmentToDelete) {
              await handleDeleteAppointment(appointmentToDelete);
            }

            hideModal();
          }}
          description="Tem certeza que deseja cancelar o agendamento?"
          title="Cancelar agendamento"
        />
      )}
    </KeyboardContainer>
  );
}

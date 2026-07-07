import { AppointmentProps } from "@/shared/interfaces/http/appointment";
import { EmployeeProps } from "@/shared/interfaces/http/employee";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { AgendaBlock } from "./AgendaBlock";
import { EmployeeOffHours } from "./EmployeeOffHours";
import { useState } from "react";
import { BlockedAgendaBlock } from "./BlockedAgendaBlock";
import { DeleteModal } from "../AppDeleteModal";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";

type BlockedRangeInterface = {
  time: string;
  duration: number;
};

type SlotsInterface = {
  key: string;
  time: string;
  showLabel: boolean;
};

interface AppAgendaProps {
  safeEmployee: EmployeeProps;
  appointments: AppointmentProps[];
  onCreate?: (data: { time: string; duration: number }) => void;
  handleSlotPress: (time: string) => void;
  scrollRef: React.RefObject<ScrollView | null>;
  appointmentGroups: AppointmentProps[][];
  blockedRanges: BlockedRangeInterface[];
  slots: SlotsInterface[];
  selectedTime: string | null;
  getCurrentTimePosition: (
    currentTimeS: string,
    slotHeight: number,
    numberPerSlot: number,
  ) => number;
  selectedAppointmentId?: number;
  setSelectedAppointmentId: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  getEndTime: (startTime: string, duration: number) => string;
  SLOT_HEIGHT: number;
  CONTENT_HEIGHT: number;
  isDeleting: boolean;
  currentY: number;
  deleteAppointmentBlocked: (id: number) => void;
  overlapsAppointment: (
    time: string,
    duration: number,
    appointments: AppointmentProps[],
  ) => boolean;
  selectedAppointmentCancelId: number | null;
  setSelectedCancelAppointmentId: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  isWorkingTime: (time: string, employee: EmployeeProps) => boolean;
  handleDeleteAppointment: (data: AppointmentProps[]) => Promise<void>;
  modalVisible: boolean;
  showModal: (id: number) => void;
  hideModal: () => void;
  isDeleteLoading: boolean;
}

export function AppAgenda({
  appointmentGroups,
  scrollRef,
  SLOT_HEIGHT,
  handleSlotPress,
  CONTENT_HEIGHT,
  blockedRanges,
  selectedTime,
  slots,
  getEndTime,
  modalVisible,
  showModal,
  hideModal,
  isDeleteLoading,
  selectedAppointmentId,
  setSelectedAppointmentId,
  appointments,
  handleDeleteAppointment,
  currentY,
  deleteAppointmentBlocked,
  isDeleting,
}: AppAgendaProps) {
  const [modalBlockVisible, setModalBlockVisible] = useState(false);
  const { safePush } = useSafeNavigation();

  function showBlockModal(id: number) {
    setSelectedAppointmentId(id);
    setModalBlockVisible(true);
  }

  function hideBlockModal() {
    setModalBlockVisible(false);
    setSelectedAppointmentId(0);
  }

  return (
    <View className="flex-1 bg-background-agenda">
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="always"
        contentContainerStyle={{
          paddingBottom: 40,
          paddingTop: 40,
        }}
      >
        <View style={{ height: CONTENT_HEIGHT, position: "relative" }}>
          {/* 🔹 SLOTS */}
          {slots.map((slot) => {
            const selected = selectedTime === slot.time;

            return (
              <TouchableOpacity
                key={slot.key}
                onPress={() => handleSlotPress(slot.time)}
                style={{
                  height: SLOT_HEIGHT,
                  backgroundColor: selected ? "#DBEAFE" : "transparent",
                }}
                className="flex-row"
              >
                <View className="w-12 items-end pr-1 bg-background-agenda">
                  {slot.showLabel ? (
                    <Text className="text-[11px] text-gray-300 font-semibold  ">
                      {slot.time}
                    </Text>
                  ) : (
                    <Text className="text-[10px] text-gray-300  ">
                      {slot.time}
                    </Text>
                  )}
                </View>

                <View className="flex-1 border-b border-gray-200" />
              </TouchableOpacity>
            );
          })}
          {/* 🔹 OFF HOURS */}
          {blockedRanges.map((range) => (
            <EmployeeOffHours
              key={`blocked-${range.time}`}
              time={range.time}
              duration={range.duration}
              agendaStart="00:00"
            />
          ))}

          {/* 🔹 AGENDAMENTOS */}
          {appointmentGroups.map((group) =>
            group.map((app, index) =>
              app.blocked ? (
                <BlockedAgendaBlock
                  key={app.id}
                  appointment={app}
                  overlapIndex={index}
                  overlapTotal={group.length}
                  onPress={() => showBlockModal(app.id)}
                />
              ) : (
                <AgendaBlock
                  key={app.id}
                  appointment={app}
                  getEndTime={getEndTime}
                  overlapIndex={index}
                  overlapTotal={group.length}
                  onPress={() => safePush(`/(private)/(tabs)/(admin-tabs)/agenda/booking-details/${app.id}`)}
                />
              ),
            ),
          )}

          {/* 🔴 LINHA DO HORÁRIO ATUAL */}
          <View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: currentY,
              left: 48,
              right: 0,
              height: 2,
              backgroundColor: "#FF0000", // vermelho puro
              zIndex: 100,
            }}
          >
            {/* bolinha */}
            <View
              style={{
                position: "absolute",
                left: -6,
                top: -4,
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#FF0000",
              }}
            />
          </View>
        </View>

        <DeleteModal
          loading={isDeleting}
          visible={modalBlockVisible}
          confirmationButtonText="Desbloquear"
          confirmationButtonColor
          hideModal={hideBlockModal}
          handleDelete={() => {
            if (!selectedAppointmentId) return;
            deleteAppointmentBlocked(selectedAppointmentId);
            hideBlockModal();
          }}
          description="Tem certeza que deseja desbloquear o período?"
          title="Desbloquear horário"
        />

      </ScrollView>
    </View>
  );
}

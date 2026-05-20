import {
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import { AppointmentProps } from "@/shared/interfaces/http/appointment";
import { useTime } from "@/shared/hooks/useTime";

interface Props {
  appointment: AppointmentProps;
  overlapIndex: number;
  overlapTotal: number;
  onPress: (id: number) => void;
}

export function BlockedAgendaBlock({
  appointment,
  overlapIndex,
  overlapTotal,
  onPress,
}: Props) {
  const { timeToTop, SLOT_HEIGHT } = useTime();

  const start = new Date(appointment.dateScheduled);
  const end = appointment.dateEnd ? new Date(appointment.dateEnd) : null;

  if (!end) return null;

  const top = timeToTop(
    `${String(start.getHours()).padStart(2, "0")}:${String(start.getMinutes()).padStart(2, "0")}`,
  );

  const durationMinutes = (end.getTime() - start.getTime()) / 60000;
  const height = (durationMinutes / 10) * SLOT_HEIGHT;

  const BASE_LEFT = 56;
  const GAP = 4;

  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const TOTAL_WIDTH = SCREEN_WIDTH - BASE_LEFT - 16; // padding horizontal

  // largura igual ao AgendaBlock
  const width = Math.max(TOTAL_WIDTH / overlapTotal - GAP, 70);
  const left = BASE_LEFT + overlapIndex * (width + GAP);
  return (
    <TouchableOpacity
      onPress={() => onPress(appointment.id)}
      activeOpacity={0.8}
        style={{
          position: "absolute",
          top,
          left,
          width,
          height,
          borderRadius: 8,
          backgroundColor: "#E7E7E7", // cinza claro
          borderWidth: 1,
          borderColor: "#AFAFAF",
          justifyContent: "center",
          alignItems: "center",
        }}
    >
     
        <Text style={{ color: "#333", fontWeight: "700" }}>
          HORÁRIO BLOQUEADO
        </Text>
    </TouchableOpacity>
  );
}

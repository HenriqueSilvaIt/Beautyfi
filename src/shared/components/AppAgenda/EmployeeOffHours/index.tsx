import { View } from "react-native";
import { TouchableWithoutFeedback } from "react-native"; // aqui usamos RN mesmo
import { useTime } from "@/shared/hooks/useTime";

interface Props {
  time: string;
  duration: number;
  agendaStart: string;
  onPress?: () => void; // callback quando clicar
}

export function EmployeeOffHours({ time, duration, onPress }: Props) {
  const { timeToTop } = useTime();
  const SLOT_HEIGHT = 40;

  const top = timeToTop(time);

 // limite máximo de altura (24h)
  const MAX_HEIGHT = 24 * 6 * SLOT_HEIGHT;

  // height segura
  const height = Math.min(
    (duration / 10) * SLOT_HEIGHT,
    MAX_HEIGHT
  );
  if (height <= 0) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: "absolute",
        top,
        height,
        left: 56,
        right: 8,
        borderRadius: 8,
      }}
      className="bg-gray-300"
    />
  );
}

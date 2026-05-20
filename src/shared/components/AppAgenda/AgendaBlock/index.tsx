import {
  View,
  Text,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import {
  AppointmentProps,
  EAppointmentType,
} from "@/shared/interfaces/http/appointment";
import { useAgenda } from "@/shared/hooks/useAgenda";
import { useTime } from "@/shared/hooks/useTime";
import { moneyMapper } from "@/utils/moneyMapper";
import { colors } from "@/styles/colors";
import { useUserStore } from "@/shared/store/user-store";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  appointment: AppointmentProps;
  onPress: (id: number) => void;
  getEndTime: (startTime: string, duration: number) => string;
  overlapIndex: number;
  overlapTotal: number;
}

export function AgendaBlock({
  appointment,
  onPress,
  getEndTime,
  overlapIndex,
  overlapTotal,
}: Props) {
  const {
    getAppointmentStart,
    getAppointmentDuration,
    SLOT_HEIGHT,
    getServiceName,
    getServicePrice,

    getUser,
  } = useAgenda();
  const { timeToTop } = useTime();

  const { user } = useUserStore();
  const start = getAppointmentStart(appointment);
  const duration = getAppointmentDuration(appointment.services);
  const endTime = getEndTime(start, duration);

  const userAvatar = getUser(appointment.user);
  const serviceName = getServiceName(appointment.services);

  const servicePrice = getServicePrice(appointment.services);

  const top = timeToTop(start);
  const height = (duration / 10) * SLOT_HEIGHT;

  const BASE_LEFT = 56;
  const GAP = 4;
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const TOTAL_WIDTH = SCREEN_WIDTH - BASE_LEFT - 16; // padding horizontal

  const width = Math.max(TOTAL_WIDTH / overlapTotal - GAP, 70); // largura mínima
  const isNarrow = width < 200; // ajuste esse valor se quiser
  const MIN_HEIGHT_FOR_FULL_SMALL_CONTENT = 120;
  const MIN_WIDTH_FOR_FULL_SMALL_CONTENT = 120;

  const isSmallHeight = height < MIN_HEIGHT_FOR_FULL_SMALL_CONTENT;
  const isSmallWidth = height < MIN_WIDTH_FOR_FULL_SMALL_CONTENT;

  const paddingHorizontal = width < 100 ? 2 : 8;

  const left = BASE_LEFT + overlapIndex * (width + GAP);

  const TYPE_COLOR_MAP: Record<EAppointmentType, string> = {
    ADMIN: colors["app-theme-primary"],
    CLIENT: colors["accent-blue"],
    IA: colors["accent-purple"],
  };

  const roleColor = appointment?.type
    ? TYPE_COLOR_MAP[appointment.type]
    : undefined;

  const borderLeftColor = appointment.schedulingFitIn
    ? colors["accent-red"]
    : (roleColor ?? colors["accent-gray"]);
  console.log(appointment.additionalInfo);
  return (
    <TouchableOpacity
      className="bg-accent-blue-dark border-l-4 border-green-400"
      activeOpacity={0.8}
      onPress={() => onPress(appointment.id)}
      style={{
        position: "absolute",
        borderLeftWidth: 4,
        borderLeftColor: borderLeftColor, // verde
        backgroundColor: "#0f180a", // seu bg-accent-blue-dark
        top,
        width,
        height,
        left,
        right: 8,
        borderRadius: 8,
        padding: paddingHorizontal,
        zIndex: 20,
        elevation: 5,
      }}
    >
      <View
        style={{
          flexDirection: isNarrow ? "column" : "row",
          alignItems: "center",
          shadowColor: colors.black,
          shadowOpacity: 0.5,
        }}
      >
        <View className="">
          {!isSmallHeight && (
            <Image
              source={{ uri: userAvatar }}
              className={`w-[40px] h-[40px] rounded-full border-white ${
                isNarrow ? "mb-1" : "mr-2"
              }`}
              resizeMode="cover"
            />
          )}
        </View>
        <View
          style={{
            justifyContent: "flex-start",
            flexShrink: 1,
            alignItems: isNarrow ? "center" : "flex-start",
          }}
        >
          <Text
            className="text-font-primary font-semibold"
            style={{
              fontSize: isSmallHeight ? 12 : isSmallWidth ? 12 : 14,
            }}
            numberOfLines={isSmallHeight ? 1 : 2}
            ellipsizeMode="tail"
          >
            {start} • {endTime}
          </Text>

          <Text
            className="text-font-primary"
            style={{
              fontSize: isSmallHeight ? 12 : isSmallWidth ? 12 : 14,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {appointment.client?.name}{" "}
            {appointment.schedulingFitIn === true && "- [ENCAIXE]"}{" "}
          </Text>

          {appointment.usingSubscription === true && (
            <View className="flex-row gap-2">
              <Text className="text-font-primary">Cliente de assinatura</Text>
              <Ionicons
                name="diamond-outline"
                color={colors["app-theme-primary"]}
                size={22}
              />
            </View>
          )}
          <Text
            className="text-font-primary "
            style={{
              fontSize: isSmallHeight ? 12 : isSmallWidth ? 12 : 13,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {serviceName} • R$ {moneyMapper(servicePrice)}
          </Text>

          <Text
            className="text-font-primary"
            style={{
              fontSize: isSmallHeight ? 12 : isSmallWidth ? 12 : 14,
            }}
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {appointment.additionalInfo}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

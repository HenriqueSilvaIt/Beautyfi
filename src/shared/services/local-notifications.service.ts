import { colors } from "@/styles/colors";
import { secondsInMinute } from "date-fns/constants";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useFormatDate } from "../hooks/useFormatDate";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Usamos canais para agrupar nossas notificações

const DEFAULT_CHANNEL = "default";

//Precisamos criar IDs identificadores para nossas notificações

const NOTIFICATION_IDS = {
  BOOKING_REMEMBER: "booking-remember",
  BOOKING_CONFIRMATION: "booking_confirmation",
};

//URL base do deep link, rotas de private e public n precisa colocar
// pode colocar quando for chamar a rota direto
const DEEP_LINK = "dompalagani-app://"
function formatDateBR(date: Date | string) {
  const parsedDate = new Date(date);

  return parsedDate.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true, //toca o som da notificação
    shouldShowBanner: true, //Exibi o banner da notificação no top oda tela no IOs
    shouldSetBadge: false, // Não atualiza a Badge da nossa noticação (icone)
    shouldShowList: true, // Adicionar nossa notificação na listagem
    // tem priority que seria a prioridade nossa notificação
  }),
});

// Channel é só no android por isso usamos o If
async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(DEFAULT_CHANNEL, {
      name: "Notificações do Dom Palagani",
      importance: Notifications.AndroidImportance.HIGH, //Importancia alta
      vibrationPattern: [0, 250, 205, 250], // Essas propridades alteram como o celular vibra
      lightColor: colors["app-theme-primary"],
      sound: "default", // Som padrão do celular, n precisa colocar porque já é padrão
    });
  }
}

interface ScheduleBookingReminderInteface {
  appointmentId: number;
  dateScheduled: Date;
  serviceName: string;
  employeeName: string;
  delayInMinutes: number;
}

async function requestPermissions(): Promise<boolean> {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    //Perissão negada
    const { status } = await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  return finalStatus === "granted";
}

async function  cancelNotifications(notificationId: string) {


  try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.log()
  }
}

async function scheduleBookingReminder({
  dateScheduled,
  delayInMinutes,
  employeeName,
  appointmentId,
  serviceName,
}: ScheduleBookingReminderInteface) {
  //Permissão do usuário
  const hasPermission = await requestPermissions();
  if (!hasPermission) {
    console.log("LocalNotification Permission not granted");
    return; // sem permissão
  }

  await setupNotificationChannel();

  const scheduledDate = new Date(dateScheduled);

  const appointmentDate = new Date(dateScheduled);

  const oneDayBefore = new Date(appointmentDate);
  oneDayBefore.setDate(oneDayBefore.getDate() - 1);

  const oneHourBefore = new Date(appointmentDate);
  oneHourBefore.setHours(oneHourBefore.getHours() - 1);

  const notifications = [];

  const reminders = [
    {
      id: `${NOTIFICATION_IDS.BOOKING_REMEMBER}-1day-${appointmentId}`,
      triggerDate: oneDayBefore,
      title: "📅 Lembrete de agendamento (amanhã)",
      body: `Você tem um agendamento amanhã
📅 Data e horário: ${formatDateBR(dateScheduled)}
💈 Serviço: ${serviceName}
👨‍🔧 Profissional: ${employeeName}`,
    },
    {
      id: `${NOTIFICATION_IDS.BOOKING_REMEMBER}-1hour-${appointmentId}`,
      triggerDate: oneHourBefore,
      title: "⏰ Seu horário é em 1 hora",
      body: `Seu agendamento está próximo
📅 Data e horário: ${formatDateBR(dateScheduled)}
💈 Serviço: ${serviceName}
👨‍🔧 Profissional: ${employeeName}`,
    },
  ];

  for (const reminder of reminders) {
    if (reminder.triggerDate <= new Date()) continue;
    //cancela noticação antiga

    cancelNotifications(reminder.id);

    const notification = await Notifications.scheduleNotificationAsync({
      identifier: reminder.id,
      content: {
        title: reminder.title,
        body: reminder.body,
        data: {
          type: NOTIFICATION_IDS.BOOKING_REMEMBER,
          appointmentId,
          deepLink: `${DEEP_LINK}bookings` // manda para tela de agendamentos
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminder.triggerDate,
      },
    });

    notifications.push(notification);
  }

  console.log("Notificação configurada");

  return notifications;
}

// Salva lembrete localmente

async function saveReminder(reminder: any) {
  const reminders = await AsyncStorage.getItem("booking_reminders");

  const list = reminders ? JSON.parse(reminders) : [];

  list.push(reminder);

  await AsyncStorage.setItem("booking_reminders", JSON.stringify(list));
}

// Reagenda quando abri o app
async function restoreNotifications() {
  const reminders = await AsyncStorage.getItem("booking_reminders");

  if (!reminders) return;

  const list = JSON.parse(reminders);

  for (const reminder of list) {
    await localNotificationService.scheduleBookingReminder(reminder);
  }
}

export const localNotificationService = {
  scheduleBookingReminder,
  setupNotificationChannel,
  requestPermissions,
};

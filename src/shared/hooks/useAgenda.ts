import {
  AppointmentProps,
  AppointmentServices,
} from "../interfaces/http/appointment";
import { CompanyServicesProps } from "../interfaces/http/company-services";
import { EDayWeek, EmployeeProps } from "../interfaces/http/employee";
import { UserProps } from "../interfaces/user";
import { useTime } from "./useTime";

export function useAgenda() {
  const SLOT_HEIGHT = 40;
  const START_HOUR = 8;
  const END_HOUR = 18;

  const { timeToMinutes } = useTime();

  function getAppointmentDuration(services: AppointmentServices[]): number {
    return services.reduce((total, s) => total + (s.durationAtMoment ?? 0), 0);
  }

  function getCurrentTimePosition(
  currentTime: string,
  slotHeight: number,
  minutesPerSlot: number
) {
  const [hour, minute] = currentTime.split(":").map(Number);
  const totalMinutes = hour * 60 + minute;

  const pixelsPerMinute = slotHeight / minutesPerSlot;

  return totalMinutes * pixelsPerMinute;
}

function getServiceName(
  services: AppointmentServices[]
): string {
  return services[0]?.service.name ?? "";
}

function getServicePrice(
  services: AppointmentServices[]
): number {
  return services[0]?.service.price ?? 0;
}



function getUser(
  users?: UserProps | null
): string {
  return users?.avatarUrl ?? "";
}

  function getAppointmentStart(app: AppointmentProps): string {
    const date = new Date(app.dateScheduled);

    return `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
  }

  function overlapsAppointment(
    time: string,
    duration: number,
    appointments: AppointmentProps[]
  ) {
    const start = timeToMinutes(time);
    const end = start + duration;

    return appointments.some((app) => {
      const s = timeToMinutes(getAppointmentStart(app));
      const e = s + getAppointmentDuration(app.services);
      return start < e && end > s;
    });
  }

  function isValidRange(start: number, end: number) {
    return start !== 0 || end !== 0;
  }

  function normalize(time: string) {
    return time.slice(0, 5); // "08:00:00" → "08:00"
  }

  function isWorkingTime(time: string, employee: EmployeeProps) {
    const t = timeToMinutes(time);

    const s1 = timeToMinutes(normalize(employee.firstTime));
    const e1 = timeToMinutes(normalize(employee.secondTime));
    const s2 = timeToMinutes(normalize(employee.thirdTime));
    const e2 = timeToMinutes(normalize(employee.lastTime));

    const inFirst = isValidRange(s1, e1) && t >= s1 && t < e1;
    //Maior ou igual ás 9hrs e menor que 12h  ou seja antes da meio dia

    const inSecond = isValidRange(s2, e2) && t >= s2 && t < e2;
    // maior ou igual ás 13h e antes das 19 hrs

    return inFirst || inSecond;
  }

  function getAgendaStart(employee: EmployeeProps) {
    const times = [
      normalize(employee.firstTime),
      normalize(employee.thirdTime),
    ].filter((t) => t !== "00:00");

    return times.sort()[0] ?? "00:00";
  }

  function groupOverlappingAppointments(
  appointments: AppointmentProps[],
  getStart: (a: AppointmentProps) => number,
  getEnd: (a: AppointmentProps) => number
) {
  const groups: AppointmentProps[][] = [];

  appointments.forEach((app) => {
    const start = getStart(app);
    const end = getEnd(app);

    let placed = false;

    for (const group of groups) {
      const overlaps = group.some((g) => {
        const gStart = getStart(g);
        const gEnd = getEnd(g);
        return start < gEnd && end > gStart;
      });

      if (overlaps) {
        group.push(app);
        placed = true;
        break;
      }
    }

    if (!placed) {
      groups.push([app]);
    }
  });

  return groups;
}




function getEmployeeOffHourRanges(
  employee: EmployeeProps,
  currentDay: EDayWeek
) {
  const ranges: { time: string; duration: number }[] = [];

  // Normaliza os dias do workDays
  const normalizeDay = (day: string) => {
    switch (day.toLowerCase()) {
      case "domingo": return "Domingo";
      case "segunda": return "Segunda";
      case "terça": return "Terça";
      case "quarta": return "Quarta";
      case "quinta": return "Quinta";
      case "sexta": return "Sexta";
      case "sábado": return "Sábado";
      default: return day;
    }
  };

  const todayNormalized = normalizeDay(currentDay);

   // 🔥 pega o schedule do dia
  const daySchedule = employee.schedule?.find(
    (d) => normalizeDay(d.day) === todayNormalized
  );

  // ❌ não trabalha hoje (não tem schedule ou não tem times)
  if (!daySchedule || !daySchedule.times || daySchedule.times.length === 0) {
    ranges.push({ time: "00:00", duration: 24 * 60 });
    console.log(
      `getEmployeeOffHourRanges -> full day blocked for ${employee.name}`
    );
    return ranges;
  }

  // ✅ ordena os períodos do dia
  const periods = [...daySchedule.times].sort(
    (a, b) => timeToMinutes(normalize(a.start)) - timeToMinutes(normalize(b.start))
  );
  const dayStart = "00:00";
  const dayEnd = "23:59";

  // 1) antes do primeiro período
  const firstStart = normalize(periods[0].start);
  const beforeFirst = timeToMinutes(firstStart) - timeToMinutes(dayStart);

  if (beforeFirst > 0) {
    ranges.push({ time: dayStart, duration: beforeFirst });
  }

  // 2) intervalos entre períodos
  for (let i = 0; i < periods.length - 1; i++) {
    const currentEnd = normalize(periods[i].end);
    const nextStart = normalize(periods[i + 1].start);

    const gap = timeToMinutes(nextStart) - timeToMinutes(currentEnd);

    if (gap > 0) {
      ranges.push({ time: currentEnd, duration: gap });
    }
  }

  // 3) depois do último período
  const lastEnd = normalize(periods[periods.length - 1].end);
  const afterLast = timeToMinutes(dayEnd) - timeToMinutes(lastEnd);

  if (afterLast > 0) {
    ranges.push({ time: lastEnd, duration: afterLast });
  }

  return ranges.filter((r) => r.duration > 0);
}


  return {
    getAppointmentDuration,
    overlapsAppointment,
    getAppointmentStart,
    isWorkingTime,
    normalize,
    getEmployeeOffHourRanges,
    getServicePrice,
    groupOverlappingAppointments,
    getServiceName,
    getCurrentTimePosition,
    getUser,
    getAgendaStart,
    SLOT_HEIGHT,
    START_HOUR,
    END_HOUR,
  };
}

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface FormatDate {
  date: Date;
}

export function useFormatDate() {
  function formatMonthUpper(date: Date) {
    const mes = format(date, "MMM", { locale: ptBR });
    return mes.charAt(0).toUpperCase() + mes.slice(1);
  }

  function formatWeekDay(date: Date) {
    const text = format(date, "EEEEEE", { locale: ptBR });
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function formatHour(date: Date) {
    const text = format(date, "HH:mm", { locale: ptBR });
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function formatDate(date: Date) {
    const text = format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    // Coloca a primeira letra em maiúscula
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function formatDay(date: Date) {
    const text = format(date, "d", { locale: ptBR });
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function formatMonth(date: Date) {
    const text = format(date, "MMMM", { locale: ptBR });
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function formatYear(date: Date) {
    const text = format(date, "yyyy", { locale: ptBR });
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function DateIsoToBR(iso: string): string {
    // "2024-01-15" -> "15/01/2024"
    if (!iso) return "";

    const [year, month, day] = iso.split("-");
    return `${day}/${month}/${year}`;
  }

  function DateBRToISO(br: string): string {
    // "15/01/2024" -> "2024-01-15"
    if (!br) return "";

    const [day, month, year] = br.split("/");
    return `${year}-${month}-${day}`;
  }

  function formatDateToBR(date: Date): string {
    if (!date) return "";

    return format(date, "dd/MM/yyyy", { locale: ptBR });
  }

  function formatIsoToLocalDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  const formatDateToDateTimeIso = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  };


  //Tipo string to Instant 

   function  formatDateInstantToDateTimeIso (date: Date) {
  return date.toISOString(); // ✅ já gera com Z e milissegundos
};

  function timeStringToDate(time: string | null): Date {
    if (!time) {
      return new Date();
    }

    const [hours, minutes] = time.split(":").map(Number);

    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return date;
  }

  function formatDateTimeToBR(date: Date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day}/${month}/${year} • ${hours}:${minutes}`;
  }

  function formatIsoDateTimeToBR(iso: string) {
    if (!iso) return "";

    const date = new Date(iso);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  function formatIsoDateAndTimeToBR(iso: string) {
    if (!iso) return "";

    const date = new Date(iso);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  function dateToTimeString(date: Date) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  function formatDateToISO(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // meses 0-11
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
  return {
    formatDay,
    formatWeekDay,
    formatMonth,
    formatDate,
    formatHour,
    formatYear,
    formatMonthUpper,
    formatIsoToLocalDate,
    DateIsoToBR,
    formatDateToBR,
    DateBRToISO,
    dateToTimeString,
    formatDateToDateTimeIso,
    formatDateTimeToBR,
    formatIsoDateTimeToBR,
    formatIsoDateAndTimeToBR,
    formatDateInstantToDateTimeIso,
    formatDateToISO,
    timeStringToDate,
  };
}

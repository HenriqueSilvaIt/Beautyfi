import DatePicker from "react-native-date-picker";

type Props = {
  open: boolean;
  date?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  minimumDate?: Date;
  mode?: "date" | "time" | "datetime";
};
export function AppDateTimePicker({
  open,
  date,
  onConfirm,
  onCancel,
  minimumDate,
  mode,
}: Props) {
  return (
    <DatePicker
      modal
      open={open}
      date={date || new Date()}
      mode={mode || "datetime"}
      locale="pt-BR"
      is24hourSource="locale"
      minimumDate={minimumDate}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

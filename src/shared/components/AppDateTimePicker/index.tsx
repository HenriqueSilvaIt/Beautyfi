import DatePicker from "react-native-date-picker";

type Props = {
  open: boolean;
  date?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
  minimumDate?: Date;
};
export function AppDateTimePicker({
  open,
  date,
  onConfirm,
  onCancel,
  minimumDate,
}: Props) {
  return (
    <DatePicker
      modal
      open={open}
      date={date || new Date()}
      mode="datetime"
      is24hourSource="locale"
      minimumDate={minimumDate}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

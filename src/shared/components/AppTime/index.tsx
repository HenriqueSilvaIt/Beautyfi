import DatePicker from "react-native-date-picker";

type Props = {
  open: boolean;
  date?: Date;
  onConfirm: (date: Date) => void;
  onCancel: () => void;
};

export function AppTime({
  open,
  date,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <DatePicker
      modal
      open={open}
      date={date || new Date()}
      mode="time" // ✅ só horário
      is24hourSource="locale"
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}
import { BookingDetailsView } from "@/viewModel/Agenda/BookingDetails/BookingDetails.view";
import { useBookingDetailsViewModel } from "@/viewModel/Agenda/BookingDetails/useBookingDetailsViewModel";
import { useLocalSearchParams } from "expo-router";

export default function BookingDetailsPage() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const appointmentId = id ? Number(id) : undefined;
  const props = useBookingDetailsViewModel(appointmentId!);
  return <BookingDetailsView {...props} />;
}

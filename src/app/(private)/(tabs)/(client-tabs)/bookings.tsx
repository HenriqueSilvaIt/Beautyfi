import { BookingView } from "@/viewModel/Booking/Booking.view";
import { useBookingViewModel } from "@/viewModel/Booking/useBookingViewModel";
import { View } from "react-native";

export default function Bookings() {

    const props = useBookingViewModel();
    
  return( 

    <BookingView {...props} />)

}

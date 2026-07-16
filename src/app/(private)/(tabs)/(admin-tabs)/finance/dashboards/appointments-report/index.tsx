import React from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppEmptyList } from "@/shared/components/AppEmptyList";
import { useAppointmentsReportViewModel } from "@/viewModel/Finance/Dashboards/DashboardAppointment/useAppointmentsReportViewModel";
import { AppointmentReportView } from "@/viewModel/Finance/Dashboards/DashboardAppointment/AppointmentReport.view";


export default function AppointmentsReportScreen() {

  const props = useAppointmentsReportViewModel();
  return (
    <AppointmentReportView {...props} />
  );
}

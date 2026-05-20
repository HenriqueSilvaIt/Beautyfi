import { AppointmentProps } from "../interfaces/http/appointment";
import { EmployeeProps } from "../interfaces/http/employee";

export function mapEmployeeFromAppointment(
  appointment: AppointmentProps
): EmployeeProps {
  const emp = appointment.employee;

  return {
    id: emp.id,
    email: emp.email,
    name: emp.name,
    firstTime: emp.firstTime,
    secondTime: emp.secondTime,
    thirdTime: emp.thirdTime,
    lastTime: emp.lastTime,
    avatarUrl: emp.avatarUrl,
    phone: emp.phone,
    description: emp.description,
  };
}
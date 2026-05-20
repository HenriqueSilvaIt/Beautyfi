import { AgendaView } from "@/viewModel/Agenda/Agenda.view";
import { useAgendaViewModel } from "@/viewModel/Agenda/useAgendaViewModel";
import {  View } from "react-native";

export default function Agenda() {

    const props = useAgendaViewModel();

    return (

        <View className="flex-1 bg-background-primary">

            <AgendaView {...props}/>
        </View>
        );
}
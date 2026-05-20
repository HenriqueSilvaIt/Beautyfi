import { BlockAgendaView } from "@/viewModel/Agenda/BlockAgenda/BlockAgenda.view";
import { View } from "react-native";

export default function BlockAgendaPage() {

    return (
        <View className="flex-1 bg-background-primary">
            <BlockAgendaView/>
        </View>
    )
} 
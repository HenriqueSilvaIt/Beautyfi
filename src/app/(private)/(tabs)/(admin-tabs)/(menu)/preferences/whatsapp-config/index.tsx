import { useWhatsAppViewModel } from "@/viewModel/Menu/AdminPreferences/WhatsApp/useWhatsAppViewModel";
import { WhatsAppConfigView } from "@/viewModel/Menu/AdminPreferences/WhatsApp/WhatsAppConfigView";
import { View } from "react-native";


export default function WhatsappConfigPage() {


    const  props = useWhatsAppViewModel();
    return (
        <View className="flex-1 bg-background-primary"> 
        <WhatsAppConfigView {...props}/>

        </View>
    )
}
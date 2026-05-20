import { ClientView } from "@/viewModel/Admin/Clients/ClientView";
import { useClientViewModel } from "@/viewModel/Admin/Clients/useClientViewModel";
import { View } from "react-native";

export default function ClientCreate() {

  
      const props = useClientViewModel(undefined);
  
      return( 
          <View className="flex-1 bg-background-primary">
              <ClientView {...props}/>
          </View>
          
      )
}
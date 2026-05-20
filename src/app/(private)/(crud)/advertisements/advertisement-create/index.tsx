import { AdvertisementView } from "@/viewModel/Admin/Advertisements/AdvertisementView";
import { useAdvertisementViewModel } from "@/viewModel/Admin/Advertisements/useAdvertisementViewModel";
import { View } from "react-native";

export default function AdvertisementCreate() {

  
      const props = useAdvertisementViewModel(undefined);
  
      return( 
          <View className="flex-1 bg-background-primary">
              <AdvertisementView {...props}/>
          </View>
          
      )
}
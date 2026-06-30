import { useHomeViewModel } from "@/viewModel/Home/useHomeViewModel";
import { Image, Text, View } from "react-native";


interface AppFormHeaderProps {
    title: string;
    subTitle: string;
}

export function AppFormHeader({title, subTitle} : AppFormHeaderProps) {

    const {company} = useHomeViewModel();

    return (

        <View className="items-center mb-8 bg-background-primary">
            <Image 
                source={require("@assets/images/logo.png")}
                resizeMode="contain"
                className="w-[100px] h-[100px] mb-8"
                />

                <Text className="text-3xl font-bold mb-3 text-center text-font-primary">{title}</Text>
                <Text className="text-base text-center   text-gray-500">{subTitle}</Text>
        </View>
   )
}
import { Stack } from "expo-router";

export default function WorkingDaysLayout() {

    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index"/>
        </Stack>

    )
}
import { Stack } from "expo-router";


export default function ClientLayout() {

    return (
        <Stack screenOptions={{headerShown: false}} >
            <Stack.Screen name="index" />
            <Stack.Screen name="[id]"/>
            <Stack.Screen name="client-create/index" />
        </Stack>
    )
}
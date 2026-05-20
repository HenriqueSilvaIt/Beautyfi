import { Stack } from "expo-router";

export default function EmployeeServicesLayout () {

    return(
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="index"/>
        </Stack>
    )
}
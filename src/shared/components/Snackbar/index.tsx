import { View, Text } from "react-native";
import { useSnackbarContext } from "../../hooks/snackbar.context";

export function Snackbar() {
  const { message, type } = useSnackbarContext();

  /*caso não exista mensagem de erro a snack bar não sera exibida na tela */
  if (!message || !type) {
    return <></>;
  }

  let bgColor = "bg-accent-red";

  switch (type) {
    case "SUCCESS":
      bgColor = "bg-success";
      break;
    case "ERROR":
      bgColor = "bg-accent-red";
      break;
    case "WARNING":
      bgColor = "bg-warning";
      break;
  }

  return (
    <View
      className={`absolute top-20 self-center w-[90%] h-[50px] rounded-xl ${bgColor} justify-center items-center z-10 padding-4`}
    >
      <Text className="text-font-primary text-center text-base font-bold">{message}</Text>
    </View>
  );
}

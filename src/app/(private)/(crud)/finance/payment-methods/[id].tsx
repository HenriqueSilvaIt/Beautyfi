import React, { useEffect, useState } from "react";
import { Alert, Switch, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppButton } from "@/shared/components/AppButton";
import { AppInputController } from "@/shared/components/AppInputControler";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { usePaymentCrudMutation } from "@/shared/queries/finance/use-payment-crud.mutation";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { colors } from "@/styles/colors";
import { PaymentMethodDTO } from "@/shared/interfaces/http/order";

const schema = yup.object().shape({
  name: yup.string().required("Nome é obrigatório"),
  card: yup.boolean().required(),
  fee: yup.string().required("Taxa é obrigatória"),
});

interface PaymentMethodFormData {
  name: string;
  card: boolean;
  fee: string;
}

export default function PaymentMethodFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditMode = id !== "0";
  const { notify } = useSnackbarContext();
  const [isSaving, setIsSaving] = useState(false);

  const {
    useGetPaymentMethodsQuery,
    paymentMethodCreateMutation,
    paymentMethodUpdateMutation,
    paymentMethodDeleteMutation,
  } = usePaymentCrudMutation();

  const { data: methods } = useGetPaymentMethodsQuery();
  const currentMethod = methods?.find((m) => String(m.id) === id);

  const { control, handleSubmit, reset, watch, setValue } = useForm<PaymentMethodFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      card: false,
      fee: "0",
    },
  });

  const isCard = watch("card");

  useEffect(() => {
    if (currentMethod) {
      reset({
        name: currentMethod.name || "",
        card: !!currentMethod.card,
        fee: currentMethod.fee != null ? String(currentMethod.fee) : "0",
      });
    }
  }, [currentMethod]);

  const handleSave = async (data: PaymentMethodFormData) => {
    try {
      setIsSaving(true);
      const dto: PaymentMethodDTO = {
        name: data.name,
        card: data.card,
        fee: Number(data.fee.replace(",", ".")) || 0,
      };

      if (isEditMode) {
        await paymentMethodUpdateMutation.mutateAsync({ id: Number(id), dto });
        notify({ message: "Forma de pagamento atualizada!", type: "SUCCESS" });
      } else {
        await paymentMethodCreateMutation.mutateAsync(dto);
        notify({ message: "Forma de pagamento criada!", type: "SUCCESS" });
      }
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar a forma de pagamento.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta forma de pagamento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await paymentMethodDeleteMutation.mutateAsync(Number(id));
              notify({ message: "Forma de pagamento excluída!", type: "SUCCESS" });
              router.back();
            } catch (err) {
              Alert.alert("Erro", "Falha ao excluir o registro.");
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <KeyboardContainer>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
          <AppAdminHeader
            title={isEditMode ? "Editar Forma de Pagamento" : "Criar Forma de Pagamento"}
            iconRightName={isEditMode ? "trash-outline" : undefined}
            action={isEditMode ? handleDelete : undefined}
            iconRight={isEditMode ? { icon: true, path: "" } : { icon: false, path: "" }}
          />

          <View className="p-6 gap-6 flex-1">
            <AppInputController
              control={control}
              name="name"
              label="Nome do Método"
              placeholder="Ex: Pix, Dinheiro, Cartão"
              leftIcon="cash-outline"
            />

            {/* Switch Toggle for isCard */}
            <View className="bg-background-tertiary p-4 rounded-xl flex-row items-center justify-between border border-slate-800">
              <View className="flex-1 pr-4">
                <Text className="text-white text-base font-bold">Requer Cartão?</Text>
                <Text className="text-gray-600 text-xs mt-1">
                  Ative se o cliente precisar escolher uma bandeira e número de parcelas.
                </Text>
              </View>
              <Switch
                value={isCard}
                onValueChange={(val) => setValue("card", val)}
                trackColor={{ false: "#374151", true: colors["app-theme-primary"] || "#cba35d" }}
                thumbColor={isCard ? "#ffffff" : "#9ca3af"}
              />
            </View>

            <AppInputController
              control={control}
              name="fee"
              label="Taxa padrão (%)"
              placeholder="0.00"
              leftIcon="calculator-outline"
              keyboardType="numeric"
            />

            <View className="flex-1 justify-end mt-8">
              <AppButton
                onPress={handleSubmit(handleSave)}
                isLoading={isSaving}
                variant="admin"
                size={true}
              >
                Salvar
              </AppButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardContainer>
    </SafeAreaView>
  );
}

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

const schema = yup.object().shape({
  name: yup.string().required("Nome da bandeira é obrigatório"),
  fee: yup.string().required("Taxa é obrigatória"),
  dayDelay: yup.string().required("Prazo de recebimento é obrigatório"),
  isCalendarDays: yup.boolean().required(),
});

interface CardFlagFormData {
  name: string;
  fee: string;
  dayDelay: string;
  isCalendarDays: boolean;
}

export default function CardFlagFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const isEditMode = id !== "0";
  const { notify } = useSnackbarContext();
  const [isSaving, setIsSaving] = useState(false);

  const {
    useGetPaymentCardFlagsQuery,
    paymentCardFlagCreateMutation,
    paymentCardFlagUpdateMutation,
    paymentCardFlagDeleteMutation,
  } = usePaymentCrudMutation();

  const { data: cardFlags } = useGetPaymentCardFlagsQuery();
  const currentFlag = cardFlags?.find((f) => String(f.id) === id);

  const { control, handleSubmit, reset, watch, setValue } = useForm<CardFlagFormData>({
    resolver: yupResolver(schema) as any,
    defaultValues: {
      name: "",
      fee: "0",
      dayDelay: "1",
      isCalendarDays: true,
    },
  });

  const isCalendarDays = watch("isCalendarDays");

  useEffect(() => {
    if (currentFlag) {
      reset({
        name: currentFlag.name || "",
        fee: currentFlag.fee != null ? String(currentFlag.fee) : "0",
        dayDelay: currentFlag.dayDelay != null ? String(currentFlag.dayDelay) : "1",
        isCalendarDays: currentFlag.dayType !== "WORKING_DAYS",
      });
    }
  }, [currentFlag]);

  const handleSave = async (data: CardFlagFormData) => {
    try {
      setIsSaving(true);
      const dto = {
        name: data.name,
        fee: Number(data.fee.replace(",", ".")) || 0,
        dayDelay: Number(data.dayDelay) || 0,
        dayType: data.isCalendarDays ? "CALENDAR_DAYS" as const : "WORKING_DAYS" as const,
      };

      if (isEditMode) {
        await paymentCardFlagUpdateMutation.mutateAsync({ id: Number(id), dto });
        notify({ message: "Bandeira de cartão atualizada!", type: "SUCCESS" });
      } else {
        await paymentCardFlagCreateMutation.mutateAsync(dto);
        notify({ message: "Bandeira de cartão criada!", type: "SUCCESS" });
      }
      router.back();
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um erro ao salvar a bandeira.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta bandeira de cartão?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await paymentCardFlagDeleteMutation.mutateAsync(Number(id));
              notify({ message: "Bandeira de cartão excluída!", type: "SUCCESS" });
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
            title={isEditMode ? "Editar Bandeira" : "Criar Bandeira"}
            iconRightName={isEditMode ? "trash-outline" : undefined}
            action={isEditMode ? handleDelete : undefined}
            iconRight={isEditMode ? { icon: true, path: "" } : { icon: false, path: "" }}
          />

          <View className="p-6 gap-6 flex-1">
            <AppInputController
              control={control}
              name="name"
              label="Nome da Bandeira / Parcela"
              placeholder="Ex: Visa Crédito 1x, Master Débito"
              leftIcon="card-outline"
            />

            <AppInputController
              control={control}
              name="fee"
              label="Taxa da bandeira (%)"
              placeholder="0.00"
              leftIcon="calculator-outline"
              keyboardType="numeric"
            />

            <AppInputController
              control={control}
              name="dayDelay"
              label="Prazo de Recebimento (dias)"
              placeholder="1"
              leftIcon="time-outline"
              keyboardType="numeric"
            />

            {/* Switch Toggle for dayType */}
            <View className="bg-background-tertiary p-4 rounded-xl flex-row items-center justify-between border border-slate-800">
              <View className="flex-1 pr-4">
                <Text className="text-white text-base font-bold">Dias Corridos?</Text>
                <Text className="text-gray-600 text-xs mt-1">
                  Ative se o recebimento ocorrer em dias corridos. Desative para contar apenas dias úteis.
                </Text>
              </View>
              <Switch
                value={isCalendarDays}
                onValueChange={(val) => setValue("isCalendarDays", val)}
                trackColor={{ false: "#374151", true: colors["app-theme-primary"] || "#cba35d" }}
                thumbColor={isCalendarDays ? "#ffffff" : "#9ca3af"}
              />
            </View>

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

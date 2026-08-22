import { useEffect, useState } from "react";
import { router } from "expo-router";
import { useSnackbarContext } from "@/shared/hooks/snackbar.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useClientMutation } from "@/shared/queries/company/use.client.mutation";

export function useAnamnesisViewModel(clientId: number | undefined) {
  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();
  const [isLoading, setIsLoading] = useState(false);

  const { useGetClientById, clientAnamnesisUpdateMutation } = useClientMutation();
  const { data: client, refetch: clientRefetch } = useGetClientById(Number(clientId));

  const [allergies, setAllergies] = useState("");
  const [skinHairType, setSkinHairType] = useState("");
  const [preExistingConditions, setPreExistingConditions] = useState("");
  const [medications, setMedications] = useState("");
  const [observations, setObservations] = useState("");

  useEffect(() => {
    if (client?.anamnesis) {
      setAllergies(client.anamnesis.allergies || "");
      setSkinHairType(client.anamnesis.skinHairType || "");
      setPreExistingConditions(client.anamnesis.preExistingConditions || "");
      setMedications(client.anamnesis.medications || "");
      setObservations(client.anamnesis.observations || "");
    }
  }, [client]);

  async function handleSaveAnamnesis() {
    if (!clientId) {
      notify({ message: "ID de cliente inválido.", type: "ERROR" });
      return;
    }

    try {
      setIsLoading(true);

      await clientAnamnesisUpdateMutation.mutateAsync({
        clientId: Number(clientId),
        anamnesisData: {
          allergies,
          skinHairType,
          preExistingConditions,
          medications,
          observations,
        },
      });

      notify({
        message: "Ficha de Anamnese salva com sucesso!",
        type: "SUCCESS",
      });

      await clientRefetch();
      router.back();
    } catch (err) {
      handleError(err, "Falha ao salvar Ficha de Anamnese");
    } finally {
      setIsLoading(false);
    }
  }

  return {
    client,
    isLoading,
    allergies,
    setAllergies,
    skinHairType,
    setSkinHairType,
    preExistingConditions,
    setPreExistingConditions,
    medications,
    setMedications,
    observations,
    setObservations,
    handleSaveAnamnesis,
  };
}

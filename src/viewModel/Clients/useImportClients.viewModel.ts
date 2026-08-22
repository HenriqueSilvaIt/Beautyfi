import { useState } from "react";
import { Alert, Linking } from "react-native";
import { parseCsvClientData, getCsvTemplateString } from "@/shared/utils/csvTemplate";
import { postClients } from "@/shared/services/client.service";
import { useQueryClient } from "@tanstack/react-query";

export type ImportSource = "phone" | "csv" | "google" | null;

export interface ContactItem {
  id: string;
  name: string;
  phone: string;
  email?: string;
  birthDate?: string;
  selected: boolean;
  source: string;
  isValid: boolean;
  validationError?: string;
}

export function useImportClientsViewModel(onSuccessClose?: () => void) {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSource, setSelectedSource] = useState<ImportSource>(null);
  
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadingContacts, setLoadingContacts] = useState(false);

  // LGPD & Opt-in
  const [lgpdConsent, setLgpdConsent] = useState(false);
  const [allowMarketing, setAllowMarketing] = useState(true);

  // Batch import progress
  const [isImporting, setIsImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [totalToImport, setTotalToImport] = useState(0);

  // CSV Raw
  const [csvFileName, setCsvFileName] = useState<string | null>(null);

  // 1. Fetch Phone Contacts (Safe dynamic import)
  const fetchPhoneContacts = async () => {
    setLoadingContacts(true);
    try {
      let Contacts: any;
      try {
        Contacts = require("expo-contacts");
      } catch (e) {
        Alert.alert(
          "Recurso não disponível",
          "O módulo de acesso a contatos não está presente neste ambiente (Expo Go). É necessário um build de desenvolvimento."
        );
        setLoadingContacts(false);
        return;
      }

      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão necessária",
          "Para importar os contatos, precisamos da permissão de acesso à sua agenda telefônica. Por favor, habilite nas configurações.",
          [
            { text: "Cancelar", style: "cancel" },
            { text: "Abrir Ajustes", onPress: () => Linking.openSettings() },
          ]
        );
        setLoadingContacts(false);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
      });

      const formatted: ContactItem[] = [];
      data?.forEach((c: any, idx: number) => {
        const phone = c.phoneNumbers && c.phoneNumbers.length > 0 ? c.phoneNumbers[0].number : "";
        const email = c.emails && c.emails.length > 0 ? c.emails[0].email : "";
        const name = c.name || `${c.firstName || ""} ${c.lastName || ""}`.trim() || "Contato sem nome";
        
        const digits = phone ? phone.replace(/\D/g, "") : "";
        let normalizedPhone = "";
        let isValid = true;
        let validationError = "";

        if (!digits || digits.length < 10) {
          isValid = false;
          validationError = "Telefone inválido ou ausente";
        } else {
          normalizedPhone = digits.length <= 11 ? `+55${digits}` : `+${digits}`;
        }

        if (phone) {
          formatted.push({
            id: c.id || `phone-${idx}`,
            name,
            phone: normalizedPhone || phone,
            email,
            selected: isValid,
            source: "celular",
            isValid,
            validationError,
          });
        }
      });

      setContacts(formatted);
      setSelectedSource("phone");
      setCurrentStep(2);
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Não foi possível carregar os contatos do celular.");
    } finally {
      setLoadingContacts(false);
    }
  };

  // 2. Pick CSV File (Safe dynamic import)
  const pickCsvFile = async () => {
    setLoadingContacts(true);
    try {
      let DocumentPicker: any;
      try {
        DocumentPicker = require("expo-document-picker");
      } catch (e) {
        Alert.alert(
          "Recurso não disponível",
          "O seletor de arquivos não está disponível neste ambiente. É necessário um build de desenvolvimento."
        );
        setLoadingContacts(false);
        return;
      }

      const res = await DocumentPicker.getDocumentAsync({
        type: ["text/csv", "text/comma-separated-values", "application/csv", "*/*"],
        copyToCacheDirectory: true,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        const asset = res.assets[0];
        setCsvFileName(asset.name);

        const response = await fetch(asset.uri);
        const text = await response.text();

        const parsedRows = parseCsvClientData(text);
        const formatted: ContactItem[] = parsedRows.map((r, idx) => ({
          id: `csv-${idx}`,
          name: `${r.name} ${r.lastName || ""}`.trim(),
          phone: r.phone,
          email: r.email,
          birthDate: r.birthDate,
          selected: r.isValid,
          source: "csv",
          isValid: r.isValid,
          validationError: r.validationError,
        }));

        setContacts(formatted);
        setSelectedSource("csv");
        setCurrentStep(2);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao ler o arquivo CSV escolhido.");
    } finally {
      setLoadingContacts(false);
    }
  };

  // 3. Select Google Contacts / Manual
  const selectGoogleSource = () => {
    setSelectedSource("google");
    Alert.alert(
      "Google Contacts",
      "Dica: Acesse contacts.google.com no navegador, clique em 'Exportar' em formato CSV e selecione o arquivo gerado na opção 'Arquivo CSV' deste app!",
      [{ text: "Entendi", onPress: () => pickCsvFile() }]
    );
  };

  // Toggle contact selection
  const toggleContactSelection = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const toggleSelectAll = (select: boolean) => {
    setContacts((prev) =>
      prev.map((c) => (c.isValid ? { ...c, selected: select } : c))
    );
  };

  const selectedCount = contacts.filter((c) => c.selected && c.isValid).length;

  // Filtered contacts by search
  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  // Submit batch import
  const executeBatchImport = async () => {
    if (!lgpdConsent) {
      Alert.alert("Atenção", "É necessário declarar o consentimento de acordo com a LGPD para continuar.");
      return;
    }

    const toImport = contacts.filter((c) => c.selected && c.isValid);
    if (toImport.length === 0) {
      Alert.alert("Atenção", "Nenhum contato válido selecionado para importação.");
      return;
    }

    setIsImporting(true);
    setTotalToImport(toImport.length);
    setImportedCount(0);
    setFailedCount(0);
    setCurrentStep(4);

    let success = 0;
    let failed = 0;

    for (const contact of toImport) {
      try {
        const nameParts = contact.name.split(" ");
        const firstName = nameParts[0] || contact.name;
        const lastName = nameParts.slice(1).join(" ") || undefined;

        await postClients({
          name: firstName,
          lastName,
          phone: contact.phone,
          email: contact.email || undefined,
          allowWhatsAppNotification: allowMarketing,
        });

        success++;
        setImportedCount(success);
      } catch (err) {
        console.error("Failed importing contact:", contact.name, err);
        failed++;
        setFailedCount(failed);
      }
    }

    setIsImporting(false);
    queryClient.invalidateQueries({ queryKey: ["clients"] });
    queryClient.invalidateQueries({ queryKey: ["onboarding-clients"] });
  };

  const resetModal = () => {
    setCurrentStep(1);
    setSelectedSource(null);
    setContacts([]);
    setSearchQuery("");
    setLgpdConsent(false);
    setAllowMarketing(true);
    setIsImporting(false);
    setImportedCount(0);
    setFailedCount(0);
    if (onSuccessClose) onSuccessClose();
  };

  return {
    currentStep,
    setCurrentStep,
    selectedSource,
    contacts,
    filteredContacts,
    searchQuery,
    setSearchQuery,
    loadingContacts,
    selectedCount,
    toggleContactSelection,
    toggleSelectAll,
    fetchPhoneContacts,
    pickCsvFile,
    selectGoogleSource,
    lgpdConsent,
    setLgpdConsent,
    allowMarketing,
    setAllowMarketing,
    isImporting,
    importedCount,
    failedCount,
    totalToImport,
    executeBatchImport,
    resetModal,
    csvFileName,
  };
}

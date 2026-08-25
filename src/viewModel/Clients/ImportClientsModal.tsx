import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Share,
} from "react-native";
import { BottomSheetFlatList, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useImportClientsViewModel } from "./useImportClients.viewModel";
import { getCsvTemplateString } from "@/shared/utils/csvTemplate";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ImportClientsContentProps {
  onClose: () => void;
  onCustomImport?: (importedClients: { name: string; phone: string; email?: string }[]) => Promise<void> | void;
}

export function ImportClientsContent({ onClose, onCustomImport }: ImportClientsContentProps) {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 24);

  const themeGold = colors["app-theme-secundary"] || "#CBA35D";
  const navyBlue = "#092D5D";

  const {
    currentStep,
    setCurrentStep,
    selectedSource,
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
  } = useImportClientsViewModel(() => onClose(), onCustomImport);

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const downloadCsvTemplate = async () => {
    try {
      const template = getCsvTemplateString();
      await Share.share({
        message: template,
        title: "modelo_importacao_clientes.csv",
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View className="flex-1 p-5 bg-[#CBA35D]/10" style={{ paddingBottom: bottomPadding }}>
      {/* Top Bar */}
      <View className="flex-row items-center justify-between pb-3.5 border-b border-white/20 mb-4">
        <View className="flex-row items-center gap-2.5">
          <View className="w-9 h-9 rounded-full bg-[#092D5D]/20 items-center justify-center">
            <Ionicons name="people" size={20} color={navyBlue} />
          </View>
          <Text className="text-[#092D5D] text-lg font-black">Importar Clientes</Text>
        </View>
        <TouchableOpacity
          onPress={handleClose}
          className="p-2 rounded-full bg-white/40 border border-white/60"
          activeOpacity={0.8}
        >
          <Ionicons name="close" size={20} color="#092D5D" />
        </TouchableOpacity>
      </View>

      {/* STEP 1: CHOICE OF SOURCE */}
      {currentStep === 1 && (
        <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          <Text className="text-gray-800 text-xs font-semibold mb-4">
            Escolha de onde deseja importar a base de clientes para o seu estabelecimento:
          </Text>

          {loadingContacts ? (
            <View className="py-12 items-center justify-center gap-3">
              <ActivityIndicator size="large" color={navyBlue} />
              <Text className="text-gray-800 text-xs font-semibold">Carregando contatos...</Text>
            </View>
          ) : (
            <View className="gap-3">
              <TouchableOpacity
                onPress={fetchPhoneContacts}
                activeOpacity={0.85}
                className="p-4 rounded-2xl bg-white border border-gray-200 flex-row items-center gap-4 shadow-sm"
              >
                <View className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 items-center justify-center">
                  <Ionicons name="phone-portrait-outline" size={24} color="#2563EB" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-extrabold text-sm">Contatos do Celular</Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    Selecione individualmente quem importar da sua agenda.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickCsvFile}
                activeOpacity={0.85}
                className="p-4 rounded-2xl bg-white border border-gray-200 flex-row items-center gap-4 shadow-sm"
              >
                <View className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 items-center justify-center">
                  <Ionicons name="document-text-outline" size={24} color="#059669" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-extrabold text-sm">Arquivo CSV / Excel</Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    Importe planilhas vindas de outros sistemas (Avec, Trinks).
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={selectGoogleSource}
                activeOpacity={0.85}
                className="p-4 rounded-2xl bg-white border border-gray-200 flex-row items-center gap-4 shadow-sm"
              >
                <View className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 items-center justify-center">
                  <Ionicons name="logo-google" size={22} color="#DC2626" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-extrabold text-sm">Google Contacts</Text>
                  <Text className="text-gray-500 text-xs mt-0.5">
                    Exporte seus contatos do Google em CSV para importar.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
              </TouchableOpacity>

              {/* Model CSV Download */}
              <TouchableOpacity
                onPress={downloadCsvTemplate}
                activeOpacity={0.85}
                className="mt-3 p-3.5 bg-white/80 rounded-xl border border-gray-200 flex-row items-center justify-center gap-2"
              >
                <Ionicons name="download-outline" size={18} color={navyBlue} />
                <Text className="text-[#092D5D] text-xs font-bold">Baixar modelo de planilha (.csv)</Text>
              </TouchableOpacity>
            </View>
          )}
        </BottomSheetScrollView>
      )}

      {/* STEP 2: SELECTIVE CONTACT LIST */}
      {currentStep === 2 && (
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-gray-900 text-xs font-bold">
              Selecionados: <Text className="text-[#092D5D] font-black">{selectedCount}</Text>
            </Text>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => toggleSelectAll(true)}
                activeOpacity={0.8}
                className="px-3 py-1.5 bg-white rounded-lg border border-gray-200"
              >
                <Text className="text-gray-800 text-xs font-bold">Marcar todos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleSelectAll(false)}
                activeOpacity={0.8}
                className="px-3 py-1.5 bg-white rounded-lg border border-gray-200"
              >
                <Text className="text-gray-500 text-xs font-semibold">Desmarcar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-white rounded-xl px-3.5 py-2.5 border border-gray-200 mb-3">
            <Ionicons name="search" size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar por nome ou telefone..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-gray-900 text-xs p-0 font-medium"
            />
          </View>

          {/* Contacts Scrollable FlatList */}
          <BottomSheetFlatList
            data={filteredContacts}
            keyExtractor={(c) => c.id}
            className="flex-1 my-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="py-12 items-center justify-center">
                <Text className="text-gray-500 text-xs font-semibold">Nenhum contato encontrado.</Text>
              </View>
            }
            renderItem={({ item: c }) => (
              <TouchableOpacity
                key={c.id}
                onPress={() => c.isValid && toggleContactSelection(c.id)}
                activeOpacity={0.7}
                className={`p-3.5 mb-2.5 rounded-2xl border flex-row items-center justify-between ${
                  c.selected
                    ? "bg-[#092D5D]/10 border-[#092D5D]"
                    : "bg-white border-gray-200"
                } ${!c.isValid ? "opacity-50" : ""}`}
              >
                <View className="flex-row items-center gap-3 flex-1 pr-2">
                  <Ionicons
                    name={c.selected ? "checkbox" : "square-outline"}
                    size={22}
                    color={c.selected ? navyBlue : "#9CA3AF"}
                  />
                  <View className="flex-1">
                    <Text className="text-gray-900 text-sm font-bold">{c.name}</Text>
                    <Text className="text-gray-500 text-xs font-medium mt-0.5">{c.phone}</Text>
                    {!c.isValid && (
                      <Text className="text-red-500 text-[11px] mt-0.5">{c.validationError}</Text>
                    )}
                  </View>
                </View>

                {c.isValid && (
                  <View className="px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                    <Text className="text-emerald-700 text-[10px] font-bold uppercase">Válido</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />

          {/* Footer Buttons */}
          <View className="flex-row gap-3 pt-3 border-t border-white/20">
            <TouchableOpacity
              onPress={() => setCurrentStep(1)}
              activeOpacity={0.8}
              className="flex-1 py-3 bg-white rounded-xl border border-gray-200 items-center"
            >
              <Text className="text-gray-700 text-xs font-extrabold uppercase">Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentStep(3)}
              disabled={selectedCount === 0}
              activeOpacity={0.85}
              className={`flex-1 py-3 rounded-xl items-center shadow-sm ${
                selectedCount > 0 ? "bg-[#092D5D]" : "bg-gray-300 opacity-60"
              }`}
            >
              <Text className="text-white text-xs font-extrabold uppercase tracking-wide">
                Avançar ({selectedCount})
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: LGPD CONSENT & CONFIRMATION */}
      {currentStep === 3 && (
        <BottomSheetScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          <Text className="text-gray-900 font-extrabold text-sm mb-1">Consentimento LGPD & Confirmação</Text>
          <Text className="text-gray-600 text-xs mb-4">
            Revise as permissões antes de submeter os clientes à base do seu estabelecimento.
          </Text>

          {/* Summary Card */}
          <View className="bg-white p-4 rounded-2xl border border-gray-200 mb-4 gap-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 text-xs">Total selecionados:</Text>
              <Text className="text-[#092D5D] font-extrabold text-sm">{selectedCount} clientes</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 text-xs">Origem dos dados:</Text>
              <Text className="text-gray-900 text-xs font-bold capitalize">{selectedSource || "Planilha/Agenda"}</Text>
            </View>
          </View>

          {/* LGPD Checkbox */}
          <TouchableOpacity
            onPress={() => setLgpdConsent(!lgpdConsent)}
            activeOpacity={0.85}
            className="flex-row items-start gap-3 p-3.5 bg-white rounded-2xl border border-gray-200 mb-3"
          >
            <Ionicons
              name={lgpdConsent ? "checkbox" : "square-outline"}
              size={22}
              color={lgpdConsent ? navyBlue : "#9CA3AF"}
            />
            <Text className="text-gray-800 text-xs flex-1 leading-5">
              <Text className="font-bold">Declaração LGPD (Obrigatório):</Text> Confirmo que possuo a devida autorização dos clientes para cadastrar seus dados no sistema.
            </Text>
          </TouchableOpacity>

          {/* Marketing Opt-In Checkbox */}
          <TouchableOpacity
            onPress={() => setAllowMarketing(!allowMarketing)}
            activeOpacity={0.85}
            className="flex-row items-start gap-3 p-3.5 bg-white rounded-2xl border border-gray-200 mb-6"
          >
            <Ionicons
              name={allowMarketing ? "checkbox" : "square-outline"}
              size={22}
              color={allowMarketing ? navyBlue : "#9CA3AF"}
            />
            <Text className="text-gray-800 text-xs flex-1 leading-5">
              Permitir envio de mensagens automáticas de lembrete, aniversário e reativação para estes clientes.
            </Text>
          </TouchableOpacity>

          {/* Submit Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setCurrentStep(2)}
              activeOpacity={0.8}
              className="flex-1 py-3.5 bg-white rounded-xl border border-gray-200 items-center"
            >
              <Text className="text-gray-700 text-xs font-extrabold uppercase">Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={executeBatchImport}
              disabled={!lgpdConsent}
              activeOpacity={0.85}
              className={`flex-1 py-3.5 rounded-xl items-center shadow-md ${
                lgpdConsent ? "bg-[#092D5D]" : "bg-gray-300 opacity-60"
              }`}
            >
              <Text className="text-white text-xs font-extrabold uppercase tracking-wide">
                Concluir Importação
              </Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      )}

      {/* STEP 4: IMPORT PROGRESS & SUMMARY */}
      {currentStep === 4 && (
        <View className="py-8 items-center justify-center gap-4">
          {isImporting ? (
            <>
              <ActivityIndicator size="large" color={navyBlue} />
              <Text className="text-gray-900 font-extrabold text-base">Importando clientes...</Text>
              <Text className="text-gray-600 text-xs font-medium">
                {importedCount} de {totalToImport} processados
              </Text>
              {/* Progress bar */}
              <View className="w-full h-3 bg-white rounded-full overflow-hidden my-2 border border-gray-200">
                <View
                  className="h-full bg-[#092D5D]"
                  style={{
                    width: `${Math.round((importedCount / Math.max(totalToImport, 1)) * 100)}%`,
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text className="text-gray-900 font-black text-xl text-center">
                Importação Concluída! 🎉
              </Text>
              <Text className="text-gray-600 text-xs text-center px-4">
                <Text className="text-emerald-600 font-bold">{importedCount}</Text> cliente(s) importado(s) com sucesso.
                {failedCount > 0 && ` (${failedCount} falha(s)/duplicado(s))`}
              </Text>

              <TouchableOpacity
                onPress={handleClose}
                activeOpacity={0.85}
                className="w-full py-3.5 bg-[#092D5D] rounded-2xl items-center mt-4 shadow-md"
              >
                <Text className="text-white font-extrabold text-sm uppercase tracking-wide">
                  Concluir
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );
}

interface ImportClientsModalProps {
  visible: boolean;
  onClose: () => void;
  onCustomImport?: (importedClients: { name: string; phone: string; email?: string }[]) => Promise<void> | void;
}

export function ImportClientsModal({ visible, onClose, onCustomImport }: ImportClientsModalProps) {
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  useEffect(() => {
    if (visible) {
      openBottomSheet(
        <ImportClientsContent
          onClose={() => {
            closeBottomSheet();
            onClose();
          }}
          onCustomImport={onCustomImport}
        />,
        1
      );
    } else {
      closeBottomSheet();
    }
  }, [visible]);

  return null;
}

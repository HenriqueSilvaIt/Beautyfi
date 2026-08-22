import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Share,
} from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useImportClientsViewModel } from "./useImportClients.viewModel";
import { getCsvTemplateString } from "@/shared/utils/csvTemplate";

interface ImportClientsContentProps {
  onClose: () => void;
}

export function ImportClientsContent({ onClose }: ImportClientsContentProps) {
  const themeGold = colors["app-theme-secundary"] || "#CBA35D";

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
  } = useImportClientsViewModel(() => onClose());

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
    <View className="bg-background-secondary rounded-t-3xl p-5 flex-1 border-t border-accent-gold/40 shadow-2xl">
      {/* Top Bar */}
      <View className="flex-row items-center justify-between pb-3 border-b border-white/10 mb-4">
        <View className="flex-row items-center gap-2">
          <Ionicons name="people-circle-outline" size={24} color={themeGold} />
          <Text className="text-font-primary text-lg font-bold">Importar Clientes</Text>
        </View>
        <TouchableOpacity onPress={handleClose} className="p-1">
          <Ionicons name="close" size={24} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* STEP 1: CHOICE OF SOURCE */}
      {currentStep === 1 && (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-font-secondary text-sm mb-4">
            Escolha de onde deseja importar a base de clientes do seu salão:
          </Text>

          {loadingContacts ? (
            <View className="py-12 items-center justify-center gap-3">
              <ActivityIndicator size="large" color={themeGold} />
              <Text className="text-font-secondary text-sm">Carregando contatos...</Text>
            </View>
          ) : (
            <View className="gap-3">
              <TouchableOpacity
                onPress={fetchPhoneContacts}
                className="p-4 rounded-2xl bg-background-tertiary border border-accent-gold/20 flex-row items-center gap-4 active:opacity-80"
              >
                <View className="w-12 h-12 rounded-full bg-blue-500/20 items-center justify-center">
                  <Ionicons name="phone-portrait-outline" size={24} color="#3B82F6" />
                </View>
                <View className="flex-1">
                  <Text className="text-font-primary font-semibold text-base">Contatos do Celular</Text>
                  <Text className="text-font-secondary text-xs mt-0.5">
                    Selecione individualmente quem importar da sua agenda.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={themeGold} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickCsvFile}
                className="p-4 rounded-2xl bg-background-tertiary border border-accent-gold/20 flex-row items-center gap-4 active:opacity-80"
              >
                <View className="w-12 h-12 rounded-full bg-emerald-500/20 items-center justify-center">
                  <Ionicons name="document-text-outline" size={24} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-font-primary font-semibold text-base">Arquivo CSV / Excel</Text>
                  <Text className="text-font-secondary text-xs mt-0.5">
                    Importe planilhas vindas de outros sistemas (Avec, Trinks).
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={themeGold} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={selectGoogleSource}
                className="p-4 rounded-2xl bg-background-tertiary border border-accent-gold/20 flex-row items-center gap-4 active:opacity-80"
              >
                <View className="w-12 h-12 rounded-full bg-red-500/20 items-center justify-center">
                  <Ionicons name="logo-google" size={22} color="#EF4444" />
                </View>
                <View className="flex-1">
                  <Text className="text-font-primary font-semibold text-base">Google Contacts</Text>
                  <Text className="text-font-secondary text-xs mt-0.5">
                    Exporte seus contatos do Google em CSV para importar.
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={themeGold} />
              </TouchableOpacity>

              {/* Model CSV Download */}
              <TouchableOpacity
                onPress={downloadCsvTemplate}
                className="mt-4 p-3 bg-background-quartenary rounded-xl border border-white/10 flex-row items-center justify-center gap-2"
              >
                <Ionicons name="download-outline" size={18} color={themeGold} />
                <Text className="text-accent-gold text-xs font-semibold">Baixar modelo de planilha (.csv)</Text>
              </TouchableOpacity>
            </View>
          )}
        </BottomSheetScrollView>
      )}

      {/* STEP 2: SELECTIVE CONTACT LIST */}
      {currentStep === 2 && (
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-font-primary text-sm font-semibold">
              Selecionados: <Text className="text-accent-gold">{selectedCount}</Text>
            </Text>

            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => toggleSelectAll(true)}
                className="px-3 py-1.5 bg-background-tertiary rounded-lg border border-white/10"
              >
                <Text className="text-font-primary text-xs font-medium">Marcar todos</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleSelectAll(false)}
                className="px-3 py-1.5 bg-background-tertiary rounded-lg border border-white/10"
              >
                <Text className="text-font-secondary text-xs font-medium">Desmarcar</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View className="flex-row items-center bg-background-tertiary rounded-xl px-3.5 py-2.5 border border-white/10 mb-3">
            <Ionicons name="search" size={20} color="#9CA3AF" />
            <TextInput
              placeholder="Buscar contato ou telefone..."
              placeholderTextColor="#6B7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-2 text-font-primary text-sm p-0"
            />
          </View>

          {/* Contacts Scrollable List */}
          <BottomSheetScrollView className="flex-1 my-1" showsVerticalScrollIndicator={false}>
            {filteredContacts.length === 0 ? (
              <View className="py-8 items-center justify-center">
                <Text className="text-font-secondary text-sm">Nenhum contato encontrado.</Text>
              </View>
            ) : (
              filteredContacts.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => c.isValid && toggleContactSelection(c.id)}
                  activeOpacity={0.7}
                  className={`p-3.5 mb-2.5 rounded-2xl border flex-row items-center justify-between ${
                    c.selected ? "bg-accent-gold/15 border-accent-gold/50" : "bg-background-tertiary border-white/5"
                  } ${!c.isValid ? "opacity-50" : ""}`}
                >
                  <View className="flex-row items-center gap-3.5 flex-1 pr-2">
                    <Ionicons
                      name={c.selected ? "checkbox" : "square-outline"}
                      size={24}
                      color={c.selected ? themeGold : "#6B7280"}
                    />
                    <View className="flex-1">
                      <Text className="text-font-primary text-base font-bold">{c.name}</Text>
                      <Text className="text-font-secondary text-sm font-medium mt-0.5">{c.phone}</Text>
                      {!c.isValid && (
                        <Text className="text-red-400 text-xs mt-0.5">{c.validationError}</Text>
                      )}
                    </View>
                  </View>

                  {c.isValid && (
                    <View className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
                      <Text className="text-emerald-400 text-xs font-bold">Válido</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))
            )}
          </BottomSheetScrollView>

          {/* Footer Buttons */}
          <View className="flex-row gap-3 pt-3 border-t border-white/10">
            <TouchableOpacity
              onPress={() => setCurrentStep(1)}
              className="flex-1 py-3 bg-background-tertiary rounded-xl border border-white/10 items-center"
            >
              <Text className="text-font-primary text-sm font-semibold">Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentStep(3)}
              disabled={selectedCount === 0}
              className={`flex-1 py-3 rounded-xl items-center ${
                selectedCount > 0 ? "bg-accent-gold" : "bg-gray-600 opacity-50"
              }`}
              style={selectedCount > 0 ? { backgroundColor: themeGold } : undefined}
            >
              <Text className="text-black text-sm font-bold">Avançar ({selectedCount})</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* STEP 3: LGPD CONSENT & CONFIRMATION */}
      {currentStep === 3 && (
        <BottomSheetScrollView showsVerticalScrollIndicator={false}>
          <Text className="text-font-primary font-bold text-base mb-2">Consentimento LGPD & Confirmação</Text>
          <Text className="text-font-secondary text-xs mb-4">
            Revise os termos de privacidade antes de submeter os clientes à base do seu estabelecimento.
          </Text>

          {/* Summary Card */}
          <View className="bg-background-tertiary p-4 rounded-xl border border-white/10 mb-4 gap-2">
            <View className="flex-row justify-between">
              <Text className="text-font-secondary text-xs">Total selecionados:</Text>
              <Text className="text-accent-gold font-bold text-sm">{selectedCount} clientes</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-font-secondary text-xs">Origem dos dados:</Text>
              <Text className="text-font-primary text-xs capitalize">{selectedSource || "Planilha/Agenda"}</Text>
            </View>
          </View>

          {/* LGPD Checkbox */}
          <TouchableOpacity
            onPress={() => setLgpdConsent(!lgpdConsent)}
            className="flex-row items-start gap-3 p-3 bg-background-tertiary rounded-xl border border-white/10 mb-3"
          >
            <Ionicons
              name={lgpdConsent ? "checkbox" : "square-outline"}
              size={24}
              color={lgpdConsent ? themeGold : "#6B7280"}
            />
            <Text className="text-font-primary text-xs flex-1 leading-5">
              <Text className="font-bold">Declaração LGPD (Obrigatório):</Text> Confirmo que possuo a devida autorização dos clientes para cadastrar seus dados no sistema do salão.
            </Text>
          </TouchableOpacity>

          {/* Marketing Opt-In Checkbox */}
          <TouchableOpacity
            onPress={() => setAllowMarketing(!allowMarketing)}
            className="flex-row items-start gap-3 p-3 bg-background-tertiary rounded-xl border border-white/10 mb-6"
          >
            <Ionicons
              name={allowMarketing ? "checkbox" : "square-outline"}
              size={24}
              color={allowMarketing ? themeGold : "#6B7280"}
            />
            <Text className="text-font-primary text-xs flex-1 leading-5">
              Permitir envio de mensagens automáticas de lembrete, aniversário e reativação para estes clientes.
            </Text>
          </TouchableOpacity>

          {/* Submit Buttons */}
          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={() => setCurrentStep(2)}
              className="flex-1 py-3.5 bg-background-tertiary rounded-xl border border-white/10 items-center"
            >
              <Text className="text-font-primary text-sm font-semibold">Voltar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={executeBatchImport}
              disabled={!lgpdConsent}
              className={`flex-1 py-3.5 rounded-xl items-center ${
                lgpdConsent ? "bg-accent-gold" : "bg-gray-600 opacity-50"
              }`}
              style={lgpdConsent ? { backgroundColor: themeGold } : undefined}
            >
              <Text className="text-black text-sm font-bold">Concluir Importação</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      )}

      {/* STEP 4: IMPORT PROGRESS & SUMMARY */}
      {currentStep === 4 && (
        <View className="py-6 items-center justify-center gap-4">
          {isImporting ? (
            <>
              <ActivityIndicator size="large" color={themeGold} />
              <Text className="text-font-primary font-bold text-base">Importando clientes...</Text>
              <Text className="text-font-secondary text-sm">
                {importedCount} de {totalToImport} processados
              </Text>
              {/* Progress bar */}
              <View className="w-full h-3 bg-background-tertiary rounded-full overflow-hidden my-2">
                <View
                  className="h-full bg-accent-gold"
                  style={{
                    width: `${Math.round((importedCount / Math.max(totalToImport, 1)) * 100)}%`,
                    backgroundColor: themeGold,
                  }}
                />
              </View>
            </>
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={60} color="#10B981" />
              <Text className="text-font-primary font-bold text-xl text-center">
                Importação Concluída! 🎉
              </Text>
              <Text className="text-font-secondary text-sm text-center">
                <Text className="text-emerald-400 font-bold">{importedCount}</Text> clientes importados com sucesso.
                {failedCount > 0 && ` (${failedCount} falhas/duplicados)`}
              </Text>

              <TouchableOpacity
                onPress={handleClose}
                className="w-full py-3.5 bg-accent-gold rounded-xl items-center mt-4"
                style={{ backgroundColor: themeGold }}
              >
                <Text className="text-black font-bold text-base">Voltar ao aplicativo</Text>
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
}

export function ImportClientsModal({ visible, onClose }: ImportClientsModalProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/80 justify-end">
        <ImportClientsContent onClose={onClose} />
      </View>
    </Modal>
  );
}

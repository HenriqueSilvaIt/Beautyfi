import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useServiceNoShowClientsViewModel } from "./useServiceNoShowClientsViewModel";

export function ServiceNoShowClientsView(
  props: ReturnType<typeof useServiceNoShowClientsViewModel>
) {
  const {
    router,
    insets,
    service,
    isLoadingService,
    isLoadingClients,
    noShowApplyToAll,
    setNoShowApplyToAll,
    selectedClientIds,
    searchQuery,
    setSearchQuery,
    filteredClients,
    allFilteredSelected,
    handleToggleClient,
    handleToggleSelectAll,
    handleSave,
    isSubmitting,
  } = props;

  if (isLoadingService) {
    return (
      <View className="flex-1 bg-background-primary justify-center items-center">
        <ActivityIndicator size="large" color="#092D5D" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-primary">
      {/* Header */}
      <View
        style={{ paddingTop: Math.max(insets.top, 20) + 10 }}
        className="bg-background-tertiary px-5 pb-4 border-b border-gray-700/50 flex-row items-center justify-between"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-800 justify-center items-center"
        >
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>
        <View className="flex-1 items-center mx-2">
          <Text className="text-font-primary text-base font-bold text-center" numberOfLines={1}>
            Clientes para Sinal / No-Show
          </Text>
          <Text className="text-font-secondary text-xs text-center" numberOfLines={1}>
            {service?.name || "Serviço"}
          </Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 110 + insets.bottom }}
      >
        {/* Card do Modo de Aplicação */}
        <View className="bg-background-tertiary border border-gray-700/50 rounded-2xl p-5 mb-5 shadow-sm">
          <View className="flex-row items-center justify-between">
            <View className="flex-1 pr-3">
              <Text className="text-font-primary text-sm font-bold">
                Aplicar a TODOS os clientes
              </Text>
              <Text className="text-font-secondary text-xs mt-1 leading-4">
                {noShowApplyToAll
                  ? "Ativo. Todos os clientes que agendarem este serviço pagarão o sinal obrigatório."
                  : "Personalizado. Apenas os clientes selecionados na lista abaixo pagarão sinal para este serviço."}
              </Text>
            </View>
            <Switch
              value={noShowApplyToAll}
              onValueChange={(val) => setNoShowApplyToAll(val)}
              trackColor={{ false: "#3f3f46", true: "#092D5D" }}
              thumbColor={noShowApplyToAll ? "#CBA35D" : "#f4f4f5"}
            />
          </View>
        </View>

        {/* Seção de Clientes Específicos (quando noShowApplyToAll == false) */}
        {!noShowApplyToAll ? (
          <View className="gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-font-primary text-sm font-bold">
                Clientes com Sinal Mandatório ({selectedClientIds.length})
              </Text>
              <TouchableOpacity
                onPress={handleToggleSelectAll}
                activeOpacity={0.7}
                className="bg-app-theme-primary/10 border border-app-theme-primary/30 px-3 py-1.5 rounded-lg"
              >
                <Text className="text-app-theme-primary font-semibold text-xs">
                  {allFilteredSelected ? "Desmarcar Todos" : "Selecionar Todos"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Campo de Busca */}
            <View className="bg-background-tertiary border border-gray-700/50 rounded-xl px-3 py-2 flex-row items-center gap-2">
              <Ionicons name="search" size={18} color={colors.gray[400]} />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Buscar cliente por nome ou telefone..."
                placeholderTextColor={colors.gray[400]}
                className="flex-1 text-font-primary text-sm py-1"
              />
              {searchQuery ? (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color={colors.gray[400]} />
                </TouchableOpacity>
              ) : null}
            </View>

            {/* Lista de Clientes */}
            {isLoadingClients ? (
              <View className="py-8 items-center">
                <ActivityIndicator color={colors.white} />
              </View>
            ) : filteredClients.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-font-secondary text-xs">Nenhum cliente encontrado.</Text>
              </View>
            ) : (
              <View className="bg-background-tertiary border border-gray-700/50 rounded-2xl overflow-hidden divide-y divide-gray-800">
                {filteredClients.map((client) => {
                  const isSelected = Boolean(client.id && selectedClientIds.includes(client.id));
                  return (
                    <TouchableOpacity
                      key={client.id ?? client.name}
                      onPress={() => handleToggleClient(client.id)}
                      activeOpacity={0.8}
                      className={`p-4 flex-row items-center justify-between ${
                        isSelected ? "bg-app-theme-primary/5" : ""
                      }`}
                    >
                      <View className="flex-row items-center gap-3 flex-1 pr-2">
                        <View
                          className={`w-9 h-9 rounded-full items-center justify-center border ${
                            isSelected
                              ? "bg-[#092D5D] border-[#CBA35D]"
                              : "bg-gray-800 border-gray-700"
                          }`}
                        >
                          <Text
                            className={`font-bold text-xs ${
                              isSelected ? "text-[#CBA35D]" : "text-gray-300"
                            }`}
                          >
                            {client.name?.charAt(0).toUpperCase() || "C"}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text
                            className={`font-bold text-sm ${
                              isSelected ? "text-font-primary" : "text-font-secondary"
                            }`}
                            numberOfLines={1}
                          >
                            {client.name} {client.lastName || ""}
                          </Text>
                          {client.phone ? (
                            <Text className="text-font-secondary text-xs mt-0.5">
                              {client.phone}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                      <Switch
                        value={isSelected}
                        onValueChange={() => handleToggleClient(client.id)}
                        trackColor={{ false: "#3f3f46", true: "#092D5D" }}
                        thumbColor={isSelected ? "#CBA35D" : "#f4f4f5"}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>

      {/* Botão Flutuante de Salvar com Margem Segura do Rodapé */}
      <View
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        className="absolute bottom-0 left-0 right-0 p-5 bg-background-primary/95 border-t border-gray-800"
      >
        <TouchableOpacity
          onPress={handleSave}
          disabled={isSubmitting}
          activeOpacity={0.85}
          className="h-14 bg-app-theme-primary rounded-xl justify-center items-center shadow-lg"
        >
          {isSubmitting ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text className="text-white font-bold text-base">Salvar Preferências</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

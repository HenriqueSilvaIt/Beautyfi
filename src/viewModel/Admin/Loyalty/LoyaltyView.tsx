import React from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Controller } from "react-hook-form";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppInput } from "@/shared/components/AppInput";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { useLoyaltyViewModel } from "./useLoyaltyViewModel";

export function LoyaltyView(props: ReturnType<typeof useLoyaltyViewModel>) {
  const {
    control,
    onSubmit,
    isLoading,
    loyaltyActive,
    itemsList,
    showItemModal,
    setShowItemModal,
    itemType,
    setItemType,
    selectedServiceId,
    setSelectedServiceId,
    selectedProductId,
    setSelectedProductId,
    itemTitle,
    setItemTitle,
    itemPoints,
    setItemPoints,
    itemDescription,
    setItemDescription,
    servicesList,
    productsList,
    handleAddItem,
    handleDeleteItem,
  } = props;

  return (
    <KeyboardContainer>
      <View className="flex-1 bg-background-primary">
        <AppAdminHeader
          title="Programa de Fidelidade"
          iconRight={{ icon: false, path: "" }}
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        >
          {/* Header Banner */}
          <View className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-[#092D5D] to-[#1E40AF] border border-accent-gold/30">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-10 h-10 rounded-full bg-accent-gold/20 items-center justify-center">
                <Ionicons name="gift-outline" size={22} color="#CBA35D" />
              </View>
              <View className="flex-1">
                <Text className="text-font-primary text-base font-bold">
                  Clube de Pontos & Recompensas
                </Text>
                <Text className="text-font-secondary text-xs mt-0.5">
                  Fidelize seus clientes oferecendo prêmios, serviços e produtos a cada agendamento
                </Text>
              </View>
            </View>
          </View>

          {/* Toggle Ativação */}
          <View className="mt-6 p-4 rounded-2xl bg-background-quartenary border border-white/5 flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <Text className="text-font-primary text-sm font-bold">
                Ativar Programa de Fidelidade
              </Text>
              <Text className="text-font-secondary text-xs mt-0.5">
                Exibe a aba de Fidelidade na página do seu salão no aplicativo
              </Text>
            </View>
            <Controller
              control={control}
              name="loyaltyActive"
              render={({ field: { value, onChange } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: "#374151", true: "#CBA35D" }}
                  thumbColor={value ? "#FFFFFF" : "#9CA3AF"}
                />
              )}
            />
          </View>

          {loyaltyActive && (
            <View className="mt-6 gap-4">
              <Text className="text-font-secondary text-xs font-bold uppercase tracking-wider px-1">
                CONFIGURAÇÃO DA RECOMPENSA
              </Text>

              {/* Form de Pontos por Real */}
              <View className="bg-background-quartenary rounded-2xl p-4 border border-white/5 gap-4">
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-font-primary text-xs font-semibold mb-1.5">
                      Pontos por R$ 1,00 gasto
                    </Text>
                    <Controller
                      control={control}
                      name="loyaltyPointsPerReal"
                      render={({ field: { value, onChange } }) => (
                        <AppInput
                          value={value}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          placeholder="Ex: 1.0"
                        />
                      )}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-font-primary text-xs font-semibold mb-1.5">
                      Pontuação Mínima
                    </Text>
                    <Controller
                      control={control}
                      name="loyaltyMinPoints"
                      render={({ field: { value, onChange } }) => (
                        <AppInput
                          value={value}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          placeholder="Ex: 100"
                        />
                      )}
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-font-primary text-xs font-semibold mb-1.5">
                    Valor do Benefício Geral (R$)
                  </Text>
                  <Controller
                    control={control}
                    name="loyaltyRewardValue"
                    render={({ field: { value, onChange } }) => (
                      <AppInput
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        placeholder="Ex: 15.00"
                      />
                    )}
                  />
                </View>

                <View>
                  <Text className="text-font-primary text-xs font-semibold mb-1.5">
                    Título da Recompensa Geral
                  </Text>
                  <Controller
                    control={control}
                    name="loyaltyRewardDescription"
                    render={({ field: { value, onChange } }) => (
                      <AppInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Ex: R$ 15,00 de desconto no próximo agendamento"
                      />
                    )}
                  />
                </View>

                <View>
                  <Text className="text-font-primary text-xs font-semibold mb-1.5">
                    Regras e Instruções do Salão
                  </Text>
                  <Controller
                    control={control}
                    name="loyaltyRuleDescription"
                    render={({ field: { value, onChange } }) => (
                      <AppInput
                        value={value}
                        onChangeText={onChange}
                        multiline
                        numberOfLines={3}
                        placeholder="Descreva como os clientes acumulam e resgatam os pontos..."
                      />
                    )}
                  />
                </View>
              </View>

              {/* SEÇÃO: ITENS E PRÊMIOS DE FIDELIDADE (SERVIÇOS E PRODUTOS) */}
              <View className="mt-4 flex-row items-center justify-between px-1">
                <Text className="text-font-secondary text-xs font-bold uppercase tracking-wider">
                  ITENS DE PRÊMIO (SERVIÇOS & PRODUTOS)
                </Text>
                <TouchableOpacity
                  onPress={() => setShowItemModal(true)}
                  className="px-3 py-1.5 rounded-full bg-accent-gold/20 border border-accent-gold/40 flex-row items-center gap-1"
                >
                  <Ionicons name="add-circle-outline" size={16} color="#CBA35D" />
                  <Text className="text-accent-gold font-bold text-xs">Novo Item</Text>
                </TouchableOpacity>
              </View>

              <View className="gap-3">
                {itemsList.length === 0 ? (
                  <View className="p-4 rounded-2xl bg-background-quartenary border border-white/5 items-center">
                    <Text className="text-font-secondary text-xs text-center">
                      Nenhum item específico de serviço/produto adicionado.
                    </Text>
                  </View>
                ) : (
                  itemsList.map((item) => (
                    <View
                      key={item.id}
                      className="p-4 rounded-2xl bg-background-quartenary border border-white/10 flex-row items-center justify-between"
                    >
                      <View className="flex-1 mr-2">
                        <View className="flex-row items-center gap-2 mb-1">
                          <View className="px-2 py-0.5 rounded-md bg-accent-gold/20 border border-accent-gold/30">
                            <Text className="text-accent-gold font-bold text-[10px] uppercase">
                              {item.itemType === "SERVICE" ? "Serviço" : item.itemType === "PRODUCT" ? "Produto" : "Prêmio"}
                            </Text>
                          </View>
                          <Text className="text-accent-gold font-bold text-xs">
                            {item.pointsRequired} Pontos
                          </Text>
                        </View>
                        <Text className="text-font-primary font-bold text-sm">
                          {item.title}
                        </Text>
                        {item.description ? (
                          <Text className="text-font-secondary text-xs mt-0.5" numberOfLines={2}>
                            {item.description}
                          </Text>
                        ) : null}
                      </View>

                      <TouchableOpacity
                        onPress={() => item.id && handleDeleteItem(item.id)}
                        className="p-2.5 rounded-xl bg-accent-red/10 border border-accent-red/20"
                      >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                    </View>
                  ))
                )}
              </View>
            </View>
          )}

          {/* Botão Salvar */}
          <View className="mt-8">
            <TouchableOpacity
              onPress={onSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
              className="h-[56px] bg-app-theme-primary rounded-2xl items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text className="text-font-secundary text-base font-bold">
                  Salvar Configurações
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* MODAL ADICIONAR ITEM DE RECOMPENSA */}
        <Modal
          visible={showItemModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowItemModal(false)}
        >
          <View className="flex-1 bg-black/70 justify-end">
            <View className="bg-background-quartenary rounded-t-3xl p-6 border-t border-accent-gold/30 space-y-4">
              <View className="flex-row items-center justify-between border-b border-white/10 pb-3">
                <Text className="text-font-primary text-base font-bold">
                  Adicionar Item de Recompensa
                </Text>
                <TouchableOpacity onPress={() => setShowItemModal(false)}>
                  <Ionicons name="close" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {/* Seletor de Tipo */}
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setItemType("SERVICE")}
                  className={`flex-1 py-2.5 rounded-xl items-center border ${
                    itemType === "SERVICE"
                      ? "bg-accent-gold border-accent-gold"
                      : "bg-background-tertiary border-white/10"
                  }`}
                >
                  <Text className={`text-xs font-bold ${itemType === "SERVICE" ? "text-slate-950" : "text-white"}`}>
                    Serviço
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setItemType("PRODUCT")}
                  className={`flex-1 py-2.5 rounded-xl items-center border ${
                    itemType === "PRODUCT"
                      ? "bg-accent-gold border-accent-gold"
                      : "bg-background-tertiary border-white/10"
                  }`}
                >
                  <Text className={`text-xs font-bold ${itemType === "PRODUCT" ? "text-slate-950" : "text-white"}`}>
                    Produto
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setItemType("CUSTOM")}
                  className={`flex-1 py-2.5 rounded-xl items-center border ${
                    itemType === "CUSTOM"
                      ? "bg-accent-gold border-accent-gold"
                      : "bg-background-tertiary border-white/10"
                  }`}
                >
                  <Text className={`text-xs font-bold ${itemType === "CUSTOM" ? "text-slate-950" : "text-white"}`}>
                    Outro
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Seletor de Serviço / Produto */}
              {itemType === "SERVICE" && (
                <View>
                  <Text className="text-font-primary text-xs font-semibold mb-1.5">
                    Selecione o Serviço
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 my-1">
                    {servicesList.map((srv) => (
                      <TouchableOpacity
                        key={srv.id}
                        onPress={() => {
                          setSelectedServiceId(srv.id);
                          setItemTitle(srv.name);
                        }}
                        className={`px-3 py-2 rounded-xl border ${
                          selectedServiceId === srv.id
                            ? "bg-accent-gold/20 border-accent-gold"
                            : "bg-background-tertiary border-white/10"
                        }`}
                      >
                        <Text className="text-white text-xs font-bold">{srv.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {itemType === "PRODUCT" && (
                <View>
                  <Text className="text-font-primary text-xs font-semibold mb-1.5">
                    Selecione o Produto
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2 my-1">
                    {productsList.map((prod) => (
                      <TouchableOpacity
                        key={prod.id}
                        onPress={() => {
                          setSelectedProductId(prod.id);
                          setItemTitle(prod.name);
                        }}
                        className={`px-3 py-2 rounded-xl border ${
                          selectedProductId === prod.id
                            ? "bg-accent-gold/20 border-accent-gold"
                            : "bg-background-tertiary border-white/10"
                        }`}
                      >
                        <Text className="text-white text-xs font-bold">{prod.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              <View>
                <Text className="text-font-primary text-xs font-semibold mb-1.5">
                  Título do Prêmio / Recompensa
                </Text>
                <AppInput
                  value={itemTitle}
                  onChangeText={setItemTitle}
                  placeholder="Ex: Corte de Cabelo Cortesia"
                />
              </View>

              <View>
                <Text className="text-font-primary text-xs font-semibold mb-1.5">
                  Pontos Necessários para Resgate
                </Text>
                <AppInput
                  value={itemPoints}
                  onChangeText={setItemPoints}
                  keyboardType="numeric"
                  placeholder="Ex: 150"
                />
              </View>

              <View>
                <Text className="text-font-primary text-xs font-semibold mb-1.5">
                  Descrição Adicional
                </Text>
                <AppInput
                  value={itemDescription}
                  onChangeText={setItemDescription}
                  placeholder="Instruções de resgate no estabelecimento"
                />
              </View>

              <TouchableOpacity
                onPress={handleAddItem}
                disabled={isLoading}
                className="h-[50px] bg-app-theme-primary rounded-2xl items-center justify-center mt-2 shadow-lg"
              >
                {isLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text className="text-font-secundary text-sm font-bold">
                    Adicionar Item ao Programa
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardContainer>
  );
}

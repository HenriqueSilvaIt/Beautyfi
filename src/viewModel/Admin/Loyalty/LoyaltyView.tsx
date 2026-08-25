import React from "react";
import {
  ActivityIndicator,
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
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";

function AddItemBottomSheet({
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
  isLoading,
  closeBottomSheet,
}: any) {
  return (
    <View className="px-5 py-4 gap-3 bg-white rounded-t-3xl pb-10">
      <View className="flex-row items-center justify-between border-b border-gray-100 pb-3">
        <View className="flex-row items-center gap-2">
          <Ionicons name="gift-outline" size={20} color="#092D5D" />
          <Text className="text-gray-900 text-base font-extrabold">
            Novo Item de Recompensa
          </Text>
        </View>
        <TouchableOpacity onPress={closeBottomSheet} className="p-1">
          <Ionicons name="close" size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Seletor de Tipo */}
      <View className="flex-row gap-2">
        <TouchableOpacity
          onPress={() => {
            setItemType("SERVICE");
            setSelectedProductId(undefined);
          }}
          className={`flex-1 py-2.5 rounded-xl items-center border ${
            itemType === "SERVICE"
              ? "bg-[#092D5D] border-[#092D5D]"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <Text className={`text-xs font-bold ${itemType === "SERVICE" ? "text-white" : "text-gray-700"}`}>
            Serviço
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setItemType("PRODUCT");
            setSelectedServiceId(undefined);
          }}
          className={`flex-1 py-2.5 rounded-xl items-center border ${
            itemType === "PRODUCT"
              ? "bg-[#092D5D] border-[#092D5D]"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <Text className={`text-xs font-bold ${itemType === "PRODUCT" ? "text-white" : "text-gray-700"}`}>
            Produto
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setItemType("CUSTOM");
            setSelectedServiceId(undefined);
            setSelectedProductId(undefined);
          }}
          className={`flex-1 py-2.5 rounded-xl items-center border ${
            itemType === "CUSTOM"
              ? "bg-[#092D5D] border-[#092D5D]"
              : "bg-gray-50 border-gray-200"
          }`}
        >
          <Text className={`text-xs font-bold ${itemType === "CUSTOM" ? "text-white" : "text-gray-700"}`}>
            Outro Prêmio
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seleção do Serviço */}
      {itemType === "SERVICE" && (
        <View>
          <Text className="text-gray-700 text-xs font-semibold mb-1.5">
            Selecione o Serviço do Salão:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} className="py-1">
            {servicesList.map((srv: any) => (
              <TouchableOpacity
                key={srv.id}
                onPress={() => {
                  setSelectedServiceId(srv.id);
                  setItemTitle(srv.name);
                }}
                className={`px-3.5 py-2.5 rounded-xl border ${
                  selectedServiceId === srv.id
                    ? "bg-[#092D5D]/10 border-[#092D5D]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Text className={`text-xs font-bold ${selectedServiceId === srv.id ? "text-[#092D5D]" : "text-gray-700"}`}>
                  {srv.name} (R$ {Number(srv.price || 0).toFixed(2).replace(".", ",")})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Seleção do Produto */}
      {itemType === "PRODUCT" && (
        <View>
          <Text className="text-gray-700 text-xs font-semibold mb-1.5">
            Selecione o Produto do Estoque:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} className="py-1">
            {productsList.map((prod: any) => (
              <TouchableOpacity
                key={prod.id}
                onPress={() => {
                  setSelectedProductId(prod.id);
                  setItemTitle(prod.name);
                }}
                className={`px-3.5 py-2.5 rounded-xl border ${
                  selectedProductId === prod.id
                    ? "bg-[#092D5D]/10 border-[#092D5D]"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <Text className={`text-xs font-bold ${selectedProductId === prod.id ? "text-[#092D5D]" : "text-gray-700"}`}>
                  {prod.name} (R$ {Number(prod.price || 0).toFixed(2).replace(".", ",")})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Título do Prêmio */}
      <View>
        <Text className="text-gray-700 text-xs font-semibold mb-1">
          Nome da Recompensa / Prêmio:
        </Text>
        <AppInput
          value={itemTitle}
          onChangeText={setItemTitle}
          placeholder="Ex: Corte de Cabelo Cortesia"
        />
      </View>

      {/* Pontos Necessários */}
      <View>
        <Text className="text-gray-700 text-xs font-semibold mb-1">
          Pontos Necessários para Resgatar:
        </Text>
        <AppInput
          value={itemPoints}
          onChangeText={setItemPoints}
          keyboardType="numeric"
          placeholder="Ex: 100"
        />
      </View>

      {/* Descrição Adicional */}
      <View>
        <Text className="text-gray-700 text-xs font-semibold mb-1">
          Instruções de Resgate (Opcional):
        </Text>
        <AppInput
          value={itemDescription}
          onChangeText={setItemDescription}
          placeholder="Ex: Válido de segunda a quinta"
        />
      </View>

      {/* Botão Salvar Item */}
      <TouchableOpacity
        onPress={handleAddItem}
        disabled={isLoading}
        className="h-[52px] bg-[#092D5D] rounded-xl items-center justify-center mt-2 shadow-md"
      >
        {isLoading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text className="text-white font-bold text-sm">
            Adicionar Prêmio ao Clube
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

export function LoyaltyView(props: ReturnType<typeof useLoyaltyViewModel>) {
  const {
    control,
    watch,
    onSubmit,
    isLoading,
    loyaltyActive,
    stampActive,
    itemsList,
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

  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();

  const handleOpenAddItemSheet = () => {
    openBottomSheet(
      <AddItemBottomSheet
        itemType={itemType}
        setItemType={setItemType}
        selectedServiceId={selectedServiceId}
        setSelectedServiceId={setSelectedServiceId}
        selectedProductId={selectedProductId}
        setSelectedProductId={setSelectedProductId}
        itemTitle={itemTitle}
        setItemTitle={setItemTitle}
        itemPoints={itemPoints}
        setItemPoints={setItemPoints}
        itemDescription={itemDescription}
        setItemDescription={setItemDescription}
        servicesList={servicesList}
        productsList={productsList}
        handleAddItem={handleAddItem}
        isLoading={isLoading}
        closeBottomSheet={closeBottomSheet}
      />,
      0
    );
  };

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
          <View className="mt-4 p-5 rounded-2xl bg-gradient-to-r from-[#092D5D] to-[#1E40AF] border border-[#CBA35D]/30 shadow-md">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-12 h-12 rounded-2xl bg-[#CBA35D]/20 items-center justify-center border border-[#CBA35D]/40">
                <Ionicons name="trophy" size={24} color="#CBA35D" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-base font-extrabold">
                  Clube de Prêmios & Fidelidade
                </Text>
                <Text className="text-gray-300 text-xs mt-0.5 leading-4">
                  Seus clientes acumulam pontos a cada agendamento e trocam por serviços e produtos do seu espaço!
                </Text>
              </View>
            </View>
          </View>

          {/* SEÇÃO 1: PROGRAMA DE PONTOS POR R$ */}
          <View className="mt-6 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm flex-row items-center justify-between">
            <View className="flex-1 mr-3">
              <View className="flex-row items-center gap-2">
                <Text className="text-gray-900 text-sm font-bold">
                  Programa de Pontos por R$
                </Text>
                <View className={`px-2 py-0.5 rounded-full border ${loyaltyActive ? "bg-emerald-50 border-emerald-200" : "bg-gray-100 border-gray-200"}`}>
                  <Text className={`text-[10px] font-bold ${loyaltyActive ? "text-emerald-700" : "text-gray-500"}`}>
                    {loyaltyActive ? "ATIVO" : "INATIVO"}
                  </Text>
                </View>
              </View>
              <Text className="text-gray-500 text-xs mt-1">
                Conceda pontos a cada R$ gasto em serviços para os clientes acumularem e trocarem por prêmios
              </Text>
            </View>
            <Controller
              control={control}
              name="loyaltyActive"
              render={({ field: { value, onChange } }) => (
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: "#E5E7EB", true: "#092D5D" }}
                  thumbColor={value ? "#CBA35D" : "#9CA3AF"}
                />
              )}
            />
          </View>

          {loyaltyActive && (
            <View className="mt-4 gap-5">
              {/* Regra de Pontuação */}
              <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm gap-4">
                <View className="flex-row items-center gap-2 border-b border-gray-100 pb-3">
                  <Ionicons name="sparkles-outline" size={18} color="#092D5D" />
                  <Text className="text-gray-900 text-sm font-bold">
                    Regra de Acúmulo de Pontos
                  </Text>
                </View>

                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-gray-700 text-xs font-semibold mb-1.5">
                      Pontos Concedidos:
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
                    <Text className="text-gray-700 text-xs font-semibold mb-1.5">
                      A cada R$ Gasto:
                    </Text>
                    <Controller
                      control={control}
                      name="loyaltyAmountPerPoint"
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
                </View>
                <Text className="text-gray-400 text-[11px] mt-0.5">
                  Exemplo: {watch("loyaltyPointsPerReal") || "1"} Ponto(s) a cada R$ {watch("loyaltyAmountPerPoint") || "1"},00 gastos.
                </Text>

                <View>
                  <Text className="text-gray-700 text-xs font-semibold mb-1.5">
                    Regras e Orientações para o Cliente:
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
                        placeholder="Descreva as condições de uso (ex: Pontos válidos por 1 ano. Resgate disponível de segunda a quinta)."
                      />
                    )}
                  />
                </View>
              </View>

              {/* Catálogo de Prêmios */}
              <View className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm gap-4">
                <View className="flex-row items-center gap-2 border-b border-gray-100 pb-3">
                  <Ionicons name="gift" size={18} color="#092D5D" />
                  <Text className="text-gray-900 text-sm font-bold flex-1">
                    Catálogo de Prêmios (Serviços & Produtos)
                  </Text>
                </View>

                <View className="gap-3">
                  {itemsList.length === 0 ? (
                    <View className="p-6 rounded-xl bg-gray-50 border border-gray-200/60 items-center">
                      <Ionicons name="gift-outline" size={32} color="#9CA3AF" className="mb-2" />
                      <Text className="text-gray-800 font-bold text-xs text-center">
                        Nenhum prêmio cadastrado ainda.
                      </Text>
                      <Text className="text-gray-500 text-[11px] text-center mt-0.5">
                        Ofereça serviços e produtos como recompensa para seus clientes!
                      </Text>
                    </View>
                  ) : (
                    itemsList.map((item) => (
                      <View
                        key={item.id}
                        className="p-4 rounded-xl bg-gray-50 border border-gray-200/60 flex-row items-center justify-between"
                      >
                        <View className="flex-1 mr-3">
                          <View className="flex-row items-center gap-2 mb-1">
                            <View className="px-2 py-0.5 rounded-md bg-[#092D5D]/10">
                              <Text className="text-[#092D5D] font-bold text-[10px] uppercase">
                                {item.itemType === "SERVICE" ? "Serviço" : item.itemType === "PRODUCT" ? "Produto" : "Prêmio"}
                              </Text>
                            </View>
                            {item.servicePrice ? (
                              <Text className="text-gray-500 text-xs font-semibold">
                                (R$ {Number(item.servicePrice).toFixed(2).replace(".", ",")})
                              </Text>
                            ) : item.productPrice ? (
                              <Text className="text-gray-500 text-xs font-semibold">
                                (R$ {Number(item.productPrice).toFixed(2).replace(".", ",")})
                              </Text>
                            ) : null}
                          </View>
                          <Text className="text-gray-900 font-bold text-sm">
                            {item.title}
                          </Text>
                          {item.description ? (
                            <Text className="text-gray-500 text-xs mt-0.5" numberOfLines={2}>
                              {item.description}
                            </Text>
                          ) : null}
                        </View>

                        <View className="flex-row items-center gap-3">
                          <View className="px-3 py-1.5 rounded-xl bg-[#CBA35D]/15 border border-[#CBA35D]/40 items-center">
                            <Text className="text-[#CBA35D] font-black text-xs">
                              {item.pointsRequired} pts
                            </Text>
                          </View>

                          <TouchableOpacity
                            onPress={() => item.id && handleDeleteItem(item.id)}
                            className="p-2 rounded-lg bg-red-50 border border-red-100"
                          >
                            <Ionicons name="trash-outline" size={16} color="#EF4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>

                <TouchableOpacity
                  onPress={handleOpenAddItemSheet}
                  activeOpacity={0.85}
                  className="h-12 rounded-xl bg-[#092D5D]/10 border border-[#092D5D]/30 flex-row items-center justify-center gap-2 mt-1"
                >
                  <Ionicons name="add-circle-outline" size={20} color="#092D5D" />
                  <Text className="text-[#092D5D] font-extrabold text-sm">
                    + Adicionar Novo Prêmio
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* SEÇÃO 2: CARTÃO FIDELIDADE POR SERVIÇO (CARIMBOS) */}
          <View className="mt-6 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm gap-4">
            <View className="flex-row items-center justify-between border-b border-gray-100 pb-3">
              <View className="flex-row items-center gap-2 flex-1">
                <Ionicons name="card-outline" size={18} color="#092D5D" />
                <Text className="text-gray-900 text-sm font-bold">
                  Cartão Fidelidade por Serviço (Carimbos)
                </Text>
              </View>
              <Controller
                control={control}
                name="stampActive"
                render={({ field: { value, onChange } }) => (
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: "#E5E7EB", true: "#092D5D" }}
                    thumbColor={value ? "#CBA35D" : "#9CA3AF"}
                  />
                )}
              />
            </View>

            <Text className="text-gray-500 text-xs leading-4">
              Crie uma promoção focada em um serviço específico (ex: A cada 4 Sobrancelhas nos próximos 4 meses, ganhe a 5ª grátis).
            </Text>

            {stampActive && (
              <View className="gap-4 mt-1">
                {/* Seletor de Serviço */}
                <View>
                  <Text className="text-gray-700 text-xs font-semibold mb-1.5">
                    Selecione o Serviço da Promoção:
                  </Text>
                  <Controller
                    control={control}
                    name="stampServiceId"
                    render={({ field: { value, onChange } }) => (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }} className="py-1">
                        {servicesList.map((srv: any) => (
                          <TouchableOpacity
                            key={srv.id}
                            onPress={() => onChange(srv.id)}
                            className={`px-3.5 py-2.5 rounded-xl border ${
                              value === srv.id
                                ? "bg-[#092D5D] border-[#092D5D]"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <Text className={`text-xs font-bold ${value === srv.id ? "text-white" : "text-gray-700"}`}>
                              {srv.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    )}
                  />
                </View>

                {/* Quantidade Necessária */}
                <View>
                  <Text className="text-gray-700 text-xs font-semibold mb-1.5">
                    Quantidade de Agendamentos para Ganhar o Prêmio:
                  </Text>
                  <Controller
                    control={control}
                    name="stampRequiredCount"
                    render={({ field: { value, onChange } }) => (
                      <AppInput
                        value={value}
                        onChangeText={onChange}
                        keyboardType="numeric"
                        placeholder="Ex: 4 (Ganhe na 5ª realização)"
                      />
                    )}
                  />
                </View>

                {/* Datas de Validade */}
                <View className="flex-row gap-3">
                  <View className="flex-1">
                    <Text className="text-gray-700 text-xs font-semibold mb-1.5">
                      Data de Início (AAAA-MM-DD):
                    </Text>
                    <Controller
                      control={control}
                      name="stampStartDate"
                      render={({ field: { value, onChange } }) => (
                        <AppInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="Ex: 2026-09-01"
                        />
                      )}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-gray-700 text-xs font-semibold mb-1.5">
                      Data de Término (AAAA-MM-DD):
                    </Text>
                    <Controller
                      control={control}
                      name="stampEndDate"
                      render={({ field: { value, onChange } }) => (
                        <AppInput
                          value={value}
                          onChangeText={onChange}
                          placeholder="Ex: 2026-12-31"
                        />
                      )}
                    />
                  </View>
                </View>

                {/* Descrição da Recompensa */}
                <View>
                  <Text className="text-gray-700 text-xs font-semibold mb-1.5">
                    Prêmio do Cartão Fidelidade:
                  </Text>
                  <Controller
                    control={control}
                    name="stampRewardDescription"
                    render={({ field: { value, onChange } }) => (
                      <AppInput
                        value={value}
                        onChangeText={onChange}
                        placeholder="Ex: 5ª Sobrancelha 100% Grátis!"
                      />
                    )}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Botão Salvar */}
          <View className="mt-8 mb-6">
            <TouchableOpacity
              onPress={onSubmit}
              disabled={isLoading}
              activeOpacity={0.85}
              className="h-[56px] bg-[#092D5D] rounded-2xl items-center justify-center shadow-lg"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-base font-bold">
                  Salvar Configurações de Fidelidade
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardContainer>
  );
}


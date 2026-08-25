import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { useCompanyRegisterViewModel } from "./useCompanyRegisterViewModel";
import { AppInput } from "@/shared/components/AppInput";
import { ImportClientsModal } from "@/viewModel/Clients/ImportClientsModal";
import * as ImagePicker from "expo-image-picker";
import { Image as ExpoImage } from "expo-image";
import { useGallery } from "@/shared/hooks/useGallery";
import { useCamera } from "@/shared/hooks/useCamera";
import { useAppModal } from "@/shared/hooks/useAppModal";
import { useModalStore } from "@/shared/store/modal-store";

// ─── Progress Bar & Stepper Limpo (Fundo Claro) ───────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  const percent = Math.round((step / total) * 100);

  return (
    <View className="px-5 pt-3 pb-4 bg-white border-b border-gray-100">
      <View className="flex-row items-center justify-between mb-2">
        {Array.from({ length: total }).map((_, i) => {
          const isCompleted = i < step;
          const isCurrent = i === step - 1;
          return (
            <React.Fragment key={i}>
              <View
                className={`w-7 h-7 rounded-full items-center justify-center ${
                  isCompleted
                    ? "bg-[#CBA35D]"
                    : isCurrent
                    ? "bg-[#092D5D] border-2 border-[#CBA35D]"
                    : "bg-gray-100 border border-gray-200"
                }`}
              >
                {isCompleted ? (
                  <Ionicons name="checkmark-sharp" size={14} color="#FFFFFF" />
                ) : (
                  <Text
                    className={`text-[11px] font-black ${
                      isCurrent ? "text-[#CBA35D]" : "text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </Text>
                )}
              </View>
              {i < total - 1 && (
                <View className="flex-1 h-1 mx-1 rounded-full bg-gray-100 overflow-hidden">
                  <View
                    className="h-full bg-[#CBA35D] rounded-full"
                    style={{
                      width: i < step - 1 ? "100%" : "0%",
                    }}
                  />
                </View>
              )}
            </React.Fragment>
          );
        })}
      </View>
      <View className="flex-row justify-between items-center px-1">
        <Text className="text-gray-500 text-[11px] font-semibold">
          Etapa {step} de {total}
        </Text>
        <Text className="text-[#092D5D] text-[11px] font-black tracking-wide">
          {percent}% concluído
        </Text>
      </View>
    </View>
  );
}

// ─── Step 1: Dados do Negócio e Conta de Acesso ───────────
function Step1({ data, updateData, nextStep, canProceed }: any) {
  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <Text className="text-gray-900 text-2xl font-black mb-1">
          Crie seu negócio e conta
        </Text>
        <Text className="text-gray-500 text-xs font-medium">
          Preencha os dados da empresa e crie suas credenciais de administrador.
        </Text>
      </View>

      {/* Seção Empresa */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm mb-4">
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="business" size={18} color="#092D5D" />
          <Text className="text-[#092D5D] text-xs font-black uppercase tracking-wider">
            Sobre o Estabelecimento
          </Text>
        </View>

        <AppInput
          label="Nome da Empresa *"
          value={data.name}
          onChangeText={(v) => updateData({ name: v })}
          placeholder="Ex: Barbearia Elegance"
          leftIcon="business-outline"
          containerClassName="mb-1"
        />
      </View>

      {/* Seção Admin */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm mb-6 gap-3">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="person" size={18} color="#092D5D" />
          <Text className="text-[#092D5D] text-xs font-black uppercase tracking-wider">
            Conta do Administrador
          </Text>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <AppInput
              label="Primeiro Nome *"
              value={data.firstName}
              onChangeText={(v) => updateData({ firstName: v })}
              placeholder="Ex: João"
              leftIcon="person-outline"
            />
          </View>
          <View className="flex-1">
            <AppInput
              label="Sobrenome"
              value={data.lastName}
              onChangeText={(v) => updateData({ lastName: v })}
              placeholder="Ex: Silva"
              leftIcon="person-outline"
            />
          </View>
        </View>

        <AppInput
          label="E-mail de Acesso *"
          value={data.email}
          onChangeText={(v) => updateData({ email: v.trim() })}
          placeholder="Ex: joao@email.com"
          leftIcon="mail-outline"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <AppInput
          label="Senha de Acesso (mín. 6 caracteres) *"
          value={data.password}
          onChangeText={(v) => updateData({ password: v })}
          placeholder="Sua senha secreta"
          leftIcon="lock-closed-outline"
          secureTextEntry
          autoCapitalize="none"
        />

        <AppInput
          label="Celular / WhatsApp *"
          value={data.phone}
          onChangeText={(v) => updateData({ phone: v })}
          placeholder="Ex: (11) 99999-9999"
          leftIcon="call-outline"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        disabled={!canProceed}
        onPress={nextStep}
        activeOpacity={0.85}
        className={`h-16 rounded-2xl items-center justify-center shadow-md ${
          canProceed ? "bg-[#092D5D]" : "bg-gray-300 border border-gray-300"
        }`}
      >
        <Text
          className={`font-black text-base uppercase tracking-wider ${
            canProceed ? "text-white" : "text-gray-600"
          }`}
        >
          Continuar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Step 2: Categoria / Segmento ─────────────────────────
function Step2({
  data,
  updateData,
  nextStep,
  prevStep,
  canProceed,
  CATEGORIES,
}: any) {
  const toggleCategory = (cat: string) => {
    const current: string[] = data.categories ?? [];
    const exists = current.includes(cat);
    updateData({
      categories: exists ? current.filter((c) => c !== cat) : [...current, cat],
    });
  };

  const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
    Manicure: "sparkles-outline",
    Sobrancelhas: "eye-outline",
    Maquiagem: "color-palette-outline",
    Cabelos: "cut-outline",
    Barbearia: "cut-outline",
    Podologia: "footsteps-outline",
  };

  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <Text className="text-gray-900 text-2xl font-black mb-1">
          Em qual segmento você atua?
        </Text>
        <Text className="text-gray-500 text-xs font-medium">
          Selecione uma ou mais categorias de atendimento do seu salão ou barbearia.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-3 mb-8">
        {CATEGORIES.map((cat: string) => {
          const selected = (data.categories ?? []).includes(cat);
          const iconName = categoryIcons[cat] || "grid-outline";
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => toggleCategory(cat)}
              activeOpacity={0.85}
              className={`flex-row items-center gap-2.5 px-4 py-4 rounded-2xl border shadow-sm ${
                selected
                  ? "bg-[#092D5D] border-[#092D5D]"
                  : "bg-white border-gray-200"
              }`}
              style={{ width: "48%" }}
            >
              <Ionicons
                name={iconName}
                size={20}
                color={selected ? "#CBA35D" : "#6b7280"}
              />
              <Text
                className={`font-bold text-xs flex-1 ${
                  selected ? "text-white" : "text-gray-800"
                }`}
              >
                {cat}
              </Text>
              {selected && (
                <Ionicons name="checkmark-circle" size={18} color="#CBA35D" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.85}
          className="flex-1 h-16 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-base uppercase tracking-wider">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          activeOpacity={0.85}
          className={`flex-1 h-16 rounded-2xl items-center justify-center shadow-md ${
            canProceed ? "bg-[#092D5D]" : "bg-gray-300 border border-gray-300"
          }`}
        >
          <Text
            className={`font-black text-base uppercase tracking-wider ${
              canProceed ? "text-white" : "text-gray-600"
            }`}
          >
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 3: Tamanho da Equipe ────────────────────────────
function Step3({
  data,
  updateData,
  nextStep,
  prevStep,
  canProceed,
  TEAM_SIZES,
}: any) {
  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <Text className="text-gray-900 text-2xl font-black mb-1">
          Tamanho da sua equipe
        </Text>
        <Text className="text-gray-500 text-xs font-medium">
          Quantas pessoas atendem clientes com você? Isso ajusta a agenda.
        </Text>
      </View>

      <View className="gap-3 mb-8">
        {TEAM_SIZES.map((ts: { label: string; value: string }) => {
          const selected = data.teamSize === ts.value;
          return (
            <TouchableOpacity
              key={ts.value}
              onPress={() => updateData({ teamSize: ts.value })}
              activeOpacity={0.85}
              className={`flex-row items-center justify-between p-4.5 rounded-2xl border shadow-sm ${
                selected
                  ? "bg-[#092D5D] border-[#092D5D]"
                  : "bg-white border-gray-200"
              }`}
            >
              <View className="flex-row items-center gap-3">
                <Ionicons
                  name={ts.value === "1" ? "person" : "people"}
                  size={22}
                  color={selected ? "#CBA35D" : "#6b7280"}
                />
                <Text
                  className={`font-bold text-sm ${
                    selected ? "text-white" : "text-gray-800"
                  }`}
                >
                  {ts.label}
                </Text>
              </View>

              {selected ? (
                <Ionicons name="radio-button-on" size={20} color="#CBA35D" />
              ) : (
                <Ionicons name="radio-button-off" size={20} color="#9ca3af" />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.85}
          className="flex-1 h-16 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-base uppercase tracking-wider">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          activeOpacity={0.85}
          className={`flex-1 h-16 rounded-2xl items-center justify-center shadow-md ${
            canProceed ? "bg-[#092D5D]" : "bg-gray-300 border border-gray-300"
          }`}
        >
          <Text
            className={`font-black text-base uppercase tracking-wider ${
              canProceed ? "text-white" : "text-gray-600"
            }`}
          >
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 4: Localização Detalhada via CEP ────────────────
function Step4({
  data,
  updateData,
  nextStep,
  prevStep,
  canProceed,
  searchCep,
  addressLoading,
}: any) {
  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <Text className="text-gray-900 text-2xl font-black mb-1">
          Onde fica o seu negócio?
        </Text>
        <Text className="text-gray-500 text-xs font-medium">
          Digite o CEP para preencher o endereço automaticamente.
        </Text>
      </View>

      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm mb-6 gap-3">
        {/* CEP */}
        <View className="mb-1">
          <Text className="text-gray-700 font-bold text-xs mb-1.5">
            CEP *
          </Text>
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 h-14 shadow-sm focus:border-[#092D5D]">
            <Ionicons name="location-outline" size={20} color="#092D5D" style={{ marginRight: 10 }} />
            <TextInput
              value={data.cep ?? ""}
              onChangeText={searchCep}
              placeholder="Ex: 01310-100"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={9}
              className="flex-1 text-gray-900 text-base font-bold p-0"
            />
            {addressLoading && (
              <ActivityIndicator size="small" color="#092D5D" />
            )}
          </View>
        </View>

        {/* Rua */}
        <AppInput
          label="Rua / Logradouro *"
          value={data.street}
          onChangeText={(v) => updateData({ street: v })}
          placeholder="Ex: Avenida Paulista"
          leftIcon="navigate-outline"
        />

        {/* Número e Complemento */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <AppInput
              label="Número *"
              value={data.number}
              onChangeText={(v) => updateData({ number: v })}
              placeholder="Ex: 1000"
              leftIcon="home-outline"
              keyboardType="numeric"
            />
          </View>
          <View className="flex-1">
            <AppInput
              label="Complemento"
              value={data.complement}
              onChangeText={(v) => updateData({ complement: v })}
              placeholder="Ex: Sala 42"
              leftIcon="business-outline"
            />
          </View>
        </View>

        {/* Bairro */}
        <AppInput
          label="Bairro *"
          value={data.neighborhood}
          onChangeText={(v) => updateData({ neighborhood: v })}
          placeholder="Ex: Bela Vista"
          leftIcon="map-outline"
        />

        {/* Cidade e Estado */}
        <View className="flex-row gap-3">
          <View className="flex-1">
            <AppInput
              label="Cidade *"
              value={data.city}
              onChangeText={(v) => updateData({ city: v })}
              placeholder="Ex: São Paulo"
              leftIcon="location-sharp"
            />
          </View>
          <View className="w-24">
            <AppInput
              label="UF *"
              value={data.state}
              onChangeText={(v) => updateData({ state: v.toUpperCase() })}
              placeholder="SP"
              leftIcon="flag-outline"
              maxLength={2}
              autoCapitalize="characters"
            />
          </View>
        </View>
      </View>

      {/* Preview Endereço Completo */}
      {data.address ? (
        <View className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 flex-row items-center gap-3">
          <Ionicons name="checkmark-circle" size={22} color="#10b981" />
          <Text className="text-emerald-800 text-xs font-bold flex-1" numberOfLines={3}>
            {data.address}
          </Text>
        </View>
      ) : null}

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.85}
          className="flex-1 h-16 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-base uppercase tracking-wider">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          activeOpacity={0.85}
          className={`flex-1 h-16 rounded-2xl items-center justify-center shadow-md ${
            canProceed ? "bg-[#092D5D]" : "bg-gray-300 border border-gray-300"
          }`}
        >
          <Text
            className={`font-black text-base uppercase tracking-wider ${
              canProceed ? "text-white" : "text-gray-600"
            }`}
          >
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 5: Serviços Sugeridos ───────────────────────────
// ─── Step 5: Serviços Reais ───────────────────────────
function Step5({
  nextStep,
  prevStep,
  suggestedServices,
  data,
  updateData,
}: any) {
  const [customName, setCustomName] = React.useState("");
  const [customPrice, setCustomPrice] = React.useState("");
  const [customDuration, setCustomDuration] = React.useState("30");

  const toggleSuggested = (sName: string) => {
    const current: any[] = data.realServices ?? [];
    const exists = current.some((item) => item.name === sName);
    if (exists) {
      updateData({
        realServices: current.filter((item) => item.name !== sName),
      });
    } else {
      updateData({
        realServices: [
          ...current,
          { name: sName, price: 50.0, duration: 30 },
        ],
      });
    }
  };

  const addCustomService = () => {
    if (!customName.trim()) return;
    const priceNum = parseFloat(customPrice.replace(",", ".")) || 50.0;
    const durNum = parseInt(customDuration, 10) || 30;

    const current: any[] = data.realServices ?? [];
    updateData({
      realServices: [
        ...current,
        { name: customName.trim(), price: priceNum, duration: durNum },
      ],
    });

    setCustomName("");
    setCustomPrice("");
    setCustomDuration("30");
  };

  const removeService = (index: number) => {
    const current: any[] = data.realServices ?? [];
    updateData({
      realServices: current.filter((_, i) => i !== index),
    });
  };

  const realServicesList: any[] = data.realServices ?? [];

  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-900 text-2xl font-black">
            Serviços Reais
          </Text>
          <View className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
            <Text className="text-amber-800 text-[10px] font-extrabold uppercase">Opcional</Text>
          </View>
        </View>
        <Text className="text-gray-500 text-xs font-medium mt-1">
          Cadastre os serviços que seu estabelecimento oferece. Você pode pular e cadastrar depois no painel.
        </Text>
      </View>

      {/* Sugestões do Segmento */}
      {suggestedServices.length > 0 && (
        <View className="mb-5">
          <Text className="text-[#092D5D] text-xs font-black uppercase tracking-wider mb-2.5">
            Sugestões Rápidas (Clique para adicionar)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {suggestedServices.map((s: string) => {
              const isAdded = realServicesList.some((item) => item.name === s);
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => toggleSuggested(s)}
                  activeOpacity={0.85}
                  className={`flex-row items-center gap-2 px-3.5 py-2.5 rounded-xl border ${
                    isAdded
                      ? "bg-[#092D5D] border-[#092D5D]"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Ionicons
                    name={isAdded ? "checkmark-circle" : "add-circle-outline"}
                    size={16}
                    color={isAdded ? "#CBA35D" : "#092D5D"}
                  />
                  <Text className={`font-bold text-xs ${isAdded ? "text-white" : "text-gray-800"}`}>
                    {s} (R$ 50,00)
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Formulário Novo Serviço Personalizado */}
      <View className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm mb-5 gap-3">
        <Text className="text-gray-900 font-extrabold text-xs uppercase tracking-wider">
          Adicionar Serviço Personalizado
        </Text>
        <AppInput
          label="Nome do Serviço"
          value={customName}
          onChangeText={setCustomName}
          placeholder="Ex: Corte e Barba VIP"
          leftIcon="cut-outline"
        />
        <View className="flex-row gap-3">
          <View className="flex-1">
            <AppInput
              label="Preço (R$)"
              value={customPrice}
              onChangeText={setCustomPrice}
              placeholder="Ex: 60,00"
              keyboardType="numeric"
              leftIcon="cash-outline"
            />
          </View>
          <View className="flex-1">
            <AppInput
              label="Duração (minutos)"
              value={customDuration}
              onChangeText={setCustomDuration}
              placeholder="Ex: 45"
              keyboardType="numeric"
              leftIcon="time-outline"
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={addCustomService}
          activeOpacity={0.85}
          className="h-11 rounded-xl bg-[#092D5D]/10 border border-[#092D5D]/30 items-center justify-center flex-row gap-1.5 mt-1"
        >
          <Ionicons name="add" size={18} color="#092D5D" />
          <Text className="text-[#092D5D] font-bold text-xs">Adicionar à Lista</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Serviços Adicionados */}
      <View className="mb-6">
        <Text className="text-[#092D5D] text-xs font-black uppercase tracking-wider mb-2.5">
          Serviços Cadastrados ({realServicesList.length})
        </Text>
        {realServicesList.length === 0 ? (
          <View className="p-4 rounded-2xl bg-white border border-gray-200/60 items-center">
            <Text className="text-gray-400 text-xs font-semibold text-center">
              Nenhum serviço selecionado. Clique nas sugestões ou adicione manualmente.
            </Text>
          </View>
        ) : (
          <View className="gap-2">
            {realServicesList.map((srv, idx) => (
              <View
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-gray-200/80 flex-row items-center justify-between"
              >
                <View className="flex-1 mr-2">
                  <Text className="text-gray-900 font-bold text-sm">{srv.name}</Text>
                  <Text className="text-gray-500 text-xs font-medium mt-0.5">
                    R$ {Number(srv.price || 0).toFixed(2).replace(".", ",")} • {srv.duration || 30} min
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeService(idx)} className="p-1.5 rounded-lg bg-red-50">
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.85}
          className="flex-1 h-16 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-base uppercase tracking-wider">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nextStep}
          activeOpacity={0.85}
          className="flex-1 h-16 bg-[#092D5D] rounded-2xl items-center justify-center shadow-md"
        >
          <Text className="text-white font-black text-base uppercase tracking-wider">
            {realServicesList.length === 0 ? "Pular / Continuar" : "Continuar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 6: Clientes Iniciais (Opcional) ─────────────────────
function Step6({
  nextStep,
  prevStep,
  data,
  updateData,
}: any) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);

  const addClient = () => {
    if (!name.trim()) return;
    const current: any[] = data.clients ?? [];
    updateData({
      clients: [
        ...current,
        { name: name.trim(), phone: phone.trim(), email: email.trim() },
      ],
    });
    setName("");
    setPhone("");
    setEmail("");
  };

  const removeClient = (index: number) => {
    const current: any[] = data.clients ?? [];
    updateData({
      clients: current.filter((_, i) => i !== index),
    });
  };

  const clientsList: any[] = data.clients ?? [];

  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-900 text-2xl font-black">
            Clientes Iniciais
          </Text>
          <View className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
            <Text className="text-amber-800 text-[10px] font-extrabold uppercase">Opcional</Text>
          </View>
        </View>
        <Text className="text-gray-500 text-xs font-medium mt-1">
          Cadastre clientes recorrentes do seu salão para já iniciar com histórico. Você pode pular.
        </Text>
      </View>

      {/* Botão de Importação de Clientes em Lote (Temporariamente oculto)
      <TouchableOpacity
        onPress={() => setIsImportModalOpen(true)}
        activeOpacity={0.85}
        className="p-4 rounded-2xl bg-white border border-[#CBA35D]/40 shadow-sm mb-5 flex-row items-center justify-between"
      >
        <View className="flex-row items-center gap-3 flex-1 mr-2">
          <View className="w-10 h-10 rounded-full bg-[#092D5D]/10 items-center justify-center">
            <Ionicons name="cloud-upload-outline" size={20} color="#092D5D" />
          </View>
          <View className="flex-1">
            <Text className="text-gray-900 font-extrabold text-sm">
              Importar Clientes em Lote
            </Text>
            <Text className="text-gray-500 text-xs mt-0.5">
              Traga os contatos da agenda do seu celular ou arquivo CSV.
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#CBA35D" />
      </TouchableOpacity>

      <ImportClientsModal
        visible={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onCustomImport={(importedClients) => {
          const current: any[] = data.clients ?? [];
          updateData({
            clients: [...current, ...importedClients],
          });
        }}
      />
      */}

      {/* Formulário Novo Cliente Manual */}
      <View className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm mb-5 gap-3">
        <Text className="text-gray-900 font-extrabold text-xs uppercase tracking-wider">
          Cadastrar Cliente Manualmente
        </Text>
        <AppInput
          label="Nome Completo *"
          value={name}
          onChangeText={setName}
          placeholder="Ex: Maria Oliveira"
          leftIcon="person-outline"
        />
        <AppInput
          label="Celular / WhatsApp"
          value={phone}
          onChangeText={setPhone}
          placeholder="Ex: (11) 98888-8888"
          keyboardType="phone-pad"
          leftIcon="call-outline"
        />
        <AppInput
          label="E-mail (Opcional)"
          value={email}
          onChangeText={setEmail}
          placeholder="Ex: maria@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
        />
        <TouchableOpacity
          onPress={addClient}
          activeOpacity={0.85}
          className="h-11 rounded-xl bg-[#092D5D]/10 border border-[#092D5D]/30 items-center justify-center flex-row gap-1.5 mt-1"
        >
          <Ionicons name="person-add-outline" size={18} color="#092D5D" />
          <Text className="text-[#092D5D] font-bold text-xs">Adicionar Cliente</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Clientes Adicionados */}
      <View className="mb-6">
        <Text className="text-[#092D5D] text-xs font-black uppercase tracking-wider mb-2.5">
          Clientes Cadastrados ({clientsList.length})
        </Text>
        {clientsList.length === 0 ? (
          <View className="p-4 rounded-2xl bg-white border border-gray-200/60 items-center">
            <Text className="text-gray-400 text-xs font-semibold text-center">
              Nenhum cliente adicionado. Você pode cadastrar clientes depois.
            </Text>
          </View>
        ) : (
          <View className="gap-2">
            {clientsList.map((cli, idx) => (
              <View
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-gray-200/80 flex-row items-center justify-between"
              >
                <View className="flex-1 mr-2">
                  <Text className="text-gray-900 font-bold text-sm">{cli.name}</Text>
                  <Text className="text-gray-500 text-xs font-medium mt-0.5">
                    {cli.phone || "Sem telefone"} {cli.email ? `• ${cli.email}` : ""}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeClient(idx)} className="p-1.5 rounded-lg bg-red-50">
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.85}
          className="flex-1 h-16 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-base uppercase tracking-wider">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nextStep}
          activeOpacity={0.85}
          className="flex-1 h-16 bg-[#092D5D] rounded-2xl items-center justify-center shadow-md"
        >
          <Text className="text-white font-black text-base uppercase tracking-wider">
            {clientsList.length === 0 ? "Pular / Continuar" : "Continuar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 7: Equipe / Profissionais (Opcional) ───────────────
function Step7({
  nextStep,
  prevStep,
  data,
  updateData,
}: any) {
  const [name, setName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [email, setEmail] = React.useState("");

  const addEmployee = () => {
    if (!name.trim()) return;
    const current: any[] = data.employees ?? [];
    updateData({
      employees: [
        ...current,
        { name: name.trim(), phone: phone.trim(), email: email.trim() },
      ],
    });
    setName("");
    setPhone("");
    setEmail("");
  };

  const removeEmployee = (index: number) => {
    const current: any[] = data.employees ?? [];
    updateData({
      employees: current.filter((_, i) => i !== index),
    });
  };

  const employeesList: any[] = data.employees ?? [];

  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-900 text-2xl font-black">
            Profissionais / Equipe
          </Text>
          <View className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
            <Text className="text-amber-800 text-[10px] font-extrabold uppercase">Opcional</Text>
          </View>
        </View>
        <Text className="text-gray-500 text-xs font-medium mt-1">
          Adicione outros profissionais que trabalham com você. Você pode pular e adicionar depois.
        </Text>
      </View>

      {/* Formulário Novo Profissional */}
      <View className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm mb-5 gap-3">
        <Text className="text-gray-900 font-extrabold text-xs uppercase tracking-wider">
          Adicionar Membro da Equipe
        </Text>
        <AppInput
          label="Nome do Profissional *"
          value={name}
          onChangeText={setName}
          placeholder="Ex: Carlos Barbeiro"
          leftIcon="people-outline"
        />
        <AppInput
          label="Celular / WhatsApp"
          value={phone}
          onChangeText={setPhone}
          placeholder="Ex: (11) 97777-7777"
          keyboardType="phone-pad"
          leftIcon="call-outline"
        />
        <AppInput
          label="E-mail de Acesso (Opcional)"
          value={email}
          onChangeText={setEmail}
          placeholder="Ex: carlos@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon="mail-outline"
        />
        <TouchableOpacity
          onPress={addEmployee}
          activeOpacity={0.85}
          className="h-11 rounded-xl bg-[#092D5D]/10 border border-[#092D5D]/30 items-center justify-center flex-row gap-1.5 mt-1"
        >
          <Ionicons name="person-add" size={18} color="#092D5D" />
          <Text className="text-[#092D5D] font-bold text-xs">Adicionar Profissional</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Profissionais Adicionados */}
      <View className="mb-6">
        <Text className="text-[#092D5D] text-xs font-black uppercase tracking-wider mb-2.5">
          Equipe Cadastrada ({employeesList.length})
        </Text>
        {employeesList.length === 0 ? (
          <View className="p-4 rounded-2xl bg-white border border-gray-200/60 items-center">
            <Text className="text-gray-400 text-xs font-semibold text-center">
              Apenas você (Administrador) estará cadastrado inicialmente.
            </Text>
          </View>
        ) : (
          <View className="gap-2">
            {employeesList.map((emp, idx) => (
              <View
                key={idx}
                className="p-3.5 rounded-xl bg-white border border-gray-200/80 flex-row items-center justify-between"
              >
                <View className="flex-1 mr-2">
                  <Text className="text-gray-900 font-bold text-sm">{emp.name}</Text>
                  <Text className="text-gray-500 text-xs font-medium mt-0.5">
                    {emp.phone || "Sem telefone"} {emp.email ? `• ${emp.email}` : ""}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeEmployee(idx)} className="p-1.5 rounded-lg bg-red-50">
                  <Ionicons name="trash-outline" size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.85}
        >
          <Text className="text-white font-black text-sm uppercase tracking-wide">
            {employeesList.length === 0 ? "Pular / Continuar" : "Continuar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 8: Fotos do Espaço e Portfólio (Opcional) ─────────
function Step8({ nextStep, prevStep, data, updateData }: any) {
  const { openGalleryMultiple } = useGallery({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false,
    quality: 0.8,
  });
  const { openCamera } = useCamera({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });
  const modals = useAppModal();
  const { close } = useModalStore();

  const spaceImages: string[] = data.imagesUrl ?? [];
  const portfolioImages: string[] = data.portfolioImagesUrl ?? [];

  const handlePickImages = (type: "space" | "portfolio") => {
    const isPort = type === "portfolio";
    modals.showSelection({
      title: isPort ? "Fotos de Portfólio" : "Fotos do Espaço",
      message: `Escolha como adicionar imagens do ${isPort ? "portfólio" : "estabelecimento"}:`,
      options: [
        {
          text: "Galeria (Várias Fotos)",
          icon: "images",
          variant: "primary",
          onPress: async () => {
            close();
            const uris = await openGalleryMultiple({ allowsMultipleSelection: true });
            if (uris && uris.length > 0) {
              if (isPort) {
                updateData({ portfolioImagesUrl: [...portfolioImages, ...uris] });
              } else {
                updateData({ imagesUrl: [...spaceImages, ...uris] });
              }
            }
          },
        },
        {
          text: "Câmera",
          icon: "camera",
          variant: "primary",
          onPress: async () => {
            close();
            const uri = await openCamera();
            if (uri) {
              if (isPort) {
                updateData({ portfolioImagesUrl: [...portfolioImages, uri] });
              } else {
                updateData({ imagesUrl: [...spaceImages, uri] });
              }
            }
          },
        },
      ],
    });
  };

  const removeImage = (index: number, type: "space" | "portfolio") => {
    if (type === "portfolio") {
      updateData({
        portfolioImagesUrl: portfolioImages.filter((_, i) => i !== index),
      });
    } else {
      updateData({
        imagesUrl: spaceImages.filter((_, i) => i !== index),
      });
    }
  };

  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 140 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-gray-900 text-2xl font-black">
            Fotos do Espaço & Portfólio
          </Text>
          <View className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200">
            <Text className="text-amber-800 text-[10px] font-extrabold uppercase">Opcional</Text>
          </View>
        </View>
        <Text className="text-gray-500 text-xs font-medium mt-1">
          Adicione fotos do seu estabelecimento e dos serviços realizados. Você pode pular.
        </Text>
      </View>

      {/* Seção Fotos do Espaço */}
      <View className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm mb-5 gap-3">
        <View className="flex-row items-center gap-2">
          <Ionicons name="home-outline" size={18} color="#092D5D" />
          <Text className="text-gray-900 font-extrabold text-xs uppercase tracking-wider">
            Fotos do Estabelecimento ({spaceImages.length})
          </Text>
        </View>

        {spaceImages.length > 0 && (
          <View className="flex-row flex-wrap gap-2 my-1">
            {spaceImages.map((uri, idx) => (
              <View key={idx} className="w-[28%] h-16 rounded-xl overflow-hidden relative border border-gray-200 bg-gray-100">
                <ExpoImage source={{ uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                <TouchableOpacity
                  onPress={() => removeImage(idx, "space")}
                  className="absolute top-1 right-1 p-1 bg-red-600/90 rounded-full z-10"
                >
                  <Ionicons name="trash-outline" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => handlePickImages("space")}
          activeOpacity={0.85}
          className="h-11 rounded-xl bg-[#092D5D]/10 border border-[#092D5D]/30 items-center justify-center flex-row gap-1.5"
        >
          <Ionicons name="images-outline" size={18} color="#092D5D" />
          <Text className="text-[#092D5D] font-bold text-xs">Adicionar Fotos do Espaço</Text>
        </TouchableOpacity>
      </View>

      {/* Seção Fotos do Portfólio */}
      <View className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm mb-6 gap-3">
        <View className="flex-row items-center gap-2">
          <Ionicons name="camera-outline" size={18} color="#092D5D" />
          <Text className="text-gray-900 font-extrabold text-xs uppercase tracking-wider">
            Fotos de Portfólio ({portfolioImages.length})
          </Text>
        </View>

        {portfolioImages.length > 0 && (
          <View className="flex-row flex-wrap gap-2 my-1">
            {portfolioImages.map((uri, idx) => (
              <View key={idx} className="w-[28%] h-16 rounded-xl overflow-hidden relative border border-gray-200 bg-gray-100">
                <ExpoImage source={{ uri }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                <TouchableOpacity
                  onPress={() => removeImage(idx, "portfolio")}
                  className="absolute top-1 right-1 p-1 bg-red-600/90 rounded-full z-10"
                >
                  <Ionicons name="trash-outline" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          onPress={() => handlePickImages("portfolio")}
          activeOpacity={0.85}
          className="h-11 rounded-xl bg-[#092D5D]/10 border border-[#092D5D]/30 items-center justify-center flex-row gap-1.5"
        >
          <Ionicons name="images-outline" size={18} color="#092D5D" />
          <Text className="text-[#092D5D] font-bold text-xs">Adicionar Fotos de Trabalhos</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-3 mt-6 mb-6">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.85}
          className="flex-1 h-16 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-base uppercase tracking-wider">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nextStep}
          activeOpacity={0.85}
          className="flex-1 h-16 bg-[#092D5D] rounded-2xl items-center justify-center shadow-md"
        >
          <Text className="text-white font-black text-base uppercase tracking-wider">
            {spaceImages.length === 0 && portfolioImages.length === 0 ? "Pular / Continuar" : "Continuar"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 9: Horário de Trabalho ───────────────────────────
function Step9({
  data,
  updateData,
  nextStep,
  prevStep,
  canProceed,
}: any) {
  const DAYS_OF_WEEK = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado", "Domingo"];

  const toggleDay = (day: string) => {
    const current: string[] = data.workDays ?? [];
    const exists = current.includes(day);
    updateData({
      workDays: exists ? current.filter((d) => d !== day) : [...current, day],
    });
  };

  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 80 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <Text className="text-gray-900 text-2xl font-black mb-1">
          Horário de Atendimento
        </Text>
        <Text className="text-gray-500 text-xs font-medium">
          Defina os dias da semana e turnos de expediente.
        </Text>
      </View>

      {/* Dias da semana */}
      <Text className="text-[#092D5D] text-xs font-black uppercase tracking-wider mb-2.5">
        Dias de Funcionamento
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {DAYS_OF_WEEK.map((day) => {
          const selected = (data.workDays ?? []).includes(day);
          return (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDay(day)}
              activeOpacity={0.85}
              className={`px-4 py-3 rounded-2xl border shadow-sm ${
                selected
                  ? "bg-[#092D5D] border-[#092D5D]"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`font-bold text-xs ${
                  selected ? "text-white" : "text-gray-700"
                }`}
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Horários */}
      <Text className="text-[#092D5D] text-xs font-black uppercase tracking-wider mb-2.5">
        Horários de Turno (Turno 1 e Turno 2)
      </Text>

      {/* Turno da Manhã */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm mb-4">
        <Text className="text-gray-900 font-extrabold text-xs mb-3 uppercase tracking-wider">
          Turno 1 (Manhã: Ex 09:00 - 12:00)
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1 bg-gray-50 rounded-2xl px-3.5 py-2.5 border border-gray-200">
            <Text className="text-gray-500 text-[10px] font-bold uppercase mb-0.5">Entrada</Text>
            <TextInput
              value={data.scheduleStart ?? "09:00"}
              onChangeText={(v) => updateData({ scheduleStart: v })}
              placeholder="09:00"
              placeholderTextColor="#9ca3af"
              className="text-gray-900 font-bold text-base p-0"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
          <View className="flex-1 bg-gray-50 rounded-2xl px-3.5 py-2.5 border border-gray-200">
            <Text className="text-gray-500 text-[10px] font-bold uppercase mb-0.5">Saída Almoço</Text>
            <TextInput
              value={data.scheduleLunchStart ?? "12:00"}
              onChangeText={(v) => updateData({ scheduleLunchStart: v })}
              placeholder="12:00"
              placeholderTextColor="#9ca3af"
              className="text-gray-900 font-bold text-base p-0"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
        </View>
      </View>

      {/* Turno da Tarde */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm mb-8">
        <Text className="text-gray-900 font-extrabold text-xs mb-3 uppercase tracking-wider">
          Turno 2 (Tarde: Ex 13:00 - 18:00)
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1 bg-gray-50 rounded-2xl px-3.5 py-2.5 border border-gray-200">
            <Text className="text-gray-500 text-[10px] font-bold uppercase mb-0.5">Retorno Almoço</Text>
            <TextInput
              value={data.scheduleLunchEnd ?? "13:00"}
              onChangeText={(v) => updateData({ scheduleLunchEnd: v })}
              placeholder="13:00"
              placeholderTextColor="#9ca3af"
              className="text-gray-900 font-bold text-base p-0"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
          <View className="flex-1 bg-gray-50 rounded-2xl px-3.5 py-2.5 border border-gray-200">
            <Text className="text-gray-500 text-[10px] font-bold uppercase mb-0.5">Encerramento</Text>
            <TextInput
              value={data.scheduleEnd ?? "18:00"}
              onChangeText={(v) => updateData({ scheduleEnd: v })}
              placeholder="18:00"
              placeholderTextColor="#9ca3af"
              className="text-gray-900 font-bold text-base p-0"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.85}
          className="flex-1 h-16 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-base uppercase tracking-wider">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          activeOpacity={0.85}
          className={`flex-1 h-16 rounded-2xl items-center justify-center shadow-md ${
            canProceed ? "bg-[#092D5D]" : "bg-gray-300 border border-gray-300"
          }`}
        >
          <Text
            className={`font-black text-base uppercase tracking-wider ${
              canProceed ? "text-white" : "text-gray-600"
            }`}
          >
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 10: Revisão Final ───────────────────────────────
function Step10({ data, prevStep, submitCompany, isSubmitting }: any) {
  const servicesCount = (data.realServices ?? []).length || (data.defaultServices ?? []).length;
  const clientsCount = (data.clients ?? []).length;
  const employeesCount = (data.employees ?? []).length;
  const spaceImagesCount = (data.imagesUrl ?? []).length;
  const portfolioImagesCount = (data.portfolioImagesUrl ?? []).length;

  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 80 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <Text className="text-gray-900 text-2xl font-black mb-1">
          Pronto para começar! 🎉
        </Text>
        <Text className="text-gray-500 text-xs font-medium">
          Confira o resumo das informações antes de criar sua conta.
        </Text>
      </View>

      <View className="gap-3 mb-8">
        <InfoRow icon="business-outline" label="Empresa" value={data.name} />
        <InfoRow
          icon="person-outline"
          label="Administrador"
          value={`${data.firstName} ${data.lastName || ""}`}
        />
        <InfoRow icon="mail-outline" label="E-mail de Login" value={data.email} />
        <InfoRow
          icon="pricetag-outline"
          label="Segmentos"
          value={(data.categories ?? []).join(", ") || "—"}
        />
        <InfoRow
          icon="cut-outline"
          label="Serviços Reais"
          value={`${servicesCount} serviço(s) cadastrado(s)`}
        />
        <InfoRow
          icon="person-add-outline"
          label="Clientes Iniciais"
          value={`${clientsCount} cliente(s) inicial(is)`}
        />
        <InfoRow
          icon="people-outline"
          label="Equipe / Profissionais"
          value={`${employeesCount + 1} profissional(is) (Admin + ${employeesCount} extra)`}
        />
        <InfoRow
          icon="images-outline"
          label="Fotos do Espaço & Portfólio"
          value={`${spaceImagesCount} foto(s) do espaço • ${portfolioImagesCount} foto(s) de trabalho`}
        />
        <InfoRow
          icon="time-outline"
          label="Atendimento (2 Turnos)"
          value={`${(data.workDays ?? []).join(", ") || "—"} • ${data.scheduleStart} - ${data.scheduleLunchStart} / ${data.scheduleLunchEnd} - ${data.scheduleEnd}`}
        />
        <InfoRow
          icon="location-outline"
          label="Endereço"
          value={data.address || "Não informado"}
        />
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          disabled={isSubmitting}
          activeOpacity={0.85}
          className="flex-1 h-16 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-base uppercase tracking-wider">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={submitCompany}
          disabled={isSubmitting}
          activeOpacity={0.85}
          className={`flex-1 h-16 bg-[#092D5D] rounded-2xl items-center justify-center shadow-lg ${
            isSubmitting ? "opacity-60" : ""
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black text-base uppercase tracking-wider">
              Criar Conta e Empresa
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value?: string;
}) {
  return (
    <View className="flex-row items-center gap-3.5 bg-white border border-gray-100 shadow-sm p-4.5 rounded-2xl">
      <View className="w-10 h-10 rounded-2xl bg-[#092D5D]/10 items-center justify-center border border-[#092D5D]/20">
        <Ionicons name={icon} size={20} color="#092D5D" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-400 text-[10px] font-bold uppercase mb-0.5">{label}</Text>
        <Text
          className="text-gray-900 text-sm font-bold"
          numberOfLines={2}
        >
          {value || "—"}
        </Text>
      </View>
    </View>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────
export function CompanyRegisterView() {
  const vm = useCompanyRegisterViewModel();
  const totalSteps = 10;

  const titles = [
    "Seu Negócio",
    "Segmentos",
    "Tamanho da Equipe",
    "Endereço",
    "Serviços Reais",
    "Clientes Iniciais",
    "Profissionais",
    "Fotos do Espaço & Portfólio",
    "Horário de Atendimento",
    "Confirmação",
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header Limpo com Fundo Branco */}
      <View className="flex-row items-center px-5 py-3.5 bg-white border-b border-gray-100 justify-between">
        <TouchableOpacity
          onPress={() => {
            if (vm.step === 1) router.back();
            else vm.prevStep();
          }}
          activeOpacity={0.8}
          className="bg-gray-100 p-2.5 rounded-full border border-gray-200"
        >
          <Ionicons name="arrow-back" size={20} color="#1f2937" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-gray-400 text-[10px] font-extrabold uppercase tracking-widest">
            Cadastro de Empresa
          </Text>
          <Text className="text-gray-900 font-black text-sm">
            {titles[vm.step - 1]}
          </Text>
        </View>

        <View className="bg-[#092D5D]/10 px-3 py-1 rounded-full border border-[#092D5D]/20">
          <Text className="text-[#092D5D] text-xs font-black">
            {vm.step}/{totalSteps}
          </Text>
        </View>
      </View>

      <ProgressBar step={vm.step} total={totalSteps} />

      {vm.step === 1 && (
        <Step1
          data={vm.data}
          updateData={vm.updateData}
          nextStep={vm.nextStep}
          canProceed={vm.canProceedStep1}
        />
      )}
      {vm.step === 2 && (
        <Step2
          data={vm.data}
          updateData={vm.updateData}
          nextStep={vm.nextStep}
          prevStep={vm.prevStep}
          canProceed={vm.canProceedStep2}
          CATEGORIES={vm.CATEGORIES}
        />
      )}
      {vm.step === 3 && (
        <Step3
          data={vm.data}
          updateData={vm.updateData}
          nextStep={vm.nextStep}
          prevStep={vm.prevStep}
          canProceed={vm.canProceedStep3}
          TEAM_SIZES={vm.TEAM_SIZES}
        />
      )}
      {vm.step === 4 && (
        <Step4
          data={vm.data}
          updateData={vm.updateData}
          nextStep={vm.geocodeAndNextStep}
          prevStep={vm.prevStep}
          canProceed={vm.canProceedStep4}
          searchCep={vm.searchCep}
          addressLoading={vm.addressLoading}
        />
      )}
      {vm.step === 5 && (
        <Step5
          data={vm.data}
          updateData={vm.updateData}
          nextStep={vm.nextStep}
          prevStep={vm.prevStep}
          suggestedServices={vm.suggestedServices}
        />
      )}
      {vm.step === 6 && (
        <Step6
          data={vm.data}
          updateData={vm.updateData}
          nextStep={vm.nextStep}
          prevStep={vm.prevStep}
        />
      )}
      {vm.step === 7 && (
        <Step7
          data={vm.data}
          updateData={vm.updateData}
          nextStep={vm.nextStep}
          prevStep={vm.prevStep}
        />
      )}
      {vm.step === 8 && (
        <Step8
          data={vm.data}
          updateData={vm.updateData}
          nextStep={vm.nextStep}
          prevStep={vm.prevStep}
        />
      )}
      {vm.step === 9 && (
        <Step9
          data={vm.data}
          updateData={vm.updateData}
          nextStep={vm.nextStep}
          prevStep={vm.prevStep}
          canProceed={vm.canProceedStep6}
        />
      )}
      {vm.step === 10 && (
        <Step10
          data={vm.data}
          prevStep={vm.prevStep}
          submitCompany={vm.submitCompany}
          isSubmitting={vm.isSubmitting}
        />
      )}
    </SafeAreaView>
  );
}

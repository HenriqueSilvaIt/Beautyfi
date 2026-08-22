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
        className={`h-14 rounded-2xl items-center justify-center shadow-md ${
          canProceed ? "bg-[#092D5D]" : "bg-gray-200 opacity-60"
        }`}
      >
        <Text className="text-white font-black text-sm uppercase tracking-wide">
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
    Barbearia: "scissor-outline",
    Podologia: "footsteps-outline",
  };

  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 60 }}
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
          className="flex-1 h-14 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-sm uppercase">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          activeOpacity={0.85}
          className={`flex-1 h-14 rounded-2xl items-center justify-center shadow-md ${
            canProceed ? "bg-[#092D5D]" : "bg-gray-200 opacity-60"
          }`}
        >
          <Text className="text-white font-black text-sm uppercase tracking-wide">
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
          className="flex-1 h-14 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-sm uppercase">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          activeOpacity={0.85}
          className={`flex-1 h-14 rounded-2xl items-center justify-center shadow-md ${
            canProceed ? "bg-[#092D5D]" : "bg-gray-200 opacity-60"
          }`}
        >
          <Text className="text-white font-black text-sm uppercase tracking-wide">
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
      contentContainerStyle={{ paddingBottom: 60 }}
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
          <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-3.5 h-12 shadow-sm focus:border-[#092D5D]">
            <Ionicons name="location-outline" size={18} color="#092D5D" style={{ marginRight: 10 }} />
            <TextInput
              value={data.cep ?? ""}
              onChangeText={searchCep}
              placeholder="Ex: 01310-100"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
              maxLength={9}
              className="flex-1 text-gray-900 text-sm font-semibold p-0"
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
          className="flex-1 h-14 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-sm uppercase">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          activeOpacity={0.85}
          className={`flex-1 h-14 rounded-2xl items-center justify-center shadow-md ${
            canProceed ? "bg-[#092D5D]" : "bg-gray-200 opacity-60"
          }`}
        >
          <Text className="text-white font-black text-sm uppercase tracking-wide">
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 5: Serviços Sugeridos ───────────────────────────
function Step5({
  nextStep,
  prevStep,
  suggestedServices,
  data,
  updateData,
}: any) {
  const toggleService = (s: string) => {
    const current: string[] = data.defaultServices ?? [];
    const exists = current.includes(s);
    updateData({
      defaultServices: exists
        ? current.filter((x) => x !== s)
        : [...current, s],
    });
  };

  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-4">
        <Text className="text-gray-900 text-2xl font-black mb-1">
          Quais serviços você oferece?
        </Text>
        <Text className="text-gray-500 text-xs font-medium">
          Sugestões baseadas no seu segmento. Você pode adicionar ou alterar depois.
        </Text>
      </View>

      <View className="flex-row flex-wrap gap-2.5 mb-8">
        {suggestedServices.map((s: string) => {
          const selected = (data.defaultServices ?? []).includes(s);
          return (
            <TouchableOpacity
              key={s}
              onPress={() => toggleService(s)}
              activeOpacity={0.85}
              className={`flex-row items-center gap-2 px-4 py-3 rounded-2xl border shadow-sm ${
                selected
                  ? "bg-[#092D5D] border-[#092D5D]"
                  : "bg-white border-gray-200"
              }`}
            >
              <Ionicons
                name={selected ? "checkmark-circle" : "ellipse-outline"}
                size={16}
                color={selected ? "#CBA35D" : "#9ca3af"}
              />
              <Text
                className={`font-bold text-xs ${
                  selected ? "text-white" : "text-gray-800"
                }`}
              >
                {s}
              </Text>
            </TouchableOpacity>
          );
        })}
        {suggestedServices.length === 0 && (
          <Text className="text-gray-500 text-xs">
            Nenhuma sugestão cadastrada para essa categoria. Você poderá cadastrar serviços no painel admin.
          </Text>
        )}
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          activeOpacity={0.85}
          className="flex-1 h-14 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-sm uppercase">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nextStep}
          activeOpacity={0.85}
          className="flex-1 h-14 bg-[#092D5D] rounded-2xl items-center justify-center shadow-md"
        >
          <Text className="text-white font-black text-sm uppercase tracking-wide">
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 6: Horário de Trabalho ───────────────────────────
function Step6({
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
      contentContainerStyle={{ paddingBottom: 60 }}
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
        Horários de Turno
      </Text>

      {/* Turno da Manhã */}
      <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm mb-4">
        <Text className="text-gray-900 font-extrabold text-xs mb-3 uppercase tracking-wider">
          Turno da Manhã (Ex: 09:00 - 12:00)
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
          Turno da Tarde (Ex: 13:00 - 18:00)
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
          className="flex-1 h-14 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-sm uppercase">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          activeOpacity={0.85}
          className={`flex-1 h-14 rounded-2xl items-center justify-center shadow-md ${
            canProceed ? "bg-[#092D5D]" : "bg-gray-200 opacity-60"
          }`}
        >
          <Text className="text-white font-black text-sm uppercase tracking-wide">
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Step 7: Revisão Final ────────────────────────────────
function Step7({ data, prevStep, submitCompany, isSubmitting }: any) {
  return (
    <ScrollView
      className="flex-1 px-5 pt-4 bg-gray-50"
      contentContainerStyle={{ paddingBottom: 60 }}
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
          icon="people-outline"
          label="Equipe"
          value={data.teamSize || "—"}
        />
        <InfoRow
          icon="time-outline"
          label="Atendimento"
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
          className="flex-1 h-14 rounded-2xl items-center justify-center bg-white border border-gray-200"
        >
          <Text className="text-gray-700 font-extrabold text-sm uppercase">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={submitCompany}
          disabled={isSubmitting}
          activeOpacity={0.85}
          className={`flex-1 h-14 bg-[#092D5D] rounded-2xl items-center justify-center shadow-lg ${
            isSubmitting ? "opacity-60" : ""
          }`}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-black text-sm uppercase tracking-wide">
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
  const totalSteps = 7;

  const titles = [
    "Seu Negócio",
    "Segmentos",
    "Tamanho da Equipe",
    "Endereço",
    "Serviços",
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
          canProceed={vm.canProceedStep6}
        />
      )}
      {vm.step === 7 && (
        <Step7
          data={vm.data}
          prevStep={vm.prevStep}
          submitCompany={vm.submitCompany}
          isSubmitting={vm.isSubmitting}
        />
      )}
    </SafeAreaView>
  );
}

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
import { colors } from "@/styles/colors";

// ─── Progress Bar ─────────────────────────────────────────
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <View className="flex-row gap-1.5 px-6 pt-4 pb-2">
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className="h-1 flex-1 rounded-full"
          style={{
            backgroundColor: i < step ? colors["app-theme-primary"] : "#334155",
          }}
        />
      ))}
    </View>
  );
}

// ─── Page 1: Dados do Negócio e Conta de Acesso ───────────
function Step1({ data, updateData, nextStep, canProceed }: any) {
  return (
    <ScrollView
      className="flex-1 px-6 pt-6"
      contentContainerStyle={{ paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-font-primary text-3xl font-bold mb-2">
        Crie seu negócio e conta
      </Text>
      <Text className="text-font-primary text-sm mb-6">
        Insira os dados da empresa e suas credenciais de login.
      </Text>

      {/* Seção Empresa */}
      <Text className="text-font-primary text-xs font-bold uppercase tracking-wider mb-2 text-app-theme-primary">
        Sobre a Empresa
      </Text>

      <View className="bg-background-tertiary rounded-2xl px-4 py-3 mb-6">
        <Text className="text-font-primary  font-semibold text-xs mb-1 uppercase tracking-wider">
          Nome da Empresa *
        </Text>
        <TextInput
          value={data.name ?? ""}
          onChangeText={(v) => updateData({ name: v })}
          placeholder="Ex: Barbearia do João"
          placeholderTextColor="colors.gray[600]"
          className="text-font-primary text-base"
        />
      </View>



      {/* Seção Admin */}
      <Text className=" text-xs font-bold uppercase tracking-wider mb-2 text-app-theme-primary">
        Conta do Administrador
      </Text>

      <View className="flex-row gap-3 mb-4">
        <View className="bg-background-tertiary rounded-2xl px-4 py-3 flex-1">
          <Text className="text-font-primary  font-semibold text-xs mb-1 uppercase tracking-wider">
            Primeiro Nome *
          </Text>
          <TextInput
            value={data.firstName ?? ""}
            onChangeText={(v) => updateData({ firstName: v })}
            placeholder="Ex: João"
            placeholderTextColor={colors.black}
            className="text-font-primary text-base"
          />
        </View>

        <View className="bg-background-tertiary rounded-2xl px-4 py-3 flex-1">
          <Text className="text-font-primary font-semibold text-xs mb-1 uppercase tracking-wider">
            Sobrenome
          </Text>
          <TextInput
            value={data.lastName ?? ""}
            onChangeText={(v) => updateData({ lastName: v })}
            placeholder="Ex: Silva"
            placeholderTextColor={colors.black}
            className="text-font-primary text-base"
          />
        </View>
      </View>

      <View className="bg-background-tertiary rounded-2xl px-4 py-3 mb-4">
        <Text className="text-font-primary  font-semibold text-xs mb-1 uppercase tracking-wider">
          Email de Acesso *
        </Text>
        <TextInput
          value={data.email ?? ""}
          onChangeText={(v) => updateData({ email: v.trim() })}
          placeholder="Ex: joao@email.com"
          placeholderTextColor="colors.gray[600]"
          className="text-font-primary text-base"
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </View>

      <View className="bg-background-tertiary rounded-2xl px-4 py-3 mb-4">
        <Text className="text-font-primary font-semibold text-xs mb-1 uppercase tracking-wider">
          Senha de Acesso (mín. 6 caracteres) *
        </Text>
        <TextInput
          value={data.password ?? ""}
          onChangeText={(v) => updateData({ password: v })}
          placeholder="Sua senha secreta"
          placeholderTextColor="colors.gray[600]"
          className="text-font-primary text-base"
          secureTextEntry
          autoCapitalize="none"
        />
      </View>

      <View className="bg-background-tertiary rounded-2xl px-4 py-3 mb-8">
        <Text className="text-font-primary font-semibold  text-xs mb-1 uppercase tracking-wider">
          Celular / Telefone *
        </Text>
        <TextInput
          value={data.phone ?? ""}
          onChangeText={(v) => updateData({ phone: v })}
          placeholder="Ex: (11) 99999-9999"
          placeholderTextColor={colors.black}
          className="text-font-primary text-base"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity
        disabled={!canProceed}
        onPress={nextStep}
        className={`py-4 rounded-2xl items-center ${
          canProceed ? "" : "opacity-40"
        }`}
        style={{ backgroundColor: colors["app-theme-primary"] }}
      >
        <Text className="text-font-secundary font-bold text-base">
          Continuar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ─── Page 2: Categoria ────────────────────────────────────
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

  return (
    <ScrollView
      className="flex-1 px-6 pt-6"
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text className="text-font-primary text-3xl font-bold mb-2">
        Em qual segmento você atua?
      </Text>
      <Text className="text-font-primary text-sm mb-6">
        Selecione uma ou mais categorias.
      </Text>

      <View className="flex-row flex-wrap gap-3 mb-8">
        {CATEGORIES.map((cat: string) => {
          const selected = (data.categories ?? []).includes(cat);
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => toggleCategory(cat)}
              className={`px-4 py-2.5 rounded-full border ${
                selected
                  ? "border-app-theme-primary"
                  : "border-gray-700 bg-background-tertiary"
              }`}
              style={
                selected
                  ? { backgroundColor: colors["app-theme-primary"] + "20" }
                  : {}
              }
            >
              <Text
                style={{
                  color: colors["app-theme-primary"],
                }}
                className="font-semibold text-sm"
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          className="flex-1 py-4 rounded-2xl items-center bg-background-tertiary"
        >
          <Text className="text-font-primary font-bold text-base">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          className={`flex-1 py-4 rounded-2xl items-center ${
            canProceed ? "" : "opacity-40"
          }`}
          style={{ backgroundColor: colors["app-theme-primary"] }}
        >
          <Text className="text-font-secundary font-bold text-base">
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Page 3: Tamanho da Equipe ────────────────────────────
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
      className="flex-1 px-6 pt-6"
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text className="text-font-primary text-3xl font-bold mb-2">
        Quantas pessoas trabalham com você?
      </Text>
      <Text className="text-font-primary text-sm mb-6">
        Isso nos ajuda a configurar melhor a agenda.
      </Text>

      <View className="gap-3 mb-8">
        {TEAM_SIZES.map((ts: { label: string; value: string }) => {
          const selected = data.teamSize === ts.value;
          return (
            <TouchableOpacity
              key={ts.value}
              onPress={() => updateData({ teamSize: ts.value })}
              className={`flex-row items-center justify-between px-5 py-4 rounded-2xl border ${
                selected
                  ? "border-app-theme-primary"
                  : "border-gray-700 bg-background-tertiary"
              }`}
              style={
                selected
                  ? { backgroundColor: colors["app-theme-primary"] + "15" }
                  : {}
              }
            >
              <Text
                style={{
                  color: colors["app-theme-primary"],
                }}
                className="font-semibold text-base"
              >
                {ts.label}
              </Text>
              {selected && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors["app-theme-primary"]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          className="flex-1 py-4 rounded-2xl items-center bg-background-tertiary"
        >
          <Text className="text-font-primary font-bold text-base">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          className={`flex-1 py-4 rounded-2xl items-center ${
            canProceed ? "" : "opacity-40"
          }`}
          style={{ backgroundColor: colors["app-theme-primary"] }}
        >
          <Text className="text-font-secundary font-bold text-base">
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Page 4: Localização Detalhada via CEP ────────────────
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
      className="flex-1 px-6 pt-6"
      contentContainerStyle={{ paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-font-primary text-3xl font-bold mb-2">
        Onde fica o seu negócio?
      </Text>
      <Text className="text-font-primary text-sm mb-6">
        Digite o CEP para buscar as informações do endereço automaticamente e depois digite o número.
      </Text>

      {/* CEP */}
      <View className="bg-background-tertiary rounded-2xl px-4 py-3 mb-4 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-font-primary text-xs mb-1 uppercase tracking-wider">
            CEP *
          </Text>
          <TextInput
            value={data.cep ?? ""}
            onChangeText={searchCep}
            placeholder="Ex: 01310-100"
            placeholderTextColor="colors.gray[600]"
            className="text-font-primary text-base"
            keyboardType="numeric"
            maxLength={9}
          />
        </View>
        {addressLoading && (
          <ActivityIndicator size="small" color={colors["app-theme-primary"]} />
        )}
      </View>

      {/* Rua */}
      <View className="bg-background-tertiary rounded-2xl px-4 py-3 mb-4">
        <Text className="text-font-primary text-xs mb-1 uppercase tracking-wider">
          Rua / Logradouro *
        </Text>
        <TextInput
          value={data.street ?? ""}
          onChangeText={(v) => updateData({ street: v })}
          placeholder="Ex: Avenida Paulista"
          placeholderTextColor="colors.gray[600]"
          className="text-font-primary text-base"
        />
      </View>

      {/* Número e Complemento */}
      <View className="flex-row gap-3 mb-4">
        <View className="bg-background-tertiary rounded-2xl px-4 py-3 flex-1">
          <Text className="text-font-primary text-xs mb-1 uppercase tracking-wider">
            Número *
          </Text>
          <TextInput
            value={data.number ?? ""}
            onChangeText={(v) => updateData({ number: v })}
            placeholder="Ex: 1000"
            placeholderTextColor="colors.gray[600]"
            className="text-font-primary text-base"
            keyboardType="numeric"
          />
        </View>

        <View className="bg-background-tertiary rounded-2xl px-4 py-3 flex-1">
          <Text className="text-font-primary text-xs mb-1 uppercase tracking-wider">
            Complemento
          </Text>
          <TextInput
            value={data.complement ?? ""}
            onChangeText={(v) => updateData({ complement: v })}
            placeholder="Ex: Sala 42"
            placeholderTextColor="colors.gray[600]"
            className="text-font-primary text-base"
          />
        </View>
      </View>

      {/* Bairro */}
      <View className="bg-background-tertiary rounded-2xl px-4 py-3 mb-4">
        <Text className="text-font-primary text-xs mb-1 uppercase tracking-wider">
          Bairro *
        </Text>
        <TextInput
          value={data.neighborhood ?? ""}
          onChangeText={(v) => updateData({ neighborhood: v })}
          placeholder="Ex: Bela Vista"
          placeholderTextColor="colors.gray[600]"
          className="text-font-primary text-base"
        />
      </View>

      {/* Cidade e Estado */}
      <View className="flex-row gap-3 mb-6">
        <View className="bg-background-tertiary rounded-2xl px-4 py-3 flex-1">
          <Text className="text-font-primary text-xs mb-1 uppercase tracking-wider">
            Cidade *
          </Text>
          <TextInput
            value={data.city ?? ""}
            onChangeText={(v) => updateData({ city: v })}
            placeholder="Ex: São Paulo"
            placeholderTextColor="colors.gray[600]"
            className="text-font-primary text-base"
          />
        </View>

        <View className="bg-background-tertiary rounded-2xl px-4 py-3 w-24">
          <Text className="text-font-primary text-xs mb-1 uppercase tracking-wider">
            UF *
          </Text>
          <TextInput
            value={data.state ?? ""}
            onChangeText={(v) => updateData({ state: v.toUpperCase() })}
            placeholder="SP"
            placeholderTextColor="colors.gray[600]"
            className="text-font-primary text-base"
            maxLength={2}
            autoCapitalize="characters"
          />
        </View>
      </View>

      {/* Preview Endereço Completo */}
      {data.address ? (
        <View className="bg-green-900/20 border border-green-800 rounded-2xl p-4 mb-6 flex-row items-center gap-3">
          <Ionicons name="checkmark-circle" size={22} color="#4ade80" />
          <Text className="text-green-400 text-sm flex-1" numberOfLines={3}>
            {data.address}
          </Text>
        </View>
      ) : null}

      <View className="flex-row gap-3 mt-4">
        <TouchableOpacity
          onPress={prevStep}
          className="flex-1 py-4 rounded-2xl items-center bg-background-tertiary"
        >
          <Text className="text-font-primary font-bold text-base">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          className={`flex-1 py-4 rounded-2xl items-center ${
            canProceed ? "" : "opacity-40"
          }`}
          style={{ backgroundColor: colors["app-theme-primary"] }}
        >
          <Text className="text-font-secundary font-bold text-base">
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Page 5: Serviços Sugeridos ───────────────────────────
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
      className="flex-1 px-6 pt-6"
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text className="text-font-primary text-3xl font-bold mb-2">
        Quais serviços você oferece?
      </Text>
      <Text className="text-font-primary text-sm mb-6">
        Sugestões baseadas na sua categoria. Você pode editar depois.
      </Text>

      <View className="flex-row flex-wrap gap-3 mb-8">
        {suggestedServices.map((s: string) => {
          const selected = (data.defaultServices ?? []).includes(s);
          return (
            <TouchableOpacity
              key={s}
              onPress={() => toggleService(s)}
              className={`px-4 py-2.5 rounded-full border ${
                selected
                  ? "border-app-theme-primary"
                  : "border-gray-700 bg-background-tertiary"
              }`}
              style={
                selected
                  ? { backgroundColor: colors["app-theme-primary"] + "20" }
                  : {}
              }
            >
              <Text
                style={{
                  color: selected ? colors["app-theme-primary"] : "#9ca3af",
                }}
                className="font-semibold text-sm"
              >
                {s}
              </Text>
            </TouchableOpacity>
          );
        })}
        {suggestedServices.length === 0 && (
          <Text className="text-gray-600 text-sm">
            Nenhuma sugestão disponível. Você pode adicionar serviços depois no
            SaaS.
          </Text>
        )}
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          className="flex-1 py-4 rounded-2xl items-center bg-background-tertiary"
        >
          <Text className="text-font-primary font-bold text-base">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={nextStep}
          className="flex-1 py-4 rounded-2xl items-center"
          style={{ backgroundColor: colors["app-theme-primary"] }}
        >
          <Text className="text-font-secundary font-bold text-base">
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Page 6: Horário de Trabalho ───────────────────────────
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
      className="flex-1 px-6 pt-6"
      contentContainerStyle={{ paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text className="text-font-primary text-3xl font-bold mb-2">
        Seu horário de trabalho
      </Text>
      <Text className="text-font-primary text-sm mb-6">
        Selecione os dias da semana que você atende e defina seus turnos.
      </Text>

      {/* Dias da semana */}
      <Text className="text-font-primary text-xs font-bold uppercase tracking-wider mb-3 text-app-theme-primary">
        Dias de Atendimento
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {DAYS_OF_WEEK.map((day) => {
          const selected = (data.workDays ?? []).includes(day);
          return (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDay(day)}
              className={`px-4 py-2 rounded-full border ${
                selected
                  ? "border-app-theme-primary"
                  : "border-gray-700 bg-background-tertiary"
              }`}
              style={
                selected
                  ? { backgroundColor: colors["app-theme-primary"] + "20" }
                  : {}
              }
            >
              <Text
                style={{
                  color: selected ? colors["app-theme-primary"] : "#9ca3af",
                }}
                className="font-semibold text-sm"
              >
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Horários */}
      <Text className="text-font-primary text-xs font-bold uppercase tracking-wider mb-3 text-app-theme-primary">
        Horários de Turno
      </Text>

      {/* Turno da Manhã */}
      <View className="bg-background-tertiary rounded-2xl p-4 mb-4">
        <Text className="text-font-primary font-semibold text-xs mb-3 uppercase tracking-wider">
          Turno da Manhã (Ex: 09:00 - 12:00)
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1 bg-background-primary/40 rounded-xl px-3 py-2">
            <Text className="text-gray-400 text-[10px] mb-0.5 uppercase">Entrada</Text>
            <TextInput
              value={data.scheduleStart ?? "09:00"}
              onChangeText={(v) => updateData({ scheduleStart: v })}
              placeholder="09:00"
              placeholderTextColor="#666"
              className="text-font-primary text-base p-0"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
          <View className="flex-1 bg-background-primary/40 rounded-xl px-3 py-2">
            <Text className="text-gray-400 text-[10px] mb-0.5 uppercase">Almoço (Saída)</Text>
            <TextInput
              value={data.scheduleLunchStart ?? "12:00"}
              onChangeText={(v) => updateData({ scheduleLunchStart: v })}
              placeholder="12:00"
              placeholderTextColor="#666"
              className="text-font-primary text-base p-0"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
        </View>
      </View>

      {/* Turno da Tarde */}
      <View className="bg-background-tertiary rounded-2xl p-4 mb-8">
        <Text className="text-font-primary font-semibold text-xs mb-3 uppercase tracking-wider">
          Turno da Tarde (Ex: 13:00 - 18:00)
        </Text>
        <View className="flex-row gap-3">
          <View className="flex-1 bg-background-primary/40 rounded-xl px-3 py-2">
            <Text className="text-gray-400 text-[10px] mb-0.5 uppercase">Retorno</Text>
            <TextInput
              value={data.scheduleLunchEnd ?? "13:00"}
              onChangeText={(v) => updateData({ scheduleLunchEnd: v })}
              placeholder="13:00"
              placeholderTextColor="#666"
              className="text-font-primary text-base p-0"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
          <View className="flex-1 bg-background-primary/40 rounded-xl px-3 py-2">
            <Text className="text-gray-400 text-[10px] mb-0.5 uppercase">Fim / Saída</Text>
            <TextInput
              value={data.scheduleEnd ?? "18:00"}
              onChangeText={(v) => updateData({ scheduleEnd: v })}
              placeholder="18:00"
              placeholderTextColor="#666"
              className="text-font-primary text-base p-0"
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />
          </View>
        </View>
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          className="flex-1 py-4 rounded-2xl items-center bg-background-tertiary"
        >
          <Text className="text-font-primary font-bold text-base">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={!canProceed}
          onPress={nextStep}
          className={`flex-1 py-4 rounded-2xl items-center ${
            canProceed ? "" : "opacity-40"
          }`}
          style={{ backgroundColor: colors["app-theme-primary"] }}
        >
          <Text className="text-font-secundary font-bold text-base">
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ─── Page 7: Revisão Final ────────────────────────────────
function Step7({ data, prevStep, submitCompany, isSubmitting }: any) {
  return (
    <ScrollView
      className="flex-1 px-6 pt-6"
      contentContainerStyle={{ paddingBottom: 60 }}
    >
      <Text className="text-font-primary text-3xl font-bold mb-2">
        Pronto para começar! 🎉
      </Text>
      <Text className="text-font-primary text-sm mb-8">
        Revise os dados abaixo e confirme a criação de sua conta e estabelecimento.
      </Text>

      <View className="gap-4 mb-8">
        <InfoRow icon="business-outline" label="Empresa" value={data.name} />
        <InfoRow
          icon="person-outline"
          label="Administrador"
          value={`${data.firstName} ${data.lastName || ""}`}
        />
        <InfoRow icon="mail-outline" label="E-mail de Login" value={data.email} />
        <InfoRow
          icon="pricetag-outline"
          label="Segmento"
          value={(data.categories ?? []).join(", ") || "—"}
        />
        <InfoRow
          icon="people-outline"
          label="Equipe"
          value={data.teamSize || "—"}
        />
        <InfoRow
          icon="time-outline"
          label="Horário de Atendimento"
          value={`${(data.workDays ?? []).join(", ") || "—"} • ${data.scheduleStart} - ${data.scheduleLunchStart} / ${data.scheduleLunchEnd} - ${data.scheduleEnd}`}
        />
        <InfoRow
          icon="location-outline"
          label="Endereço"
          value={data.address?.substring(0, 80) || "Não informado"}
        />
      </View>

      <View className="flex-row gap-3">
        <TouchableOpacity
          onPress={prevStep}
          className="flex-1 py-4 rounded-2xl items-center bg-background-tertiary"
          disabled={isSubmitting}
        >
          <Text className="text-font-primary font-bold text-base">Voltar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={submitCompany}
          disabled={isSubmitting}
          className={`flex-1 py-4 rounded-2xl items-center ${
            isSubmitting ? "opacity-60" : ""
          }`}
          style={{ backgroundColor: colors["app-theme-primary"] }}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-font-secundary font-bold text-base">
              Criar conta e Empresa
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
    <View className="flex-row items-start gap-3 bg-background-tertiary p-4 rounded-2xl">
      <Ionicons name={icon} size={20} color={colors["app-theme-primary"]} />
      <View className="flex-1">
        <Text className="text-font-primary text-xs mb-0.5">{label}</Text>
        <Text
          className="text-font-primary text-sm font-semibold"
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
    "Seu negócio",
    "Segmento",
    "Equipe",
    "Localização",
    "Serviços",
    "Horário",
    "Confirmação",
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-1 gap-3">
        <TouchableOpacity
          onPress={() => {
            if (vm.step === 1) router.back();
            else vm.prevStep();
          }}
          className="bg-background-tertiary p-2 rounded-full"
        >
          <Ionicons name="arrow-back" size={22} color="white" />
        </TouchableOpacity>
        <Text className="text-font-primary font-semibold text-base flex-1">
          {titles[vm.step - 1]}
        </Text>
        <Text className="text-font-primary text-sm">
          {vm.step}/{totalSteps}
        </Text>
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

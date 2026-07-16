import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { colors } from "@/styles/colors";
import { useCompanyEditViewModel } from "./useCompanyEditViewModel";
import { AppDateTimePicker } from "@/shared/components/AppDateTimePicker";

export function CompanyEditView() {
  const {
    isLoading,
    name, setName,
    cnpj, setCnpj,
    address, setAddress,
    phone, setPhone,
    description, setDescription,
    imagesUrl, setImagesUrl,
    hoursList,
    instagram, setInstagram,
    facebook, setFacebook,
    website, setWebsite,
    saving,
    uploading,
    handleHourChange,
    handleSave,
    getFormatTime,
    handlePickAndUploadImage,
    handleRemoveImage,
    activeHourEdit,
    setActiveHourEdit,
    openTimePicker,
    handleConfirmTime,
    selectedCategories,
    toggleCategory,
    allCategories,
    cep, setCep,
    street, setStreet,
    number, setNumber,
    complement, setComplement,
    neighborhood, setNeighborhood,
    city, setCity,
    state, setState,
    addressLoading,
    searchCep,
  } = useCompanyEditViewModel();

  const themeColor = colors["app-theme-primary"];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color={themeColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header com botão Salvar integrado */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-slate-100">
        <AppAdminHeader
          title="Editar Empresa"
          iconRight={{ icon: false, path: "" }}
        />
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
          className="px-5 py-2.5 rounded-full"
          style={{ backgroundColor: themeColor }}
        >
          <Text className="text-white text-xs font-bold">
            {saving ? "Salvando..." : "Salvar"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 py-4 bg-white"
        showsVerticalScrollIndicator={false}
      >
        {/* Dados Principais */}
        <View className="mb-6">
          <Text
            className="text-xs font-bold uppercase tracking-wider mb-4"
            style={{ color: themeColor }}
          >
            Dados Principais
          </Text>

          <View className="gap-3">
            {/* Nome do Estabelecimento */}
            <View>
              <Text className="text-slate-500 text-xs font-semibold mb-1">Nome do Estabelecimento</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ex: BeautyFi"
                placeholderTextColor="#94a3b8"
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 text-sm"
              />
            </View>

            {/* CNPJ */}
            <View>
              <Text className="text-slate-500 text-xs font-semibold mb-1">CNPJ</Text>
              <TextInput
                value={cnpj}
                onChangeText={setCnpj}
                placeholder="Ex: 00.000.000/0001-00"
                placeholderTextColor="#94a3b8"
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 text-sm"
              />
            </View>

            {/* Telefone */}
            <View>
              <Text className="text-slate-500 text-xs font-semibold mb-1">Telefone</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="Ex: (11) 99999-9999"
                placeholderTextColor="#94a3b8"
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 text-sm"
                keyboardType="phone-pad"
              />
            </View>

            {/* Endereço Title */}
            <Text
              className="text-xs font-bold uppercase tracking-wider mt-4 mb-2"
              style={{ color: themeColor }}
            >
              Endereço do Estabelecimento
            </Text>

            {/* CEP */}
            <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  CEP *
                </Text>
                <TextInput
                  value={cep}
                  onChangeText={searchCep}
                  placeholder="Ex: 01310-100"
                  placeholderTextColor="#94a3b8"
                  className="text-slate-800 text-sm p-0"
                  keyboardType="numeric"
                  maxLength={9}
                />
              </View>
              {addressLoading && (
                <ActivityIndicator size="small" color={themeColor} />
              )}
            </View>

            {/* Rua / Logradouro */}
            <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                Rua / Logradouro *
              </Text>
              <TextInput
                value={street}
                onChangeText={setStreet}
                placeholder="Ex: Avenida Paulista"
                placeholderTextColor="#94a3b8"
                className="text-slate-800 text-sm p-0"
              />
            </View>

            {/* Número e Complemento */}
            <View className="flex-row gap-3">
              <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex-1">
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Número *
                </Text>
                <TextInput
                  value={number}
                  onChangeText={setNumber}
                  placeholder="Ex: 1000"
                  placeholderTextColor="#94a3b8"
                  className="text-slate-800 text-sm p-0"
                  keyboardType="numeric"
                />
              </View>

              <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex-1">
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Complemento
                </Text>
                <TextInput
                  value={complement}
                  onChangeText={setComplement}
                  placeholder="Ex: Sala 42"
                  placeholderTextColor="#94a3b8"
                  className="text-slate-800 text-sm p-0"
                />
              </View>
            </View>

            {/* Bairro */}
            <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
              <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                Bairro *
              </Text>
              <TextInput
                value={neighborhood}
                onChangeText={setNeighborhood}
                placeholder="Ex: Bela Vista"
                placeholderTextColor="#94a3b8"
                className="text-slate-800 text-sm p-0"
              />
            </View>

            {/* Cidade e UF */}
            <View className="flex-row gap-3">
              <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex-1">
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  Cidade *
                </Text>
                <TextInput
                  value={city}
                  onChangeText={setCity}
                  placeholder="Ex: São Paulo"
                  placeholderTextColor="#94a3b8"
                  className="text-slate-800 text-sm p-0"
                />
              </View>

              <View className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 w-24">
                <Text className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                  UF *
                </Text>
                <TextInput
                  value={state}
                  onChangeText={setState}
                  placeholder="Ex: SP"
                  placeholderTextColor="#94a3b8"
                  className="text-slate-800 text-sm p-0"
                  maxLength={2}
                  autoCapitalize="characters"
                />
              </View>
            </View>

            {/* Descrição */}
            <View className="mt-2">
              <Text className="text-slate-500 text-xs font-semibold mb-1">Descrição</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Descrição curta..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 text-sm min-h-[60px]"
              />
            </View>
          </View>
        </View>


        {/* Categorias / Segmentos */}
        <View className="mb-6 border-t border-slate-100 pt-6">
          <Text
            className="text-xs font-bold uppercase tracking-wider mb-4"
            style={{ color: themeColor }}
          >
            Segmentos / Categorias
          </Text>
          <View className="flex-row flex-wrap gap-2.5">
            {allCategories.map((cat: any) => {
              const isSelected = selectedCategories.some((c: any) => c.id === cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => toggleCategory(cat)}
                  activeOpacity={0.8}
                  className={`px-4 py-2.5 rounded-full border ${
                    isSelected
                      ? "border-app-theme-primary"
                      : "border-slate-200 bg-slate-50"
                  }`}
                  style={
                    isSelected
                      ? { backgroundColor: colors["app-theme-primary"] + "15" }
                      : {}
                  }
                >
                  <Text
                    style={{
                      color: isSelected ? colors["app-theme-primary"] : "#64748b",
                    }}
                    className="font-bold text-xs"
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Carousel de Fotos */}

        <View className="mb-6 border-t border-slate-100 pt-6">
          <Text
            className="text-xs font-bold uppercase tracking-wider mb-2"
            style={{ color: themeColor }}
          >
            Imagens do Estabelecimento
          </Text>
          
          {/* Grid de Imagens Atuais */}
          <View className="flex-row flex-wrap gap-2.5 mb-4">
            {imagesUrl
              .split(",")
              .map((url) => url.trim())
              .filter((url) => url.length > 0)
              .map((url, idx) => (
                <View key={idx} className="relative w-[30%] aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <Image source={{ uri: url }} className="w-full h-full object-cover" />
                  <TouchableOpacity
                    onPress={() => handleRemoveImage(idx)}
                    activeOpacity={0.7}
                    className="absolute top-1 right-1 bg-red-600 p-1.5 rounded-full shadow"
                  >
                    <Ionicons name="trash-outline" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}

            {imagesUrl.split(",").map(url => url.trim()).filter(url => url.length > 0).length === 0 && (
              <Text className="text-slate-400 text-xs py-2">Nenhuma imagem no portfólio.</Text>
            )}
          </View>

          {/* Botões de Ação */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handlePickAndUploadImage}
              disabled={uploading}
              activeOpacity={0.8}
              className="bg-slate-50 border border-slate-200 py-3 rounded-xl flex-row justify-center items-center gap-2"
            >
              {uploading ? (
                <ActivityIndicator size="small" color={themeColor} />
              ) : (
                <>
                  <Ionicons name="image-outline" size={16} color={themeColor} />
                  <Text className="text-slate-700 text-xs font-bold">Enviar Foto da Galeria</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Redes Sociais */}
        <View className="mb-6 border-t border-slate-100 pt-6">
          <Text
            className="text-xs font-bold uppercase tracking-wider mb-4"
            style={{ color: themeColor }}
          >
            Redes Sociais
          </Text>

          <View className="gap-3">
            {[
              { label: "Instagram URL", value: instagram, onChange: setInstagram, placeholder: "https://instagram.com/..." },
              { label: "Facebook URL", value: facebook, onChange: setFacebook, placeholder: "https://facebook.com/..." },
              { label: "Website URL", value: website, onChange: setWebsite, placeholder: "https://seusite.com.br" },
            ].map(({ label, value, onChange, placeholder }) => (
              <View key={label}>
                <Text className="text-slate-500 text-xs font-semibold mb-1">{label}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder={placeholder}
                  placeholderTextColor="#94a3b8"
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 text-sm"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Horários de Atendimento */}
        <View className="mb-12 border-t border-slate-100 pt-6">
          <Text
            className="text-xs font-bold uppercase tracking-wider mb-4"
            style={{ color: themeColor }}
          >
            Horários de Atendimento
          </Text>

          {hoursList.map((hour) => (
            <View
              key={hour.id}
              className="border-b border-slate-100 py-3 gap-2"
            >
              <Text className="text-slate-700 font-bold text-sm">
                {hour.dayWeek}
              </Text>
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-slate-400 text-[10px] font-semibold mb-1">
                    1º Turno (Início - Fim)
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={() => openTimePicker(hour.id, "firstHour", hour.firstHour)}
                      className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex-1 items-center justify-center"
                    >
                      <Text className="text-slate-800 text-xs font-semibold">
                        {getFormatTime(hour.firstHour) || "09:00"}
                      </Text>
                    </TouchableOpacity>
                    <Text className="text-slate-400 text-xs">-</Text>
                    <TouchableOpacity
                      onPress={() => openTimePicker(hour.id, "secondHour", hour.secondHour)}
                      className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex-1 items-center justify-center"
                    >
                      <Text className="text-slate-800 text-xs font-semibold">
                        {getFormatTime(hour.secondHour) || "12:00"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-slate-400 text-[10px] font-semibold mb-1">
                    2º Turno (Início - Fim)
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <TouchableOpacity
                      onPress={() => openTimePicker(hour.id, "thirdHour", hour.thirdHour)}
                      className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex-1 items-center justify-center"
                    >
                      <Text className="text-slate-800 text-xs font-semibold">
                        {getFormatTime(hour.thirdHour) || "13:00"}
                      </Text>
                    </TouchableOpacity>
                    <Text className="text-slate-400 text-xs">-</Text>
                    <TouchableOpacity
                      onPress={() => openTimePicker(hour.id, "lastHour", hour.lastHour)}
                      className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex-1 items-center justify-center"
                    >
                      <Text className="text-slate-800 text-xs font-semibold">
                        {getFormatTime(hour.lastHour) || "18:00"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* DateTime Picker Modal */}
      {activeHourEdit && (
        <AppDateTimePicker
          open={!!activeHourEdit}
          date={activeHourEdit.dateValue}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={() => setActiveHourEdit(null)}
        />
      )}
    </SafeAreaView>
  );
}

import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Image as ExpoImage } from "expo-image";
import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { AppInput } from "@/shared/components/AppInput";
import { colors } from "@/styles/colors";
import { useCompanyEditViewModel } from "./useCompanyEditViewModel";
import { AppDateTimePicker } from "@/shared/components/AppDateTimePicker";

export function CompanyEditView() {
  const {
    isLoading,
    name,
    setName,
    cnpj,
    setCnpj,
    phone,
    setPhone,
    description,
    setDescription,
    imagesUrl,
    portfolioImagesUrl,
    hoursList,
    instagram,
    setInstagram,
    facebook,
    setFacebook,
    website,
    setWebsite,
    saving,
    uploadingSpace,
    uploadingPortfolio,
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
    cep,
    street,
    setStreet,
    number,
    setNumber,
    complement,
    setComplement,
    neighborhood,
    setNeighborhood,
    city,
    setCity,
    state,
    setState,
    addressLoading,
    searchCep,
  } = useCompanyEditViewModel();

  const themeColor = colors["app-theme-primary"];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary justify-center items-center">
        <ActivityIndicator size="large" color={themeColor} />
      </SafeAreaView>
    );
  }

  const renderImageGrid = (
    rawImages: string,
    type: "space" | "portfolio",
    isUploading: boolean
  ) => {
    const cleanUrls = rawImages
      ? rawImages
          .replace(/[\[\]"']/g, "")
          .split(",")
          .map((url) => url.trim())
          .filter(
            (url) =>
              url.length > 5 &&
              (url.includes("http://") ||
                url.includes("https://") ||
                url.startsWith("file://") ||
                url.startsWith("data:")),
          )
      : [];

    return (
      <View className="mb-2">
        <View className="flex-row flex-wrap justify-between mb-2">
          {cleanUrls.length === 0 ? (
            <View className="w-full py-6 items-center justify-center bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl mb-3">
              <Ionicons
                name={type === "portfolio" ? "images-outline" : "home-outline"}
                size={32}
                color="#9ca3af"
              />
              <Text className="text-gray-500 text-xs font-bold mt-1">
                {type === "portfolio"
                  ? "Nenhuma foto de portfólio"
                  : "Nenhuma foto do espaço"}
              </Text>
              <Text className="text-gray-400 text-[10px] mt-0.5">
                {type === "portfolio"
                  ? "Adicione fotos dos serviços e resultados dos trabalhos"
                  : "Adicione imagens do seu estabelecimento"}
              </Text>
            </View>
          ) : (
            cleanUrls.map((url, idx) => (
              <View
                key={idx}
                style={{
                  width: "48%",
                  height: 150,
                  borderRadius: 16,
                  overflow: "hidden",
                  position: "relative",
                  marginBottom: 12,
                  backgroundColor: "#f8fafc",
                  borderWidth: 1,
                  borderColor: "#e2e8f0",
                }}
              >
                <ExpoImage
                  source={{ uri: url }}
                  style={{ width: "100%", height: "100%" }}
                  contentFit="cover"
                  transition={200}
                />
                <TouchableOpacity
                  onPress={() => handleRemoveImage(idx, type)}
                  activeOpacity={0.7}
                  style={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(220, 38, 38, 0.9)",
                    padding: 7,
                    borderRadius: 20,
                    zIndex: 10,
                  }}
                >
                  <Ionicons name="trash-outline" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>

        <TouchableOpacity
          onPress={() => handlePickAndUploadImage(type)}
          disabled={isUploading}
          activeOpacity={0.85}
          className="bg-[#FAF8EF] border border-[#CBA35D]/40 py-3 rounded-xl flex-row justify-center items-center gap-2"
        >
          {isUploading ? (
            <ActivityIndicator size="small" color="#092D5D" />
          ) : (
            <>
              <Ionicons
                name={type === "portfolio" ? "camera-outline" : "add-circle-outline"}
                size={18}
                color="#092D5D"
              />
              <Text className="text-[#092D5D] text-xs font-extrabold uppercase tracking-wide">
                {type === "portfolio"
                  ? "Adicionar Foto ao Portfólio"
                  : "Adicionar Foto do Espaço"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {/* Header com botão Salvar */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-white border-b border-gray-100 shadow-sm">
        <AppAdminHeader
          title="Editar Empresa"
          iconRight={{ icon: false, path: "" }}
        />
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
          className="px-5 py-2.5 rounded-xl flex-row items-center gap-1.5 shadow-sm"
          style={{ backgroundColor: "#092D5D" }}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={16} color="#CBA35D" />
              <Text className="text-white text-xs font-extrabold uppercase tracking-wide">
                Salvar
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 py-4"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
        {/* Card 1: Dados Principais */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-gray-100 shadow-sm">
          <View className="flex-row items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-[#092D5D]/10 justify-center items-center">
              <Ionicons name="business" size={18} color="#092D5D" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Informações do Estabelecimento
            </Text>
          </View>

          <View className="gap-4">
            <AppInput
              label="Nome do Estabelecimento"
              leftIcon="storefront-outline"
              placeholder="Ex: Salão BeautyFi"
              value={name}
              onChangeText={setName}
              formCrud
            />

            <AppInput
              label="CNPJ"
              leftIcon="card-outline"
              placeholder="00.000.000/0001-00"
              value={cnpj}
              onChangeText={setCnpj}
              keyboardType="numeric"
              formCrud
            />

            <AppInput
              label="Telefone / WhatsApp"
              leftIcon="call-outline"
              placeholder="(11) 99999-9999"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              formCrud
            />

            <AppInput
              label="Descrição Curta"
              leftIcon="document-text-outline"
              placeholder="Conte um pouco sobre os diferenciais do seu espaço..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              formCrud
            />
          </View>
        </View>

        {/* Card 2: Endereço Completo */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-gray-100 shadow-sm">
          <View className="flex-row items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <View className="flex-row items-center gap-2">
              <View className="w-8 h-8 rounded-lg bg-[#CBA35D]/20 justify-center items-center">
                <Ionicons name="location" size={18} color="#092D5D" />
              </View>
              <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
                Endereço e Localização
              </Text>
            </View>
            {addressLoading && <ActivityIndicator size="small" color="#092D5D" />}
          </View>

          <View className="gap-4">
            <AppInput
              label="CEP (Busca Automática)"
              leftIcon="map-outline"
              placeholder="00000-000"
              value={cep}
              onChangeText={searchCep}
              keyboardType="numeric"
              maxLength={9}
              formCrud
            />

            <AppInput
              label="Rua / Logradouro"
              leftIcon="navigate-outline"
              placeholder="Ex: Avenida Paulista"
              value={street}
              onChangeText={setStreet}
              formCrud
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <AppInput
                  label="Número"
                  leftIcon="pin-outline"
                  placeholder="1000"
                  value={number}
                  onChangeText={setNumber}
                  keyboardType="numeric"
                  formCrud
                />
              </View>
              <View className="flex-1">
                <AppInput
                  label="Complemento"
                  leftIcon="business-outline"
                  placeholder="Sala 42"
                  value={complement}
                  onChangeText={setComplement}
                  formCrud
                />
              </View>
            </View>

            <AppInput
              label="Bairro"
              leftIcon="home-outline"
              placeholder="Ex: Bela Vista"
              value={neighborhood}
              onChangeText={setNeighborhood}
              formCrud
            />

            <View className="flex-row gap-3">
              <View className="flex-1">
                <AppInput
                  label="Cidade"
                  leftIcon="location-outline"
                  placeholder="São Paulo"
                  value={city}
                  onChangeText={setCity}
                  formCrud
                />
              </View>
              <View className="w-28">
                <AppInput
                  label="UF"
                  placeholder="SP"
                  value={state}
                  onChangeText={setState}
                  maxLength={2}
                  autoCapitalize="characters"
                  formCrud
                />
              </View>
            </View>
          </View>
        </View>

        {/* Card 3: Categorias e Segmentos */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-gray-100 shadow-sm">
          <View className="flex-row items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-[#092D5D]/10 justify-center items-center">
              <Ionicons name="grid" size={18} color="#092D5D" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Segmentos & Categorias
            </Text>
          </View>

          <Text className="text-gray-500 text-xs mb-3">
            Selecione as categorias atendidas pelo seu estabelecimento:
          </Text>

          <View className="flex-row flex-wrap gap-2">
            {allCategories.map((cat: any) => {
              const isSelected = selectedCategories.some((c: any) => c.id === cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => toggleCategory(cat)}
                  activeOpacity={0.8}
                  className={`px-4 py-2.5 rounded-xl border flex-row items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#092D5D] border-[#092D5D]"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={14} color="#CBA35D" />
                  )}
                  <Text
                    className={`font-bold text-xs ${
                      isSelected ? "text-white" : "text-gray-600"
                    }`}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Card 4: Fotos do Espaço */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-gray-100 shadow-sm">
          <View className="flex-row items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-[#092D5D]/10 justify-center items-center">
              <Ionicons name="home" size={18} color="#092D5D" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Fotos do Espaço (Capa / Carrossel)
            </Text>
          </View>
          {renderImageGrid(imagesUrl, "space", uploadingSpace)}
        </View>

        {/* Card 5: Fotos de Portfólio */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-gray-100 shadow-sm">
          <View className="flex-row items-center gap-2 mb-3 pb-3 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-[#CBA35D]/20 justify-center items-center">
              <Ionicons name="images" size={18} color="#092D5D" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Fotos do Portfólio (Trabalhos Realizados)
            </Text>
          </View>
          {renderImageGrid(portfolioImagesUrl, "portfolio", uploadingPortfolio)}
        </View>

        {/* Card 6: Redes Sociais */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-gray-100 shadow-sm">
          <View className="flex-row items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-[#092D5D]/10 justify-center items-center">
              <Ionicons name="share-social" size={18} color="#092D5D" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Redes Sociais & Website
            </Text>
          </View>

          <View className="gap-4">
            <AppInput
              label="Instagram URL"
              leftIcon="logo-instagram"
              placeholder="https://instagram.com/seusalao"
              value={instagram}
              onChangeText={setInstagram}
              formCrud
            />

            <AppInput
              label="Facebook URL"
              leftIcon="logo-facebook"
              placeholder="https://facebook.com/seusalao"
              value={facebook}
              onChangeText={setFacebook}
              formCrud
            />

            <AppInput
              label="Website URL"
              leftIcon="globe-outline"
              placeholder="https://seusalao.com.br"
              value={website}
              onChangeText={setWebsite}
              formCrud
            />
          </View>
        </View>

        {/* Card 7: Horários de Atendimento */}
        <View className="bg-white rounded-2xl p-5 mb-5 border border-gray-100 shadow-sm">
          <View className="flex-row items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <View className="w-8 h-8 rounded-lg bg-[#CBA35D]/20 justify-center items-center">
              <Ionicons name="time" size={18} color="#092D5D" />
            </View>
            <Text className="text-[#092D5D] text-sm font-extrabold uppercase tracking-wider">
              Horários de Atendimento
            </Text>
          </View>

          <View className="gap-3">
            {hoursList.map((hour) => (
              <View
                key={hour.id}
                className="bg-gray-50 border border-gray-200/60 p-3.5 rounded-xl gap-2"
              >
                <Text className="text-[#092D5D] font-black text-xs uppercase tracking-wide">
                  {hour.dayWeek}
                </Text>
                <View className="flex-row gap-3">
                  {/* Turno 1 */}
                  <View className="flex-1">
                    <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      1º Turno
                    </Text>
                    <View className="flex-row items-center gap-1.5">
                      <TouchableOpacity
                        onPress={() =>
                          openTimePicker(hour.id, "firstHour", hour.firstHour)
                        }
                        className="bg-white border border-gray-200 p-2 rounded-lg flex-1 items-center"
                      >
                        <Text className="text-gray-800 text-xs font-bold">
                          {getFormatTime(hour.firstHour) || "09:00"}
                        </Text>
                      </TouchableOpacity>
                      <Text className="text-gray-400 text-xs font-bold">-</Text>
                      <TouchableOpacity
                        onPress={() =>
                          openTimePicker(hour.id, "secondHour", hour.secondHour)
                        }
                        className="bg-white border border-gray-200 p-2 rounded-lg flex-1 items-center"
                      >
                        <Text className="text-gray-800 text-xs font-bold">
                          {getFormatTime(hour.secondHour) || "12:00"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Turno 2 */}
                  <View className="flex-1">
                    <Text className="text-gray-500 text-[10px] font-bold uppercase tracking-wider mb-1">
                      2º Turno
                    </Text>
                    <View className="flex-row items-center gap-1.5">
                      <TouchableOpacity
                        onPress={() =>
                          openTimePicker(hour.id, "thirdHour", hour.thirdHour)
                        }
                        className="bg-white border border-gray-200 p-2 rounded-lg flex-1 items-center"
                      >
                        <Text className="text-gray-800 text-xs font-bold">
                          {getFormatTime(hour.thirdHour) || "13:00"}
                        </Text>
                      </TouchableOpacity>
                      <Text className="text-gray-400 text-xs font-bold">-</Text>
                      <TouchableOpacity
                        onPress={() =>
                          openTimePicker(hour.id, "lastHour", hour.lastHour)
                        }
                        className="bg-white border border-gray-200 p-2 rounded-lg flex-1 items-center"
                      >
                        <Text className="text-gray-800 text-xs font-bold">
                          {getFormatTime(hour.lastHour) || "18:00"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal do Seletor de Hora */}
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

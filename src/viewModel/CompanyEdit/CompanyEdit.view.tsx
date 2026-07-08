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
            {[
              { label: "Nome do Estabelecimento", value: name, onChange: setName, placeholder: "Ex: BeautyFi" },
              { label: "CNPJ", value: cnpj, onChange: setCnpj, placeholder: "Ex: 00.000.000/0001-00" },
              { label: "Telefone", value: phone, onChange: setPhone, placeholder: "Ex: (11) 99999-9999" },
              { label: "Endereço", value: address, onChange: setAddress, placeholder: "Ex: Av. Paulista, 1000" },
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

            <View>
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

            <View className="mt-1">
              <Text className="text-slate-500 text-[10px] font-semibold mb-1">Ou edite as URLs manualmente:</Text>
              <TextInput
                value={imagesUrl}
                onChangeText={setImagesUrl}
                placeholder="Ex: https://img1.com, https://img2.com"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-slate-800 text-xs min-h-[60px]"
              />
            </View>
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

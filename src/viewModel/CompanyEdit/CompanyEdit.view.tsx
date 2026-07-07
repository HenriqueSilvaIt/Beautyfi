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
  } = useCompanyEditViewModel();

  const themeColor = colors["app-theme-primary"];

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary justify-center items-center">
        <ActivityIndicator size="large" color={themeColor} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      {/* Header com botão Salvar integrado */}
      <View className="flex-row items-center justify-between px-5 py-2 border-b border-gray-800">
        <AppAdminHeader
          title="Editar Empresa"
          iconRight={{ icon: false, path: "" }}
        />
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
          className="px-4 py-2 rounded-xl"
          style={{ backgroundColor: themeColor }}
        >
          <Text className="text-font-secundary text-xs font-bold">
            {saving ? "Salvando..." : "Salvar"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1 px-5 py-4"
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
                <Text className="text-gray-500 text-xs mb-1">{label}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder={placeholder}
                  placeholderTextColor="#9ca3af"
                  className="bg-background-tertiary border border-gray-700 p-3 rounded-xl text-font-primary text-sm"
                />
              </View>
            ))}

            <View>
              <Text className="text-gray-500 text-xs mb-1">Descrição</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Descrição curta..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                className="bg-background-tertiary border border-gray-700 p-3 rounded-xl text-font-primary text-sm min-h-[60px]"
              />
            </View>
          </View>
        </View>

        {/* Carousel de Fotos */}
        <View className="mb-6 border-t border-gray-800 pt-6">
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
                <View key={idx} className="relative w-[30%] aspect-square rounded-xl overflow-hidden bg-gray-900 border border-gray-800">
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
              <Text className="text-gray-500 text-xs py-2">Nenhuma imagem no portfólio.</Text>
            )}
          </View>

          {/* Botões de Ação */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handlePickAndUploadImage}
              disabled={uploading}
              activeOpacity={0.8}
              className="bg-background-tertiary border border-gray-700 py-3 rounded-xl flex-row justify-center items-center gap-2"
            >
              {uploading ? (
                <ActivityIndicator size="small" color={themeColor} />
              ) : (
                <>
                  <Ionicons name="image-outline" size={16} color={themeColor} />
                  <Text className="text-font-primary text-xs font-bold">Enviar Foto da Galeria</Text>
                </>
              )}
            </TouchableOpacity>

            <View className="mt-1">
              <Text className="text-gray-500 text-[10px] mb-1">Ou edite as URLs manualmente:</Text>
              <TextInput
                value={imagesUrl}
                onChangeText={setImagesUrl}
                placeholder="Ex: https://img1.com, https://img2.com"
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={3}
                className="bg-background-tertiary border border-gray-700 p-3 rounded-xl text-font-primary text-xs min-h-[60px]"
              />
            </View>
          </View>
        </View>

        {/* Redes Sociais */}
        <View className="mb-6 border-t border-gray-800 pt-6">
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
                <Text className="text-gray-500 text-xs mb-1">{label}</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder={placeholder}
                  placeholderTextColor="#9ca3af"
                  className="bg-background-tertiary border border-gray-700 p-3 rounded-xl text-font-primary text-sm"
                />
              </View>
            ))}
          </View>
        </View>

        {/* Horários de Atendimento */}
        <View className="mb-12 border-t border-gray-800 pt-6">
          <Text
            className="text-xs font-bold uppercase tracking-wider mb-4"
            style={{ color: themeColor }}
          >
            Horários de Atendimento
          </Text>

          {hoursList.map((hour) => (
            <View
              key={hour.id}
              className="border-b border-gray-800/50 py-3 gap-2"
            >
              <Text className="text-font-primary font-bold text-sm">
                {hour.dayWeek}
              </Text>
              <View className="flex-row gap-4">
                <View className="flex-1">
                  <Text className="text-gray-500 text-[10px] mb-1">
                    1º Turno (Início - Fim)
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <TextInput
                      value={getFormatTime(hour.firstHour)}
                      onChangeText={(val) =>
                        handleHourChange(hour.id, "firstHour", val)
                      }
                      placeholder="09:00"
                      placeholderTextColor={themeColor}
                      className="bg-background-tertiary border border-gray-700 p-2 rounded-lg text-font-primary text-xs flex-1 text-center"
                    />
                    <Text className="text-gray-500 text-xs">-</Text>
                    <TextInput
                      value={getFormatTime(hour.secondHour)}
                      onChangeText={(val) =>
                        handleHourChange(hour.id, "secondHour", val)
                      }
                      placeholder="12:00"
                      placeholderTextColor={themeColor}
                      className="bg-background-tertiary border border-gray-700 p-2 rounded-lg text-font-primary text-xs flex-1 text-center"
                    />
                  </View>
                </View>

                <View className="flex-1">
                  <Text className="text-gray-500 text-[10px] mb-1">
                    2º Turno (Início - Fim)
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <TextInput
                      value={getFormatTime(hour.thirdHour)}
                      onChangeText={(val) =>
                        handleHourChange(hour.id, "thirdHour", val)
                      }
                      placeholder="13:00"
                      placeholderTextColor={themeColor}
                      className="bg-background-tertiary border border-gray-700 p-2 rounded-lg text-font-primary text-xs flex-1 text-center"
                    />
                    <Text className="text-gray-500 text-xs">-</Text>
                    <TextInput
                      value={getFormatTime(hour.lastHour)}
                      onChangeText={(val) =>
                        handleHourChange(hour.id, "lastHour", val)
                      }
                      placeholder="18:00"
                      placeholderTextColor={themeColor}
                      className="bg-background-tertiary border border-gray-700 p-2 rounded-lg text-font-primary text-xs flex-1 text-center"
                    />
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

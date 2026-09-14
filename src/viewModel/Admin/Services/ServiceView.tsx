import { Modal, Text, TouchableOpacity, View, Linking } from "react-native";
import { useServiceViewModel } from "./userServiceViewModel";
import { KeyboardContainer } from "@/shared/components/KeyboardContainer";
import AppDetails from "@/shared/components/AppDetails";
import { ServiceFormData } from "./service.scheme";
import { Ionicons } from "@expo/vector-icons";

import { useRouter } from "expo-router";

export function ServiceView({
  control,
  onSubmit,
  isEditMode,
  serviceContent,
  serviceId,
  handleSelectAvatar,
  isUploadingAvatar,
  avatarUri,
  availableInApp,
  setAvailableInApp,
  handleToggleAvailableInApp,
  priceStartingFrom,
  setPriceStartingFrom,
  handleTogglePriceStartingFrom,
  requiresDeposit,
  setRequiresDeposit,
  handleToggleRequiresDeposit,
  depositType,
  setDepositType,
  isLoading,
  onServiceDelete,
  serviceRefetch,
  isStripeModalVisible,
  setIsStripeModalVisible,
}: ReturnType<typeof useServiceViewModel>) {
  const router = useRouter();

  return (
    <>
      <KeyboardContainer>
        <View className="flex-1 bg-background-primary">
          <AppDetails<ServiceFormData>
            control={control}
            isLoading={isLoading}
            onSubmit={onSubmit}
            serviceContent={serviceContent}
            imageSelect={handleSelectAvatar}
            isUploadingAvatar={isUploadingAvatar}
            avatarUri={avatarUri}
            isEditMode={isEditMode}
            id={serviceId}
            dontShowImageSelect={false}
            title="serviço"
            setAvailableInApp={setAvailableInApp}
            availableInApp={availableInApp}
            handleToggleAvailableInApp={handleToggleAvailableInApp}
            priceStartingFrom={priceStartingFrom}
            setPriceStartingFrom={setPriceStartingFrom}
            handleTogglePriceStartingFrom={handleTogglePriceStartingFrom}
            requiresDeposit={requiresDeposit}
            handleToggleRequiresDeposit={handleToggleRequiresDeposit}
            depositType={depositType}
            setDepositType={setDepositType}
            noShowApplyToAll={serviceContent?.noShowApplyToAll}
            noShowClientCount={serviceContent?.noShowClientIds?.length}
            onManageNoShowClients={() => {
              if (serviceId) {
                router.push({
                  pathname: "/(private)/(crud)/services/service-noshow-clients" as any,
                  params: { serviceId: String(serviceId) },
                });
              }
            }}
            fields={[
              {
                name: "name",
                label: "Nome do Serviço",
                leftIcon: "person",
                placeholder: "Digite o nome",
              },
              {
                name: "description",
                label: "Descrição",
                leftIcon: "reader",
                placeholder: "Descrição",
              },
              {
                name: "duration",
                label: "Duração (min)",
                leftIcon: "time",
                placeholder: "0",
                type: "service",
              },
              {
                name: "price",
                label: "Preço",
                leftIcon: "cash",
                placeholder: "R$ 0,00",
              },
              ...(requiresDeposit
                ? [
                    {
                      name: "depositAmount" as const,
                      label:
                        depositType === "PERCENTAGE"
                          ? "Valor do Sinal (%)"
                          : "Valor do Sinal (R$)",
                      leftIcon: "cash" as const,
                      placeholder:
                        depositType === "PERCENTAGE" ? "Ex: 20" : "R$ 0,00",
                    },
                  ]
                : []),
              {
                name: "priceDescription",
                label: "Descrição do preço (opcional)",
                leftIcon: "cash",
                placeholder: "Terça a Quinta é R$ 0,00",
                multiline: true,
                numberOfLines: 4,
              },
              {
                name: "commissionServiceFee",
                label: "% Comissão",
                leftIcon: "cash",
                placeholder: "0,00",
              },
            ]}
            onDelete={onServiceDelete}
          />
        </View>
      </KeyboardContainer>

      {/* Modal de Conexão com o Stripe Connect */}
      <Modal
        animationType="fade"
        transparent
        visible={isStripeModalVisible}
        onRequestClose={() => setIsStripeModalVisible(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center p-5 z-50">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl border border-slate-100">
            {/* Ícone */}
            <View className="w-16 h-16 rounded-full bg-[#FAF8EF] border border-[#CBA35D]/40 justify-center items-center mb-4">
              <Ionicons name="card-outline" size={32} color="#092D5D" />
            </View>

            {/* Título */}
            <Text className="text-[#092D5D] text-lg font-black text-center mb-2">
              Conectar Conta Stripe
            </Text>

            {/* Texto Explicativo */}
            <Text className="text-slate-600 text-xs text-center leading-5 mb-4 font-medium">
              Para cobrar sinal via PIX/Cartão nos agendamentos, você precisa conectar sua conta do Stripe para receber os valores diretamente em seu banco.
            </Text>

            {/* Passo a Passo */}
            <View className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 w-full mb-5 gap-1.5">
              <Text className="text-[#092D5D] font-extrabold text-[11px] uppercase tracking-wider mb-1">
                Passo a passo no Painel Web:
              </Text>
              <Text className="text-slate-700 text-xs font-medium">
                1. Acesse <Text className="text-[#092D5D] font-extrabold">painel.beautyfi.com.br</Text>
              </Text>
              <Text className="text-slate-700 text-xs font-medium">
                2. Entre em <Text className="text-[#092D5D] font-extrabold">Assinaturas</Text> ➔ <Text className="text-[#092D5D] font-extrabold">Conectar conta Stripe</Text>
              </Text>
              <Text className="text-slate-700 text-xs font-medium">
                3. Siga com as orientações até concluir.
              </Text>
            </View>

            {/* Botões de Ação */}
            <TouchableOpacity
              onPress={() => {
                setIsStripeModalVisible(false);
                Linking.openURL("https://painel.beautyfi.com.br").catch(() => {});
              }}
              activeOpacity={0.85}
              className="w-full bg-[#092D5D] py-3.5 rounded-xl items-center mb-2.5 shadow-sm"
            >
              <Text className="text-white font-extrabold text-xs uppercase tracking-wide">
                Ir para o Painel Web
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setIsStripeModalVisible(false)}
              activeOpacity={0.7}
              className="py-2"
            >
              <Text className="text-slate-400 font-bold text-xs">
                Entendi / Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

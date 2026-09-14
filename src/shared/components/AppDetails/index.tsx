import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { AppInputController } from "../AppInputControler";

import { AppAdminHeader } from "../AppAdminHeader";
import { AppButton } from "../AppButton";
import { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import { DeleteModal } from "../AppDeleteModal";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { UserProps } from "@/shared/interfaces/user";
import { useMask } from "@/shared/hooks/useMask";
import { CompanyServicesInterface } from "@/shared/interfaces/http/company-services";
import { AppAvatar } from "../AppAvatar";
import { ProductInterface } from "@/shared/interfaces/http/product";
import { EmployeeInterface } from "@/shared/interfaces/http/employee";
import { ClientInterface } from "@/shared/interfaces/http/client";
import { AdvertisementInterface } from "@/shared/interfaces/http/advertisement";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { usePlanStore } from "@/shared/store/plan-store";
import { AppToggle } from "../AppToggle";
import { ClientLoyaltyModal } from "@/viewModel/Admin/Clients/ClientLoyaltyModal";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { useCompanyStore } from "@/shared/store/company-store";
import { useUserStore } from "@/shared/store/user-store";
import { useLoyaltyMutation } from "@/shared/queries/company/use-loyalty.mutation";
import { StripePlanDTO } from "@/shared/interfaces/http/stripe";

interface AppDetailsItemBase {
  title: string;
  description?: string;
  imgUrl?: string;
  price?: number;
  id?: number;
  amount?: number;
  cutsAllowed?: number;
  phone?: string;
  url?: string;
  duration?: number;
}

interface AppDetailsField<T extends FieldValues> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  type?:
    | "text"
    | "time"
    | "employee"
    | "date"
    | "url"
    | "client"
    | "service"
    | "product"
    | "subscription-details";
  multiline?: boolean;
  numberOfLines?: number;
  errors?: FieldErrors<{
    url?: string | undefined;
    title?: string | undefined;
    description?: string | undefined;
    imgUrl: string;
  }>;
}

interface AppDetailsProps<T extends FieldValues> {
  control: Control<T>;
  fields: AppDetailsField<T>[]; // array de campos a renderizar
  onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
  routeIconRight?: string;
  isEditMode?: boolean;
  id: number | undefined;
  isLoading: boolean;
  onDelete?: (id: number) => Promise<void>;
  title?: string;
  titleMessage?: string;
  message?: string;
  avatarUri?: string | null;
  serviceContent?: CompanyServicesInterface;
  advertisementContent?: AdvertisementInterface;
  employeeContent?: EmployeeInterface;
  productContent?: ProductInterface;
  clientContent?: ClientInterface;
  stripePlanContent?: StripePlanDTO;
  userData?: UserProps | null | undefined;
  imageSelect?: () => Promise<void>;
  isUploadingAvatar?: boolean;
  dontShowImageSelect?: boolean;
  availableInApp?: boolean;
  setAvailableInApp?: Dispatch<SetStateAction<boolean>>;
  handleToggleAvailableInApp?: () => void;

  priceStartingFrom?: boolean;
  setPriceStartingFrom?: Dispatch<SetStateAction<boolean>>;
  handleTogglePriceStartingFrom?: () => void;

  clientAllowWhatsAppNotification?: boolean;
  setClientAllowWhatsAppNotification?: Dispatch<SetStateAction<boolean>>;
  handleToggleAllowWhatAppMessage?: () => void;

  clientLoyaltyPointsData?: any;

  requiresDeposit?: boolean;
  handleToggleRequiresDeposit?: () => void;
  depositType?: "PERCENTAGE" | "FIXED";
  setDepositType?: Dispatch<SetStateAction<"PERCENTAGE" | "FIXED">>;

  onManageNoShowClients?: () => void;
  noShowApplyToAll?: boolean;
  noShowClientCount?: number;
}

export default function AppDetails<T extends FieldValues>({
  control,
  fields,
  isLoading,
  onSubmit,
  isEditMode,
  id,
  title,
  message,
  titleMessage,
  userData,
  avatarUri,
  imageSelect,
  employeeContent,
  advertisementContent,
  serviceContent,
  clientContent,
  productContent,
  stripePlanContent,
  isUploadingAvatar,
  dontShowImageSelect,
  onDelete,
  handleToggleAvailableInApp,
  availableInApp,
  setAvailableInApp, 
  priceStartingFrom,
  setPriceStartingFrom,
  handleTogglePriceStartingFrom,
  clientAllowWhatsAppNotification,
  setClientAllowWhatsAppNotification,
  handleToggleAllowWhatAppMessage,
  clientLoyaltyPointsData,
  requiresDeposit,
  handleToggleRequiresDeposit,
  depositType,
  setDepositType,
  onManageNoShowClients,
  noShowApplyToAll,
  noShowClientCount,
}: AppDetailsProps<T>) {
  const [modalVisible, setModalVisible] = useState(false);
  const setPlanId = usePlanStore((state) => state.setPlanId);
  function showModal() {
    setModalVisible(true);
  }

  function hideModal() {
    setModalVisible(false);
  }

  function resolveAvatarUri() {
    // imagem local primeiro
    if (typeof avatarUri === "string") return avatarUri; // depende do que está sendo editado
    if (productContent?.imgUrl) return productContent.imgUrl;
    if (serviceContent?.imgUrl) return serviceContent.imgUrl;
    if (advertisementContent?.imgUrl) return advertisementContent.imgUrl;
    if (clientContent?.profileUrl) return clientContent.profileUrl;
    if (employeeContent?.avatarUrl) return employeeContent.avatarUrl;
    if (userData?.avatarUrl) return userData.avatarUrl;

    return null;
  }

  // Filtrando os campos de tipo "time"
  const employeeFields = fields.filter((field) => field.type === "employee");
  const serviceFields = fields.filter((field) => field.type === "service");
  const availability = fields.filter(
    (field) => field.type === "service" || field.type === "product",
  );

  const clientFields = fields.filter((field) => field.type === "client");

  const subscriptionDetailsFields = fields.filter(
    (field) => field.type === "subscription-details",
  );

  const { safePush } = useSafeNavigation();
  const { openBottomSheet, closeBottomSheet } = useBottomSheetContext();
  const selectedCompanyId = useCompanyStore((s) => s.selectedCompanyId);
  const userCompanyId = useUserStore((s) => s.user?.companyId);
  const companyIdNum = Number(selectedCompanyId || userCompanyId || 0);
  const { useGetActiveProgramQuery } = useLoyaltyMutation();
  const { data: loyaltyProgramData } = useGetActiveProgramQuery(companyIdNum > 0 ? companyIdNum : undefined);

  const { maskDate, maskPhone, maskMoneyBR } = useMask();

  useEffect(() => {
    console.log("🖼 avatarUri ATUALIZADO no AppDetails:", avatarUri);
  }, [avatarUri]);

  function getTransformByField(name: string) {
    switch (name) {
      case "birthDate":
        return maskDate;

      case "phone":
        return maskPhone;
      case "price":
        return maskMoneyBR;
      case "commission":
        return maskMoneyBR;
      case "amount":
        return maskMoneyBR;
      case "depositAmount":
        return depositType === "PERCENTAGE" ? (text: string) => text.replace(/[^\d]/g, "") : maskMoneyBR;
      case "cutsAllowed":
        return (text: string) => text.replace(/[^\d]/g, "");
      case "quantity":
        return (text: string) => text.replace(/[^\d]/g, "");
      default:
        return undefined;
    }
  }

  return (
    <ScrollView className="px-5 " contentContainerStyle={{ flexGrow: 1 }}>
      <AppAdminHeader
        title={
          isEditMode
            ? `Editar ${title}`
            : title
              ? `Novo ${title}`
              : `${titleMessage}`
        }
        iconRightName={isEditMode ? "trash" : undefined}
        iconRight={{
          icon: true,
          path: "",
        }}
        action={showModal}
      />
      <View className=" px-5 mt-5 justify-center">
        {!dontShowImageSelect && (
          <AppAvatar
            uri={resolveAvatarUri()}
            variant={userData ? "user" : "default"}
            onPress={imageSelect}
            loading={isUploadingAvatar}
          />
        )}
        {fields.map((field) => (
          <AppInputController
            transform={getTransformByField(field.name as string)}
            key={field.name as string}
            control={control}
            name={field.name}
            leftIcon={field.leftIcon}
            label={field.label}
            placeholder={field.placeholder}
            placeholderTextColor={colors.gray[600]}
            secureTextEntry={field.name === "password"}
            formCrud
            multiline={field.multiline} // ✅ pega do field
            numberOfLines={field.numberOfLines} // ✅ pega do field
          />
        ))}

        {employeeFields.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => safePush("/(private)/(crud)/employees/working-days")}
            className="w-full bg-background-tertiary justify-center rounded-md  h-[40px] mb-5 "
          >
            <Text className="text-font-primary text-center">
              Definir dias de trabalho
            </Text>
          </TouchableOpacity>
        )}

        {employeeFields.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              safePush("/(private)/(crud)/employees/employee-services")
            }
            className="w-full bg-background-tertiary justify-center rounded-md  h-[40px] mb-5 "
          >
            <Text className="text-font-primary text-center">
              Associar serviços
            </Text>
          </TouchableOpacity>
        )}

        {serviceFields.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              safePush("/(private)/(crud)/services/service-employees")
            }
            className="w-full bg-background-tertiary justify-center rounded-md  h-[40px] mb-5 "
          >
            <Text className="text-font-primary text-center">
              Associar funcionários
            </Text>
          </TouchableOpacity>
        )}

        {subscriptionDetailsFields.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              setPlanId(Number(stripePlanContent?.id));
              safePush(
                `/(private)/(crud)/subscriptions/subscription-plan-items/${stripePlanContent?.id}`,
              );
            }}
            className="w-full bg-background-tertiary justify-center rounded-md  h-[40px] mb-5 "
          >
            <Text className="text-font-primary text-center">
              Associar Itens do Plano
            </Text>
          </TouchableOpacity>
        )}

        {subscriptionDetailsFields.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              safePush(
                "/(private)/(crud)/subscriptions/subscription-plan-employees",
              )
            }
            className="w-full bg-background-tertiary justify-center rounded-md  h-[40px] mb-5 "
          >
            <Text className="text-font-primary text-center">
              Associar Profissionais
            </Text>
          </TouchableOpacity>
        )}

        {availability.length > 0 && title?.toLowerCase() !== "cliente" && (
          <>
            <AppToggle
              value={availableInApp ?? false}
              onValueChange={() => handleToggleAvailableInApp?.()}
              textTrue="Este item ficará visível na vitrine do app."
              textFalse="Este item ficará oculto na vitrine do app."
              title="Disponível na vitrine"
            />
            <AppToggle
              value={priceStartingFrom ?? false}
              onValueChange={() => handleTogglePriceStartingFrom?.()}
              textTrue="O valor será exibido como 'A partir de R$ ...' na vitrine."
              textFalse="O valor será exibido como preço fixo 'R$ ...'."
              title="Preço 'A partir de'"
            />
          </>
        )}
        {(clientFields.length > 0 || title?.toLowerCase() === "cliente" || !!clientContent) && (
          <View className="mb-6 gap-4">
            {/* Card Último Agendamento */}
            <View className="bg-background-quartenary p-4 rounded-2xl border border-white/5">
              <View className="flex-row items-center gap-2 mb-2">
                <Ionicons name="calendar-outline" size={20} color="#CBA35D" />
                <Text className="text-font-primary text-sm font-bold">
                  Último Agendamento
                </Text>
              </View>
              {clientContent?.lastAppointmentDate ? (
                <View className="bg-background-tertiary p-3 rounded-xl border border-white/5">
                  <Text className="text-accent-gold font-bold text-sm">
                    {clientContent.lastAppointmentService || "Serviço realizado"}
                  </Text>
                  <Text className="text-font-secondary text-xs mt-1">
                    📅 {clientContent.lastAppointmentDate.includes("T") ? clientContent.lastAppointmentDate.split("T")[0].split("-").reverse().join("/") + " às " + clientContent.lastAppointmentDate.split("T")[1].substring(0, 5) : clientContent.lastAppointmentDate}
                  </Text>
                </View>
              ) : (
                <View className="bg-background-tertiary p-3 rounded-xl border border-white/5 items-center">
                  <Text className="text-font-secondary text-xs italic">
                    Sem agendamento registrado
                  </Text>
                </View>
              )}
            </View>

            {/* Card Programa de Fidelidade */}
            <View className="bg-background-quartenary p-4 rounded-2xl border border-white/5 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-[#CBA35D]/20 items-center justify-center border border-[#CBA35D]/40">
                  <Ionicons name="trophy" size={20} color="#CBA35D" />
                </View>
                <View>
                  <Text className="text-font-primary text-sm font-bold">
                    Programa de Fidelidade
                  </Text>
                  <Text className="text-font-secondary text-xs">
                    Pontos acumulados pelo cliente
                  </Text>
                </View>
              </View>
              <View className="px-3 py-1.5 rounded-xl bg-[#CBA35D]/20 border border-[#CBA35D]/40">
                <Text className="text-[#CBA35D] font-black text-sm">
                  {clientLoyaltyPointsData?.pointsBalance ?? clientContent?.loyaltyPoints ?? 0} pts
                </Text>
              </View>
            </View>

            {/* Card Ficha de Anamnese */}
            {isEditMode && id && (
              <TouchableOpacity
                onPress={() => safePush(`/(private)/(crud)/clients/anamnesis/${id}`)}
                activeOpacity={0.8}
                className="bg-background-quartenary p-4 rounded-2xl border border-white/5 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-purple-500/20 items-center justify-center border border-purple-500/40">
                    <Ionicons name="clipboard" size={20} color="#a855f7" />
                  </View>
                  <View>
                    <Text className="text-font-primary text-sm font-bold">
                      Ficha de Anamnese
                    </Text>
                    <Text className="text-font-secondary text-xs">
                      {clientContent?.anamnesis?.allergies || clientContent?.anamnesis?.skinHairType || clientContent?.anamnesis?.observations
                        ? "Ver e editar histórico de saúde / alergias"
                        : "Clique para preencher a anamnese do cliente"}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CBA35D" />
              </TouchableOpacity>
            )}

            {/* Card Gerenciar Cartão Fidelidade (Carimbos) */}
            {isEditMode && id && (
              <TouchableOpacity
                onPress={() => {
                  openBottomSheet(
                    <ClientLoyaltyModal
                      clientId={Number(id)}
                      clientName={clientContent?.name || "Cliente"}
                      companyId={Number(selectedCompanyId || userCompanyId || 0)}
                      currentStamps={clientLoyaltyPointsData?.stampsBalance ?? 0}
                      stampRequiredCount={loyaltyProgramData?.stampRequiredCount ?? 4}
                      stampServiceName={loyaltyProgramData?.stampServiceName ?? "Serviço Especial"}
                      onClose={closeBottomSheet}
                    />,
                    0
                  );
                }}
                activeOpacity={0.8}
                className="bg-background-quartenary p-4 rounded-2xl border border-white/5 flex-row items-center justify-between"
              >
                <View className="flex-row items-center gap-3">
                  <View className="w-10 h-10 rounded-full bg-[#CBA35D]/20 items-center justify-center border border-[#CBA35D]/40">
                    <Ionicons name="ribbon" size={20} color="#CBA35D" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-font-primary text-sm font-bold">
                      Cartão Fidelidade
                    </Text>
                    <Text className="text-font-secondary text-xs">
                      {clientLoyaltyPointsData?.stampsBalance ?? 0} de {loyaltyProgramData?.stampRequiredCount ?? 4} carimbos acumulados
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CBA35D" />
              </TouchableOpacity>
            )}

            <AppToggle
              value={clientAllowWhatsAppNotification ?? false}
              onValueChange={() => handleToggleAllowWhatAppMessage?.()}
              textTrue="O cliente receberá notificações via WhatsApp (Aceitou receber)."
              textFalse="O cliente não receberá notificações via WhatsApp."
              title="Permitir Notificações via WhatsApp"
            />
          </View>
        )}

        {requiresDeposit !== undefined && (
          <View className="mb-4">
            <AppToggle
              value={requiresDeposit ?? false}
              onValueChange={() => handleToggleRequiresDeposit?.()}
              textTrue="O cliente pagará o sinal via PIX para garantir o agendamento."
              textFalse="Sem exigência de pagamento prévio de sinal."
              title="Cobrar Sinal (Prevenção de No-Show)"
            />

            {requiresDeposit && (
              <View className="bg-background-tertiary p-4 rounded-xl mb-4 gap-3 border border-white/10">
                <Text className="text-font-primary text-xs font-bold uppercase tracking-wider">
                  Tipo do Valor do Sinal
                </Text>

                <View className="flex-row bg-background-primary rounded-xl p-1 gap-2 border border-white/10">
                  <TouchableOpacity
                    onPress={() => setDepositType?.("FIXED")}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: "center",
                      backgroundColor: depositType === "FIXED" ? "#CBA35D" : "#27272A",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: depositType === "FIXED" ? "#FFFFFF" : "#A1A1AA",
                      }}
                    >
                      R$ Valor Fixo
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setDepositType?.("PERCENTAGE")}
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      borderRadius: 10,
                      alignItems: "center",
                      backgroundColor: depositType === "PERCENTAGE" ? "#CBA35D" : "#27272A",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "700",
                        color: depositType === "PERCENTAGE" ? "#FFFFFF" : "#A1A1AA",
                      }}
                    >
                      % Porcentagem
                    </Text>
                  </TouchableOpacity>
                </View>

                <View className="flex-row items-center gap-2 bg-amber-500/10 p-3 rounded-lg border border-amber-500/20 mt-1">
                  <Text className="text-amber-400 text-xs flex-1 leading-4">
                    💡 <Text className="font-bold">Prevenção de No-Show:</Text> O sinal será cobrado via PIX no checkout da reserva. Em caso de falta (não comparecimento), o valor do sinal cobrado cobre os custos do profissional.
                  </Text>
                </View>

                {isEditMode && id && onManageNoShowClients && (
                  <TouchableOpacity
                    onPress={onManageNoShowClients}
                    activeOpacity={0.85}
                    className="bg-background-tertiary border border-gray-600 rounded-lg p-3.5 flex-row items-center justify-between mt-3"
                  >
                    <View className="flex-row items-center gap-3 flex-1 pr-2">
                      <View className="w-9 h-9 rounded-full bg-app-theme-primary/10 justify-center items-center">
                        <Ionicons name="people-outline" size={20} color={colors.white} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-font-primary font-bold text-xs">
                          Clientes para Sinal / No-Show
                        </Text>
                        <Text className="text-font-secondary text-[11px] mt-0.5" numberOfLines={1}>
                          {noShowApplyToAll !== false
                            ? "Aplica para TODOS os clientes (Padrão)"
                            : `Aplica apenas para ${noShowClientCount || 0} cliente(s) selecionado(s)`}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={colors.gray[400]} />
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}

        <AppButton
          className=""
          rightIcon="arrow-forward"
          variant="field"
          onPress={onSubmit}
          isLoading={isLoading}
        >
          {isEditMode
            ? "Salvar alterações"
            : title
              ? `Criar ${title}`
              : `${message}`}
        </AppButton>

        <DeleteModal
          loading={isLoading}
          visible={modalVisible}
          hideModal={hideModal}
          handleDelete={() => {
            if (onDelete) {
              onDelete(Number(id));
            } else {
              console.error("onDelete function is undefined");
            }
          }}
          description="Tem certeza que deseja deletar esse item?"
          title="Deletar o item?"
          confirmationButtonText="Apagar"
        />
      </View>
    </ScrollView>
  );
}

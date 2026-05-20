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
import { StripePlanDTO } from "@/shared/interfaces/http/stripe";
import { usePlanStore } from "@/shared/store/plan-store";

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

  const subscriptionDetailsFields = fields.filter(
    (field) => field.type === "subscription-details",
  );

  const { safePush } = useSafeNavigation();

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
            <Text className="text-font-primary text-center">Associar serviços</Text>
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

        {availability.length > 0  &&  (
          <View className="mb-5 rounded-2xl border border-zinc-800 bg-background-tertiary p-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-1 pr-3">
                <Text
                  className={`text-base font-semibold ${availableInApp ? "text-app-theme-primary" : "text-font-primary"}`}
                >
                  Disponível na vitrine
                </Text>
                <Text className="mt-1 text-sm text-gray-500">
                  {availableInApp
                    ? "Este item ficará visível na vitrine do app."
                    : "Este item ficará oculto na vitrine do app."}
                </Text>
              </View>
              <Switch
                value={availableInApp ?? false}
                onValueChange={() => handleToggleAvailableInApp?.()} // ✅ optional chaining
                thumbColor={
                  availableInApp ? colors["app-theme-primary"] : colors.white
                }
                trackColor={{
                  false: colors.gray[800],
                  true: colors["app-theme-primary-light"],
                }}
                ios_backgroundColor={colors.gray[800]}
              />
            </View>
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

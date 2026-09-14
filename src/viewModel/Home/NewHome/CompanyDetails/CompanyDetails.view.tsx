import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import {
  CompanyDetailTab,
  useCompanyDetailsViewModel,
} from "./useCompanyDetailsViewModel";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/styles/colors";
import { CompanyDetails } from "@/shared/components/CompanyTabs/CompanyDetails";
import { CompanyServices } from "@/shared/components/BusinessTabs/CompanyServices";
import { CompanyProduct } from "@/shared/components/BusinessTabs/CompanyProduct";
import { AppSearchBar } from "@/shared/components/AppSearchBar";

const { width: screenWidth } = Dimensions.get("window");

const defaultCarouselImages = [
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
];

// Helper seguro para tratar URLs de imagens (seja String, Array ou JSON String) sem crashar
const parseImageUrls = (raw: any): string[] => {
  if (!raw) return [];
  let list: string[] = [];
  if (Array.isArray(raw)) {
    list = raw.map((item) => String(item || ""));
  } else if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        list = parsed.map((item) => String(item || ""));
      } else {
        list = raw.split(",");
      }
    } catch {
      list = raw.split(",");
    }
  }
  return list
    .map((url) => url.replace(/[\[\]"']/g, "").trim())
    .filter(
      (url) =>
        url.length > 5 &&
        (url.startsWith("http://") ||
          url.startsWith("https://") ||
          url.startsWith("file://") ||
          url.startsWith("data:")),
    );
};

export function CompanyDetailsView(
  props: ReturnType<typeof useCompanyDetailsViewModel>,
) {
  const {
    companyDetailsData,
    companyDetailsLoading,
    companyDetailsError,
    isFavorite,
    handleToggleFavorite,
    handleGoBack,
    activeTab,
    setActiveTab,
    selectedServices,
    setSelectedServices,
    servicesList,
    productsList,
    packagesList,
    subscriptionPlans,
    handleBookSelectedServices,
    handleBookPackage,
    handleGoToSubscriptionTab,
  } = props;

  // ─── HOOKS (DEVE SER DECLARADO NO TOPO DO COMPONENTE ANTES DE QUALQUER RETURN CONDICIONAL) ───
  const insets = useSafeAreaInsets();
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const tabFlatListRef = React.useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      props.companyDetailsRefetch?.();
    }, [props.companyDetailsRefetch])
  );

  // Calcula quais abas possuem conteúdo ativo para exibição (com verificações seguras de nulo)
  const hasProducts = (productsList ?? []).length > 0;
  const hasPackages = (packagesList ?? []).length > 0;
  const isLoyaltyActive = Boolean(
    props.loyaltyProgramData?.active !== undefined
      ? props.loyaltyProgramData.active
      : companyDetailsData?.loyaltyActive
  );
  const isStampActive = Boolean(props.loyaltyProgramData?.stampActive);

  const isLoyaltyConfigured = Boolean(isLoyaltyActive || isStampActive);
  const hasSubscriptions = (subscriptionPlans ?? []).length > 0;

  const tabs: CompanyDetailTab[] = [
    "Serviços",
    ...(hasProducts ? ["Produtos" as CompanyDetailTab] : []),
    ...(hasPackages ? ["Pacotes" as CompanyDetailTab] : []),
    ...(isLoyaltyConfigured ? ["Fidelidade" as CompanyDetailTab] : []),
    "Detalhes",
    "Avaliações",
    ...(hasSubscriptions ? ["Assinaturas" as CompanyDetailTab] : []),
  ];

  React.useEffect(() => {
    if (!tabs.includes(activeTab)) {
      setActiveTab("Serviços");
    }
  }, [tabs.length, activeTab]);

  // ─── RETORNOS CONDICIONAIS (APÓS TODOS OS HOOKS) ───
  if (companyDetailsLoading && !companyDetailsData) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary justify-center items-center">
        <ActivityIndicator size="large" color="#092D5D" />
      </SafeAreaView>
    );
  }

  if (companyDetailsError || !companyDetailsData) {
    return (
      <SafeAreaView className="flex-1 bg-background-primary justify-center items-center px-6">
        <Text className="text-gray-800 text-center text-base mb-4">
          Erro ao carregar dados do estabelecimento.
        </Text>
        <TouchableOpacity
          onPress={handleGoBack}
          className="bg-[#092D5D] px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Voltar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Parse space images or fallback to default
  const dbSpaceImages = parseImageUrls(companyDetailsData?.imagesUrl);
  const images = dbSpaceImages.length > 0 ? dbSpaceImages : defaultCarouselImages;

  // Parse portfolio images
  const portfolioImages = parseImageUrls(companyDetailsData?.portfolioImagesUrl);

  const allGalleryImages = Array.from(new Set([...images, ...portfolioImages]));

  const openViewerImage = (imgUrl: string) => {
    if (!allGalleryImages || allGalleryImages.length === 0) return;
    const idx = allGalleryImages.findIndex((url) => url === imgUrl);
    setViewerIndex(idx >= 0 && idx < allGalleryImages.length ? idx : 0);
  };

  const handleTabSelect = (tab: CompanyDetailTab, index: number) => {
    setActiveTab(tab);
    try {
      tabFlatListRef.current?.scrollToIndex({
        index,
        animated: true,
        viewPosition: 0.5,
      });
    } catch (e) {
      console.log("Erro ao rolar menu de abas:", e);
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "Fidelidade": {
        const isLoyaltyActive = Boolean(
          props.loyaltyProgramData?.active !== undefined
            ? props.loyaltyProgramData.active
            : companyDetailsData.loyaltyActive
        );
        const isStampActive = Boolean(props.loyaltyProgramData?.stampActive);

        const ptsPerReal = props.loyaltyProgramData?.pointsPerReal ?? companyDetailsData.loyaltyPointsPerReal ?? 1.0;
        const minPts = props.loyaltyProgramData?.minPointsToRedeem ?? companyDetailsData.loyaltyMinPoints;
        const rewardVal = props.loyaltyProgramData?.rewardValue ?? companyDetailsData.loyaltyRewardValue;
        const rewardDesc = props.loyaltyProgramData?.rewardDescription ?? companyDetailsData.loyaltyRewardDescription;
        const ruleDesc = props.loyaltyProgramData?.ruleDescription ?? companyDetailsData.loyaltyRuleDescription ?? "Acumule pontos em todos os seus agendamentos concluídos e troque por descontos e serviços exclusivos!";

        const hasConfiguredReward = Boolean(
          rewardDesc?.trim() || (rewardVal != null && rewardVal > 0) || (minPts != null && minPts > 0) || (props.loyaltyProgramData?.items && props.loyaltyProgramData.items.length > 0)
        );

        const userPts = (props.user as any)?.loyaltyPoints ?? 0;
        const targetMinPts = minPts || 100;
        const progressPercent = Math.min(100, Math.round((userPts / targetMinPts) * 100));

        if (!isLoyaltyActive && !isStampActive) {
          return (
            <View className="px-4 py-12 items-center justify-center bg-white rounded-2xl border border-gray-100 my-4 shadow-sm">
              <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-3">
                <Ionicons name="gift-outline" size={32} color="#9CA3AF" />
              </View>
              <Text className="text-gray-900 font-bold text-base text-center">
                Sem Programa de Fidelidade Ativo
              </Text>
              <Text className="text-gray-500 text-xs text-center mt-1.5 px-6 leading-5">
                Este estabelecimento ainda não possui recompensas ou cartões de fidelidade ativos.
              </Text>
            </View>
          );
        }

        return (
          <View className="px-4 py-3 gap-4">
            {/* 1. SEÇÃO DO CARTÃO FIDELIDADE (CARIMBOS) - EXIBIDA APENAS SE ESTIVER ATIVADO */}
            {isStampActive && (
              <View className="p-5 rounded-2xl bg-white border border-[#CBA35D]/40 shadow-sm">
                <View className="flex-row items-center justify-between border-b border-gray-100 pb-3 mb-3">
                  <View className="flex-row items-center gap-2 flex-1">
                    <View className="w-9 h-9 rounded-full bg-[#CBA35D]/20 items-center justify-center border border-[#CBA35D]/40">
                      <Ionicons name="ribbon" size={18} color="#092D5D" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-gray-900 font-extrabold text-sm">
                        Cartão Fidelidade: {props.loyaltyProgramData?.stampServiceName || "Serviço Especial"}
                      </Text>
                      {props.loyaltyProgramData?.stampStartDate || props.loyaltyProgramData?.stampEndDate ? (
                        <Text className="text-gray-500 text-[11px] font-medium mt-0.5">
                          📅 Validade: {props.loyaltyProgramData?.stampStartDate ? props.loyaltyProgramData.stampStartDate.split("T")[0] : "Início"} até {props.loyaltyProgramData?.stampEndDate ? props.loyaltyProgramData.stampEndDate.split("T")[0] : "Término"}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>

                {/* Visual dos Carimbos */}
                <View className="flex-row items-center justify-around py-3 bg-slate-50 rounded-xl border border-slate-200/60 my-1 px-2">
                  {Array.from({ length: props.loyaltyProgramData?.stampRequiredCount || 4 }).map((_, index) => {
                    const isEarned = index < (props.clientPointsData?.stampsBalance || 0);
                    return (
                      <View key={index} className="items-center gap-1">
                        <View
                          className={`w-10 h-10 rounded-full items-center justify-center shadow-xs border ${
                            isEarned
                              ? "bg-emerald-50 border-emerald-300"
                              : "bg-slate-100 border-slate-200/80"
                          }`}
                        >
                          <Ionicons
                            name={isEarned ? "checkmark-circle" : "ellipse-outline"}
                            size={22}
                            color={isEarned ? "#059669" : "#9CA3AF"}
                          />
                        </View>
                        <Text
                          className={`text-[10px] font-bold ${
                            isEarned ? "text-emerald-700 font-extrabold" : "text-slate-400"
                          }`}
                        >
                          {index + 1}º
                        </Text>
                      </View>
                    );
                  })}
                  <View className="items-center gap-1">
                    <View className="w-11 h-11 rounded-full bg-[#092D5D] border-2 border-[#CBA35D] items-center justify-center shadow-md">
                      <Ionicons name="gift" size={20} color="#CBA35D" />
                    </View>
                    <Text className="text-[10px] font-black text-[#092D5D]">GRÁTIS!</Text>
                  </View>
                </View>

                {/* Recompensa */}
                <Text className="text-[#092D5D] text-xs font-extrabold text-center mt-2.5">
                  🎁 {props.loyaltyProgramData?.stampRewardDescription || `Complete ${props.loyaltyProgramData?.stampRequiredCount || 4} realizações e ganhe a próxima grátis!`}
                </Text>
              </View>
            )}

            {/* 2. SEÇÕES DO PROGRAMA DE PONTOS POR R$ - EXIBIDAS APENAS SE ESTIVER ATIVADO */}
            {isLoyaltyActive && (
              <>
                {/* Card Principal do Clube de Fidelidade em Fundo Branco */}
                <View className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm gap-4">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center gap-3">
                      <View className="w-12 h-12 rounded-2xl bg-[#CBA35D]/15 items-center justify-center border border-[#CBA35D]/30">
                        <Ionicons name="trophy" size={24} color="#CBA35D" />
                      </View>
                      <View>
                        <Text className="text-slate-900 font-extrabold text-base">
                          Clube de Pontos
                        </Text>
                        <Text className="text-slate-500 text-xs font-medium mt-0.5">
                          {companyDetailsData.name}
                        </Text>
                      </View>
                    </View>
                    <View className="px-3 py-1 rounded-full bg-[#092D5D]/10 border border-[#092D5D]/20">
                      <Text className="text-[#092D5D] font-extrabold text-[10px] uppercase tracking-wider">
                        VIP
                      </Text>
                    </View>
                  </View>

                  {/* Card de Pontuação do Usuário se Logado */}
                  {props.user ? (
                    <View className="pt-3 border-t border-slate-100">
                      <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-slate-600 text-xs font-semibold">
                          Seus Pontos Acumulados:
                        </Text>
                        <View className="flex-row items-baseline gap-1">
                          <Text className="text-[#092D5D] font-black text-xl">
                            {userPts}
                          </Text>
                          <Text className="text-[#CBA35D] font-extrabold text-xs">
                            pts
                          </Text>
                        </View>
                      </View>

                      {/* Barra de Progresso em Fundo Claro */}
                      <View className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden mb-1.5 border border-slate-200/60">
                        <View
                          className="h-full bg-gradient-to-r from-[#092D5D] to-[#CBA35D] rounded-full"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </View>
                      <View className="flex-row justify-between items-center">
                        <Text className="text-slate-400 text-[11px] font-medium">0 pts</Text>
                        <Text className="text-[#092D5D] text-[11px] font-extrabold">
                          {progressPercent}% da meta
                        </Text>
                        <Text className="text-slate-400 text-[11px] font-medium">{targetMinPts} pts</Text>
                      </View>
                    </View>
                  ) : (
                    <View className="pt-3 border-t border-slate-100 flex-row items-center gap-2">
                      <Ionicons name="lock-closed-outline" size={16} color="#092D5D" />
                      <Text className="text-slate-600 text-xs flex-1">
                        Faça login para acompanhar seus pontos e resgatar prêmios exclusivos!
                      </Text>
                    </View>
                  )}
                </View>

                {/* Recompensa / Benefício em Destaque (se configurado) */}
                {hasConfiguredReward && (rewardDesc || (rewardVal != null && rewardVal > 0)) ? (
                  <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <View className="flex-row items-center gap-2 mb-2">
                      <Ionicons name="gift" size={20} color="#092D5D" />
                      <Text className="text-gray-900 font-bold text-sm">
                        Benefício / Prêmio em Destaque
                      </Text>
                    </View>

                    <View className="p-4 rounded-xl bg-[#F8FAFC] border border-gray-200/60 flex-row items-center justify-between">
                      <View className="flex-1 pr-3">
                        <Text className="text-[#092D5D] font-black text-base">
                          {rewardDesc || `Benefício de R$ ${rewardVal != null ? Number(rewardVal).toFixed(2).replace(".", ",") : "0,00"}`}
                        </Text>
                        {minPts != null && minPts > 0 ? (
                          <Text className="text-gray-500 text-xs mt-1">
                            Meta: {minPts} pontos acumulados
                          </Text>
                        ) : null}
                      </View>

                      {rewardVal != null && rewardVal > 0 ? (
                        <View className="bg-[#092D5D] px-3 py-2 rounded-xl">
                          <Text className="text-white font-bold text-xs">
                            R$ {Number(rewardVal).toFixed(2).replace(".", ",")} OFF
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                ) : null}

                {/* Como Funciona / Regras do Programa de Pontos */}
                <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <View className="flex-row items-center gap-2 mb-3">
                    <Ionicons name="information-circle-outline" size={20} color="#092D5D" />
                    <Text className="text-gray-900 font-bold text-sm">
                      Como Funciona o Programa de Pontos
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-xs leading-5">
                    {ruleDesc}
                  </Text>

                  <View className="mt-4 pt-3 border-t border-gray-100 flex-row items-center gap-3">
                    <View className="w-8 h-8 rounded-full bg-[#092D5D]/10 items-center justify-center">
                      <Ionicons name="sparkles" size={16} color="#092D5D" />
                    </View>
                    <Text className="text-gray-700 text-xs font-semibold flex-1">
                      Ganhe {ptsPerReal} ponto(s) a cada R$ 1,00 gasto ao concluir um agendamento!
                    </Text>
                  </View>
                </View>

                {/* Lista de Itens de Recompensa (Serviços e Produtos) */}
                <View className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
                  <Text className="text-gray-900 font-bold text-sm mb-3">
                    Itens e Prêmios Resgatáveis (Serviços & Produtos)
                  </Text>
                  {props.loyaltyProgramData?.items && props.loyaltyProgramData.items.length > 0 ? (
                    <View className="gap-2.5">
                      {props.loyaltyProgramData.items.map((item: any) => (
                        <View
                          key={item.id}
                          className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/60 flex-row items-center justify-between"
                        >
                          <View className="flex-1 mr-2">
                            <View className="flex-row items-center gap-1.5 mb-1">
                              <View className="px-2 py-0.5 rounded-md bg-[#092D5D]/10">
                                <Text className="text-[#092D5D] font-bold text-[10px] uppercase">
                                  {item.itemType === "SERVICE" ? "Serviço" : item.itemType === "PRODUCT" ? "Produto" : "Prêmio"}
                                </Text>
                              </View>
                              {item.servicePrice ? (
                                <Text className="text-gray-500 text-xs font-semibold">
                                  R$ {Number(item.servicePrice).toFixed(2).replace(".", ",")}
                                </Text>
                              ) : item.productPrice ? (
                                <Text className="text-gray-500 text-xs font-semibold">
                                  R$ {Number(item.productPrice).toFixed(2).replace(".", ",")}
                                </Text>
                              ) : null}
                            </View>
                            <Text className="text-gray-900 font-bold text-xs">
                              {item.title}
                            </Text>
                            {item.description ? (
                              <Text className="text-gray-500 text-[11px] mt-0.5">
                                {item.description}
                              </Text>
                            ) : null}
                          </View>

                          <View className="px-3 py-1.5 rounded-xl bg-[#CBA35D]/15 border border-[#CBA35D]/40 items-center">
                            <Text className="text-[#CBA35D] font-black text-xs">
                              {item.pointsRequired} pts
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text className="text-gray-500 text-xs italic text-center py-2">
                      Consulte os prêmios e condições diretamente no salão.
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
        );
      }
      case "Serviços":
        return (
          <View className="flex-1 min-h-[300px]">
            <View className="px-4 mb-4">
              <AppSearchBar
                value={props.searchValue}
                onChangeText={props.setSearchValue}
                placeholder="Buscar serviços por nome..."
              />
            </View>

            {servicesList.length > 0 ? (
              <CompanyServices
                data={servicesList}
                isRefreshing={false}
                onRefresh={props.serviceRefetch}
                fetchNextPage={props.serviceFetchNextPage}
                hasNextPage={props.serviceHasNextPage}
                isFetchingNextPage={props.serviceIsFetchingNextPage}
                isLoading={props.serviceIsLoading}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
              />
            ) : (
              <Text className="text-center text-gray-600 my-8">
                Nenhum serviço disponível.
              </Text>
            )}
          </View>
        );
      case "Produtos":
        return (
          <View className="flex-1 min-h-[300px]">
            <View className="px-4 mb-4">
              <AppSearchBar
                value={props.searchValue}
                onChangeText={props.setSearchValue}
                placeholder="Buscar produtos por nome..."
              />
            </View>
            {productsList.length > 0 ? (
              <CompanyProduct
                data={productsList}
                isRefreshing={props.isProductRefetching}
                onRefresh={props.refetchProduct}
                fetchNextPage={props.productFetchNextPage}
                hasNextPage={props.productHasNextPage}
                isFetchingNextPage={props.productIsFetchingNextPage}
                isLoading={props.productIsLoading}
              />
            ) : (
              <Text className="text-center text-gray-600 my-8">
                Nenhum produto disponível.
              </Text>
            )}
          </View>
        );
      case "Detalhes":
        return (
          <CompanyDetails
            data={[companyDetailsData]}
            employees={props.employeesList}
            reviews={[]}
          />
        );
      case "Avaliações":
        return (
          <View className="px-1 py-3">
            <View className="flex-row justify-between items-center mb-6 border-b border-gray-100 pb-3">
              <Text className="text-gray-900 font-bold text-base">
                Avaliações dos Clientes
              </Text>
              {companyDetailsData.rating !== undefined && (
                <View className="flex-row items-center bg-[#fbbf24]/10 px-3 py-1.5 rounded-full">
                  <Ionicons name="star" size={16} color="#fbbf24" />

                  <Text className="text-gray-900 font-bold text-sm ml-1">
                    {(companyDetailsData.rating ?? 0).toFixed(1)}
                  </Text>
                  <Text className="text-gray-600 text-xs ml-1">
                    ({companyDetailsData.reviewsCount ?? 0})
                  </Text>
                </View>
              )}
            </View>

            {/* Form to leave a review (if logged in as client) */}
            {props.user && !props.isAdmin && (
              <View className="bg-white p-4 rounded-2xl border border-gray-100 mb-6 shadow-sm">
                <Text className="text-gray-900 font-bold text-sm mb-2">
                  {props.editingReview ? "Editar Avaliação" : "Deixe sua Avaliação"}
                </Text>

                {/* Star Selector */}
                <View className="flex-row gap-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => props.setNewRating(star)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={star <= props.newRating ? "star" : "star-outline"}
                        size={28}
                        color="#fbbf24"
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <TextInput
                  placeholder="Escreva seu comentário aqui..."
                  placeholderTextColor={colors["app-theme-primary"]}
                  value={props.newComment}
                  onChangeText={props.setNewComment}
                  multiline
                  numberOfLines={3}
                  className="bg-gray-50 text-gray-900 text-sm p-4 rounded-xl border border-gray-200 min-h-[80px] text-left"
                  style={{ textAlignVertical: "top" }}
                />

                <View className="flex-row gap-3 mt-4">
                  {props.editingReview && (
                    <TouchableOpacity
                      onPress={props.handleCancelEdit}
                      activeOpacity={0.8}
                      className="flex-1 bg-gray-200 py-3.5 rounded-xl items-center"
                    >
                      <Text className="text-gray-700 text-sm font-bold">
                        Cancelar
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={props.handleSubmitReview}
                    disabled={props.isSubmittingReview}
                    activeOpacity={0.8}
                    className="flex-1 bg-[#092D5D] py-3.5 rounded-xl items-center"
                  >
                    <Text className="text-white text-sm font-bold">
                      {props.isSubmittingReview
                        ? "Enviando..."
                        : props.editingReview
                          ? "Atualizar Avaliação"
                          : "Enviar Avaliação"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Reviews List */}
            {props.reviewsList && props.reviewsList.length > 0 ? (
              <View className="gap-4">
                {props.reviewsList.map((rev) => (
                  <View
                    key={rev.id}
                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-row items-center">
                        {rev.userAvatarUrl ? (
                          <Image
                            source={{ uri: rev.userAvatarUrl }}
                            className="w-[40px] h-[40px] rounded-full"
                          />
                        ) : (
                          <View className="w-[40px] h-[40px] rounded-full bg-gray-100 justify-center items-center border border-gray-200">
                            <Ionicons name="person" size={14} color="#6b7280" />
                          </View>
                        )}
                        <Text className="text-gray-900 font-bold text-sm ml-2">
                          {rev.userFirstName}
                        </Text>
                      </View>

                      <View className="flex-row gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Ionicons
                            key={star}
                            name={star <= rev.rating ? "star" : "star-outline"}
                            size={12}
                            color="#fbbf24"
                          />
                        ))}
                      </View>
                    </View>
                    <Text className="text-gray-400 text-[10px] mb-2">
                      {new Date(rev.createdAt).toLocaleDateString("pt-BR")}
                    </Text>
                    {rev.comment ? (
                      <Text className="text-gray-700 text-sm leading-relaxed">
                        {rev.comment}
                      </Text>
                    ) : null}

                    {props.user && props.user.id === rev.userId && (
                      <View className="flex-row justify-end gap-4 mt-3 pt-3 border-t border-gray-100">
                        <TouchableOpacity
                          onPress={() => props.handleEditReview(rev)}
                          activeOpacity={0.7}
                          className="flex-row items-center"
                        >
                          <Ionicons name="create-outline" size={16} color="#4b5563" />
                          <Text className="text-gray-600 text-xs font-semibold ml-1">
                            Editar
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => props.handleDeleteReview(rev.id)}
                          activeOpacity={0.7}
                          className="flex-row items-center"
                        >
                          <Ionicons name="trash-outline" size={16} color="#ef4444" />
                          <Text className="text-red-500 text-xs font-semibold ml-1">
                            Excluir
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-center text-gray-600 my-8">
                Nenhuma avaliação ainda.
              </Text>
            )}
          </View>
        );
      case "Assinaturas":
        return (
          <View className="px-1 py-3">
            <Text className="text-gray-900 font-bold text-base mb-4">
              Planos de Assinatura Disponíveis
            </Text>
            {subscriptionPlans.length > 0 ? (
              subscriptionPlans.map((plan) => (
                <View
                  key={plan.id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 mb-4 shadow-sm"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-gray-900 font-bold text-base flex-1 mr-2">
                      {plan.name}
                    </Text>
                    {plan.userSubscriptions &&
                      plan.userSubscriptions.length > 0 && (
                        <View className="bg-green-50 px-2 py-1 rounded">
                          <Text className="text-green-700 font-bold text-xs">
                            Ativo
                          </Text>
                        </View>
                      )}
                  </View>
                  <Text className="text-gray-600 text-sm leading-relaxed mb-4">
                    {plan.description}
                  </Text>
                  <View className="flex-row justify-between items-center pt-3 border-t border-gray-50">
                    <Text className="text-gray-900 font-extrabold text-base">
                      R$ {Number(plan.amount).toFixed(2).replace(".", ",")}{" "}
                      <Text className="text-gray-600 font-normal text-xs">
                        /mês
                      </Text>
                    </Text>
                    <TouchableOpacity
                      onPress={handleGoToSubscriptionTab}
                      className="bg-[#092D5D] px-4 py-2 rounded-xl"
                    >
                      <Text className="text-white text-xs font-bold">
                        Assinar Plano
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-center text-gray-600 my-8">
                Nenhum plano disponível.
              </Text>
            )}
          </View>
        );
      case "Pacotes": {
        return (
          <View className="px-1 py-3">
            <Text className="text-gray-900 font-bold text-base mb-4">
              Combos e Pacotes Promocionais
            </Text>
            {packagesList.length === 0 ? (
              <Text className="text-center text-gray-600 my-8">
                Nenhum pacote disponível.
              </Text>
            ) : (
              packagesList.map((pkg: any) => (
                <View
                  key={pkg.id}
                  className="bg-white p-5 rounded-2xl border border-gray-100 mb-4 shadow-sm"
                >
                  {pkg.imgUrl ? (
                    <Image
                      source={{ uri: pkg.imgUrl }}
                      className="w-full h-[140px] rounded-xl mb-3"
                      resizeMode="cover"
                    />
                  ) : null}
                  <Text className="text-gray-900 font-bold text-base mb-1">
                    {pkg.name}
                  </Text>
                  {pkg.description ? (
                    <Text className="text-gray-600 text-sm leading-relaxed mb-3">
                      {pkg.description}
                    </Text>
                  ) : null}
                  {pkg.items && pkg.items.length > 0 && (
                    <View className="mb-3">
                      <Text className="text-gray-500 text-xs font-semibold mb-1">Inclui:</Text>
                      {pkg.items.map((item: any) => (
                        <Text key={item.serviceId} className="text-gray-600 text-xs">
                          • {item.serviceName ?? `Serviço #${item.serviceId}`}{item.quantity > 1 ? ` × ${item.quantity}` : ""}
                        </Text>
                      ))}
                    </View>
                  )}
                  <View className="flex-row justify-between items-center pt-3 border-t border-gray-50">
                    <View>
                      <Text className="text-gray-900 font-extrabold text-base">
                        R$ {Number(pkg.price).toFixed(2).replace(".", ",")}
                      </Text>
                      {pkg.duration ? (
                        <Text className="text-gray-400 text-xs">{pkg.duration} min</Text>
                      ) : null}
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        handleBookPackage(pkg.items?.map((i: any) => i.serviceId) ?? [])
                      }
                      className="bg-[#092D5D] px-4 py-2 rounded-xl"
                    >
                      <Text className="text-white text-xs font-bold">
                        Agendar Combo
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        );
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={Boolean(props.isRefreshing)}
            onRefresh={props.handleRefreshAll}
            tintColor="#092D5D"
            colors={["#092D5D", "#CBA35D"]}
          />
        }
      >
        {/* Cover Carousel (Fotos do Espaço) */}
        <View style={{ height: 260, width: "100%", position: "relative" }}>
          <FlatList
            data={images}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(img, index) => `detail-img-${index}`}
            renderItem={({ item: img }) => (
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => openViewerImage(img)}
              >
                <Image
                  source={{ uri: img }}
                  resizeMode="cover"
                  style={{ width: screenWidth, height: 260 }}
                />
              </TouchableOpacity>
            )}
          />

          {/* Floating Back Button */}
          <TouchableOpacity
            onPress={handleGoBack}
            activeOpacity={0.7}
            className="absolute left-4 top-14 bg-white/90 p-2.5 rounded-full shadow-md z-10"
          >
            <Ionicons name="arrow-back" size={22} color="#1f2937" />
          </TouchableOpacity>

          {/* Floating Favorite Button */}
          <TouchableOpacity
            onPress={handleToggleFavorite}
            activeOpacity={0.7}
            className="absolute right-4 top-14 bg-white/90 p-2.5 rounded-full shadow-md z-10"
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? colors["accent-red"] : "#1f2937"}
            />
          </TouchableOpacity>
        </View>

        {/* Content Box */}
        <View className="px-4 pt-5">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-gray-900 text-2xl font-black flex-1 mr-3">
              {companyDetailsData.name}
            </Text>
            {/* Star Badge */}
            {companyDetailsData.rating !== undefined && (
              <View className="flex-row items-center bg-[#fbbf24]/10 px-2.5 py-1 rounded-lg">
                <Ionicons name="star" size={14} color="#fbbf24" />

                <Text className="text-gray-900 font-bold text-xs ml-1">
                  {(companyDetailsData.rating ?? 5.0).toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          <Text className="text-gray-600 text-sm mb-4 leading-relaxed">
            {companyDetailsData.description || "Nenhuma descrição fornecida."}
          </Text>

          {/* Carrossel Horizontal de Portfólio de Trabalhos (se houver) */}
          {portfolioImages.length > 0 && (
            <View className="mb-5">
              <View className="flex-row items-center justify-between mb-2.5">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="images" size={18} color="#092D5D" />
                  <Text className="text-[#092D5D] font-extrabold text-sm uppercase tracking-wide">
                    Portfólio de Trabalhos
                  </Text>
                </View>
                <Text className="text-slate-400 text-xs font-semibold">
                  {portfolioImages.length} foto{portfolioImages.length > 1 ? "s" : ""}
                </Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
              >
                {portfolioImages.map((imgUrl, idx) => (
                  <TouchableOpacity
                    key={`portfolio-${idx}`}
                    activeOpacity={0.85}
                    onPress={() => openViewerImage(imgUrl)}
                    className="rounded-xl overflow-hidden border border-slate-200 shadow-sm"
                  >
                    <Image
                      source={{ uri: imgUrl }}
                      className="w-[100px] h-[100px]"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Horizontal Tabs Menu */}
          <View className="border-b border-gray-100 pb-2 mb-4">
            <FlatList
              ref={tabFlatListRef}
              data={tabs}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              contentContainerStyle={{ gap: 20 }}
              onScrollToIndexFailed={(info) => {
                tabFlatListRef.current?.scrollToOffset({
                  offset: info.averageItemLength * info.index,
                  animated: true,
                });
              }}
              renderItem={({ item, index }) => {
                const isSelected = activeTab === item;
                return (
                  <TouchableOpacity
                    onPress={() => handleTabSelect(item, index)}
                    activeOpacity={0.8}
                    className="pb-2"
                    style={
                      isSelected
                        ? { borderBottomWidth: 3, borderBottomColor: "#092D5D" }
                        : {}
                    }
                  >
                    <Text
                      className={`text-sm ${
                        isSelected
                          ? "text-[#092D5D] font-extrabold"
                          : "text-gray-600 font-semibold"
                      }`}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>

          {/* Tab Content Box */}
          <View className="mt-2">{renderActiveTabContent()}</View>
        </View>
      </ScrollView>

      {/* Floating CTA Bottom Bar */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderTopWidth: 1,
          borderTopColor: "#f3f4f6",
          paddingHorizontal: 20,
          paddingTop: 10,
          paddingBottom: Math.max(14, (insets?.bottom ?? 0) + 10),
          zIndex: 999,
        }}
      >
        {(activeTab as string) === "Serviços" && selectedServices.length === 0 ? (
          <View
            className="bg-gray-200 h-[54px] rounded-xl items-center justify-center border border-gray-300"
          >
            <Text className="text-gray-600 font-bold text-base">
              Escolha um serviço
            </Text>
          </View>
        ) : selectedServices.length > 0 ? (
          <TouchableOpacity
            onPress={handleBookSelectedServices}
            activeOpacity={0.8}
            className="bg-[#092D5D] h-[54px] rounded-xl items-center justify-center shadow-lg"
          >
            <Text className="text-white font-bold text-base">
              Agendar {selectedServices.length} Serviço
              {selectedServices.length > 1 ? "s" : ""}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Modal Visualizador em Tela Cheia Swipeable (Fundo Preto) */}
      <Modal
        visible={viewerIndex !== null && viewerIndex >= 0}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setViewerIndex(null)}
      >
        <SafeAreaView className="flex-1 bg-black justify-between items-center relative">
          {/* Top Bar com Contador de Fotos e Botão Fechar */}
          <View className="w-full flex-row justify-between items-center px-6 pt-4 pb-2 z-50">
            <View className="bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
              <Text className="text-white font-bold text-xs">
                {viewerIndex !== null ? viewerIndex + 1 : 1} de {allGalleryImages.length}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setViewerIndex(null)}
              activeOpacity={0.8}
              className="p-2.5 rounded-full bg-white/20 border border-white/20"
            >
              <Ionicons name="close" size={22} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Carrossel de Fotos em Tela Cheia com Swipe Horizontal */}
          {allGalleryImages.length > 0 && (
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentOffset={{
                x: (viewerIndex ?? 0) * screenWidth,
                y: 0,
              }}
              onMomentumScrollEnd={(e) => {
                const newIndex = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                if (newIndex >= 0 && newIndex < allGalleryImages.length) {
                  setViewerIndex(newIndex);
                }
              }}
            >
              {allGalleryImages.map((imgUrl, index) => (
                <View
                  key={`fullscreen-${index}`}
                  style={{ width: screenWidth, height: "100%", justifyContent: "center", alignItems: "center" }}
                >
                  <Image
                    source={{ uri: imgUrl }}
                    style={{ width: screenWidth, height: "80%" }}
                    resizeMode="contain"
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { useProductMutation } from "@/shared/queries/company/use-product.mutation";
import { usePackageMutation } from "@/shared/queries/company/use-package.mutation";
import { useGetSubscriptionPlansQuery } from "@/shared/queries/stripe/use-stripe-mutataion";
import { useLoyaltyMutation } from "@/shared/queries/company/use-loyalty.mutation";
import { useCompanyStore } from "@/shared/store/company-store";
import { useUserStore } from "@/shared/store/user-store";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { useRouter } from "expo-router";
import { useSafeNavigation } from "@/shared/hooks/useSafeNavigation";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export type CompanyDetailTab = "Serviços" | "Produtos" | "Detalhes" | "Avaliações" | "Assinaturas" | "Pacotes" | "Fidelidade";


export function useCompanyDetailsViewModel(companyId?: number) {
  const router = useRouter();
  const { safePush, safeReplace } = useSafeNavigation();
  const [activeTab, setActiveTab] = useState<CompanyDetailTab>("Serviços");
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchValue]);

  const {
    useGetCompanyDetailsQuery,
    useGetFavoritedIdsQuery,
    toggleFavoriteMutation,
    createCompanyReviewMutation,
    updateCompanyReviewMutation,
    deleteCompanyReviewMutation,
  } = useCompanyDetailsMutation();

  const { useGetServiceAvailableInAppMutation } = useCompanyServicesMutation();
  const { useGetProductsMutation } = useProductMutation();
  const { useGetPackagesMutation } = usePackageMutation();
  const { useGetActiveProgramQuery, useGetClientPointsQuery } = useLoyaltyMutation();
  const { data: loyaltyProgramData } = useGetActiveProgramQuery(companyId);

  const access_token = useUserStore((state) => state.access_token);
  const user = useUserStore((state) => state.user);
  const clientId = user?.clientId || user?.id;
  const { data: clientPointsData } = useGetClientPointsQuery(clientId, companyId);
  const isLoggedIn = !!access_token;
  const isAdmin = user?.roles?.some((role) => role.authority === "ROLE_ADMIN") ?? false;

  // Review states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<any | null>(null);

  // Load details
  const {
    data: companyDetailsData,
    isLoading: companyDetailsLoading,
    error: companyDetailsError,
    refetch: companyDetailsRefetch,
  } = useGetCompanyDetailsQuery(companyId);

  const { favoritedCompanyIds, setFavoritedCompanyIds, addFavoriteId, removeFavoriteId, setSelectedCompanyId } = useCompanyStore();

  useEffect(() => {
    if (companyId) {
      setSelectedCompanyId(companyId);
    }
  }, [companyId]);

  // Load services
  const {
    data: serviceData,
    isLoading: serviceIsLoading,
    refetch: serviceRefetch,
    fetchNextPage: serviceFetchNextPage,
    hasNextPage: serviceHasNextPage,
    isFetchingNextPage: serviceIsFetchingNextPage,
  } = useGetServiceAvailableInAppMutation(companyId);

  // Load products
  const {
    data: productData,
    isLoading: productIsLoading,
    refetch: refetchProduct,
    fetchNextPage: productFetchNextPage,
    hasNextPage: productHasNextPage,
    isFetchingNextPage: productIsFetchingNextPage,
  } = useGetProductsMutation(companyId, debouncedSearch);

  // Load packages
  const {
    data: packageData,
    isLoading: packageIsLoading,
    refetch: packageRefetch,
    fetchNextPage: packageFetchNextPage,
    hasNextPage: packageHasNextPage,
    isFetchingNextPage: packageIsFetchingNextPage,
  } = useGetPackagesMutation(companyId);

  // Load subscription plans
  const { data: subscriptionPlans, isLoading: isPlansLoading } = useGetSubscriptionPlansQuery(companyId);

  // Load favorites if logged in
  const { data: favoritedIds } = useGetFavoritedIdsQuery(isLoggedIn);

  // Load employees
  const { useGetEmployeeMutation } = useEmployeeMutation();
  const { data: employeesData, isLoading: employeesIsLoading } = useGetEmployeeMutation({ companyId: companyId ? String(companyId) : undefined });
  const fetchedEmployees = employeesData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const employeesList = fetchedEmployees.length > 0 ? fetchedEmployees : ((companyDetailsData as any)?.employees ?? []);

  // Load reviews
  const { useGetCompanyReviewsQuery } = useCompanyDetailsMutation();
  const { data: reviewsData, isLoading: reviewsIsLoading } = useGetCompanyReviewsQuery(companyId || 0);
  const reviewsList = reviewsData?.content ?? [];

  useEffect(() => {
    if (isLoggedIn && favoritedIds) {
      setFavoritedCompanyIds(favoritedIds);
    } else if (!isLoggedIn) {
      setFavoritedCompanyIds([]);
    }
  }, [favoritedIds, isLoggedIn]);

  const isFavorite = companyId ? favoritedCompanyIds.includes(companyId) : false;

  const handleToggleFavorite = async () => {
    if (!companyId) return;

    if (!isLoggedIn) {
      safePush("/(public)/login");
      return;
    }

    try {
      if (isFavorite) {
        removeFavoriteId(companyId);
      } else {
        addFavoriteId(companyId);
      }
      await toggleFavoriteMutation.mutateAsync({ companyId, isFavorite: !isFavorite });
    } catch (err) {
      if (isFavorite) {
        addFavoriteId(companyId);
      } else {
        removeFavoriteId(companyId);
      }
      console.error(err);
    }
  };

  const handleSelectCompany = () => {
    if (!companyId) return;
    setSelectedCompanyId(companyId);
    safeReplace("/(private)/(tabs)/(client-tabs)/home");
  };

  const handleBookSelectedServices = () => {
    if (selectedServices.length === 0) return;
    if (!isLoggedIn) {
      safePush("/(public)/login");
    } else {
      try {
        router.push({
          pathname: "/(private)/schedule",
          params: {
            serviceIds: selectedServices.join(","),
            companyId: companyId ? String(companyId) : undefined,
          },
        });
      } catch (e) {
        console.error("Erro ao navegar para o agendamento:", e);
      }
    }
  };

  const handleBookPackage = (packageServices: number[]) => {
    if (!isLoggedIn) {
      safePush("/(public)/login");
    } else {
      try {
        router.push({
          pathname: "/(private)/schedule",
          params: {
            serviceIds: packageServices.join(","),
            companyId: companyId ? String(companyId) : undefined,
          },
        });
      } catch (e) {
        console.error("Erro ao navegar para o agendamento do pacote:", e);
      }
    }
  };

  const handleGoToSubscriptionTab = () => {
    if (!isLoggedIn) {
      safePush("/(public)/login");
    } else {
      safePush("/(private)/(tabs)/(client-tabs)/subscription");
    }
  };

  const handleGoBack = () => {
    try {
      if (router.canGoBack()) {
        router.back();
      } else {
        safeReplace("/(public)/home");
      }
    } catch {
      safeReplace("/(public)/home");
    }
  };

  const handleSubmitReview = async () => {
    if (!companyId) return;
    if (!createCompanyReviewMutation) {
      Alert.alert("Erro", "Não foi possível enviar a avaliação.");
      return;
    }
    if (!newComment.trim()) {
      Alert.alert("Erro", "Por favor, digite um comentário.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      if (editingReview) {
        await updateCompanyReviewMutation.mutateAsync({
          companyId,
          reviewId: editingReview.id,
          rating: newRating,
          comment: newComment.trim(),
        });
        setEditingReview(null);
        Alert.alert("Sucesso", "Sua avaliação foi atualizada com sucesso!");
      } else {
        await createCompanyReviewMutation.mutateAsync({
          companyId,
          rating: newRating,
          comment: newComment.trim(),
        });
        Alert.alert("Sucesso", "Sua avaliação foi enviada com sucesso!");
      }
      setNewComment("");
      setNewRating(5);
    } catch (err: any) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Erro ao enviar avaliação.";
      Alert.alert("Erro", msg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditReview = (review: any) => {
    setNewRating(review.rating);
    setNewComment(review.comment);
    setEditingReview(review);
  };

  const handleCancelEdit = () => {
    setNewRating(5);
    setNewComment("");
    setEditingReview(null);
  };

  const handleDeleteReview = async (reviewId: number) => {
    if (!companyId) return;
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir esta avaliação?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteCompanyReviewMutation.mutateAsync({ companyId, reviewId });
              Alert.alert("Sucesso", "Sua avaliação foi excluída!");
            } catch (err: any) {
              console.error(err);
              const msg = err instanceof Error ? err.message : "Erro ao excluir avaliação.";
              Alert.alert("Erro", msg);
            }
          }
        }
      ]
    );
  };

  const rawServicesList = serviceData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const servicesList = rawServicesList.filter((service) => {
    const matchesSearch = debouncedSearch
      ? service.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
      : true;
    return matchesSearch && service.availableInApp !== false;
  });

  const rawProductsList = productData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const productsList = rawProductsList.filter((product) => {
    return product.availableInApp === true;
  });

  const packagesList = packageData?.pages.flatMap((page) => page.content ?? []) ?? [];

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshAll = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        companyDetailsRefetch(),
        serviceRefetch(),
        refetchProduct(),
        packageRefetch(),
      ]);
    } catch (e) {
      console.error("Error refreshing company details:", e);
    } finally {
      setIsRefreshing(false);
    }
  };

  return {
    companyDetailsData,
    companyDetailsLoading: companyDetailsLoading || serviceIsLoading || productIsLoading || packageIsLoading || isPlansLoading,
    companyDetailsError,
    companyDetailsRefetch,
    isRefreshing,
    handleRefreshAll,
    isFavorite,
    handleToggleFavorite,
    handleSelectCompany,
    handleGoBack,
    companyId,
    activeTab,
    setActiveTab,
    selectedServices,
    setSelectedServices,
    servicesList,
    productsList,
    packagesList,
    loyaltyProgramData,
    clientPointsData,
    subscriptionPlans: subscriptionPlans ?? [],
    handleBookSelectedServices,
    handleBookPackage,
    handleGoToSubscriptionTab,
    serviceFetchNextPage,
    serviceRefetch,
    serviceHasNextPage,
    serviceIsFetchingNextPage,
    serviceIsLoading,
    packageFetchNextPage,
    packageRefetch,
    packageHasNextPage,
    packageIsFetchingNextPage,
    packageIsLoading,
    searchValue,
    setSearchValue,
    productFetchNextPage,
    refetchProduct,
    productHasNextPage,
    productIsFetchingNextPage,
    productIsLoading,
    isProductRefetching: productIsLoading,
    employeesList,
    reviewsList,
    reviewsIsLoading,
    user,
    isAdmin,
    newRating,
    setNewRating,
    newComment,
    setNewComment,
    isSubmittingReview,
    handleSubmitReview,
    editingReview,
    handleEditReview,
    handleDeleteReview,
    handleCancelEdit,
  };
}
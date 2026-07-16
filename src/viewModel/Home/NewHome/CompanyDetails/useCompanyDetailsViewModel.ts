import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { useCompanyServicesMutation } from "@/shared/queries/company/use-company-services.mutation";
import { useProductMutation } from "@/shared/queries/company/use-product.mutation";
import { usePackageMutation } from "@/shared/queries/company/use-package.mutation";
import { useGetSubscriptionPlansQuery } from "@/shared/queries/stripe/use-stripe-mutataion";
import { useCompanyStore } from "@/shared/store/company-store";
import { useUserStore } from "@/shared/store/user-store";
import { useEmployeeMutation } from "@/shared/queries/company/use-employee.mutation";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

export type CompanyDetailTab = "Serviços" | "Produtos" | "Detalhes" | "Avaliações" | "Assinaturas" | "Pacotes";


export function useCompanyDetailsViewModel(companyId?: number) {
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
  } = useCompanyDetailsMutation();

  const { useGetServiceAvailableInAppMutation } = useCompanyServicesMutation();
  const { useGetProductsMutation } = useProductMutation();
  const { useGetPackagesMutation } = usePackageMutation();

  const access_token = useUserStore((state) => state.access_token);
  const user = useUserStore((state) => state.user);
  const isLoggedIn = !!access_token;
  const isAdmin = user?.roles?.some((role) => role.authority === "ROLE_ADMIN") ?? false;

  // Review states
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Load details
  const {
    data: companyDetailsData,
    isLoading: companyDetailsLoading,
    error: companyDetailsError,
    refetch: companyDetailsRefetch,
  } = useGetCompanyDetailsQuery(companyId);

  // Set selected company dynamically in store when viewing details
  const { favoritedCompanyIds, setFavoritedCompanyIds, addFavoriteId, removeFavoriteId, setSelectedCompanyId } = useCompanyStore();

  useEffect(() => {
    if (companyId) {
      setSelectedCompanyId(companyId);
    }
  }, [companyId]);

  // Load services (only available in app)
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
  const employeesList = employeesData?.pages.flatMap((page) => page.content ?? []) ?? [];

  // Load reviews
  const { useGetCompanyReviewsQuery } = useCompanyDetailsMutation();
  const { data: reviewsData, isLoading: reviewsIsLoading } = useGetCompanyReviewsQuery(companyId || 0);
  const reviewsList = reviewsData?.content ?? [];

  useEffect(() => {
    if (favoritedIds) {
      setFavoritedCompanyIds(favoritedIds);
    }
  }, [favoritedIds]);

  const isFavorite = companyId ? favoritedCompanyIds.includes(companyId) : false;

  const handleToggleFavorite = async () => {
    if (!companyId) return;

    if (!isLoggedIn) {
      router.push("/(public)/login");
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
    router.replace("/(private)/(tabs)/(client-tabs)/home");
  };

  const handleBookSelectedServices = () => {
    if (selectedServices.length === 0) return;
    if (!isLoggedIn) {
      router.push("/(public)/login");
    } else {
      router.push({
        pathname: "/(private)/schedule",
        params: {
          serviceIds: selectedServices.join(","),
        },
      });
    }
  };

  const handleBookPackage = (packageServices: number[]) => {
    if (!isLoggedIn) {
      router.push("/(public)/login");
    } else {
      router.push({
        pathname: "/(private)/schedule",
        params: {
          serviceIds: packageServices.join(","),
        },
      });
    }
  };

  const handleGoToSubscriptionTab = () => {
    if (!isLoggedIn) {
      router.push("/(public)/login");
    } else {
      router.push("/(private)/(tabs)/(client-tabs)/subscription");
    }
  };

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(public)/home");
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
      await createCompanyReviewMutation.mutateAsync({
        companyId,
        rating: newRating,
        comment: newComment.trim(),
      });
      setNewComment("");
      setNewRating(5);
      Alert.alert("Sucesso", "Sua avaliação foi enviada com sucesso!");
    } catch (err: any) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Erro ao enviar avaliação.";
      Alert.alert("Erro", msg);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  // Extract content arrays from paginated data
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


  return {
    companyDetailsData,
    companyDetailsLoading: companyDetailsLoading || serviceIsLoading || productIsLoading || packageIsLoading || isPlansLoading,
    companyDetailsError,
    companyDetailsRefetch,
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
  };
}
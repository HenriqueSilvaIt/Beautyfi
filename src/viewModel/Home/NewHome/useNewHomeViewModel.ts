import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";
import * as Location from "expo-location";
import { useAddressStore } from "@/shared/store/address-store";
import { useDismissOnboardingMutation } from "@/shared/queries/user/use-user-logged.mutation";
import { useQuery } from "@tanstack/react-query";
import { getCompanyById } from "@/shared/services/company.service";
import { router } from "expo-router";


export function useNewHomeViewModel() {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Search mode & coordinates state
  const [searchMode, setSearchMode] = useState<"explorar" | "buscar">("explorar");
  const [addressText, setAddressText] = useState("");
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [radius, setRadius] = useState(15);
  const [geoLoading, setGeoLoading] = useState(false);

  // Debounce search text
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  const { addressText: savedAddress, latitude: savedLat, longitude: savedLng } = useAddressStore();
  const { user, access_token } = useUserStore();

  const effectiveAddress = user?.address || savedAddress;
  const effectiveLat = user?.address ? user.latitude : savedLat;
  const effectiveLng = user?.address ? user.longitude : savedLng;

  const requestGpsLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("GPS permission not granted");
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      if (loc && loc.coords) {
        setUserLat(loc.coords.latitude);
        setUserLng(loc.coords.longitude);
        setAddressText("Minha Localização (GPS)");
      }
    } catch (err) {
      console.log("Error getting GPS location", err);
    }
  };

  useEffect(() => {
    if (searchMode === "buscar") {
      if (effectiveLat && effectiveLng) {
        setUserLat(effectiveLat);
        setUserLng(effectiveLng);
        setAddressText(effectiveAddress || "Endereço cadastrado");
      }
      requestGpsLocation();
    }
  }, [searchMode, effectiveLat, effectiveLng, effectiveAddress]);

  const {
    useGetCompaniesQuery,
    useGetNearbyCompaniesQuery,
    useGetCompanyCategoriesQuery,
    useGetFavoritedIdsQuery,
    toggleFavoriteMutation,
  } = useCompanyDetailsMutation();

  const { favoritedCompanyIds, setFavoritedCompanyIds, addFavoriteId, removeFavoriteId } = useCompanyStore();
  const setUser = useUserStore((state) => state.setUser);
  const { dismissOnboardingMutation } = useDismissOnboardingMutation();

  const handleDismissOnboarding = async () => {
    try {
      await dismissOnboardingMutation.mutateAsync();
      setUser((prev) => prev ? { ...prev, firstLogin: false } : null);
    } catch (err) {
      console.error("Failed to dismiss onboarding:", err);
      // Fallback local update if network fails
      setUser((prev) => prev ? { ...prev, firstLogin: false } : null);
    }
  };


  const isExplorar = searchMode === "explorar";
  const isBuscar = searchMode === "buscar";

  // Load standard companies
  const {
    data: companiesData,
    error: companiesError,
    refetch: companiesRefetch,
    isFetchingNextPage: companiesIsFetchingNextPage,
    hasNextPage: companiesHasNextPage,
    isLoading: companiesIsLoading,
    fetchNextPage: companiesFetchNextPage,
    isRefetching: companiesIsRefetching,
  } = useGetCompaniesQuery(debouncedSearchText);

  // Load nearby companies
  const {
    data: nearbyData,
    error: nearbyError,
    isLoading: nearbyIsLoading,
    refetch: nearbyRefetch,
  } = useGetNearbyCompaniesQuery(userLat, userLng, radius, isBuscar);

  // Load categories
  const { data: categoriesData, isLoading: categoriesIsLoading } = useGetCompanyCategoriesQuery();

  // Load favorites if logged in
  const { data: favoritedIds } = useGetFavoritedIdsQuery(!!access_token);

  useEffect(() => {
    if (favoritedIds) {
      setFavoritedCompanyIds(favoritedIds);
    }
  }, [favoritedIds]);

  const { data: favoriteCompanies } = useQuery({
    queryKey: ["favorited-companies-details", favoritedCompanyIds],
    queryFn: async () => {
      if (!favoritedCompanyIds || favoritedCompanyIds.length === 0) return [];
      const details = await Promise.all(favoritedCompanyIds.map(id => getCompanyById(id)));
      return details.map(c => ({
        id: Number(c.id),
        name: c.name,
        description: c.description || "",
        cnpj: c.cnpj || "",
        logoUrl: c.logoUrl || "",
        address: c.address || "",
        latitude: c.latitude || 0,
        longitude: c.longitude || 0,
        phone: c.phone || "",
        rating: c.rating || 5,
        reviewsCount: c.reviewsCount || 0,
        imagesUrl: c.imagesUrl || "",
        services: []
      }));
    },
    enabled: favoritedCompanyIds.length > 0,
  });

  const companiesDataList = isExplorar
    ? (companiesData?.pages.flatMap((page) => page.content ?? []) ?? [])
    : (nearbyData ?? []);

  // Filter companies by selected category
  const filteredCompanies = companiesDataList.filter((company) => {
    if (!selectedCategoryId) return true;
    return company.companyCategories?.some((cat: any) => cat.id === selectedCategoryId);
  });

  const handleToggleFavorite = async (companyId: number) => {
    if (!access_token) {
      router.push("/(public)/login");
      return;
    }
    const isFav = favoritedCompanyIds.includes(companyId);
    try {
      if (isFav) {
        removeFavoriteId(companyId);
      } else {
        addFavoriteId(companyId);
      }
      await toggleFavoriteMutation.mutateAsync({ companyId, isFavorite: !isFav });
    } catch (err) {
      if (isFav) {
        addFavoriteId(companyId);
      } else {
        removeFavoriteId(companyId);
      }
      console.error(err);
    }
  };

  const handleAddressSearch = async () => {
    if (!addressText.trim()) return;
    setGeoLoading(true);
    try {
      const encoded = encodeURIComponent(addressText.trim());
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encoded}&countrycodes=br`,
        {
          headers: {
            "User-Agent": "BeautyFi/1.0 (contact@beautyfi.com.br)",
            "Accept-Language": "pt-BR,pt;q=0.9",
          },
        },
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        setUserLat(lat);
        setUserLng(lon);
      } else {
        Alert.alert("Endereço não encontrado", "Tente um endereço mais específico, incluindo cidade ou bairro.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível buscar o endereço. Verifique sua conexão.");
    } finally {
      setGeoLoading(false);
    }
  };

  const [addressSuggestions, setAddressSuggestions] = useState<
    Array<{ display_name: string; lat: string; lon: string }>
  >([]);
  const [isSearchingAddress, setIsSearchingAddress] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (
      !addressText ||
      addressText.trim().length < 3 ||
      addressText.includes("Minha Localização")
    ) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsSearchingAddress(true);
        const encoded = encodeURIComponent(addressText.trim());
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&countrycodes=br&limit=5&q=${encoded}`,
          {
            headers: {
              "User-Agent": "BeautyFi/1.0 (contact@beautyfi.com.br)",
              "Accept-Language": "pt-BR,pt;q=0.9",
            },
          },
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setAddressSuggestions(data);
          setShowSuggestions(data.length > 0);
        }
      } catch (err) {
        console.error("Autocomplete fetch error:", err);
      } finally {
        setIsSearchingAddress(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [addressText]);

  const handleSelectSuggestion = (item: {
    display_name: string;
    lat: string;
    lon: string;
  }) => {
    setAddressText(item.display_name);
    setUserLat(parseFloat(item.lat));
    setUserLng(parseFloat(item.lon));
    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  return {
    companiesDataPagged: filteredCompanies,
    companiesError: isExplorar ? companiesError : nearbyError,
    companiesIsLoading: isExplorar ? companiesIsLoading : nearbyIsLoading,
    companiesRefetch: isExplorar ? companiesRefetch : nearbyRefetch,
    companiesIsFetchingNextPage: isExplorar ? companiesIsFetchingNextPage : false,
    companiesHasNextPage: isExplorar ? companiesHasNextPage : false,
    companiesFetchNextPage: isExplorar ? companiesFetchNextPage : undefined,
    companiesIsRefetching: isExplorar ? companiesIsRefetching : false,
    searchText,
    setSearchText,
    categoriesData: categoriesData ?? [],
    categoriesIsLoading,
    selectedCategoryId,
    setSelectedCategoryId,
    favoritedCompanyIds,
    handleToggleFavorite,
    favoriteCompanies: favoriteCompanies ?? [],
    isLoggedIn: !!access_token,
    searchMode,
    setSearchMode,
    addressText,
    setAddressText,
    radius,
    setRadius,
    geoLoading,
    handleAddressSearch,
    handleDismissOnboarding,
    addressSuggestions,
    isSearchingAddress,
    showSuggestions,
    setShowSuggestions,
    handleSelectSuggestion,
  };
}


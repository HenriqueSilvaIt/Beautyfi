import { useState, useEffect } from "react";
import { useCompanyDetailsMutation } from "@/shared/queries/company/use-company.mutation";
import { useUserStore } from "@/shared/store/user-store";
import { useCompanyStore } from "@/shared/store/company-store";

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

  const {
    useGetCompaniesQuery,
    useGetNearbyCompaniesQuery,
    useGetCompanyCategoriesQuery,
    useGetFavoritedIdsQuery,
    toggleFavoriteMutation,
  } = useCompanyDetailsMutation();

  const access_token = useUserStore((state) => state.access_token);
  const { favoritedCompanyIds, setFavoritedCompanyIds, addFavoriteId, removeFavoriteId } = useCompanyStore();

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

  const companiesDataList = isExplorar
    ? (companiesData?.pages.flatMap((page) => page.content ?? []) ?? [])
    : (nearbyData ?? []);

  // Filter companies by selected category
  const filteredCompanies = companiesDataList.filter((company) => {
    if (!selectedCategoryId) return true;
    return company.companyCategories?.some((cat: any) => cat.id === selectedCategoryId);
  });

  const handleToggleFavorite = async (companyId: number) => {
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
      const encoded = encodeURIComponent(addressText);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encoded}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setUserLat(parseFloat(data[0].lat));
        setUserLng(parseFloat(data[0].lon));
      } else {
        alert("Endereço não encontrado.");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao buscar endereço.");
    } finally {
      setGeoLoading(false);
    }
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
    isLoggedIn: !!access_token,
    searchMode,
    setSearchMode,
    addressText,
    setAddressText,
    radius,
    setRadius,
    geoLoading,
    handleAddressSearch,
  };
}

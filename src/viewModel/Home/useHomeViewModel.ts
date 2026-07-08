import { useForm } from "react-hook-form";
import { useUserStore } from "../../shared/store/user-store";
import Animated from "react-native-reanimated";
import { useAdvertisementMutation } from "../../shared/queries/company/use-advertisement.mutation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AdvertisementProps } from "../../shared/interfaces/http/advertisement";
import { Alert, Dimensions, ImageSourcePropType } from "react-native";
import { CompanyServicesProps } from "../../shared/interfaces/http/company-services";
import { useCompanyServicesMutation } from "../../shared/queries/company/use-company-services.mutation";
import { CompanyMenuProps } from "../../shared/interfaces/company-menu";
import { EmployeeProps } from "../../shared/interfaces/http/employee";
import { useEmployeeMutation } from "../../shared/queries/company/use-employee.mutation";
import { useCompanyDetailsMutation } from "../../shared/queries/company/use-company.mutation";
import {
  CompanyInterface,
  CompanyProps,
} from "../../shared/interfaces/http/company";
import { useProductMutation } from "../../shared/queries/company/use-product.mutation";
import { ProductProps } from "../../shared/interfaces/http/product";
import { COMPANY_ID } from "@env";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { FlatList } from "react-native-reanimated/lib/typescript/Animated";
import { useBottomSheetContext } from "@/shared/hooks/useBotttomSheetApp";
import { useStore } from "zustand";
import { router } from "expo-router";
import { useCompanyStore } from "@/shared/store/company-store";

export interface LocalImage {
  id: number;
  image: ImageSourcePropType;
  title: string;
}

export function useHomeViewModel() {
  const { useGetAdvertisementsQuery } = useAdvertisementMutation();
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
    data: adversetmentData,
    error: adversetmentError,
    refetch: adversetmentRefetch,
    isRefetching: adversetmentIsRefetching,
    isFetchingNextPage: adversetmentIsFetchingNextPage,
    hasNextPage: adversetmentHasNextPage,
    fetchNextPage: adversetmentFetchNexPage,
  } = useGetAdvertisementsQuery();
  const advertsementDataPagged =
    adversetmentData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const { openBottomSheet } = useBottomSheetContext();
  const { useGetServiceMutation } = useCompanyServicesMutation();
  const {
    data: serviceData,
    error: serviceError,
    refetch: serviceRefetch,
    isFetchingNextPage: serviceIsFetchingNextPage,
    hasNextPage: serviceHasNextPage,
    isLoading: serviceIsLoading,
    isRefetching: serviceIsRefetching,
    fetchNextPage: serviceFetchNextPage,
  } = useGetServiceMutation(debouncedSearch);


  const serviceDataPagged =
    serviceData?.pages.flatMap((page) => page.content) 
    .filter((service) => service.availableInApp === true) ?? [];
  const { useGetProductsMutation } = useProductMutation();
  const {
    data: productData,
    error: productError,
    refetch: refetchProduct,
    isRefetching: isProductRefetching,
    isFetchingNextPage: productIsFetchingNextPage,
    hasNextPage: productHasNextPage,
    fetchNextPage: productFetchNextPage,
    isLoading: isProductLoading,
  } = useGetProductsMutation(debouncedSearch);

  const productDataPagged =
    productData?.pages.flatMap((pages) => pages.content ?? []) 
    .filter((service) => service.availableInApp === true)  ?? [];

    //  Filtra só produtos com estoque
const productsInStock = productDataPagged.filter(
  (p) => p.quantity != null && p.quantity > 0
);
  const { mutation, getCompanyByIdMutation } = useCompanyDetailsMutation();

  const { useGetEmployeeMutation } = useEmployeeMutation();
  const {
    data: employeeData,
    error: employeeError,
    refetch: employeeRefetch,
    isRefetching: employeeIsRefetching,
    isLoading: employeeIsLoading,
    fetchNextPage: employeeFetchNextPage,
    hasNextPage: employeeHasNextPage,
    isFetchingNextPage: employeeIsFetchingNextPage,
  } = useGetEmployeeMutation();

  

  const employeeDataPagged =
    employeeData?.pages.flatMap((page) => page.content ?? []) ?? [];
  const { setUser, user, access_token } = useUserStore();

  const isAdmin =
    user?.roles?.some((role) =>  role.authority === "ROLE_MODERATOR")  ?? false;

  const { control, handleSubmit } = useForm();

  const width = Dimensions.get("window").width - 32;

  const COMPANY_ID_NUMBER = Number(COMPANY_ID)
    ? Number(COMPANY_ID)
    : (Number(process.env.EXPO_PUBLIC_COMPANY_ID) ?? 0);

  const flatListRef = useRef<FlatList<AdvertisementProps> | null>(null);


  const [currentIndex, setCurrentIndex] = useState(0);

  const [company, setCompany] = useState<CompanyInterface>();

  const [companyDetails, setCompanyDetails] = useState<CompanyProps[]>([]);

  const memoAdvertisements = useMemo(
    () => advertsementDataPagged,
    [advertsementDataPagged],
  );
  const memoCompanyServices = useMemo(
    () => serviceDataPagged,
    [serviceDataPagged],
  );

  const [loadingImage, setLoadingImage] = useState(false);
  const { handleError } = useErrorHandler();

  const images = useMemo<LocalImage[]>(
    () => [
      {
        id: 1,
        image: require("@assets/images/barba.png"),
        title: "Promoção venha conferir!",
      },
      {
        id: 2,
        image: require("@assets/images/sombrancelha.png"),
        title: "Promoção venha conferir!",
      },
      {
        id: 3,
        image: require("@assets/images/cort.png"),
        title: "Promoção venha conferir!",
      },
      {
        id: 4,
        image: require("@assets/images/barba.png"),
        title: "Promoção venha conferir!",
      },
      {
        id: 5,
        image: require("@assets/images/cort.png"),
        title: "Promoção venha conferir!",
      },
      {
        id: 6,
        image: require("@assets/images/pezinho.png"),
        title: "Promoção venha conferir!",
      },
    ],
    [],
  );

  const menuBusiness: CompanyMenuProps[] = [
    {
      id: "1",
      menu: "Serviços",
    },
    {
      id: "2",
      menu: "Produtos",
    },
  ];
  const menuCompany: CompanyMenuProps[] = [
    {
      id: "1",
      menu: "Profissionais",
    },
    {
      id: "2",
      menu: "Detalhes",
    },
  ];

  //UseEffect para atualizar intervalo do anuncion
  const currentIndexRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (advertsementDataPagged.length === 0) return;

    intervalRef.current = setInterval(() => {
      const nextIndex =
        (currentIndexRef.current + 1) % advertsementDataPagged.length;

      currentIndexRef.current = nextIndex;
      setCurrentIndex(nextIndex);

      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [advertsementDataPagged.length]);
  const resetAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };
  //Função para fazer o indice do carousel do anuncio
  const onScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
    currentIndexRef.current = slideIndex;
  };

  // Função para buscar detalhes da empresa

  async function getCompanyDetails() {
    try {
      const data = await mutation.mutateAsync();

      setCompanyDetails([data]);
    } catch (error) {
      handleError(error, "Falha ao buscar dados da empresa");
    }
  }

  // Busca empresa peloId
  async function getCompanyById(companyId: number) {
    try {
      const data = await getCompanyByIdMutation.mutateAsync(companyId);

      setCompany(data);
    } catch (error) {
      handleError(error, "Falha ao buscar empresa");
    }
  }

  const [isLoading, setIsLoading] = useState(true);

  function handleAgendar() {
  if (!user || !access_token) {
    Alert.alert(
      "Atenção!",
      "Favor realizar login para agendar."
    );
    return;
  }

  if (selectedServices.length === 0) {
    Alert.alert(
      "Atenção!",
      "Selecione ao menos um serviço."
    );
    return;
  }

  router.push({
    pathname: "/(private)/schedule",
    params: {
      serviceIds: selectedServices.join(","),
    },
  });
}
  const companyId = useCompanyStore((state) => state.selectedCompanyId) || COMPANY_ID_NUMBER;

  useEffect(() => {
    if (!companyId) return;

    const loadHomeData = async () => {
      try {
        setIsLoading(true);
        await Promise.allSettled([getCompanyById(companyId)]);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomeData();
  }, [companyId]);

  return {
    control,
    isLoading,
    setIsLoading,
    advertsementDataPagged,
    images,
    width,
    flatListRef,
    currentIndex,
    setCurrentIndex,
    onScroll,
    user,
    serviceDataPagged,
    companyDetails,
    menuCompany,
    menuBusiness,
    productDataPagged,
    employeeDataPagged,
    memoAdvertisements,
    productIsFetchingNextPage,
    productHasNextPage,
    memoCompanyServices,
    company,
    productData,
    productsInStock,
    productError,
    refetchProduct,
    isProductRefetching,
    isProductLoading,
    serviceData,
    productFetchNextPage,
    loadingImage,
    serviceError,
    serviceIsLoading,
    serviceRefetch,
    serviceIsFetchingNextPage,
    serviceHasNextPage,
    serviceIsRefetching,
    serviceFetchNextPage,
    openBottomSheet,
    employeeRefetch,
    employeeIsRefetching,
    employeeFetchNextPage,
    employeeHasNextPage,
    employeeIsLoading,
    employeeIsFetchingNextPage,
    resetAutoPlay,
    isAdmin,
    setSelectedServices,
    selectedServices,
    handleAgendar,
    searchValue,
    setSearchValue,
  };
}

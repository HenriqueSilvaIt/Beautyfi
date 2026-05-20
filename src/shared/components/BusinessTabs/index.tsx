import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CompanyMenuProps } from "../../interfaces/company-menu";
import {
  CompanyServiceHttpResponse,
  CompanyServicesProps,
} from "../../interfaces/http/company-services";

import { useRef, useState } from "react";
import { EmployeeProps } from "../../interfaces/http/employee";

import { CompanyProps } from "../../interfaces/http/company";
import {
  ProductHttpResponse,
  ProductProps,
} from "../../interfaces/http/product";
import { CompanyProduct } from "./CompanyProduct";
import { CompanyServices } from "./CompanyServices";
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  QueryObserverResult,
  RefetchOptions,
} from "@tanstack/react-query";

interface BusinessTabsProps {
  activeMenu: CompanyMenuProps[];
  companyProduct: ProductProps[];
  companyService: CompanyServicesProps[];
  productError: Error | null;
  refetchProduct: (
    options?: RefetchOptions | undefined,
  ) => Promise<
    QueryObserverResult<InfiniteData<ProductHttpResponse, unknown>, Error>
  >;
  productFetchNextPage: (
    options?: RefetchOptions | undefined,
  ) => Promise<
    QueryObserverResult<InfiniteData<ProductHttpResponse, unknown>, Error>
  >;
  isProductRefetching: boolean;
  productIsFetchingNextPage: boolean;
  isProductLoading: boolean;
  serviceError: Error | null;
  serviceRefetch: (
    options?: RefetchOptions | undefined,
  ) => Promise<
    QueryObserverResult<
      InfiniteData<CompanyServiceHttpResponse, unknown>,
      Error
    >
  >;
  productHasNextPage: boolean;
  serviceIsLoading: boolean;
  serviceIsFetchingNextPage: boolean;
  serviceHasNextPage: boolean;
  serviceFetchNextPage: (
    options?: FetchNextPageOptions | undefined,
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<CompanyServiceHttpResponse, unknown>,
      Error
    >
  >;

  serviceIsRefetching: boolean;
  selectedServices: number[];
  setSelectedServices: React.Dispatch<React.SetStateAction<number[]>>
}

export function BusinessTabs({
  activeMenu,
  companyService,
  companyProduct,
  productError,
  refetchProduct,
  isProductRefetching,
  productFetchNextPage,
  productHasNextPage,
  productIsFetchingNextPage,
  isProductLoading,
  serviceError,
  serviceRefetch,
  serviceIsFetchingNextPage,
  serviceIsLoading,
  serviceHasNextPage,
  serviceFetchNextPage,
  serviceIsRefetching,
  setSelectedServices,
  selectedServices,
}: BusinessTabsProps) {
  const [selectedMenu, setSelectedMenu] = useState(activeMenu[0]?.menu || "");
  const flatListRef = useRef<FlatList<CompanyMenuProps>>(null);

  const renderComponent = () => {
    switch (selectedMenu) {
      case "Serviços":
        return (
          <CompanyServices
            data={companyService}
            isRefreshing={serviceIsRefetching}
            onRefresh={serviceRefetch}
            fetchNextPage={serviceFetchNextPage}
            hasNextPage={serviceHasNextPage}
            isFetchingNextPage={serviceIsFetchingNextPage}
            isLoading={serviceIsLoading}
            selectedServices={selectedServices}
            setSelectedServices={setSelectedServices}
          />
        );
      case "Produtos":
        return (
          <CompanyProduct
            data={companyProduct}
            isRefreshing={isProductRefetching}
            onRefresh={refetchProduct}
            fetchNextPage={productFetchNextPage}
            hasNextPage={productHasNextPage}
            isFetchingNextPage={productIsFetchingNextPage}
            isLoading={isProductLoading}
          />
        );
    }
  };

  const isService = selectedMenu === "Serviços";

  const data = isService ? companyService : companyProduct;

  const isLoading = isService ? serviceIsRefetching : isProductRefetching;

  const onRefresh = isService ? serviceRefetch : refetchProduct;

  const onEndReached = () => {
    if (isService) {
      if (serviceHasNextPage && !serviceIsFetchingNextPage) {
        serviceFetchNextPage();
      }
    } else {
      if (productHasNextPage && !productIsFetchingNextPage) {
        productFetchNextPage();
      }
    }
  };

  const handleSelectMenu = (item: CompanyMenuProps, index: number) => {
    setSelectedMenu(item.menu);

    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  return (
    <View className="items-center">
      {/* MENU HORIZONTAL */}
      <FlatList
        ref={flatListRef}
        data={activeMenu}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
        getItemLayout={(_, index) => ({
          length: 100,
          offset: 100 * index,
          index,
        })}
        renderItem={({ item, index }) => (
          <Pressable
            onPress={() => handleSelectMenu(item, index)}
            style={{
              width: 100,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              className={`mt-3 text-base font-bold ${
                selectedMenu === item.menu
                  ? "text-font-primary border-b-2 border-app-theme-primary"
                  : "text-gray-400"
              }`}
            >
              {item.menu}
            </Text>
          </Pressable>
        )}
      />

      {/* LISTA DE ITENS */}
      <View className="mt-4 flex-1">{renderComponent()}</View>
    </View>
  );
}

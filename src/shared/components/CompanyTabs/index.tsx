import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CompanyMenuProps } from "../../interfaces/company-menu";
import { CompanyServices } from "../BusinessTabs/CompanyServices";
import { AppCarouselCard } from "../AppCarouselCard";
import { CompanyServicesProps } from "../../interfaces/http/company-services";
import { AdvertisementProps } from "../../interfaces/http/advertisement";
import Animated from "react-native-reanimated";
import { LocalImage } from "../../../viewModel/Home/useHomeViewModel";
import { useRef, useState } from "react";
import { EmployeeProps } from "../../interfaces/http/employee";
import { CompanyEmployees } from "./CompanyEmployees";
import { CompanyDetails } from "./CompanyDetails";
import { CompanyProps } from "../../interfaces/http/company";
import { CompanyProduct } from "../BusinessTabs/CompanyProduct";
import { ProductProps } from "../../interfaces/http/product";
{/*
interface CompanyTabsProps {
  activeMenu: CompanyMenuProps[];
  employeesService: EmployeeProps[];
  companyDetails: CompanyProps[];
  
}

export function CompanyTabs({
  activeMenu,
  employeesService,
  companyDetails,
}: CompanyTabsProps) {
  const [selectedMenu, setSelectedMenu] = useState(activeMenu[0]?.menu || "");
  const flatListRef = useRef<FlatList<CompanyMenuProps>>(null);

  const renderComponent = () => {
    switch (selectedMenu) {
      case "Profissionais":
       /* return <CompanyEmployees data={employeesService} />;*/
      /*case "Detalhes":
        return <CompanyDetails data={companyDetails} />;
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
      {/* MENU HORIZONTAL }
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
          <Pressable onPress={() => handleSelectMenu(item, index)}>
            <Text
              className={`mx-3 mt-3 text-xl font-bold ${
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

      <View className="mt-4 flex-1">{renderComponent()}</View>
    </View>
  );
}*/}

import { AppCompanyInfo } from "@/shared/components/AppCompanyInfo";

import {
  CompanyInterface,
} from "@/shared/interfaces/http/company";
import { Text, View } from "react-native";

interface CompanyDataProps {
  data: CompanyInterface;
}

export default function CompanyData(data: CompanyDataProps) {
  return (
      <View className="flex-1 bg-background-primary  ">
        <AppCompanyInfo />
      </View>
  );
}

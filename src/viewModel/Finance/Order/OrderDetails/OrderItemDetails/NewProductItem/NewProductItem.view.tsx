import { AppAdminHeader } from "@/shared/components/AppAdminHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNewProductItemViewModel } from "./useNewProductItemViewModel";
import { ActivityIndicator, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { AppInputController } from "@/shared/components/AppInputControler";
import { colors } from "@/styles/colors";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { moneyMapper } from "@/utils/moneyMapper";
import { AppQuantityControl } from "@/shared/components/AppQuantityControl";

export function NewProductItem({
  product,
  isItemLoading,
  handleOpenProductList,
  onAddProductToOrder,
  employee,
  toUse,
  setToUse,
  courtesy,
  setCourtesy,
  total,
  quantity,
  setQuantity,
  handleToggleCourtesy,
  handleToggleToUse,
  control,
  maskMoneyBR,
  handleOpenEmployeeList,
}: ReturnType<typeof useNewProductItemViewModel>) {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <AppAdminHeader
        title={`Inserir Produto`}
        iconRight={{ icon: false, path: "" }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 }}
      >
        <Text className="text-[#092D5D] font-black text-xs uppercase tracking-wider mb-3">
          Adicionar Produto na Comanda
        </Text>

        <View className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs gap-4 mb-5">
          {/* Selecionar Produto */}
          <TouchableOpacity onPress={handleOpenProductList} activeOpacity={0.85}>
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
              Produto
            </Text>
            <View className="w-full flex-row items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300">
              <View className="flex-row items-center gap-2.5">
                <Ionicons name="cube-outline" size={18} color="#092D5D" />
                <Text
                  className={`text-sm font-bold ${
                    product ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {product ? product.name : "Escolha o produto"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#092D5D" />
            </View>
          </TouchableOpacity>

          {/* Campo Valor */}
          <View>
            <AppInputController
              control={control}
              name="price"
              leftIcon="cash"
              label="Valor Unitário"
              placeholder="R$ 0,00"
              placeholderTextColor={colors.gray[400]}
            />
          </View>

          {/* Selecionar Profissional */}
          <TouchableOpacity onPress={handleOpenEmployeeList} activeOpacity={0.85}>
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1.5">
              Profissional Vendedor
            </Text>
            <View className="w-full flex-row items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-300">
              <View className="flex-row items-center gap-2.5">
                <Ionicons name="person-outline" size={18} color="#092D5D" />
                <Text
                  className={`text-sm font-bold ${
                    employee ? "text-slate-900" : "text-slate-400"
                  }`}
                >
                  {employee ? employee.name : "Escolha o profissional"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={18} color="#092D5D" />
            </View>
          </TouchableOpacity>

          {/* Quantidade */}
          <View>
            <Text className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
              Quantidade
            </Text>
            <AppQuantityControl
              quantity={quantity}
              setQuantity={setQuantity}
              price={Number(product?.price)}
            />
          </View>

          {/* Opção Para Uso */}
          <View className="flex-row items-center justify-between py-2 border-t border-slate-100 pt-3">
            <View className="flex-1 pr-3">
              <Text className="text-slate-900 font-extrabold text-sm">
                Para Uso Interno
              </Text>
              <Text className="text-slate-500 text-[11px]">
                Produtos para uso não entram no valor cobrado do cliente
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleToggleToUse()} activeOpacity={0.85}>
              <MaterialCommunityIcons
                name={toUse ? "toggle-switch" : "toggle-switch-off-outline"}
                color={toUse ? "#092D5D" : "#cbd5e1"}
                size={40}
              />
            </TouchableOpacity>
          </View>

          {/* Opção Cortesia */}
          <View className="flex-row items-center justify-between py-2 border-t border-slate-100">
            <View className="flex-1 pr-3">
              <Text className="text-slate-900 font-extrabold text-sm">
                Cortesia
              </Text>
              <Text className="text-slate-500 text-[11px]">
                Concede este produto como cortesia gratuita
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleToggleCourtesy()} activeOpacity={0.85}>
              <MaterialCommunityIcons
                name={courtesy ? "toggle-switch" : "toggle-switch-off-outline"}
                color={courtesy ? "#092D5D" : "#cbd5e1"}
                size={40}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Resumo de Total */}
        <View className="p-4 rounded-2xl bg-white border border-slate-200 flex-row justify-between items-center mb-5 shadow-xs">
          <Text className="text-slate-900 font-extrabold text-base">
            Total do Produto:
          </Text>
          <Text className="text-[#092D5D] font-black text-2xl">
            R$ {moneyMapper(total)}
          </Text>
        </View>

        {/* Botão Salvar */}
        <TouchableOpacity
          onPress={onAddProductToOrder}
          activeOpacity={0.85}
          className="h-14 bg-[#092D5D] border border-[#092D5D] rounded-xl items-center justify-center shadow-md"
        >
          <Text className="text-center text-white font-extrabold text-sm uppercase tracking-wide">
            {isItemLoading ? <ActivityIndicator color="#ffffff" /> : "Salvar Produto"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

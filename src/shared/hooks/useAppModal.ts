import { Ionicons } from "@expo/vector-icons";
import { useModalStore } from "../store/modal-store";
import { createElement, ReactNode } from "react";
import {
  SelectionModal,
  SelectionModalProps,
} from "../components/AppModals/SelectionModal";
import {
  ListModalItemBase,
  ListModal,
  ListModalProps,
} from "../components/AppModals/ListModal";
import {
  AmountModal,
  AmountModalProps,
} from "../components/AppModals/AmountModal";
import {
  CheckboxItemsProps,
  CheckboxModal,
  CheckboxModalProps,
} from "../components/AppModals/CheckboxModal";
import {
  CustomServiceModal,
  CustomServiceModalProps,
} from "../components/AppModals/CustomServiceModal";
import {
  CustomDayPriceModal,
  CustomDayPriceModalProps,
} from "../components/AppModals/CustomDayPriceModal";

export type SelectionVariant = "primary" | "secondary" | "danger";

export interface SelectionOption {
  text: string;
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: SelectionVariant;
}

export function useAppModal() {
  const { open, close } = useModalStore();

  /*Vamos criar funções para abrir os nosso tipos diferentes
    de modal */

  //Modal para que vai da opção de abrir camera ou galeria do celular
  function showSelection({ options, title, message }: SelectionModalProps) {
    open(
      createElement(SelectionModal, {
        options,
        title,
        message,
      }),
    ); /*Estamos utilizando o create
    element e colocando o compoenente dentro dele porque esse é um
    arquivo .ts e o type script não reconheceria se passasemos assim
    <SelecitonModal > */
  }

  function showList<T extends ListModalItemBase>({
    data,
    isRefreshing,
    getList,
    keyExtractor,
    onItemPress,
    onRefetch,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    fetchNextPage,
    ...rest
  }: ListModalProps<T>) {
    open(
      createElement<ListModalProps<T>>(ListModal, {
        data,
        isRefreshing,
        getList,
        keyExtractor,
        onItemPress,
        onRefetch,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isRefetching,
        fetchNextPage,
        ...rest,
      }),
    );
  }

  function showCheckbox<T extends CheckboxItemsProps>({
    data,
    isRefreshing,
    getList,
    keyExtractor,
    onItemPress,
    title,
  }: CheckboxModalProps<T>) {
    open(
      createElement<CheckboxModalProps<T>>(CheckboxModal, {
        data,
        isRefreshing,
        getList,
        keyExtractor,
        onItemPress,
        title,
      }),
    );
  }

  function showAmount({
    amount,
    title,
    type,
    subtitle,
    control,
    buttonTitle,
    buttonAction,
  }: AmountModalProps) {
    open(
      createElement<AmountModalProps>(AmountModal, {
        title,
        type,
        subtitle,
        amount,
        buttonTitle,
        buttonAction,
        control,
      }),
    );
  }

  function showTotal({
    total,
    title,
    subtitle,
    type,
    control,
    buttonTitle,
    buttonAction,
  }: AmountModalProps) {
    open(
      createElement<AmountModalProps>(AmountModal, {
        title,
        type,
        subtitle,
        total,
        buttonTitle,
        buttonAction,
        control,
      }),
    );
  }

  function showCustomDayPriceModal({
    title,
    subtitle,
    control,
    buttonRightAction,
    buttonRightTitle,
    buttonLeftTitle,
    buttonLeftAction,
  }: CustomDayPriceModalProps) {
    open(
      createElement<CustomDayPriceModalProps>(CustomDayPriceModal, {
        title,
        subtitle,
        buttonRightAction,
        buttonRightTitle,
        buttonLeftTitle,
        buttonLeftAction,
        control,
      }),
    );
  }

  function showCustomServiceModal({
    title,
    subtitle,
    control,
    buttonRightAction,
    buttonRightTitle,
    buttonLeftTitle,
    buttonLeftAction,
  }: CustomServiceModalProps) {
    open(
      createElement<CustomServiceModalProps>(CustomServiceModal, {
        title,
        subtitle,
        buttonRightAction,
        buttonRightTitle,
        buttonLeftTitle,
        buttonLeftAction,
        control,
      }),
    );
  }
  return {
    showSelection,
    showList,
    showAmount,
    showCheckbox,
    showTotal,
    showCustomServiceModal,
    showCustomDayPriceModal,
  };
}

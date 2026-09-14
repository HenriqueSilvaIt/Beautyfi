import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

interface ClientOnboardingModalProps {
  visible: boolean;
  onDismiss: () => void;
}

interface SlideItem {
  tag: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  bgColor: string;
  iconColor: string;
  badgeBg: string;
  badgeText: string;
}

export function ClientOnboardingModal({
  visible,
  onDismiss,
}: ClientOnboardingModalProps) {
  const { width: SCREEN_WIDTH } = Dimensions.get("window");
  const SLIDE_WIDTH = SCREEN_WIDTH - 48; // 24px padding on each side
  const [slideIndex, setSlideIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const slides: SlideItem[] = [
    {
      tag: "AGENDAMENTO DESCOMPLICADO",
      title: "Agende em Poucos Toques",
      description:
        "Escolha seus serviços e profissionais favoritos a qualquer hora do dia ou da noite, com confirmação e praticidade imediata.",
      icon: "calendar",
      bgColor: "#E0F2FE", // Soft Azure
      iconColor: "#0284C7",
      badgeBg: "rgba(2, 132, 199, 0.15)",
      badgeText: "#0369A1",
    },
    {
      tag: "LOCALIZAÇÃO INTELIGENTE",
      title: "Os Melhores Perto de Você",
      description:
        "Explore salões, barbearias e clínicas parceiras na sua região, com visualização no mapa, rotas e fotos reais.",
      icon: "location",
      bgColor: "#FEF3C7", // Soft Amber/Gold
      iconColor: "#D97706",
      badgeBg: "rgba(217, 119, 6, 0.15)",
      badgeText: "#B45309",
    },
    {
      tag: "RECOMPENSAS & PRÊMIOS",
      title: "Cartão Fidelidade & Pontos",
      description:
        "Acumule carimbos e pontos em cada atendimento realizado e resgate serviços gratuitos e benefícios exclusivos no salão.",
      icon: "ribbon",
      bgColor: "#F3E8FF", // Soft Purple
      iconColor: "#9333EA",
      badgeBg: "rgba(147, 51, 234, 0.15)",
      badgeText: "#7E22CE",
    },
    {
      tag: "PRATICIDADE TOTAL",
      title: "Lembretes no WhatsApp",
      description:
        "Receba notificações automáticas no seu WhatsApp para nunca esquecer um horário agendado. Sem preocupações!",
      icon: "notifications",
      bgColor: "#DCFCE7", // Soft Emerald
      iconColor: "#16A34A",
      badgeBg: "rgba(22, 163, 74, 0.15)",
      badgeText: "#15803D",
    },
  ];

  const totalSlides = slides.length;
  const currentSlide = slides[slideIndex] || slides[0];

  const handleNext = () => {
    if (slideIndex < totalSlides - 1) {
      const nextIndex = slideIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setSlideIndex(nextIndex);
    } else {
      onDismiss();
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      const prevIndex = slideIndex - 1;
      flatListRef.current?.scrollToIndex({
        index: prevIndex,
        animated: true,
      });
      setSlideIndex(prevIndex);
    }
  };

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(offsetX / SLIDE_WIDTH);
    if (nextIndex >= 0 && nextIndex < totalSlides) {
      setSlideIndex(nextIndex);
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View className="flex-1 bg-[#092D5D]/50 justify-between">
        {/* Top Hero Area */}
        <SafeAreaView
          edges={["top"]}
          style={{ backgroundColor: currentSlide.bgColor, flex: 1 }}
          className="justify-between px-6 pb-6"
        >
          {/* Header Navigation */}
          <View className="flex-row justify-between items-center w-full pt-2">
            {slideIndex > 0 ? (
              <TouchableOpacity
                onPress={handlePrev}
                activeOpacity={0.7}
                className="flex-row items-center gap-1 bg-white/80 px-3 py-1.5 rounded-full border border-black/5"
              >
                <Ionicons name="chevron-back" size={16} color="#092D5D" />
                <Text className="text-[#092D5D] font-extrabold text-xs">Voltar</Text>
              </TouchableOpacity>
            ) : (
              <View className="flex-row items-center gap-1.5 bg-white/80 px-3.5 py-1.5 rounded-full border border-black/5">
                <Ionicons name="sparkles" size={14} color="#092D5D" />
                <Text className="text-[#092D5D] font-bold text-xs">Bem-vindo ao Beautyfi</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={onDismiss}
              activeOpacity={0.7}
              className="bg-[#092D5D]/10 px-4 py-2 rounded-full"
            >
              <Text className="text-[#092D5D] font-bold text-xs">Pular</Text>
            </TouchableOpacity>
          </View>

          {/* Central Hero Icon */}
          <View className="items-center justify-center flex-1 my-2">
            <View className="w-36 h-36 rounded-full bg-white shadow-lg items-center justify-center border-4 border-white/60">
              <Ionicons
                name={currentSlide.icon}
                size={76}
                color={currentSlide.iconColor}
              />
            </View>
            <View
              style={{ backgroundColor: currentSlide.badgeBg }}
              className="mt-4 px-3.5 py-1 rounded-full border border-white/30"
            >
              <Text
                style={{ color: currentSlide.badgeText }}
                className="text-[10px] font-black tracking-wider uppercase"
              >
                {currentSlide.tag}
              </Text>
            </View>
          </View>

          {/* Step Indicator pill */}
          <View className="items-center">
            <Text className="text-gray-500 text-[11px] font-extrabold">
              Etapa {slideIndex + 1} de {totalSlides}
            </Text>
          </View>
        </SafeAreaView>

        {/* Bottom Card Content */}
        <SafeAreaView
          edges={["bottom"]}
          className="bg-white rounded-t-[36px] shadow-2xl px-6 pt-7 pb-8"
        >
          {/* Horizontal Slide Carousel */}
          <View style={{ height: 160 }}>
            <FlatList
              ref={flatListRef}
              data={slides}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={onMomentumScrollEnd}
              snapToInterval={SLIDE_WIDTH}
              decelerationRate="fast"
              snapToAlignment="center"
              keyExtractor={(_, index) => `onboarding-slide-${index}`}
              getItemLayout={(_, index) => ({
                length: SLIDE_WIDTH,
                offset: SLIDE_WIDTH * index,
                index,
              })}
              renderItem={({ item }) => (
                <View
                  style={{ width: SLIDE_WIDTH }}
                  className="items-center justify-center px-3"
                >
                  <Text className="text-[#092D5D] text-2xl font-black text-center mb-2.5">
                    {item.title}
                  </Text>
                  <Text className="text-gray-600 text-sm text-center leading-relaxed font-medium">
                    {item.description}
                  </Text>
                </View>
              )}
            />
          </View>

          {/* Footer Controls: Dots + Action Button */}
          <View className="flex-row items-center justify-between mt-3 pt-4 border-t border-slate-100">
            {/* Dots */}
            <View className="flex-row items-center gap-1.5">
              {slides.map((_, idx) => {
                const isActive = idx === slideIndex;
                return (
                  <View
                    key={idx}
                    className={`h-2 rounded-full ${
                      isActive ? "w-7 bg-[#092D5D]" : "w-2 bg-slate-300"
                    }`}
                  />
                );
              })}
            </View>

            {/* Next / Finish Button */}
            <TouchableOpacity
              onPress={handleNext}
              activeOpacity={0.85}
              className={`px-7 py-3.5 rounded-2xl flex-row items-center gap-2 shadow-md ${
                slideIndex === totalSlides - 1
                  ? "bg-[#092D5D] border border-[#CBA35D]"
                  : "bg-[#092D5D]"
              }`}
            >
              <Text className="text-white font-extrabold text-xs uppercase tracking-wider">
                {slideIndex === totalSlides - 1 ? "Começar Agora" : "Avançar"}
              </Text>
              <Ionicons
                name={
                  slideIndex === totalSlides - 1
                    ? "sparkles"
                    : "arrow-forward"
                }
                size={16}
                color={slideIndex === totalSlides - 1 ? "#CBA35D" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

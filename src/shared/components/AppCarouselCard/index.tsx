import { AdvertisementProps } from "../../interfaces/http/advertisement";
import { FlatList, Image, Text, View } from "react-native";
import { LocalImage } from "../../../viewModel/Home/useHomeViewModel";
import { useState } from "react";
import { ReanimatedFlatList } from "react-native-reanimated/lib/typescript/component/FlatList";
import { CarouselImage } from "./CarouselImage";
import { getCloudinaryCarousel } from "@/shared/helpers/AppCloudinaryAvatar";

interface AppCarouselCardProps {
  data: AdvertisementProps[];
  flatListRef?: React.RefObject<ReanimatedFlatList<AdvertisementProps> | null>;
  onScroll: (event: any) => void;
  currentIndex: number;
  width: number;
  loadingImage?: boolean;
  resetAutoPlay?: () => void;
}

export function AppCarouselCard({
  data,
  flatListRef,
  onScroll,
  currentIndex,
  width,
  loadingImage,
  resetAutoPlay,
}: AppCarouselCardProps) {
  const [hasError, setHasError] = useState(false);
  const carouselHeight = Math.round((width * 9) / 16);

  // const carouselHeight = width * 1.2;
  return (
    <View className="aspect-[16/9]">
      <View className="border border-gray-600 rounded-2xl overflow-hidden">
        <FlatList<AdvertisementProps>
          ref={flatListRef}
          data={data}
          horizontal
          pagingEnabled
          onTouchStart={resetAutoPlay}
          onScroll={onScroll}
          scrollEventThrottle={16} // ← necessário para onScroll funcionar bem
          showsHorizontalScrollIndicator={false}
          keyExtractor={({ id }) => `carousel-${id}`}
          onScrollToIndexFailed={(info) => {
            // ← fallback se item não renderizou ainda
            flatListRef?.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
          renderItem={({ item }) => {
            return (
              <View
                className="h-[100%] rounded-lg relative "
                style={{ width: width }}
              >
                <CarouselImage
                  uri={item.imgUrl}
                  width={width}
                  height={carouselHeight}
                  loadingImage={loadingImage}
                />

                <View
                  style={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    padding: 16,
                    backgroundColor: "rgba(0,0,0,0.5)",
                  }}
                >
                  <Text
                    className="text-font-primary font-semibold pb-2 text-center"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {item.title}
                  </Text>
                </View>
                <View className="flex-1 flex-row absolute bottom-3 justify-center items-center w-[100%] ">
                  {data.map((_, index) => (
                    <View
                      key={index}
                      style={{
                        width: currentIndex === index ? 10 : 8,
                        height: currentIndex === index ? 10 : 8,
                        borderRadius: 10,
                        marginHorizontal: 4,
                        backgroundColor:
                          currentIndex === index
                            ? "#F59C0C"
                            : "rgba(255,255,255,0.4)",
                      }}
                    />
                  ))}
                </View>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

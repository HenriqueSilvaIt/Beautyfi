import { Image, ActivityIndicator, View, Text } from "react-native";
import { useState } from "react";

interface CarouselImageProps {
  uri: string;
  width: number;
  height: number;
  loadingImage?: boolean;
}

export function CarouselImage({ uri, width, height, loadingImage }: CarouselImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <View style={{ width, height, overflow: "hidden", borderRadius: 16 }}>
      {/* Fundo borrado */}
      {!hasError && (
        <Image
          source={{ uri }}
          style={{ position: "absolute", width: "100%", height: "100%" }}
          resizeMode="cover"
          blurRadius={20}
          onError={() => setHasError(true)}
        />
      )}

      {/* Imagem principal */}
      {!hasError ? (
        <Image
          source={{ uri }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
          onError={() => setHasError(true)}
        />
      ) : (
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#333",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white" }}>Falha ao carregar</Text>
        </View>
      )}

      {/* Loading indicator */}
      {loadingImage && !hasError && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator color="white" />
        </View>
      )}
    </View>
  );
}
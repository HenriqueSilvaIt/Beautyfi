import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Platform, Linking } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";

interface AppMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  latitude: number;
  longitude: number;
  companyName: string;
  companyAddress?: string;
}

export function AppMapModal({ isOpen, onClose, latitude, longitude, companyName, companyAddress }: AppMapModalProps) {
  const handleOpenRoute = () => {
    // Query search using only companyAddress if available, otherwise fallback to companyName
    const query = encodeURIComponent(companyAddress || companyName);
    const url = Platform.select({
      ios: `maps://0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    
    Linking.openURL(url).catch((err) => {
      console.error("Failed to open map app:", err);
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
    });
  };

  return (
    <Modal visible={isOpen} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.title} numberOfLines={1}>{companyName}</Text>
              <Text style={styles.subtitle} numberOfLines={2}>
                {companyAddress || "Localização do estabelecimento"}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color="#092D5D" />
            </TouchableOpacity>
          </View>
          
          <View style={{ flex: 1, position: "relative" }}>
            <MapView
              key={`${latitude}-${longitude}`}
              style={styles.map}
              initialRegion={{
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              <Marker 
                coordinate={{ latitude, longitude }} 
                title={companyName}
                pinColor="#CBA35D"
              />
            </MapView>
            
            <TouchableOpacity 
              onPress={handleOpenRoute}
              activeOpacity={0.8}
              style={styles.routeBtn}
            >
              <Ionicons name="navigate" size={18} color="#ffffff" />
              <Text style={styles.routeBtnText}>Como Chegar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(9, 45, 93, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container: {
    width: "100%",
    height: "60%",
    backgroundColor: "#ffffff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#092D5D",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#092D5D",
  },
  subtitle: {
    fontSize: 12,
    color: "#94a3b8",
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: "#FAF8EF",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  map: {
    flex: 1,
  },
  routeBtn: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#092D5D",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  routeBtnText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 6,
  },
});

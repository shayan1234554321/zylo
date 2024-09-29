import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Map from "@/components/Map";
import { icons } from "@/constants/icons";

const RideLayout = ({
  title,
  snapPoints,
  noBack,
  children,
}: {
  title: string;
  snapPoints?: string[];
  noBack?: boolean;
  children: React.ReactNode;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.mainView}>
        <View style={styles.headerContainer}>
          {!noBack && (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <View style={styles.backButtonInner}>
                <Image source={icons.backArrow} style={styles.backArrow} />
              </View>
            </TouchableOpacity>
          )}
          <Text style={styles.title}>{title || "Go Back"}</Text>
        </View>

        <Map />

        <BottomSheet
          ref={bottomSheetRef}
          snapPoints={snapPoints || ["40%", "85%"]}
          index={0}
        >
          {title === "Choose a Rider" ? (
            <BottomSheetView style={styles.bottomSheetView}>
              {children}
            </BottomSheetView>
          ) : (
            <BottomSheetScrollView style={styles.bottomSheetScrollView}>
              {children}
            </BottomSheetScrollView>
          )}
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainView: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonInner: {
    width: 40,
    height: 40,
    backgroundColor: "white",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  backArrow: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
    marginLeft: 10,
  },
  bottomSheetView: {
    flex: 1,
    padding: 20,
  },
  bottomSheetScrollView: {
    flex: 1,
    padding: 20,
  },
});

export default RideLayout;

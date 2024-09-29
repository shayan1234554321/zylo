import { StyleSheet, Text, View } from "react-native";
import React from "react";

const NoInternetBar = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No Internet</Text>
    </View>
  );
};

export default NoInternetBar;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 30,
  },
  text: {
    color: "white",
    fontSize: 14,
    fontFamily: "Poppins",
  }
});

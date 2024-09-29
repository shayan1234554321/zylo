import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { icons } from "../constants/icons";
import { DriverCardProps } from "@/types/type";
import { carTypeSeats } from "@/utility/constant";
import { mainURL } from "@/utility/api";
import { Colors } from "@/utility/colors";

const DriverCard: React.FC<DriverCardProps> = ({
  item,
  selected,
  setSelected,
}: DriverCardProps) => {
  return (
    <TouchableOpacity
      onPress={() => setSelected(item?._id)}
      style={[
        styles.container,
        selected === item?._id ? styles.selected : styles.unselected,
      ]}
    >
      <Image
        source={{ uri: mainURL + item?.profilePic }}
        style={styles.profileImage}
      />

      <View style={styles.infoContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{item?.name}</Text>
          <View style={styles.ratingContainer}>
            <Image source={icons.star} style={styles.ratingIcon} />
            <Text style={styles.ratingText}>
              {item?.rating === 0 ? "Un-Rated" : item?.rating}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.timeText}>5 Min</Text>
          <Text style={styles.separator}>|</Text>
          <Text style={styles.seatsText}>
            {carTypeSeats.find((c) => c.key === item?.carType)?.seat || 0} seats
          </Text>
        </View>
      </View>

      <Image
        source={carTypeSeats.find((c) => c.key === item?.carType)?.icon}
        style={styles.carImage}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  selected: {
    backgroundColor: Colors.backgroundLight,
  },
  unselected: {
    backgroundColor: "#fff",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  ratingIcon: {
    width: 15,
    height: 15,
  },
  ratingText: {
    fontSize: 14,
    marginLeft: 5,
  },
  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  priceIcon: {
    width: 15,
    height: 15,
  },
  priceText: {
    fontSize: 14,
    marginLeft: 5,
  },
  separator: {
    fontSize: 14,
    marginHorizontal: 10,
  },
  timeText: {
    fontSize: 14,
  },
  seatsText: {
    fontSize: 14,
  },
  carImage: {
    width: 70,
    height: 70,
  },
});

export default DriverCard;

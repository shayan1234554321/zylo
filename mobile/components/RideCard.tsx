import { Image, StyleSheet, Text, View } from "react-native";

import { icons } from "@/constants/icons";
import { formatDate } from "@/lib/utils";
import { Ride } from "@/types/type";
import { carTypeSeats } from "@/utility/constant";

const RideCard = ({ ride }: { ride: Ride }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <Image
          source={{
            uri: `https://maps.googleapis.com/maps/api/staticmap?center=${ride.destination.coordinates[0]},${ride.destination.coordinates[1]}&zoom=14&size=600x400&maptype=roadmap&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`,
          }}
          style={styles.mapImage}
        />

        <View style={styles.rideInfo}>
          <View style={styles.rideInfoRow}>
            <Image source={icons.to} style={styles.icon} />
            <Text style={styles.rideInfoText} numberOfLines={1}>
              {ride.locationName}
            </Text>
          </View>

          <View style={styles.rideInfoRow}>
            <Image source={icons.point} style={styles.icon} />
            <Text style={styles.rideInfoText} numberOfLines={1}>
              {ride.destinationName}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomSection}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Date & Time</Text>
          <Text style={styles.value}>{formatDate(ride.createdAt)}</Text>
        </View>
        {ride.driver && (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Driver</Text>
              <Text style={styles.value}>{ride.driver.name}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.label}>Car Seats</Text>
              <Text style={styles.value}>{carTypeSeats.find((c) => c.key === ride.driver.carType)?.seat || 0}</Text>
            </View>
          </>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.label}>Payment Status</Text>
          <Text
            style={[styles.value, ride.driver ? styles.paid : styles.unpaid]}
          >
            {ride.driver ? "Paid" : "UnPaid"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 1,
    marginBottom: 20,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  mapImage: {
    width: 80,
    height: 90,
    borderRadius: 10,
  },
  rideInfo: {
    flex: 1,
    marginLeft: 10,
  },
  rideInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  rideInfoText: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  bottomSection: {
    backgroundColor: "#F7F7F7",
    borderRadius: 10,
    padding: 15,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: "gray",
  },
  value: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
  },
  paid: {
    color: "green",
  },
  unpaid: {
    color: "red",
  },
});

export default RideCard;

import { Image, StyleSheet, Text, View } from "react-native";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import API, { mainURL } from "@/utility/api";
import { Colors } from "@/utility/colors";
import CustomButton from "@/components/CustomButton";
import axios from "axios";
import { router } from "expo-router";

const BookRide = () => {
  const { userLocation, destinationLocation, ride, setRide, user } =
    useGlobalContext();

  const userDetails = ride.user;

  const handleClick = async () => {
    if (ride.status === "assigned") {
      await axios.put(
        API.ride.startRide,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setRide((prev: any) => ({ ...prev, status: "onRide" }));
    } else {
      await axios.put(
        API.ride.completed,
        {
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setRide((prev: any) => ({ ...prev, status: "completed" }));
      router.push("/(root)/(tabs)/home");
    }
  };

  return (
    <RideLayout
      noBack
      title={
        ride.status === "assigned" ? "Rider is Waiting" : "You are on the Way"
      }
    >
      <>
        <Text style={styles.rideInfoHeader}>Ride Information</Text>

        <View style={styles.driverInfoContainer}>
          <Image
            source={{ uri: mainURL + userDetails?.profilePic }}
            style={styles.driverImage}
          />

          <View style={styles.driverDetailsContainer}>
            <Text style={styles.driverName}>{userDetails?.name}</Text>
          </View>
        </View>

        <View style={styles.addressContainer}>
          <View style={styles.addressRow}>
            <Image source={icons.to} style={styles.addressIcon} />
            <Text style={styles.addressText}>{userLocation?.address}</Text>
          </View>

          <View style={styles.addressRow}>
            <Image source={icons.point} style={styles.addressIcon} />
            <Text style={styles.addressText}>
              {destinationLocation?.address}
            </Text>
          </View>
          <CustomButton
            title={
              ride.status === "assigned" ? "I have Arrived" : "Ride Completed"
            }
            onPress={handleClick}
            bgVariant="secondary"
            style={{ marginTop: 20 }}
          />
        </View>
      </>
    </RideLayout>
  );
};

const styles = StyleSheet.create({
  rideInfoHeader: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
    marginBottom: 15,
  },
  driverInfoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  driverImage: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },
  driverDetailsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  driverName: {
    fontSize: 21,
    fontFamily: "Poppins",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  ratingStar: {
    width: 20,
    height: 20,
  },
  ratingText: {
    fontSize: 18,
    fontFamily: "Poppins",
    marginLeft: 5,
  },
  rideDetailsContainer: {
    backgroundColor: Colors.backgroundLight,
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  rideDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "white",
    paddingVertical: 15,
  },
  rideDetailLabel: {
    fontSize: 18,
    fontFamily: "Poppins",
  },
  rideDetailValue: {
    fontSize: 18,
    fontFamily: "Poppins",
    color: "#0CC25F",
  },
  addressContainer: {
    marginTop: 20,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#455A64",
  },
  addressIcon: {
    width: 24,
    height: 24,
  },
  addressText: {
    fontSize: 18,
    fontFamily: "Poppins",
    marginLeft: 10,
  },
  paymentContainer: {
    marginTop: 20,
  },
});

export default BookRide;

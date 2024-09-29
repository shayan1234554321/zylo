import { Image, StyleSheet, Text, View } from "react-native";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import { mainURL } from "@/utility/api";
import { carTypeSeats } from "@/utility/constant";
import { Colors } from "@/utility/colors";
import Toast from "react-native-toast-message";
import { router } from "expo-router";

const BookRide = () => {
  const { userLocation, destinationLocation, ride, socket, setRide } =
    useGlobalContext();

  const driverDetails = ride.driver;

  socket.on("rideStarted", () => {
    setRide((prev: any) => ({ ...prev, status: "onRide" }));
    Toast.show({
      type: "success",
      text1: "Driver Arrived",
      text2: "Happy Journey",
    });
  });

  socket.on("rideEnded", () => {
    setRide((prev: any) => ({ ...prev, status: "finished" }));
    Toast.show({
      type: "success",
      text1: "Ride Completed",
      text2: "See you again soon",
    });
    router.push("/(root)/(tabs)/home");
  });

  return (
    <RideLayout
      noBack
      title={ride.status === "assigned" ? "Driver on the Way" : "On the Way"}
    >
      <>
        <Text style={styles.rideInfoHeader}>Ride Information</Text>

        <View style={styles.driverInfoContainer}>
          <Image
            source={{ uri: mainURL + driverDetails?.profilePic }}
            style={styles.driverImage}
          />

          <View style={styles.driverDetailsContainer}>
            <Text style={styles.driverName}>{driverDetails?.name}</Text>
            <View style={styles.ratingContainer}>
              <Image source={icons.star} style={styles.ratingStar} />
              <Text style={styles.ratingText}>
                {driverDetails?.rating === 0 ? "Un-Rated" : driverDetails.rating}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.rideDetailsContainer}>
          {/* <View style={styles.rideDetailRow}>
              <Text style={styles.rideDetailLabel}>Ride Price</Text>
              <Text style={styles.rideDetailValue}>
                ${driverDetails?.price}
              </Text>
            </View> */}

          <View style={styles.rideDetailRow}>
            <Text style={styles.rideDetailLabel}>Pickup Time</Text>
            <Text style={styles.rideDetailValue}>5 Min</Text>
          </View>

          <View style={styles.rideDetailRow}>
            <Text style={styles.rideDetailLabel}>Car Seats</Text>
            <Text style={styles.rideDetailValue}>
              {carTypeSeats.find((c) => c.key === driverDetails?.carType)
                ?.seat || 0}{" "}
              seats
            </Text>
          </View>
          <View style={styles.rideDetailRow}>
            <Text style={styles.rideDetailLabel}>Car Type</Text>
            <Text style={styles.rideDetailValue}>{driverDetails?.carType}</Text>
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
        </View>

        {/* <Payment
            fullName={user?.fullName!}
            email={user?.emailAddresses[0].emailAddress!}
            amount={driverDetails?.price!}
            driverId={driverDetails?.id}
            rideTime={driverDetails?.time!}
          /> */}
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
    borderBottomColor: "#455A64", // replace with your desired color (general-700)
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

import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import GoogleTextInput from "@/components/GoogleTextInput";
import RideLayout from "@/components/RideLayout";
import { icons } from "@/constants/icons";
import { useGlobalContext } from "@/context/GlobalProvider";
import axios from "axios";
import API from "@/utility/api";
import Toast from "react-native-toast-message";
// import { useLocationStore } from "@/store";

const FindRide = () => {
  const {
    user,
    userLocation,
    setUserLocation,
    destinationLocation,
    setDestinationLocation,
    setRide,
  } = useGlobalContext();

  const handlePress = async () => {
    try {
      const response = await axios.post(
        API.ride.create,
        {
          location: {
            type: "Point",
            coordinates: [userLocation.latitude, userLocation.longitude],
          },
          destination: {
            type: "Point",
            coordinates: [
              destinationLocation.latitude,
              destinationLocation.longitude,
            ],
          },
          locationName: userLocation.address!,
          destinationName: destinationLocation.address!,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setRide(response.data.ride);

      router.push(`/(root)/confirm-ride`);
    } catch (e) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong",
      });
    }
  };

  return (
    <RideLayout title="Ride">
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>From</Text>

        <GoogleTextInput
          icon={icons.target}
          initialLocation={userLocation.address!}
          containerStyle={styles.inputContainer}
          textInputBackgroundColor="#f5f5f5"
          handlePress={(location) => setUserLocation(location)}
          disabled
        />
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionHeader}>To</Text>

        <GoogleTextInput
          icon={icons.map}
          initialLocation={destinationLocation.address!}
          containerStyle={styles.inputContainer}
          textInputBackgroundColor="transparent"
          handlePress={(location) => setDestinationLocation(location)}
          disabled
        />
      </View>

      <CustomButton
        title="Create Ride"
        onPress={handlePress}
        style={styles.button}
      />
    </RideLayout>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 15,
  },
  sectionHeader: {
    fontSize: 21,
    fontFamily: "Poppins",
    marginBottom: 10,
  },
  inputContainer: {
    backgroundColor: "#f5f5f5",
  },
  button: {
    marginTop: 30,
  },
});

export default FindRide;

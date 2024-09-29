import { router } from "expo-router";
import { FlatList, StyleSheet, View } from "react-native";

import CustomButton from "@/components/CustomButton";
import DriverCard from "@/components/DriverCard";
import RideLayout from "@/components/RideLayout";
import { useGlobalContext } from "@/context/GlobalProvider";
import Toast from "react-native-toast-message";
import { useState } from "react";
import axios from "axios";
import API from "@/utility/api";

const ConfirmRide = () => {
  const { user, selectedDriver, setSelectedDriver, socket, ride, setRide } =
    useGlobalContext();

  const [offers, setOffers] = useState<any>(ride.offers || []);

  socket.on("presentOffer", (offer: any) => {
    setOffers((prev: any) => [...prev, offer]);
  });

  const handlePress = async () => {
    const selectedOffer = offers.find(
      (offer: any) => offer.driver._id === selectedDriver
    );
    try {
      const response = await axios.put(
        API.ride.acceptOffer,
        {
          driver: selectedOffer.driver._id,
          price: selectedOffer.price,
          rideId: ride._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setRide(response.data);
      Toast.show({
        type: "success",
        text1: "Ride started",
      });
      router.push(`/(root)/book-ride`);
    } catch (e: any) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Something went wrong",
      });
    }
  };

  return (
    <RideLayout title={"Choose a Rider"} snapPoints={["65%", "85%"]}>
      <FlatList
        data={offers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <DriverCard
            item={item.driver}
            selected={selectedDriver}
            setSelected={setSelectedDriver}
          />
        )}
        ListFooterComponent={() => (
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Start Ride"
              onPress={() => {
                if (selectedDriver) {
                  handlePress();
                } else {
                  Toast.show({
                    type: "error",
                    text1: "Please select a driver",
                  });
                }
              }}
            />
          </View>
        )}
      />
    </RideLayout>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    marginHorizontal: 20,
    marginTop: 40,
  },
});

export default ConfirmRide;

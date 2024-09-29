import { Image, StyleSheet, Text, View } from "react-native";

import { icons } from "@/constants/icons";
import { formatDate } from "@/lib/utils";
import CustomButton from "./CustomButton";
import { InputField } from "./InputField";
import { useState } from "react";
import Toast from "react-native-toast-message";
import axios from "axios";
import API from "@/utility/api";
import { useGlobalContext } from "@/context/GlobalProvider";

const RideCard = ({ ride }: { ride: any }) => {
  const { user } = useGlobalContext();
  const [offer, setOffer] = useState<number>(0);
  const [offerMade, setOfferMade] = useState<number>(0);

  const HandlePress = async () => {
    if (offer > 0) {
      try {
        await axios.put(
          API.ride.presentOffer,
          {
            rideId: ride._id,
            offer: {
              driver: user._id,
              price: offer,
              location: {
                type: "Point",
                coordinates: user.location.coordinates,
              },
            },
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        setOfferMade(offer);
      } catch (e: any) {}
    } else {
      Toast.show({
        type: "error",
        text1: "Enter Offer",
      });
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: `https://maps.googleapis.com/maps/api/staticmap?center=${ride.destination.coordinates[0]},${ride.destination.coordinates[1]}&markers=color:red%7C${ride.destination.coordinates[0]},${ride.destination.coordinates[1]}&zoom=15&size=600x400&maptype=roadmap&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        }}
        style={styles.mapImage}
      />
      <View style={styles.topSection}>
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
        {ride.status !== "pending" ? (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Offer</Text>
            <Text style={styles.value}>{ride.price} $</Text>
          </View>
        ) : offerMade ? (
          <Text>Offer made of {offerMade} $</Text>
        ) : (
          <>
            <InputField
              label="Offer $"
              placeholder="25"
              textContentType="telephoneNumber"
              value={offer.toString()}
              onChangeText={(e: string) => setOffer(Math.abs(parseInt(e) || 0))}
              maxLength={6}
            />
            <CustomButton
              bgVariant="secondary"
              title="Confirm Offer"
              onPress={HandlePress}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 1,
    marginBottom: 20,
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  mapImage: {
    width: "100%",
    height: 180,
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

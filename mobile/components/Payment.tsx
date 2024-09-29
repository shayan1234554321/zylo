import { useStripe } from "@stripe/stripe-react-native";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, StyleSheet, Text, View } from "react-native";
import { ReactNativeModal } from "react-native-modal";

import CustomButton from "@/components/CustomButton";
import { images } from "@/constants/icons";
import { fetchAPI } from "@/lib/fetch";
import { PaymentProps } from "@/types/type";
import { useGlobalContext } from "@/context/GlobalProvider";

const Payment = ({
  fullName,
  email,
  amount,
  driverId,
  rideTime,
}: PaymentProps) => {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const {
    userAddress,
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationAddress,
    destinationLongitude,
  } = {
    userAddress: "",
    userLongitude: 0,
    userLatitude: 0,
    destinationLatitude: 0,
    destinationAddress: "",
    destinationLongitude: 0,
  }

  const { user: userId } = useGlobalContext();
  const [success, setSuccess] = useState(false);

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      setSuccess(true);
    }
  };

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      intentConfiguration: {
        mode: {
          amount: Math.floor(45 * 100),
          currencyCode: 'usd',
        },
        confirmHandler: async (
          paymentMethod,
          shouldSavePaymentMethod,
          intentCreationCallback,
        ) => {
          const response = await fetchAPI('/api/stripe/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: fullName || email.split('@')[0],
              email,
              amount,
              paymentMethodId: paymentMethod.id,
            }),
          });

          const { paymentIntent, customer } = await response.json();

          if (paymentIntent.client_secret) {
            const paymentResponse = await fetchAPI('/api/stripe/pay', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                payment_method_id: paymentMethod.id,
                payment_intent_id: paymentIntent.id,
                customer_id: customer,
                client_secret: paymentIntent.client_secret,
              }),
            });

            const result = await paymentResponse.json();

            if (result.client_secret) {
              await fetchAPI('/api/ride/create', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  origin_address: userAddress,
                  destination_address: destinationAddress,
                  origin_latitude: userLatitude,
                  origin_longitude: userLongitude,
                  destination_latitude: destinationLatitude,
                  destination_longitude: destinationLongitude,
                  ride_time: Math.floor(rideTime),
                  fare_price: Math.floor(45 * 100),
                  payment_status: 'paid',
                  driver_id: driverId,
                  user_id: userId,
                }),
              });

              intentCreationCallback({
                clientSecret: result.client_secret,
              });
            }
          }
        },
      },
      returnURL: 'myapp://book-ride',
    });

    if (!error) {
      // setLoading(true);
    }
  };

  return (
    <>
      <CustomButton title="Confirm Ride" onPress={openPaymentSheet} style={styles.button} />

      <ReactNativeModal isVisible={success} onBackdropPress={() => setSuccess(false)}>
        <View style={styles.modal}>
          <Image source={images.check} style={styles.image} />

          <Text style={styles.title}>Booking placed successfully</Text>

          <Text style={styles.description}>
            Thank you for your booking. Your reservation has been successfully placed. Please proceed with your trip.
          </Text>

          <CustomButton
            title="Back Home"
            onPress={() => {
              setSuccess(false);
              // Replace with navigation library (e.g., React Navigation)
              // router.push("/(root)/(tabs)/home");
            }}
            style={styles.button}
          />
        </View>
      </ReactNativeModal>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 10,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default Payment;

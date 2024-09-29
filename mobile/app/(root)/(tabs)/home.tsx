import * as Location from "expo-location";
import { router } from "expo-router";
import { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import GoogleTextInput from "@/components/GoogleTextInput";
import Map from "@/components/Map";
import RideCard from "@/components/RideCard";
import AvailableRideCard from "@/components/AvailableRideCard";
import { icons, images } from "@/constants/icons";
import { Ride } from "@/types/type";
import { useGlobalContext } from "@/context/GlobalProvider";
import { saveToLocalStorage } from "@/hooks/localStorage";
import { signOut } from "@/hooks/serverActions";
import axios from "axios";
import API from "@/utility/api";
import { calculateDriverTimes } from "@/lib/map";
import { Href } from "expo-router";

const Home = () => {
  const {
    user,
    setUser,
    setDrivers,
    userLocation,
    setUserLocation,
    setDestinationLocation,
    setRide,
    socket,
  } = useGlobalContext();

  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState<Boolean>(true);
  const handleSignOut = async () => {
    await signOut(user.token);
    await saveToLocalStorage("userToken", null);
    setUser(null);
    if (router.canDismiss()) {
      router.dismissAll();
    }
    router.replace("/(auth)/sign-in");
  };

  socket.on("newRide", (ride: any) => {
    if (user?.type === "driver") {
      setRides((prev: any) => {
        const found = prev.find((r: any) => r._id === ride._id);
        if (found) {
          return prev;
        }

        return [...prev, ride];
      });
    }
  });

  socket.on("offerAccepted", (ride: any) => {
    if (user?.type === "driver") {
      setUserLocation({
        latitude: ride.location.coordinates[0],
        longitude: ride.location.coordinates[1],
        address: ride.locationName,
      });
      setDestinationLocation({
        latitude: ride.destination.coordinates[0],
        longitude: ride.destination.coordinates[1],
        address: ride.destinationName,
      });
      setRide(ride);
      router.push("/(root)/driver-ride" as Href<string | object>);
    }
  });

  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasPermission(false);
        return;
      }

      setHasPermission(true);

      try {
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: location.coords?.latitude!,
          longitude: location.coords?.longitude!,
          // latitude: 33.9758898,
          // longitude: 71.9872803,
        });
        await axios.put(
          API.user.updateLocation,
          {
            location: {
              type: "Point",
              coordinates: [
                location.coords?.latitude,
                location.coords?.longitude,
              ],
            },
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );
        setUserLocation({
          latitude: location.coords?.latitude,
          longitude: location.coords?.longitude,
          address: `${address[0].name}, ${address[0].region}`,
        });
      } catch (e) {
        setUserLocation({
          latitude: 34.015137,
          longitude: 71.524915,
          address: `Peshawar Pakistan`,
        });
      }
    })();

    (async () => {
      try {
        const rides: any = await axios.get(API.ride.recentRides, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (rides.data.length > 0) {
          setRecentRides(rides.data);
          const rideAssigned = rides.data.find(
            (ride: any) =>
              ride.status === "assigned" || ride.status === "onRide"
          );

          if (rideAssigned) {
            setUserLocation({
              latitude: rideAssigned.location.coordinates[0],
              longitude: rideAssigned.location.coordinates[1],
              address: rideAssigned.locationName,
            });
            setDestinationLocation({
              latitude: rideAssigned.destination.coordinates[0],
              longitude: rideAssigned.destination.coordinates[1],
              address: rideAssigned.destinationName,
            });
            setRide(rideAssigned);
            if (user?.type === "driver") {
              router.push("/(root)/driver-ride" as Href<string | object>);
            } else {
              router.push("/(root)/book-ride");
            }
            return;
          }
          const ridePending = rides.data.find(
            (ride: any) => ride.status === "pending"
          );
          if (ridePending) {
            setUserLocation({
              latitude: ridePending.location.coordinates[0],
              longitude: ridePending.location.coordinates[1],
              address: ridePending.locationName,
            });
            setDestinationLocation({
              latitude: ridePending.destination.coordinates[0],
              longitude: ridePending.destination.coordinates[1],
              address: ridePending.destinationName,
            });
            setRide(ridePending);
            router.push("/(root)/confirm-ride");
            return;
          }
        }
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (userLocation?.latitude && userLocation?.latitude !== 0) {
      if (user?.type !== "driver") {
        (async () => {
          try {
            const drivers = await axios.post(
              API.user.getDrivers,
              {
                latitude: userLocation?.latitude,
                longitude: userLocation?.longitude,
              },
              {
                headers: {
                  Authorization: `Bearer ${user?.token}`,
                },
              }
            );
            const newMarkers = await calculateDriverTimes({
              markers: drivers.data,
              userLatitude: userLocation?.latitude,
              userLongitude: userLocation?.longitude,
            });
            if (drivers.data) setDrivers(newMarkers);
          } catch (err: any) {
            console.log(err);
          }
        })();
      } else {
        (async () => {
          try {
            const rides = await axios.get(API.ride.availableRides, {
              headers: {
                Authorization: `Bearer ${user?.token}`,
              },
            });
            if (rides.data) setRides(rides.data);
          } catch (err: any) {
            console.log(err);
          } finally {
            setLoading(false);
          }
        })();
      }
    }
  }, [userLocation]);

  const handleDestinationPress = (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setDestinationLocation(location);
    router.push("/(root)/find-ride");
  };

  return (
    <View>
      {user?.type === "driver" ? (
        <FlatList
          data={rides}
          renderItem={({ item }) => <AvailableRideCard ride={item} />}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              {!loading ? (
                <>
                  <Image
                    source={images.noResult}
                    style={styles.emptyImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyText}>No recent rides found</Text>
                </>
              ) : (
                <ActivityIndicator size="small" color="#000" />
              )}
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome {user?.name}</Text>
                <TouchableOpacity
                  onPress={handleSignOut}
                  style={styles.signOutButton}
                >
                  <Image source={icons.out} style={styles.signOutIcon} />
                </TouchableOpacity>
              </View>

              <Text style={styles.recentRidesText}>Available Rides</Text>
            </>
          )}
        />
      ) : (
        <FlatList
          data={recentRides?.slice(0, 5)}
          renderItem={({ item }) => <RideCard ride={item} />}
          keyExtractor={(item, index) => index.toString()}
          style={styles.list}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              {!loading ? (
                <>
                  <Image
                    source={images.noResult}
                    style={styles.emptyImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.emptyText}>No recent rides found</Text>
                </>
              ) : (
                <ActivityIndicator size="small" color="#000" />
              )}
            </View>
          )}
          ListHeaderComponent={() => (
            <>
              <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome {user?.name}</Text>
                <TouchableOpacity
                  onPress={handleSignOut}
                  style={styles.signOutButton}
                >
                  <Image source={icons.out} style={styles.signOutIcon} />
                </TouchableOpacity>
              </View>

              <GoogleTextInput
                icon={icons.search}
                containerStyle={styles.searchContainer}
                handlePress={handleDestinationPress}
              />

              <View>
                <Text style={styles.locationText}>Your current location</Text>
                <View style={styles.mapContainer}>
                  <Map />
                </View>
              </View>

              <Text style={styles.recentRidesText}>Recent Rides</Text>
            </>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 20,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyImage: {
    width: 160,
    height: 160,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
  },
  signOutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  signOutIcon: {
    width: 20,
    height: 20,
  },
  searchContainer: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  locationText: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    marginTop: 20,
    marginBottom: 10,
  },
  mapContainer: {
    height: 300,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
  },
  recentRidesText: {
    fontSize: 20,
    fontFamily: "PoppinsBold",
    marginTop: 20,
    marginBottom: 10,
  },
});

export default Home;

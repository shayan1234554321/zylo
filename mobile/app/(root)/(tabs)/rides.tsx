import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import RideCard from "@/components/RideCard";
import AvailableRideCard from "@/components/AvailableRideCard";
import { images } from "@/constants/icons";
import { Ride } from "@/types/type";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useEffect, useState } from "react";
import API from "@/utility/api";
import axios from "axios";

const Rides = () => {
  const { user } = useGlobalContext();
  const [recentRides, setRecentRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const rides: any = await axios.get(API.ride.recentRides, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        setRecentRides(rides.data);
      } catch (err: any) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <FlatList
      data={recentRides}
      renderItem={({ item }) => (
        <>
          {user.type === "driver" ? (
            <AvailableRideCard ride={item} />
          ) : (
            <RideCard ride={item} />
          )}
        </>
      )}
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
      ListHeaderComponent={() => <Text style={styles.header}>All Rides</Text>}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
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
    fontSize: 24,
    fontFamily: "PoppinsBold",
    marginVertical: 20,
  },
});

export default Rides;

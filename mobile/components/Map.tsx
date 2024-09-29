import React from "react";
import { StyleSheet } from "react-native";
import MapView, {
  Marker,
  PROVIDER_DEFAULT,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { icons } from "@/constants/icons";
import { calculateRegion } from "@/lib/map";
import { useGlobalContext } from "@/context/GlobalProvider";

const directionsAPI = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const Map = () => {
  const { userLocation, destinationLocation, selectedDriver, drivers } =
    useGlobalContext();

  const region = calculateRegion({
    userLatitude: userLocation.latitude,
    userLongitude: userLocation.longitude,
    destinationLatitude: destinationLocation.latitude,
    destinationLongitude: destinationLocation.longitude,
  });

  return (
    <MapView
      provider={PROVIDER_GOOGLE}
      style={styles.map}
      showsPointsOfInterest={false}
      initialRegion={region} 
      showsUserLocation={true}
      userInterfaceStyle="light"
      zoomControlEnabled
      mapType="terrain"
    >
      {drivers?.map((marker: any) => (
        <Marker
          key={marker._id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver?._id === marker._id
              ? icons.selectedMarker
              : icons.marker
          }
        />
      ))}

      {!!destinationLocation.latitude && !!destinationLocation.longitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{
              latitude: userLocation.latitude!,
              longitude: userLocation.longitude!,
            }}
            destination={{
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            }}
            apikey={directionsAPI!}
            strokeColor="#0286FF"
            strokeWidth={2}
          />
        </>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  map: {
    flex: 1,
    borderRadius: 10,
    width: "100%",
    height: "100%",
  },
});

export default Map;

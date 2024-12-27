import { Image, StyleSheet, Platform, View, Animated } from "react-native";

import React, { useRef, useEffect, useState } from "react";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import scooters from "../../data/scooters.json";icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain', // Scales the image properly
  },
export default function HomeScreen() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Location.requestForegroundPermissionsAsync();
  //     if (status !== "granted") {
  //       console.log("Permission to access location was denied");
  //       return;
  //     }

  //     const currentLocation = await Location.getCurrentPositionAsync({});
  //     setLocation(currentLocation.coords);
  //   })();
  // }, []);

  // useEffect(() => {
  //   if (location && mapRef.current) {
  //     mapRef.current.animateCamera({
  //       center: {
  //         latitude: location.latitude,
  //         longitude: location.longitude,
  //       },
  //       zoom: 16,
  //       heading: 0,
  //       pitch: 0,
  //     });
  //   }
  // }, [location]);

  // Fetch the user's current location
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, timeInterval: 1000 },
        (loc) => setLocation(loc.coords)
      );
    })();
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 3, // Scale up
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1, // Scale down
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);
  return (
    <View style={styles.container}>
      {/* <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        followsUserLocation={true}
        showsCompass={true}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="You are here"
          />
        )}
      </MapView> */}

      <MapView
        style={styles.map}
        showsUserLocation={true}
        followsUserLocation={true}
        initialRegion={{
          latitude: location?.latitude || 37.78825,
          longitude: location?.longitude || -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          >
            <View style={styles.puckContainer}>
              {/* Pulsing animation */}
              <Animated.View
                style={[
                  styles.pulse,
                  {
                    transform: [{ scale: pulseAnim }],
                  },
                ]}
              />
              {/* Location puck */}
              <View style={styles.puck} />
            </View>
          </Marker>
        )}

        {scooters.map((scooter) => (
          <Marker
            key={scooter.id}
            coordinate={{
              latitude: scooter.latitude,
              longitude: scooter.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }} // Equivalent to iconAnchor: 'bottom'
          >
            <Image
              source={require("./assets/pin.png")} // Replace with your pin icon
              style={styles.icon}
            />
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
icon: {
    width: 25,
    height: 25,
    resizeMode: 'contain', // Scales the image properly
  },
  puckContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 122, 255, 0.3)",
  },
  puck: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    borderWidth: 2,
    borderColor: "white",
  },
});

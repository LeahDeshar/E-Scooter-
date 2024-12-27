import React from "react";
import MapView, { Marker } from "react-native-maps";
import { View, StyleSheet, Image } from "react-native";
import supercluster from "supercluster";
import { useScooter } from "~/providers/ScooterProvider";

const pin = require("~/assets/pin.png");

export default function ScooterMarkers() {
  const { setSelectedScooter, nearbyScooters } = useScooter();

  // Initialize supercluster
  const cluster = new supercluster({
    radius: 40,
    maxZoom: 20,
  });

  // Create points for clustering
  const points = nearbyScooters.map((scooter, index) => ({
    type: "Feature",
    properties: { scooter, index },
    geometry: { type: "Point", coordinates: [scooter.long, scooter.lat] },
  }));

  // Load points into the cluster
  cluster.load(points);

  // Define the region (adjust based on your app's needs)
  const region = {
    latitude: nearbyScooters[0]?.lat || 0,
    longitude: nearbyScooters[0]?.long || 0,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  // Handle marker press
  const onMarkerPress = (scooter) => {
    setSelectedScooter(scooter);
  };

  return (
    <View style={styles.container}>
      <MapView style={StyleSheet.absoluteFillObject} initialRegion={region}>
        {cluster
          .getClusters([-180, -85, 180, 85], 16)
          .map((clusterOrMarker) => {
            const { geometry, properties } = clusterOrMarker;

            if (properties.cluster) {
              // Render cluster
              return (
                <Marker
                  key={`cluster-${properties.cluster_id}`}
                  coordinate={{
                    latitude: geometry.coordinates[1],
                    longitude: geometry.coordinates[0],
                  }}
                >
                  <View style={styles.cluster}>
                    <Text style={styles.clusterText}>
                      {properties.point_count}
                    </Text>
                  </View>
                </Marker>
              );
            }

            // Render individual markers
            const scooter = properties.scooter;
            return (
              <Marker
                key={`scooter-${properties.index}`}
                coordinate={{
                  latitude: geometry.coordinates[1],
                  longitude: geometry.coordinates[0],
                }}
                onPress={() => onMarkerPress(scooter)}
              >
                <Image source={pin} style={styles.markerIcon} />
              </Marker>
            );
          })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  markerIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  cluster: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#42E100",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  clusterText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

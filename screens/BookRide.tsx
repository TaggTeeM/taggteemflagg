import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Alert, Image, Dimensions, Animated, ScrollView, } from "react-native";
import MapView, { Marker, Region, PROVIDER_GOOGLE, AnimatedRegion, LocalTile, } from "react-native-maps";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import Geolocation from "@react-native-community/geolocation";
import Geocoder from "react-native-geocoding";

import { MapCoordinates, Booking } from "../types/BookingTypes";

import taggteem_logo from "../assets/taggteem_logo.jpg";

// Initialize the geocoder module (needs to be done only once)
Geocoder.init("AIzaSyAwhtbGOva3LF56MAb4xGPiPahNhvTEA5s", { language: "en" }); // use a valid Google Maps API Key

type RootStackParamList = {
  Login: undefined;
  OTPEntry: { phone: string };
  SignUp: undefined;
  Dashboard: undefined;
  Profile: undefined;
  BookingHistory: undefined;
  BookRide: undefined;
  BookRide_Pickup: { booking: Booking };
  BookRide_Options: { booking: Booking };
  RideDetail: { booking: Booking };
};

type BookRideScreenNavigationProp = StackNavigationProp<RootStackParamList, "BookRide">;

type Props = {
  navigation: BookRideScreenNavigationProp;
};

const BookRide: React.FC<Props> = ({ navigation }) => {
  const { authState, addBooking } = useAuth();

  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [latitude, setLatitude] = useState<number>(42.365646);
  const [longitude, setLongitude] = useState<number>(-69.00978833);
  const [latitudeDelta, setLatitudeDelta] = useState<number>(LATITUDE_DELTA);
  const [longitudeDelta, setLongitudeDelta] = useState<number>(LONGITUDE_DELTA);
  const [address, setAddress] = useState("");
  const latitudeAnimated = useState(new Animated.Value(latitude))[0];
  const longitudeAnimated = useState(new Animated.Value(longitude))[0];

  const geocodeCurrentPosition = (latitude: number, longitude: number) => {
    Geocoder.from(latitude, longitude).then(
      (response) => {
        const address = response.results[0].formatted_address;

        setAddress(address);
      },
      (error) => {
        console.error(error);
      }
    );
  };
  const setCurrentPosition = () => {
    setLatitudeDelta(LATITUDE_DELTA);
    setLongitudeDelta(LONGITUDE_DELTA);

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setAddress("");

        Animated.parallel([
          Animated.timing(latitudeAnimated, {
            toValue: latitude,
            duration: 500,
            useNativeDriver: false,
          }),
          Animated.timing(longitudeAnimated, {
            toValue: longitude,
            duration: 500,
            useNativeDriver: false,
          }),
        ]).start();

        geocodeCurrentPosition(latitude, longitude);
      },
      (error) => Alert.alert("Error", JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    setCurrentPosition();
  }, []);

  const handleBooking = () => {
    // Here you would typically send a request to your server to create a new booking
    // After successfully creating the booking, navigate back to the dashboard
    const newBooking: Booking = {
      id: "-1",
      sourceCoordinates: { latitude: 0, longitude: 0, address: "" },
      destinationCoordinates: { latitude: latitude, longitude: longitude, address: address, },
      driverName: "NA",
      tripRating: -1,
      cost: -1,
      date: new Date().toISOString(),
    };

    navigation.navigate("BookRide_Options", { booking: newBooking });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content_container}>
      <View style={styles.headerContainer}>
        <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title_text}>Flagg by TaggTeeM</Text>
      </View>

      <Text style={styles.title}>Book a Ride</Text>
      {authState.isLoggedIn && (
        <>
          <Text style={styles.instructionContainer}>This is sample text and will need to be changed to something that works for production. Move the map to choose the drop-off location that you'd like to be dropped off at.</Text>
          <Text>Drop-off Location</Text>
          <View style={styles.map_container}>
            <MapView.Animated
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={{
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta,
              }}
              onRegionChangeComplete={(region: Region) => {
                Animated.parallel([
                  Animated.timing(latitudeAnimated, {
                    toValue: region.latitude,
                    duration: 500,
                    useNativeDriver: false,
                  }),
                  Animated.timing(longitudeAnimated, {
                    toValue: region.longitude,
                    duration: 500,
                    useNativeDriver: false,
                  }),
                ]).start(() => {
                  console.log("region:", region);
                  setLatitude(region.latitude);
                  setLongitude(region.longitude);
                  setLatitudeDelta(region.latitudeDelta);
                  setLongitudeDelta(region.longitudeDelta);
                  geocodeCurrentPosition(region.latitude, region.longitude);
                });
              }}
            >
              <Marker 
                coordinate={{ latitude: latitude, longitude: longitude }} 
                draggable={true}
              />
            </MapView.Animated>
          </View>
          <Text>{address}</Text>
          <Text>({latitude.toPrecision(6)}, {longitude.toPrecision(6)})</Text>

          <View style={[styles.headerContainer, styles.buttonContainer]}>
            <Button title="Reset Map" onPress={setCurrentPosition} />
            <Button title="Confirm Drop-Off" onPress={handleBooking} />
          </View>
        </>
      )}
      {!authState.isLoggedIn && (
        <Text style={styles.text}>Please log in to book a ride.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: 50, // specify desired width
    height: 50, // specify desired height
    alignSelf: "center", // centers the logo horizontally within its container
    marginRight: 16,
  },
  title_text: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',       // Set direction to horizontal
    alignItems: 'center',       // Vertically align items in the center
    justifyContent: 'center',
  },
  buttonContainer: {
    justifyContent: 'space-around',
  },
  instructionContainer: {
    marginBottom: 8,
  },
  container: {
    flex: 1,
  },
  content_container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
  map_container: {
    height: 400,
    width: 400,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default BookRide;

import React, { useState, useEffect, useRef } from "react";
import { View, Text, Button, StyleSheet, Alert, Image, Dimensions, Animated, ScrollView, TouchableWithoutFeedback, TouchableOpacity, ImageBackground, Platform  } from "react-native";
import MapView, { Marker, Region, Details, PROVIDER_GOOGLE, AnimatedRegion, LocalTile, } from "react-native-maps";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";
import Geolocation from "@react-native-community/geolocation";
import Geocoder from "react-native-geocoding";
import { GooglePlacesAutocomplete, GooglePlacesAutocompleteRef } from 'react-native-google-places-autocomplete';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapViewDirections from 'react-native-maps-directions';
import { useFocusEffect } from '@react-navigation/native';

import { Booking } from "../types/BookingTypes";

import taggteem_logo from "../assets/taggteem_logo.jpg";
import BookRide_Options from "./BookRide_Options";
import { DrawerNavigationProp } from "@react-navigation/drawer";

enum LocationType {
  Start,
  End,
  Both
}
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
  BookRide_Pickup: { booking: Booking | null };
  BookRide_Options: { booking: Booking | null };
  BookRide_Confirmation: { booking: Booking | null };
  RideDetail: { booking: Booking };
  BecomeADriver: undefined;
  BecomeADriverConfirmation: undefined;
  DriveFlagg: undefined;
};

type BookRideScreenNavigationProp = DrawerNavigationProp<RootStackParamList, "BookRide">;

type Props = {
  navigation: BookRideScreenNavigationProp;
};

const BookRide: React.FC<Props> = ({ navigation }) => {
  const { authState, addBooking } = useAuth();

  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922 / 30.0;
  const LONGITUDE_DELTA = (LATITUDE_DELTA * ASPECT_RATIO) / 30.0;

  const [mapLatitude, setMapLatitude] = useState<number>(0);
  const [mapLongitude, setMapLongitude] = useState<number>(0);

  const [startLatitude, setStartLatitude] = useState<number>(0);
  const [startLongitude, setStartLongitude] = useState<number>(0);
  const [startAddress, setStartAddress] = useState("");
  
  const [endLatitude, setEndLatitude] = useState<number>(0);
  const [endLongitude, setEndLongitude] = useState<number>(0);
  const [endAddress, setEndAddress] = useState("");

  const [location, setLocation] = useState<LocationType>(LocationType.Both);
  const [latitudeDelta, setLatitudeDelta] = useState<number>(LATITUDE_DELTA);
  const [longitudeDelta, setLongitudeDelta] = useState<number>(LONGITUDE_DELTA);
  const latitudeAnimated = useState(new Animated.Value(mapLatitude))[0];
  const longitudeAnimated = useState(new Animated.Value(mapLongitude))[0];

  const [showDirections, setShowDirections] = useState(false);
  const [newBooking, setNewBooking] = useState<Booking | null>(null);
  
  const endPlacesRef = useRef<GooglePlacesAutocompleteRef | null>(null);
  const startPlacesRef = useRef<GooglePlacesAutocompleteRef | null>(null);
  const mapViewRef = useRef<MapView | null>(null);

  const geocodeCurrentPosition = (latitude: number, longitude: number, location: LocationType) => {
    if (location == LocationType.Both || location == LocationType.Start) {
      startPlacesRef.current?.setAddressText("Loading...");
    }
    if (location == LocationType.Both || location == LocationType.End) {
      endPlacesRef.current?.setAddressText("Loading...");
    }

    Geocoder.from(latitude, longitude).then(
      (response) => {
        const address = response.results[0].formatted_address;

        console.log("geocoding: [" + location + "] ", address);

        if (location == LocationType.Both || location == LocationType.Start) {
          setStartAddress(address);
          startPlacesRef.current?.setAddressText(address);
        }
        if (location == LocationType.Both || location == LocationType.End) {
          setEndAddress(address);
          endPlacesRef.current?.setAddressText(address);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  };

  const setCurrentPosition = (location: LocationType) => {
    setShowDirections(false);

    if (location == LocationType.Both || location == LocationType.Start) {
      startPlacesRef.current?.setAddressText("Loading...");
    }
    if (location == LocationType.Both || location == LocationType.End) {
      endPlacesRef.current?.setAddressText("Loading...");
    }

    setLatitudeDelta(latitudeDelta);
    setLongitudeDelta(longitudeDelta);

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (location == LocationType.Both || location == LocationType.Start) {
          setStartLatitude(latitude);
          setStartLongitude(longitude);

          if (location == LocationType.Start){ 
            zoomToCoordinates();
          }
        }
        if (location == LocationType.Both || location == LocationType.End) {
          setEndLatitude(latitude);
          setEndLongitude(longitude);

          if (location == LocationType.End) {  
            zoomToCoordinates();
          }
        }

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

        geocodeCurrentPosition(latitude, longitude, location);
      },
      (error) => Alert.alert("Error", JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      if (mapLatitude == 0 && mapLongitude == 0 && startLatitude == 0 && startLongitude == 0 && endLatitude == 0 && endLongitude == 0)
        setCurrentPosition(LocationType.Both);

      return () => null;
    }, [])
  );
  /*
  useEffect(() => {
    setCurrentPosition(LocationType.Both);
  }, []);

  useEffect(() => {
    zoomToCoordinates();
  }, [startLatitude, startLongitude, endLatitude, endLongitude]);
  */

  const zoomToCoordinates = () => {
    mapViewRef.current?.fitToCoordinates([{
        latitude: startLatitude,
        longitude: startLongitude,
    }, {
        latitude: endLatitude,
        longitude: endLongitude,
    }], {
        animated: true,
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }
    });
  };

  const handleBooking = () => {
    handleOuterPress();
    zoomToCoordinates();

    setShowDirections(true);

    setNewBooking({
      id: "-1",
      sourceCoordinates: { latitude: startLatitude, longitude: startLongitude, address: startAddress },
      destinationCoordinates: { latitude: endLatitude, longitude: endLongitude, address: endAddress },
      preferredDriver: null,
      driverName: null,
      tripRating: null,
      tripTier: null,
      cost: null,
      date: new Date().toISOString(),
    });
  };

  const handleBookRide = () => {
    console.log("new booking:", newBooking);

    navigation.navigate("BookRide_Options", { booking: newBooking });
  };

  const handleRegionChange = (region: Region, details: Details) => {
    console.log("region:", region);
    console.log("details:", details);

    if (!details.isGesture || showDirections)
      return;

    if (startPlacesRef.current?.isFocused()) {
      console.log("Start Location input is focused");

      setStartLatitude(region.latitude);
      setStartLongitude(region.longitude);

      setLocation(LocationType.Start);
    
      geocodeCurrentPosition(region.latitude, region.longitude, LocationType.Start);
    } else if (endPlacesRef.current?.isFocused()) {
      console.log("End Location input is focused");

      setEndLatitude(region.latitude);
      setEndLongitude(region.longitude);

      setLocation(LocationType.End);
    
      geocodeCurrentPosition(region.latitude, region.longitude, LocationType.End);
    } else {
      console.log("Neither input is focused");
    }
    
    setMapLatitude(region.latitude);
    setMapLongitude(region.longitude);
    setLatitudeDelta(region.latitudeDelta);
    setLongitudeDelta(region.longitudeDelta);
  };

  const jumpToCoordinates = (latitude: number, longitude: number) => {
    mapViewRef.current?.animateToRegion({
      latitude: latitude,
      longitude: longitude,
      latitudeDelta: latitudeDelta,
      longitudeDelta: longitudeDelta,
    });

    setShowDirections(false);
  };

  const jumpToMarker = (type: LocationType) => {
    if (type === LocationType.Start) {
      jumpToCoordinates(startLatitude, startLongitude);
    } else if (type === LocationType.End) {
      jumpToCoordinates(endLatitude, endLongitude);
    }
  };

  const handleOuterPress = () => {
    console.log("blur");

    startPlacesRef.current?.blur();
    endPlacesRef.current?.blur();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content_container} keyboardShouldPersistTaps={"handled"}>
      {authState.isLoggedIn && (
        <ImageBackground
        source={require('../assets/background_diamonds_500px.png')}
        imageStyle={{ resizeMode: 'repeat' }}
        style={styles.backgroundImage}
        >
          <View style={styles.navigationRow}>
            <Text style={styles.navigationAction} onPress={() => navigation?.openDrawer()}><Icon name="navicon" size={24} color="black" /></Text>
            <Text style={ styles.title_text }>Flagg</Text>
            <Text style={styles.navigationAction}>&nbsp;</Text>
          </View>

          <TouchableWithoutFeedback style={styles.inputContainer} onPress={handleOuterPress}>
            <View>
              <View style={styles.autocompleteContainer}>
                <GooglePlacesAutocomplete
                  ref={startPlacesRef}
                  minLength={2}
                  debounce={400}
                  enablePoweredByContainer={false}
                  currentLocation={false}
                  placeholder='Start Location'
                  fetchDetails={true}
                  styles={{
                    container: {
                      position: 'relative',
                      width: '90%',
                    },
                    textInput: {
                      fontSize: width * 0.025,
                      height: height * 0.05,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                    listView: {
                      position: 'absolute',
                      top: (height * 0.05) + 1,
                      backgroundColor: 'white',
                    },
                    row: {
                      height: height * 0.05,
                      padding: width * 0.025,
                    },
                    description: {
                      fontSize: width * 0.025,
                      height: height * 0.05,
                    },
                  }}
                  onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);

                    const location = details?.geometry?.location;

                    setStartLatitude(location?.lat || 0);
                    setStartLongitude(location?.lng || 0);
                    setStartAddress(data.description);

                    jumpToCoordinates(location?.lat || 0, location?.lng || 0);
                  }}
                  textInputProps={{onFocus: () => jumpToMarker(LocationType.Start)}}
                  query={{ key: 'AIzaSyAwhtbGOva3LF56MAb4xGPiPahNhvTEA5s', language: 'en', }}
                />
                <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentPosition(LocationType.Start)}>
                  <Icon name="crosshairs" size={width * 0.04} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={styles.autocompleteContainer}>
                <GooglePlacesAutocomplete
                  ref={endPlacesRef}
                  currentLocation={false}
                  placeholder='Enter Location'
                  fetchDetails={true}
                  styles={{
                    container: {
                      position: 'relative',
                      width: '100%',
                    },
                    textInput: {
                      fontSize: width * 0.025,
                      height: height * 0.05,
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    },
                    listView: {
                      position: 'absolute',
                      top: (height * 0.05) + 1,
                      backgroundColor: 'white',
                    },
                    row: {
                      height: height * 0.05,
                      padding: width * 0.025,
                    },
                    description: {
                      fontSize: width * 0.025,
                      height: height * 0.05,
                    },
                  }}
                  onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);

                    const location = details?.geometry?.location;

                    setEndLatitude(location?.lat || 0);
                    setEndLongitude(location?.lng || 0);
                    setEndAddress(data.description);

                    jumpToCoordinates(location?.lat || 0, location?.lng || 0);
                  }}
                  textInputProps={{onFocus: () => jumpToMarker(LocationType.End)}}
                  query={{ key: 'AIzaSyAwhtbGOva3LF56MAb4xGPiPahNhvTEA5s', language: 'en', }}
                  />
                <TouchableOpacity style={styles.iconButton} onPress={() => setCurrentPosition(LocationType.End)}>
                  <Icon name="crosshairs" size={width * 0.04} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={[styles.headerContainer, styles.buttonContainer]}>
                { !showDirections && (
                  <Button title="Confirm" onPress={handleBooking} />
                  )}

                { showDirections && (
                  <Button title="Book Ride" onPress={handleBookRide} />
                  )}
              </View>
            </View>
          </TouchableWithoutFeedback>

          <View style={styles.map_container}>
            <MapView.Animated
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              ref={mapViewRef}
              region={{
                latitude: mapLatitude,
                longitude: mapLongitude,
                latitudeDelta: latitudeDelta,
                longitudeDelta: longitudeDelta,
              }}
              onRegionChangeComplete={(region: Region, details: Details) => {
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
                ]).start(() => handleRegionChange(region, details));
              }}
            >
              <Marker
                  coordinate={{ latitude: startLatitude, longitude: startLongitude }}
                  image={require('../assets/green_flag.png')}
                  style={styles.markerFlag}
              />
              <Marker
                  coordinate={{ latitude: endLatitude, longitude: endLongitude }}
                  image={require('../assets/red_flag.png')}
                  style={styles.markerFlag}
              />
              {showDirections && (
                <MapViewDirections
                    origin={{ latitude: startLatitude, longitude: startLongitude }}
                    destination={{ latitude: endLatitude, longitude: endLongitude }}
                    apikey={"AIzaSyAwhtbGOva3LF56MAb4xGPiPahNhvTEA5s"} 
                    strokeWidth={3}
                    strokeColor="blue"
                />
              )}
            </MapView.Animated>

            {!showDirections && (
              <Icon name="map-pin" size={30} color="#D32F2F" style={styles.fixedMarker} />
            )}
          </View>
        </ImageBackground>
      )}
      {!authState.isLoggedIn && (
        <Text style={styles.text}>Please log in to book a ride.</Text>
      )}
    </ScrollView>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  logo: {
    width: 50, // specify desired width
    height: 50, // specify desired height
    alignSelf: "center", // centers the logo horizontally within its container
    marginRight: 16,
  },
  fixedMarker: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -15,   // half the width of the marker
    marginTop: -30,    // roughly the height of the marker (adjust as needed)
    zIndex: 2,
    elevation: 2,
  },
  backgroundImage: {
    //...StyleSheet.absoluteFillObject,
    //padding: 16, 
    //display: "flex", 
    //flexDirection: "column",
    //justifyContent: "center",
    //alignItems: "center",
    //flex: 1,
    position: "relative",
  },
  navigationRow: {
    width: width, 
    height: height * 0.15,
    display: "flex", 
    flexDirection: "row",
    //justifyContent: "flex-start",
    //alignItems: "flex-start",
    //flex: 1
    paddingBottom: 6,
  },
  navigationAction: {
    //flex: 1
    //borderWidth: 1,
    width: width * 0.2,
    padding: 12,
  },
  title_text: {
    //borderWidth: 1,
    fontSize:48,
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "#003f00",
    textShadowRadius: 1,
    textShadowOffset: {width: 3, height: 3},
    fontFamily: "Nexa-Heavy",
    //flex: 2,
    width: width * 0.6,
  },
  autocompleteContainer: {
    position: "relative",
    flexDirection: 'row',        // makes the child elements align horizontally
    alignItems: 'center',        // centers the children vertically
    width: '100%',               // occupies the full width available
    justifyContent: 'center', // separates the two child components
    zIndex: 1,
  },
  headerContainer: {
    width: '100%',
    flexDirection: 'row',       // Set direction to horizontal
    alignItems: 'center',       // Vertically align items in the center
    justifyContent: 'center',
    zIndex: -1,
  },
  buttonContainer: {
    justifyContent: 'space-around',
  },
  instructionContainer: {
    marginBottom: 8,
  },
  iconButton: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    //backgroundColor: '#f0f0f0',
    padding: width * 0.015,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 0, // to provide some space from the autocomplete input
    //borderColor: "black",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderStyle: "solid",
    marginTop: -5,
    height: height * 0.05,
  },  
  container: {
    flex: 1,
    backgroundColor: "#9cefb6",
  },
  content_container: {
    /*
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    */
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
  inputContainer: {
    zIndex: 100,
  },
  map_container: {
    position: "relative",
    height: height * 0.8,
    width: width,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerFlag: {
    height: height * 0.08,
    width: width * 0.08,
  },
  ad_space: {
    width: "100%",
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    height: 36,
    textAlign: "center",
    padding: 6,
    margin: 6
  },
});

export default BookRide;

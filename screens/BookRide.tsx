import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Image, Dimensions, Animated, ScrollView } from 'react-native';
import MapView, { Marker, Region, PROVIDER_GOOGLE, AnimatedRegion } from 'react-native-maps';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import { MapCoordinates, Booking } from '../types/BookingTypes';

import taggteem_logo from '../assets/taggteem_logo.jpg';

// Initialize the geocoder module (needs to be done only once)
Geocoder.init("AIzaSyAwhtbGOva3LF56MAb4xGPiPahNhvTEA5s", {language : "en"}); // use a valid Google Maps API Key

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

type BookRideScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookRide'>;

type Props = {
  navigation: BookRideScreenNavigationProp;
};
  
const BookRide: React.FC<Props> = ({ navigation }) => {
  const { authState, addBooking } = useAuth();

  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const [latitude, setLatitude] = useState<number>(42.365646);
  const [longitude, setLongitude] = useState<number>(-69.00978833);
  const [address, setAddress] = useState("");
  const [destination, setDestination] = useState<AnimatedRegion>(new AnimatedRegion({ 
    latitude: latitude, 
    longitude: longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA
  }));
  const latitudeAnimated = useState(new Animated.Value(latitude))[0];
  const longitudeAnimated = useState(new Animated.Value(longitude))[0];
    
  const setCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLatitude(latitude);
        setLongitude(longitude);
        setAddress("");

        //setDestination(new AnimatedRegion({ latitude, longitude }));
        /*
        destination.stopAnimation();
        destination.x.setValue(latitude);
        destination.y.setValue(longitude);
        Animated.timing(destination, {
          toValue: destination,
          duration: 500,
          useNativeDriver: false
        }).start();
       destination.timing({
        latitude: latitude,
        longitude: longitude,
        duration: 500,
        useNativeDriver: false
       }).start();
        */
       Animated.parallel([
        Animated.timing(latitudeAnimated, {
          toValue: latitude,
          duration: 500,
          useNativeDriver: false
        }),
        Animated.timing(longitudeAnimated, {
          toValue: longitude,
          duration: 500,
          useNativeDriver: false
        })
      ]).start();

        Geocoder.from(latitude, longitude).then(
          response => {
            const address = response.results[0].formatted_address;
            //setDestination(new AnimatedRegion({ latitude, longitude }));
            //setDestination(prevRegion => Animated.timing(prevRegion, { toValue: { x: latitude, y: longitude }, duration: 500, useNativeDriver: false }).start());
            setAddress(address);
          },
          error => {
            console.error(error);
          }
        );
      },
      (error) => Alert.alert('Error', JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  useEffect(() => {
    setCurrentPosition();
  }, []);

  const handleBooking = () => {
    // Here you would typically send a request to your server to create a new booking
    // After successfully creating the booking, navigate back to the dashboard
    const newBooking: Booking = {
        id: '-1',
        sourceCoordinates: { latitude: 0, longitude: 0, address: "" },
        destinationCoordinates: { latitude: destination.x._value, longitude: destination.y._value, address: "" },
        driverName: "NA",
        tripRating: -1,
        cost: -1,
        date: new Date().toISOString(),
    };

    //addBooking(newBooking);
    navigation.navigate('BookRide_Options', { booking: newBooking });
  };

  /*
                initialRegion={{
                latitude: destination.latitude,
                longitude: destination.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
<Marker coordinate={destination} />
              //onRegionChangeComplete={(region: Region) => setDestination(new AnimatedRegion({ latitude: region.latitude, longitude: region.longitude }))}
              onRegionChangeComplete={(region: Region) => {
                const { latitude, longitude } = region;
                Animated.timing(destination, { toValue: { x: latitude, y: longitude }, duration: 500, useNativeDriver: false }).start();
              }}
              <Marker coordinate={{ latitude: destination.x._value, longitude: destination.y._value }} />

              */
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content_container}>
      <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title_text}>Flagg by TaggTeeM</Text>

      <Text style={styles.title}>Book a Ride</Text>
      {authState.isLoggedIn && (
        <>
          <Text>Destination</Text>
          <View style={styles.map_container}>
          <MapView.Animated
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA
            }}
            onRegionChangeComplete={(region: Region) => {
              Animated.parallel([
                Animated.timing(latitudeAnimated, {
                  toValue: region.latitude,
                  duration: 500,
                  useNativeDriver: false
                }),
                Animated.timing(longitudeAnimated, {
                  toValue: region.longitude,
                  duration: 500,
                  useNativeDriver: false
                })
              ]).start(() => {
                setLatitude(region.latitude);
                setLongitude(region.longitude);
              });
            }}
          >
              <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
            </MapView.Animated>
          </View>
          <Text>{latitude}</Text>
          <Text>{longitude}</Text>
          <Text>{address}</Text>

          <Button title='Reset Map' onPress={setCurrentPosition} />
          <Button title="Book Now" onPress={handleBooking} />
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
    width: 150,  // specify desired width
    height: 150, // specify desired height
    alignSelf: 'center', // centers the logo horizontally within its container
    marginBottom: 20, // spacing below the logo
  },
  title_text: {
    fontSize: 24,
    fontWeight: "bold"
  },
    container: {
      flex: 1,
    },
    content_container: {
      justifyContent: 'center',
      alignItems: 'center',
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
      justifyContent: 'center',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });
export default BookRide;

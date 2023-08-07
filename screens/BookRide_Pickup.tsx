import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';

import { MapCoordinates, Booking } from '../types/BookingTypes';

// Initialize the geocoder module (needs to be done only once)
Geocoder.init("AIzaSyAwhtbGOva3LF56MAb4xGPiPahNhvTEA5s", {language : "en"}); // use a valid Google Maps API Key

type RootStackParamList = {
    Login: undefined;
    OTPEntry: undefined;
    SignUp: undefined;
    Dashboard: undefined;
    Profile: undefined;
    BookingHistory: undefined;
    BookRide: undefined;
    RideDetail: { booking: Booking };
    BecomeADriver: undefined;
    BecomeADriverConfirmation: undefined;
    DriveFlagg: undefined;
};

type BookRideScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookRide'>;

type Props = {
  navigation: BookRideScreenNavigationProp;
};
  
const BookRide_Pickup: React.FC<Props> = ({ navigation }) => {
  const { authState, addBooking } = useAuth();
  
  const [source, setSource] = useState<MapCoordinates>({ latitude: 0, longitude: 0, address: "" });
  const [destination, setDestination] = useState<MapCoordinates>({ latitude: 0, longitude: 0, address: "" });
  const [driver, setDriver] = useState('');
  const [cost, setCost] = useState('');
  
  useEffect(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        Geocoder.from(latitude, longitude).then(
          response => {
            const address = response.results[0].formatted_address;
            setSource({ latitude, longitude, address });
          },
          error => {
            console.error(error);
          }
        );
      },
      (error) => Alert.alert('Error', JSON.stringify(error)),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }, []);

  const handleBooking = () => {
    // Here you would typically send a request to your server to create a new booking
    // After successfully creating the booking, navigate back to the dashboard
    const newBooking: Booking = {
        id: '-1',
        sourceCoordinates: source,
        destinationCoordinates: destination,
        driverName: "NA",
        tripRating: -1,
        cost: -1,
        date: new Date().toISOString(),
    };

    addBooking(newBooking);
    navigation.navigate('RideDetail', { booking: newBooking });
  };

  return (
<View style={styles.container}>
      <Text style={styles.title}>Book a Ride</Text>
      {authState.isLoggedIn && (
        <>
          <Text>Source</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: source.latitude,
              longitude: source.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onRegionChangeComplete={(region: Region) => setSource({ latitude: region.latitude, longitude: region.longitude, address: '' })}
          >
            <Marker coordinate={source} />
          </MapView>
          
          <Text>Destination</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: destination.latitude,
              longitude: destination.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            onRegionChangeComplete={(region: Region) => setDestination({ latitude: region.latitude, longitude: region.longitude, address: '' })}
          >
            <Marker coordinate={destination} />
          </MapView>

          <Button title="Book Now" onPress={handleBooking} />
        </>
      )}
      {!authState.isLoggedIn && (
        <Text style={styles.text}>Please log in to book a ride.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
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
    map: {
      height: 200,
      width: 300,
      marginBottom: 20,
    },
  });
export default BookRide_Pickup;

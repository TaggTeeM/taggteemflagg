import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

import { MapCoordinates, Booking } from '../types/BookingTypes';

import taggteem_logo from "../assets/taggteem_logo.jpg";

type RootStackParamList = {
    Login: undefined;
    OTPEntry: undefined;
    SignUp: undefined;
    Dashboard: undefined;
    Profile: undefined;
    BookingHistory: undefined;
    BookRide: undefined;
    RideDetail: { booking: Booking };
};

type BookRideScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookRide'>;

type Props = {
  navigation: BookRideScreenNavigationProp;
};
  
const BookRide_Options: React.FC<Props> = ({ navigation }) => {
  const { authState, addBooking } = useAuth();
  
  const [source, setSource] = useState<MapCoordinates>({ latitude: 0, longitude: 0, address: "" });
  const [destination, setDestination] = useState<MapCoordinates>({ latitude: 0, longitude: 0, address: "" });
  const [driver, setDriver] = useState('');
  const [cost, setCost] = useState('');

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content_container}>
    <View style={styles.headerContainer}>
        <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title_text}>Flagg by TaggTeeM</Text>
    </View>

    <Text style={styles.title}>Ride Options</Text>
    {authState.isLoggedIn && (
        <>
        <Text style={styles.instructionContainer}>This is sample text and will need to be changed to something that works for production. Move the map to choose the drop-off location that you'd like to be dropped off at.</Text>
        <Text>Preferred Driver</Text>
        <Text>DROPDOWN HERE</Text>

        <View style={[styles.headerContainer, styles.buttonContainer]}>
            <Button title="Confirm Options" onPress={handleBooking} />
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
    container: {
        flex: 1,
    },
    content_container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
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
export default BookRide_Options;

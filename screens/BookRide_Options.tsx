import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';

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
    BookRide_Pickup: { booking: Booking | null };
    BookRide_Options: { booking: Booking | null };
    BookRide_Confirmation: { booking: Booking | null };
    RideDetail: { booking: Booking };
    BecomeADriver: undefined;
    BecomeADriverConfirmation: undefined;
    DriveFlagg: undefined;
};

type BookRideOptionsScreenRouteProp = RouteProp<RootStackParamList, 'RideDetail'>;
type BookRideOptionsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookRide'>;

type Props = {
  route?: BookRideOptionsScreenRouteProp;
  navigation: BookRideOptionsScreenNavigationProp;
};
  
const BookRide_Options: React.FC<Props> = ({ navigation, route }) => {
  const newBooking = route ? route.params.booking : null;

  const { authState, addBooking } = useAuth();
  
  const [source, setSource] = useState<MapCoordinates>({ latitude: 0, longitude: 0, address: "" });
  const [destination, setDestination] = useState<MapCoordinates>({ latitude: 0, longitude: 0, address: "" });
  const [driver, setDriver] = useState('');
  const [cost, setCost] = useState('');
  const [preferredDrivers, setPreferredDrivers] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://10.0.2.2:3000/api/get-preferred-drivers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userInternalId: authState.loggedInUser?.id,
      }),
    })
      .then(response => response.json())
      .then(data => {
        setPreferredDrivers(data); // Assuming your endpoint returns an array of drivers
      })
      .catch(error => {
        console.error("Error fetching drivers:", error);
      });
  }, []);

  const handleBooking = () => {
    // Here you would typically send a request to your server to create a new booking
    // After successfully creating the booking, navigate back to the dashboard

    navigation.navigate('BookRide_Pickup', { booking: newBooking });
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
            <Text>Current Pick Up: {newBooking?.sourceCoordinates.address}</Text>
            <Text>Current Destination: {newBooking?.destinationCoordinates.address}</Text>
            <View style={styles.optionsArea}>
                <Text>Preferred Driver</Text>
                <Picker
                    selectedValue={driver}
                    onValueChange={(itemValue, itemIndex) => setDriver(itemValue)}
                    style={ styles.driversList } // Adjust styles as needed
                >
                    {preferredDrivers.map(driver => (
                        <Picker.Item key={driver.InternalId} label={driver.name} value={driver.InternalId} />
                    ))}
                </Picker>

                <Text>Rideshare Teir</Text>
                <View>
                    <Text>TIER RADIOS HERE</Text>
                </View>
            </View>

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
    optionsArea: {
        width: "100%",
    },
    driversList: { 
        height: 50, 
        width: 150 
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

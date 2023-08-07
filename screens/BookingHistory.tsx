import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

import { Booking } from "../types/BookingTypes"

type RootStackParamList = {
  Login: undefined;
  ResetPassword: undefined;
  SignUp: undefined;
  Dashboard: undefined;
  BookingHistory: undefined;
  RideDetail: { booking: Booking };
  BecomeADriver: undefined;
  BecomeADriverConfirmation: undefined;
  DriveFlagg: undefined;
};

type BookingHistoryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'BookingHistory'>;

type Props = {
  navigation: BookingHistoryScreenNavigationProp;
};

    const bookings: Booking[] = [
    { 
      id: '1', 
      sourceCoordinates: {latitude: 42.3601, longitude: 71.0589, address: "1010 Anywhere Way, Someplace, YZ 10101"},
      destinationCoordinates: {latitude: 40.7128, longitude: 74.0060, address: "2020 Anywhere Way, Someplace, YZ 20202"},
      driverName: 'John Doe',
      tripRating: 1,
      cost: 1,
      date: '2023-01-01'
    },
    {
      id: '2',
      sourceCoordinates: {latitude: 34.0522, longitude: 118.2437, address: "3030 Anywhere Way, Someplace, YZ 30303"},
      destinationCoordinates: {latitude: 37.7749, longitude: 122.4194, address: "4040 Anywhere Way, Someplace, YZ 40404"},
      driverName: 'Jane Smith',
      tripRating: 1.5,
      cost: 5,
      date: '2023-02-01',
    },
    {
      id: '3',
      sourceCoordinates: {latitude: 51.5074, longitude: 0.1278, address: "5050 Anywhere Way, Someplace, YZ 50505"},
      destinationCoordinates: {latitude: 48.8566, longitude: 2.3522, address: "6060 Anywhere Way, Someplace, YZ 60606"},
      driverName: 'Steve Taylor',
      tripRating: 2,
      cost: 10,
      date: '2023-03-01',
    },
    {
      id: '4',
      sourceCoordinates: {latitude: 35.6895, longitude: 139.6917, address: "7070 Anywhere Way, Someplace, YZ 70707"},
      destinationCoordinates: {latitude: 35.6762, longitude: 139.6503, address: "8080 Anywhere Way, Someplace, YZ 80808"},
      driverName: 'Alice Brown',
      tripRating: 2.5,
      cost: 50,
      date: '2023-04-01',
    },
    {
      id: '5',
      sourceCoordinates: {latitude: 1.3521, longitude: 103.8198, address: "9090 Anywhere Way, Someplace, YZ 90909"},
      destinationCoordinates: {latitude: 1.3025, longitude: 103.8364, address: "1111 Anywhere Way, Someplace, YZ 11111"},
      driverName: 'Bob Martin',
      tripRating: 3,
      cost: 100,
      date: '2023-05-01',
    },
    {
      id: '6',
      sourceCoordinates: {latitude: -33.8688, longitude: 151.2093, address: "2222 Anywhere Way, Someplace, YZ 22222"},
      destinationCoordinates: {latitude: -37.8136, longitude: 144.9631, address: "3333 Anywhere Way, Someplace, YZ 33333"},
      driverName: 'Carla Johnson',
      tripRating: 3.5,
      cost: 150,
      date: '2023-06-10',
    },
  ];
  
const BookingHistory: React.FC<Props> = ({ navigation }) => {
  const { authState } = useAuth();
  const [userBookings, setUserBookings] = useState<Booking[]>([]);

  const handleSelectBooking = (booking: Booking) => {
    navigation.navigate('RideDetail', { booking: booking });
  };

  useEffect(() => {
    if (authState.isLoggedIn) {
      // In a real app, you would fetch the booking history for the user
      setUserBookings(bookings);
    }
  }, [authState.isLoggedIn]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking History for {authState.loggedInUser?.email}:</Text>
      <FlatList
        data={userBookings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSelectBooking(item)}>
                <View style={styles.bookingContainer}>
                    <Text>Source: {item.sourceCoordinates.address}</Text>
                    <Text>Destination: {item.destinationCoordinates.address}</Text>
                    <Text>Driver Name: {item.driverName}</Text>
                    <Text>Rating: {item.tripRating}</Text>
                    <Text>Cost: {item.cost}</Text>
                    <Text>Date: {item.date}</Text>
                </View>
            </TouchableOpacity>
          )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
    },
    bookingContainer: {
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    },
  });
  
export default BookingHistory;

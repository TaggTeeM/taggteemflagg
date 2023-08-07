import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Booking } from "../types/BookingTypes"

type RootStackParamList = {
    Login: undefined;
    OTPEntry: undefined;
    SignUp: undefined;
    Dashboard: undefined;
    Profile: undefined;
    BookingHistory: undefined;
    RideDetail: { booking: Booking };
    BookRide: undefined;
    BecomeADriver: undefined;
    BecomeADriverConfirmation: undefined;
    DriveFlagg: undefined;
};

type RideDetailScreenRouteProp = RouteProp<RootStackParamList, 'RideDetail'>;
type RideDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RideDetail'>;

interface Props {
  route?: RideDetailScreenRouteProp;
  navigation?: RideDetailScreenNavigationProp;
}

const RideDetail: React.FunctionComponent<Props> = ({ navigation, route }) => {
  const booking = route ? route.params.booking : null;

  if (!booking) {
    return <Text>No booking information found</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ride Detail Screen</Text>
      <Text>Source: {booking.sourceCoordinates.address}</Text>
      <Text>Destination: {booking.destinationCoordinates.address}</Text>
      <Text>Driver Name: {booking.driverName}</Text>
      <Text>Trip Rating: {booking.tripRating}</Text>
      <Text>Cost: {booking.cost}</Text>
      <Text>Date: {booking.date}</Text>
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
  text: {
    fontSize: 16,
  },
});

export default RideDetail;

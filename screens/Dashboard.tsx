import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, Image, ScrollView } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import { Booking } from '../types/BookingTypes';

import taggteem_logo from '../assets/taggteem_logo.jpg';

type RootStackParamList = {
  PastRides: undefined;
  Login: undefined;
  OTPEntry: { phone: string };
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

type DashboardScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Dashboard'>;

type Props = {
  navigation: DashboardScreenNavigationProp;
};

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const Dashboard: React.FC<Props> = ({ navigation }) => {
  const [region, setRegion] = useState<Region>({
    latitude: 42.3601,
    longitude: -71.0589,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const { authState, logout } = useAuth();
  const user = authState.loggedInUser;

  const isFocused = useIsFocused();

  console.log("is focused:", isFocused);
  console.log("driver 4:", authState.loggedInUser);

  const [driveButtonText, setDriveButtonText] = useState("Become A Driver");

  useEffect(() => {
    setDriveButtonText(user?.driver?.approved ? "Drive Now" : "Become a Driver");

    Geolocation.getCurrentPosition(
      (position) => {
        setRegion({
          ...region,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => console.log(error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDriveNow = () => {
    if (user?.driver?.approved)
      navigation.navigate('DriveFlagg');
    else
      navigation.navigate('BecomeADriver');
  };

  return (
    <ScrollView style={ styles.viewPort }>
      <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title_text}>Flagg</Text>
      <Text style={styles.subtitle_text}>Welcome, {user?.firstName}</Text>
      <Text>This is your dashboard. There is some introduction text here that will give a sentence about Flagg.</Text>

      <Text style={styles.ad_space}>&lt;&lt;&lt;Ad goes here&gt;&gt;&gt;</Text>

      <Button title="Find a Ride" onPress={() => navigation.navigate('BookRide')} />
      <Button title="See Past Rides" onPress={() => navigation.navigate('PastRides')} />
      <Button title="My Account" onPress={() => navigation.navigate('Profile')} />

      {/* Conditionally render the "Become a Driver" and "Drive Now" buttons */}
      {!user?.driver?.approved && (
        <Button title="Become a Driver" onPress={() => navigation.navigate('BecomeADriver')} />
      )}
      {user?.driver?.approved && (
        <Button title="Drive Now" onPress={() => navigation.navigate('DriveFlagg')} />
      )}

      <Button title={driveButtonText} onPress={() => handleDriveNow()} />

      <Button title="Logout" onPress={handleLogout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewPort: {
    padding: 6,
  },
  logo: {
    width: 150,  // specify desired width
    height: 150, // specify desired height
    alignSelf: 'center', // centers the logo horizontally within its container
    marginBottom: 0, // spacing below the logo
  },
  title_text: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle_text: {
    fontSize: 18,
    fontWeight: "bold"
  },
  ad_space: {
    borderColor: "black",
    borderWidth: 1,
    borderStyle: "solid",
    height: 36,
    textAlign: "center",
    padding: 6,
    margin: 6
  }
});

export default Dashboard;

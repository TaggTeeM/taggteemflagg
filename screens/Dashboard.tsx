import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, Image } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAuth } from '../context/AuthContext';

import taggteem_logo from '../assets/taggteem_logo.jpg';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Profile: undefined;
  PastRides: undefined;
  BookRide: undefined;
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

  useEffect(() => {
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

  return (
    <View>
      <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title_text}>Flagg by TaggTeeM</Text>
      <Text style={styles.subtitle_text}>Welcome, {user?.firstName}</Text>
      <Text>This is your dashboard. There is some introduction text here that will give a sentence about Flagg.</Text>

      <Text style={styles.ad_space}>&lt;&lt;&lt;Ad goes here&gt;&gt;&gt;</Text>

      <Button title="Find a Ride" onPress={() => navigation.navigate('BookRide')} />
      <Button title="See Past Rides" onPress={() => navigation.navigate('PastRides')} />
      <Button title="My Account" onPress={() => navigation.navigate('Profile')} />
      <Button title="Logout" onPress={handleLogout} />
    </View>
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

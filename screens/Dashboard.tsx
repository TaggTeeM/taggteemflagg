import React, { useEffect, useState } from 'react';
import { Button, Text, View, StyleSheet, Image, ScrollView, ImageBackground, TouchableOpacity, Dimensions } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { StackNavigationProp } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useAuth } from '../context/AuthContext';
import { Booking } from '../types/BookingTypes';

import taggteem_logo from '../assets/taggteem_logo.jpg';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type RootStackParamList = {
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

type DashboardScreenNavigationProp = DrawerNavigationProp<RootStackParamList, 'Dashboard'>;
type Dashhh = DrawerNavigationProp<RootStackParamList, 'Dashboard'>;

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
  const { authState } = useAuth();
  const user = authState.loggedInUser;
  
  /*
  useFocusEffect(
    React.useCallback(() => {
      const unsubscribe = API.subscribe(userId, user => setUser(data));

      return () => unsubscribe();
    }, [userId])
  );
  const isFocused = useIsFocused();

  console.log("is focused:", isFocused);
  console.log("driver 4:", authState.loggedInUser);
  */

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

  return (
    <View style={ styles.viewPort }>
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

      <ScrollView>
        <View style={styles.ad_space}>
          <Image source={require('../assets/bmw_ad.jpg')} style={{width: "100%", height: 34}} />
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionTouchable} onPress={() => navigation.navigate('BookRide')}>
            <Image source={require('../assets/find_a_ride_2.png')} style={styles.touchableImage} />
            <Text style={styles.touchableText}>Find a Ride</Text>
          </TouchableOpacity>

          {!user?.driver && (
            <TouchableOpacity style={styles.actionTouchable} onPress={() => navigation.navigate('BecomeADriver')}>
              <Image source={require('../assets/become_a_driver.png')} style={styles.touchableImage} />
              <Text style={styles.touchableText}>Become a Driver</Text>
            </TouchableOpacity>
          )}
          {user?.driver && (
            <TouchableOpacity style={styles.actionTouchable} onPress={() => navigation.navigate('DriveFlagg')}>
              <Image source={require('../assets/find_a_ride.png')} style={styles.touchableImage} />
              <Text style={styles.touchableText}>Drive Flagg</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionTouchable} onPress={() => navigation.navigate('BookingHistory')}>
            <Image source={require('../assets/ride_history.png')} style={styles.touchableImage} />
            <Text style={styles.touchableText}>Ride History</Text>
          </TouchableOpacity>

        </View>
        
        <View style={styles.ad_space}>
          <Image source={require('../assets/bmw_ad.jpg')} style={{width: "100%", height: 34}} />
        </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const { width, height } = Dimensions.get("window");
const styles = StyleSheet.create({
  viewPort: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#6A8163",
    //fontSize: 8,
    //width: width,
    //justifyContent: "flex-start",
    //alignItems: "flex-start",
    zIndex: -1,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    //padding: 16, 
    //display: "flex", 
    //flexDirection: "column",
    //justifyContent: "center",
    //alignItems: "center",
    //flex: 1,
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
  ad_space: {
    width: width * 0.89,
    //borderColor: "black",
    //borderWidth: 0,
    //borderStyle: "solid",
    //height: 36,
    //textAlign: "center",
    //padding: 6,
    marginTop: 12,
    marginBottom: 12,
    marginLeft: 16,
    marginRight: 16,
    //flex: 1,
  },
  actionContainer: {
    borderColor: "black",
    borderWidth: 0,
    borderStyle: "solid",
    borderRadius: 6,
    //width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    //flex: 1,
    marginLeft: 16,
    marginRight: 16,
  },
  actionTouchable: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: width * 0.4,
    height: height * 0.28,
    borderWidth: 0,
    //width: "50%",
    //flex: 1,
  },
  touchableImage: {
    width: width * 0.34,
    height: height * 0.2,
    //height: 100, 
    //flex: 1
  },
  touchableText: {
    //flex: 1
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    width: "80%",
    textAlign: "center",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#6A8163",
  },
});

export default Dashboard;

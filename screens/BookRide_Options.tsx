import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image, Animated, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Picker } from '@react-native-picker/picker';
import { RadioButton } from 'react-native-paper';
import * as RNLocalize from "react-native-localize";
import MapView, { Marker, Region, Details, PROVIDER_GOOGLE, AnimatedRegion, LocalTile, } from "react-native-maps";
import MapViewDirections from 'react-native-maps-directions';
import Icon from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';

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
  navigation?: BookRideOptionsScreenNavigationProp;
};
  
const BookRide_Options: React.FC<Props> = ({ navigation, route }) => {
  const newBooking = route ? route.params.booking : null;

  console.log("new booking (options):", newBooking);

  const { authState, addBooking } = useAuth();
  
  const [driver, setDriver] = useState('');
  const [cost, setCost] = useState('');
  const [preferredDrivers, setPreferredDrivers] = useState<any[]>([]);
  const [preferredDriver, setPreferredDriver] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>("0");
  const [tierPrices, setTierPrices] = useState<any[]>(["n/a", "n/a", "n/a"]);

  const { width, height } = Dimensions.get("window");
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922 / 30.0;
  const LONGITUDE_DELTA = (LATITUDE_DELTA * ASPECT_RATIO) / 30.0;

  const [latitudeDelta, setLatitudeDelta] = useState<number>(LATITUDE_DELTA);
  const [longitudeDelta, setLongitudeDelta] = useState<number>(LONGITUDE_DELTA);

  const [mapLatitude, setMapLatitude] = useState<number>(0);
  const [mapLongitude, setMapLongitude] = useState<number>(0);
  const latitudeAnimated = useState(new Animated.Value(mapLatitude))[0];
  const longitudeAnimated = useState(new Animated.Value(mapLongitude))[0];

  const mapViewRef = useRef<MapView | null>(null);

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

      lookupPrices();  // Fetch prices upon page load
      const interval = setInterval(lookupPrices, 5 * 60 * 1000); // Fetch prices every 5 minutes
    
      return () => clearInterval(interval);  // Cleanup interval on component unmount
  }, []);

  const lookupPrices = () => {
    fetch('http://10.0.2.2:3000/api/trip-cost-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // API needs the source and destination coordinates
        source: newBooking?.sourceCoordinates,
        destination: newBooking?.destinationCoordinates,
      }),
    })
    .then(response => response.json())
    .then(data => {
      // Convert the returned prices to local currency format
      const deviceLocale = RNLocalize.getLocales()[0].languageTag;
      const currencyCode = RNLocalize.getCurrencies()[0]; // Gets the first currency code associated with the device's locale.
  
      console.log("cost list:", data);

      const formattedPrices = data.costList.map((price: number) => {
        return new Intl.NumberFormat(deviceLocale, { style: 'currency', currency: currencyCode }).format(price); 
      });
  
      setTierPrices(formattedPrices);
    })
    .catch(error => {
      console.error("Error fetching trip prices:", error);
    });
  }
  
  const handleBooking = () => {
    // Here you would typically send a request to your server to create a new booking
    // After successfully creating the booking, navigate back to the dashboard
    newBooking!.tripTier = selectedTier;
    newBooking!.cost = parseFloat(tierPrices[parseInt(selectedTier || "0", 10)])
    newBooking!.preferredDriver = preferredDriver;

    navigation!.navigate('BookRide_Pickup', { booking: newBooking });
  };

  const zoomToCoordinates = () => {
    mapViewRef.current?.fitToCoordinates([{
        latitude: newBooking?.sourceCoordinates.latitude || 0,
        longitude: newBooking?.sourceCoordinates.longitude || 0,
    }, {
        latitude: newBooking?.destinationCoordinates.latitude || 0,
        longitude: newBooking?.destinationCoordinates.longitude || 0,
    }], {
        animated: true,
        edgePadding: { top: 0, right: 0, bottom: 0, left: 0 }
    });
  };

  zoomToCoordinates();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content_container}>

      {authState.isLoggedIn && (
        <>
          <View style={styles.map_container}>
            <MapView.Animated
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              ref={mapViewRef}
              region={{
                latitude: newBooking?.sourceCoordinates.latitude || 0,
                longitude: newBooking?.sourceCoordinates.longitude || 0,
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
                ]).start(() => {
                  if (!details.isGesture)
                    return;
            
                  setMapLatitude(region.latitude);
                  setMapLongitude(region.longitude);
                  setLatitudeDelta(region.latitudeDelta);
                  setLongitudeDelta(region.longitudeDelta);
                });
              }}
            >
              <Marker
                  coordinate={{ latitude: newBooking?.sourceCoordinates.latitude || 0, longitude: newBooking?.sourceCoordinates.longitude || 0 }}
                  image={require('../assets/green_flag.png')}
              />
              <Marker
                  coordinate={{ latitude: newBooking?.destinationCoordinates.latitude || 0, longitude: newBooking?.destinationCoordinates.longitude || 0 }}
                  image={require('../assets/red_flag.png')}
              />
              <MapViewDirections
                  origin={{ latitude: newBooking?.sourceCoordinates.latitude || 0, longitude: newBooking?.sourceCoordinates.longitude || 0 }}
                  destination={{ latitude: newBooking?.destinationCoordinates.latitude || 0, longitude: newBooking?.destinationCoordinates.longitude || 0 }}
                  apikey={"AIzaSyAwhtbGOva3LF56MAb4xGPiPahNhvTEA5s"} 
                  strokeWidth={3}
                  strokeColor="blue"
              />
            </MapView.Animated>
          </View>

          <View style={styles.headerContainer}>
              <Text style={styles.title_text}>Flagg</Text>
          </View>

          <LinearGradient colors={['#59aa6f', '#7bd899', '#9cefb6']} style={styles.routeContainer}>
            <Text>{newBooking?.sourceCoordinates.address}</Text>
            <Text style={styles.routeToLabel}>TO</Text>
            <Text>{newBooking?.destinationCoordinates.address}</Text>
          </LinearGradient>
          
          <LinearGradient colors={['#9cefb6', '#6bc889', '#398a4f']} style={styles.optionsArea}>
              <Text>Preferred Driver</Text>
              <Picker
                  selectedValue={driver}
                  onValueChange={(itemValue, itemIndex) => setPreferredDriver(itemValue)}
                  style={ styles.driversList } // Adjust styles as needed
              >
                  <Picker.Item key="" label='None' value="" />
                  {preferredDrivers.map(driver => (
                      <Picker.Item key={driver.InternalId} label={driver.name} value={driver.InternalId} />
                  ))}
              </Picker>

              <View>
                <Text>Rideshare Tier</Text>
                <RadioButton.Group onValueChange={newValue => setSelectedTier(newValue)} value={selectedTier || ''}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton.Item label={`Standard - ${tierPrices[0]}`} value="0" />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton.Item label={`Shared - ${tierPrices[1]}`} value="1" />
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <RadioButton.Item label={`Luxury - ${tierPrices[2]}`} value="2" />
                  </View>
              </RadioButton.Group>
            </View>
          </LinearGradient>

          <View style={[styles.headerContainer, styles.buttonContainer]}>
              <Button title="Confirm Options" onPress={handleBooking} />
          </View>
          </>
      )}
      {!authState.isLoggedIn && (
        <View style={styles.headerContainer}>
          <Text style={styles.title_text}>Flagg</Text>
          
          <Text style={styles.text}>Please log in to book a ride.</Text>
        </View>
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
        paddingTop: 24
    },
    driversList: { 
        height: 50, 
        width: "100%"
    },
    container: {
        flex: 1,
        //backgroundColor: "#10af40"
        backgroundColor: "#9cefb6",
        color: "#000000"
    },
    content_container: {
        justifyContent: "center",
        alignItems: "center",
    },
    map_container: {
      height: 100,
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    headerContainer: {
      width: '100%',
      flexDirection: 'row',       // Set direction to horizontal
      alignItems: 'center',       // Vertically align items in the center
      justifyContent: 'flex-start',
      backgroundColor: "#9cefb6",
      paddingBottom: 16
    },
    buttonContainer: {
      justifyContent: 'space-around',
      paddingTop: 16,
      backgroundColor: "#398a4f",
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
    routeContainer: {
      width: "90%",
      textAlign: "center",
      padding: 4,
      borderColor: "#398a4f",
      borderStyle: "solid",
      borderWidth: 4,
      borderRadius: 8,
    },
    routeToLabel: {
      fontWeight: "bold",
      width: "100%",
      textAlign: "center"
    }
  });
export default BookRide_Options;

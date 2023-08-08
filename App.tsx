import React, { useEffect } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Entypo';
//import firebase from '@react-native-firebase/app';
import SplashScreen from 'react-native-splash-screen';

import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './screens/Login';
import OTPEntry from './screens/OTPEntry';
import SignUp from './screens/SignUp';
import Dashboard from './screens/Dashboard';
import Profile from './screens/Profile';
import BookingHistory from './screens/BookingHistory';
import RideDetail from './screens/RideDetail';
import BookRide from './screens/BookRide';
import BookRide_Pickup from './screens/BookRide_Pickup';
import BookRide_Options from './screens/BookRide_Options';
import BookRide_Confirmation from './screens/BookRide_Confirmation';
import BecomeADriver from './screens/BecomeADriver';
import BecomeADriverConfirmation from './screens/BecomeADriverConfirmation';
import DriveFlagg from './screens/DriveFlagg';

import { Booking } from './types/BookingTypes';

type RootStackParamList = {
  MainDrawer: undefined;
  Login: undefined;
  OTPEntry: { phone: string };
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
  Logout: undefined;
};

type RootDrawerParamList = {
  Login: undefined;
  OTPEntry: { phone: string };
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
  Logout: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<RootDrawerParamList>();

const App: React.FC = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="MainDrawer" component={MainDrawer} options={{headerShown: false}}/>
          <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
          <Stack.Screen name="OTPEntry" component={OTPEntry} options={{ title: 'OTP Entry' }} />
          <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Sign Up' }} />
          <Stack.Screen name="BookRide_Pickup" component={BookRide_Pickup} options={{ title: 'Ride Pickup Location' }} />
          <Stack.Screen name="BookRide_Options" component={BookRide_Options} options={{ title: 'Ride Options' }} />
          <Stack.Screen name="BookRide_Confirmation" component={BookRide_Confirmation} options={{ title: 'Ride Confirmation' }} />
          <Stack.Screen name="RideDetail" component={RideDetail} options={{ title: 'Ride Details' }} />
          <Stack.Screen name="BecomeADriverConfirmation" component={BecomeADriverConfirmation} options={{ title: 'Sign-up Confirmation', headerLeft: () => null, }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const MainDrawer: React.FC = () => {
  const { authState, logout } = useAuth();
  const user = authState.loggedInUser;
  const navigation = useNavigation<DrawerNavigationProp<RootStackParamList>>();

  const handleLogout = async () => {
    try {
      await logout();
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <Drawer.Navigator initialRouteName='Dashboard'>
      <Drawer.Screen name="Dashboard" component={Dashboard} options={{ title: 'Home' }} />
      <Drawer.Screen name="BookRide" component={BookRide} options={{ title: 'Find a Ride' }} />
      <Drawer.Screen name="BookingHistory" component={BookingHistory} options={{ title: 'Ride History' }} />
      <Drawer.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
      {!user?.driver && (
        <Drawer.Screen name="BecomeADriver" component={BecomeADriver} options={{ title: 'Become a Driver' }} />
      )}
      {user?.driver && (
        <Drawer.Screen name="DriveFlagg" component={DriveFlagg} options={{ title: 'Drive Flagg' }} />
      )}
      <Drawer.Screen 
        name="Logout" 
        component={Dashboard} 
        options={{
          title: 'Logout',
          drawerIcon: () => <Icon name="log-out" size={24} color="black" />,
          swipeEnabled: false,
          unmountOnBlur: true,
          drawerLabel: () => (
            <TouchableOpacity onPress={handleLogout}>
              <Text>Logout</Text>
            </TouchableOpacity>
          )
        }}
      />
    </Drawer.Navigator>
  );
}

export default App;
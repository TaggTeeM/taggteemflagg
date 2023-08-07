import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
//import firebase from '@react-native-firebase/app';

import { AuthProvider } from './context/AuthContext';

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
  BookRide_Pickup: { booking: Booking };
  BookRide_Options: { booking: Booking };
  RideDetail: { booking: Booking };
  BecomeADriver: undefined;
  BecomeADriverConfirmation: undefined;
  DriveFlagg: undefined;
};

type RootDrawerParamList = {
  Login: undefined;
  OTPEntry: { phone: string };
  SignUp: undefined;
  Dashboard: undefined;
  Profile: undefined;
  BookingHistory: undefined;
  BookRide: undefined;
  BookRide_Pickup: { booking: Booking };
  BookRide_Options: { booking: Booking };
  RideDetail: { booking: Booking };
  BecomeADriver: undefined;
  BecomeADriverConfirmation: undefined;
  DriveFlagg: undefined;
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
          <Stack.Screen name="RideDetail" component={RideDetail} options={{ title: 'Ride Details' }} />
          <Stack.Screen name="BecomeADriverConfirmation" component={BecomeADriverConfirmation} options={{ title: 'Sign-up Confirmation', headerLeft: () => null, }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

const MainDrawer = () => {
  return (
      <NavigationContainer>
        <Drawer.Navigator initialRouteName='Dashboard'>
          <Drawer.Screen name="Dashboard" component={Dashboard} options={{ title: 'Flagg Home' }} />
          <Drawer.Screen name="Profile" component={Profile} options={{ title: 'Profile' }} />
          <Drawer.Screen name="BookingHistory" component={BookingHistory} options={{ title: 'Ride History' }} />
          <Drawer.Screen name="BookRide" component={BookRide} options={{ title: 'Find a Ride' }} />
          <Drawer.Screen name="BecomeADriver" component={BecomeADriver} options={{ title: 'Become a Driver' }} />
          <Drawer.Screen name="DriveFlagg" component={DriveFlagg} options={{ title: 'Drive Flagg' }} />
        </Drawer.Navigator>
      </NavigationContainer>
  );
}

export default App;
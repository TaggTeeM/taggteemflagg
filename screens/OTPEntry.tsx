import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Text, StyleSheet, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import { User } from '../types/BookingTypes';

import taggteem_logo from '../assets/taggteem_logo.jpg';

type RootStackParamList = {
  Login: undefined;
  OTPEntry: { phone: string };
  SignUp: undefined;
  MainDrawer: undefined;
};
  
type OTPScreenRouteProp = RouteProp<RootStackParamList, 'OTPEntry'>;
type OTPEntryScreenNavigationProp = StackNavigationProp<RootStackParamList, 'OTPEntry'>;
  
type Props = {
  route: OTPScreenRouteProp;
  navigation: OTPEntryScreenNavigationProp;
};

const OTPEntryScreen: React.FC<Props> = ({ route, navigation }) => {
  const { phone } = route.params;
  const { authState, login, logout } = useAuth();

  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      setError("");
      setSuccess("");
  
      return () => null;
    }, [])
  );
    
  useEffect(() => {
    if (authState.isLoggedIn && authState.loggedInUser) {
      setSuccess("OTP accepted, logging in" + authState.loggedInUser.phone);

      navigation.navigate('MainDrawer');
    }
  }, [authState]);

  const handleOtpChange = (text: string) => {
    setOtp(text);
  };

  const handleOTPSubmit = () => {
    if (!validateForm()) {
      return; // Stop here if form validation fails
    }
  
    fetch('http://10.0.2.2:3000/api/validate-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phone: phone,
        otp: otp,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
            console.log("success data:", data.user);

            const loginUser: User = { 
                id: data.user.id, 
                firstName: data.user.firstName, 
                lastName: data.user.lastName, 
                email: data.user.email, 
                phone: data.user.phone,
                driver: data.user.driver,
                isDriving: false,
            };
            
            console.log("constructed data:", loginUser);

            login(loginUser); // async effect hook above takes care of navigation
        } else {
            setError(data.message || 'OTP validation failed. Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('An error occurred. Please try again.');
      });
  };
  
    const validateForm = (): boolean => {
        if (!/^\d{6}$/.test(otp)) {
          setSuccess("");
          setError('OTP must be a 6-digit number.');
          return false;
        }

        setSuccess("");
        setError(''); // Clear any previous errors

        return true;
      };
      
  return (
    <View>
      <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title_text}>Welcome to Flagg by TaggTeeM!</Text>
      <Text>This is the one-time password entry page. There is some introduction text here that will give a sentence about Flagg.</Text>

      <Text style={[styles.input_label, styles.phone_label]}>One-time password (OTP)</Text>
      <TextInput
        placeholder="OTP"
        onChangeText={handleOtpChange}
        keyboardType="numeric"
        value={otp}
      />
      {error !== '' && <Text style={styles.errortext}>{error}</Text>}
      {success !== '' && <Text style={styles.success_text}>{success}</Text>}
      <Button title="Submit" onPress={handleOTPSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
    logo: {
        width: 150,  // specify desired width
        height: 150, // specify desired height
        alignSelf: 'center', // centers the logo horizontally within its container
        marginBottom: 20, // spacing below the logo
      },
    title_text: {
        fontSize: 18,
        fontWeight: "bold"
    },
    success_text: {
      color: 'limegreen'
    },
    errortext: {
      color: 'tomato'
    },
    input_label: {
        fontWeight: "bold"
    },
    phone_label: {
        marginTop: 8
    }
});
  
export default OTPEntryScreen;

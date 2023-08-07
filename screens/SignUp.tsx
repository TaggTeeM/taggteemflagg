import React, { useState, useEffect } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { Button, TextInput, View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Booking } from '../types/BookingTypes';
import { IsValidPhoneNumber } from '../middleware/Validators';

import taggteem_logo from '../assets/taggteem_logo.jpg';

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

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

type Props = {
  navigation: SignUpScreenNavigationProp;
};

const SignUp: React.FC<Props> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);

  const phoneInputRef = React.useRef<RNTextInput>(null);
  const firstNameInputRef = React.useRef<RNTextInput>(null);
  
  const handleFirstNameChange = (text: string) => {
    setFirstName(text);
  };

  const handlePhoneChange = (text: string) => {
    setPhone(text);
  };

  useEffect(() => {
    setError("");
    setSuccess("");
  }, []);

  const validateForm = (): boolean => {
    let isValid = true;

    if (phone === '') {
      isValid = false;

      setError('Please enter a phone number');
      phoneInputRef.current?.focus();
    } 
    else if (!IsValidPhoneNumber(phone)) {
      isValid = false;

      setError('Please enter a valid phone number');
      phoneInputRef.current?.focus();
    }
    else if (firstName === '') {
      isValid = false;
      
      setError('Please enter a first name');
      firstNameInputRef.current?.focus();
    }

    return isValid;
  };

  const handleSubmit = () => {
    setError("");
    setSuccess("");
    
    const currentTime = Date.now();

    // Check if the last request was less than 10 seconds ago
    if (lastRequestTime && currentTime - lastRequestTime < 1000) {
      setError('Please wait before trying again.');
      return;
    }
  
    setLastRequestTime(currentTime);
    
    if (validateForm()) {
      fetch('http://10.0.2.2:3000/api/sign-up', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
          firstName: firstName
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log("saving phone:", phone, data);
          if (data.success) {
            // Handle successful signup here, e.g., navigate to a dashboard or confirmation page.

            setSuccess(data.message);

            // save phone number to async storage
            try {
              await AsyncStorage.setItem('phoneNumber', phone);
            } catch (error) {
                console.error("Error saving phone number to local storage:", error);
            }

            navigation.navigate('OTPEntry', { phone: phone });
          } else {
            // Display an error message from the server or a generic one
            setError(data.message || 'Signup failed. Please try again.');
          }
        })
        .catch((error) => {
          console.error('Error:', error.message);
        });
    }
  };
  
  return (
    <View>
      <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
      <Text style={styles.title_text}>Welcome to Flagg by TaggTeeM!</Text>
      <Text>This is the sign up page. There is some introduction text here that will give a sentence about Flagg.</Text>
      <Text>If this page is successful, you will get a text message with a one-time password (OTP) that you will enter on the next screen.</Text>

      <Text style={[styles.input_label, styles.phone_label]}>Phone number</Text>
      <TextInput
        ref={phoneInputRef}
        value={phone}
        onChangeText={handlePhoneChange}
        placeholder="Phone number"
        keyboardType='phone-pad'
      />
      <Text style={[styles.input_label]}>First name</Text>
      <TextInput
        ref={firstNameInputRef}
        value={firstName}
        onChangeText={handleFirstNameChange}
        placeholder='First name'
      />
      {error !== '' && <Text style={styles.errortext}>{error}</Text>}
      {success !== '' && <Text style={styles.success_text}>{success}</Text>}
      <Button title="Sign Up" onPress={handleSubmit} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text>Already have an account? Log In</Text>
      </TouchableOpacity>
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
  errortext: {
    color: 'tomato'
  },
  success_text: {
    color: 'limegreen'
  },
  title_text: {
    fontSize: 18,
    fontWeight: "bold"
  },
  input_label: {
    fontWeight: "bold"
  },
  phone_label: {
    marginTop: 8
  }
});


export default SignUp;

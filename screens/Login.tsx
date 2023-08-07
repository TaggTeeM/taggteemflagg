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

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const phoneInputRef = React.useRef<RNTextInput>(null);

  useEffect(() => {
    // Load the phone number from AsyncStorage when the component mounts
    const loadPhoneNumber = async () => {
      try {
        const savedPhone = await AsyncStorage.getItem('phoneNumber');
        if (savedPhone) {
          setPhone(savedPhone);
        }
      } catch (error) {
        console.error("Error loading phone number from local storage:", error);
      }
    };
    
    setError("");
    setSuccess("");

    loadPhoneNumber();
  }, []);

  /*
  const formatPhoneInput = (text: string) => {
    let cleaned = ('' + text).replace(/\D/g, '');
    let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      let intlCode = (match[1] ? '+1 ' : ''),
          number = [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
      return number;
    }
    return text;
  };
  */

  const handlePhoneChange = (text: string) => {
    //const formattedText = formatPhoneInput(text);
    //setPhone(formattedText);
    setPhone(text);
  };

  const validateForm = () => {
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
    
    return isValid;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setError("");
      setSuccess("");
      
      // call api endpoint to validate phone number and get otp
      fetch('http://10.0.2.2:3000/api/validate-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: phone,
        }),
      })
        .then((response) => response.json())
        .then(async (data) => {
          if (data.success) {
            setSuccess(data.message);

            // save phone number to async storage
            try {
                await AsyncStorage.setItem('phoneNumber', phone);
            } catch (error) {
                console.error("Error saving phone number to local storage:", error);
            }

            // Navigate to OTPEntry if the response is successful
            navigation.navigate('OTPEntry', { phone: phone });
          } else {
            // Show error message
            setError('Invalid phone number');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };
  
  return (
    <View style={ styles.viewPort }>
      <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
      <Text style={ styles.title_text }>Welcome to Flagg by TaggTeeM!</Text>
      <Text>This is the login page. There is some introduction text here that will give a sentence about Flagg.</Text>
      <Text>If this page is successful, you will get a text message with a one-time password (OTP) that you will enter on the next screen.</Text>

      <Text style={[styles.input_label, styles.phone_label]}>Phone number</Text>
      <TextInput
        ref={phoneInputRef}
        placeholder="Phone number"
        onChangeText={handlePhoneChange}
        keyboardType="phone-pad"
        value={phone}
      />
      {error !== '' && <Text style={styles.errortext}>{error}</Text>}
      {success !== '' && <Text style={styles.success_text}>{success}</Text>}
      <Button title="Log In" onPress={handleSubmit} />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
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

export default Login;

import React, { useState, useEffect } from 'react';
import { Button, TextInput, View, Text, StyleSheet, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    <View style={ styles.viewPort }>
      <ImageBackground
        source={require('../assets/fade_green_background_1px_height.png')}
        imageStyle={{ resizeMode: 'stretch' }}
        style={styles.backgroundImage}
      >
        <View>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Icon name="arrow-circle-o-left" size={30} color="#ffffff" style={styles.fixedMarker} />
          </TouchableOpacity>
        </View>

        <View style={styles.LogoTitle}>
          <Text style={ styles.title_text }>Flagg</Text>
          <Text style={styles.subtitle_text}>Log In</Text>
        </View>

        <View>
          <Text style={[styles.input_label, styles.phone_label]}>One-time password (OTP)</Text>
          <TextInput
            placeholder="OTP"
            onChangeText={handleOtpChange}
            keyboardType="numeric"
            value={otp}
            style={{color: "white", backgroundColor: "rgba(143, 200, 143, 0.6)", fontWeight: "bold"}}
            />
        </View>

        <View>
          <Button title="Submit" onPress={handleOTPSubmit} />
          {error !== '' && <Text style={styles.errortext}>{error}</Text>}
          {success !== '' && <Text style={styles.success_text}>{success}</Text>}
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  viewPort: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1
  },
  fixedMarker: {
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    padding: 16, 
    display: "flex", 
    flexDirection: "column"
  },
  logo: {
    width: 150,  // specify desired width
    height: 150, // specify desired height
    alignSelf: 'center', // centers the logo horizontally within its container
    marginBottom: 20, // spacing below the logo
  },
  LogoTitle: {
    padding: 6,
    marginTop: 36,
  },
  title_text: {
    fontFamily: "Nexa-Heavy",
    fontSize:48,
    //fontWeight: "bold",
    textAlign: "center",
    color: "white",
    textShadowColor: "#003f00",
    textShadowRadius: 1,
    textShadowOffset: {width: 3, height: 3}
  },
  subtitle_text: {
    fontFamily: "Nexa-Heavy",
    fontSize:24,
    textAlign: "center",
    color: "white",
    textShadowColor: "#003f00",
    textShadowRadius: 1,
    textShadowOffset: {width: 1, height: 1}
  },
  input_label: {
    fontWeight: "bold",
    color: "white",
    textShadowColor: "#003f00",
    textShadowRadius: 1,
    textShadowOffset: {width: 1, height: 1}
  },
  success_text: {
    color: 'limegreen'
  },
  errortext: {
    color: 'tomato'
  },
  phone_label: {
      marginTop: 8
  },
  otp_touchable: {
    marginTop: 36,
    backgroundColor: "rgba(255, 255, 255, 0.2)"
  },
  otp_text: {
    color: "white",
    textShadowColor: "#007f00",
    textShadowRadius: 1,
    textShadowOffset: {width: 1, height: 1}
  }
});
  
export default OTPEntryScreen;

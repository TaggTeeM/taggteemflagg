import React, { useState, useEffect } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { Button, TextInput, View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

import { IsValidPhoneNumber } from '../middleware/Validators';

import taggteem_logo from '../assets/taggteem_logo.jpg';

type RootStackParamList = {
  Login: undefined;
  OTPEntry: { phone: string };
  SignUp: undefined;
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

  useFocusEffect(
    React.useCallback(() => {
      setError("");
      setSuccess("");
  
      return () => null;
    }, [])
  );

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
    <View style={ styles.viewPort }>
      <ImageBackground
        source={require('../assets/fade_green_background_1px_height.png')}
        imageStyle={{ resizeMode: 'stretch' }}
        style={styles.backgroundImage}
      >
        <View style={{width: "100%"}}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Icon name="arrow-circle-o-left" size={30} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.LogoTitle}>
          <Text style={ styles.title_text }>Flagg</Text>
          <Text style={styles.subtitle_text}>Sign Up</Text>
        </View>

        <View style={{width: "100%"}}>
          <View>
            <Text style={[styles.input_label, styles.phone_label]}>Phone number</Text>
            <TextInput
              ref={phoneInputRef}
              value={phone}
              onChangeText={handlePhoneChange}
              placeholder="Phone number"
              keyboardType='phone-pad'
              style={{color: "white", backgroundColor: "rgba(143, 200, 143, 0.6)", fontWeight: "bold"}}
            />
          </View>
          <View>
              <Text style={[styles.input_label]}>First name</Text>
              <TextInput
                ref={firstNameInputRef}
                value={firstName}
                onChangeText={handleFirstNameChange}
                placeholder='First name'
                style={{color: "white", backgroundColor: "rgba(143, 200, 143, 0.6)", fontWeight: "bold"}}
                />
            </View>
        </View>

        <View style={{width: "100%"}}>
          <Button title="Sign Up" onPress={handleSubmit} />
          {error !== '' && <Text style={styles.errortext}>{error}</Text>}
          {success !== '' && <Text style={styles.success_text}>{success}</Text>}
        </View>

        <View style={{flex: 1}}>
          <Text>&nbsp;</Text>
        </View>

        <View style={styles.signup_touchable}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.signup_text}>Already have an account? Log In</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  viewPort: {
    ...StyleSheet.absoluteFillObject,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -1
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    padding: 16, 
    display: "flex", 
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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
  phone_label: {
    marginTop: 8
  },
  signup_touchable: {
    marginTop: 36,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    width: "90%",
    borderRadius: 4,
    padding: 2,
  },
  signup_text: {
    fontWeight: "bold",
    color: "white",
    textShadowColor: "#007f00",
    textShadowRadius: 1,
    textShadowOffset: {width: 1, height: 1},
    textAlign: "center",
  }
});


export default SignUp;

import React, { useState, useEffect } from 'react';
import { TextInput as RNTextInput } from 'react-native';
import { Button, TextInput, View, Text, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

import { useAuth } from '../context/AuthContext';
import { IsValidPhoneNumber } from '../middleware/Validators';

import taggteem_logo from '../assets/taggteem_logo.jpg';

type RootStackParamList = {
  Login: undefined;
  OTPEntry: { phone: string };
  SignUp: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

const Login: React.FC<Props> = ({ navigation }) => {
  const { authState, login, logout } = useAuth();
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const phoneInputRef = React.useRef<RNTextInput>(null);

  useFocusEffect(
    React.useCallback(() => {
      setError("");
      setSuccess("");
  
      return () => null;
    }, [])
  );

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

    logout();
    
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
      <ImageBackground
        source={require('../assets/fade_green_background_1px_height.png')}
        imageStyle={{ resizeMode: 'stretch' }}
        style={styles.backgroundImage}
      >
        <View style={styles.LogoTitle}>
          <Text style={ styles.title_text }>Flagg</Text>
        </View>

        <View style={{marginTop: 16, width: "100%"}}>
          <Text style={[styles.input_label, styles.phone_label]}>Phone number</Text>
          <TextInput
            ref={phoneInputRef}
            placeholder="Phone number"
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            value={phone}
            style={{color: "white", backgroundColor: "rgba(143, 200, 143, 0.6)", fontWeight: "bold"}}
          />
        </View>

        <View style={{width: "100%"}}>
          <Button title="Log In" onPress={handleSubmit} />
          {error !== '' && <Text style={styles.errortext}>{error}</Text>}
          {success !== '' && <Text style={styles.success_text}>{success}</Text>}
        </View>

        <View style={{flex: 1}}>
          <Text>&nbsp;</Text>
        </View>

        <View style={styles.signup_touchable}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signup_text}>Don't have an account? Sign Up</Text>
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
  LogoTitle: {
    padding: 6,
    marginTop: 36,
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
    color: 'lime'
  },
  title_text: {
    fontSize:64,
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "#003f00",
    textShadowRadius: 1,
    textShadowOffset: {width: 3, height: 3},
    fontFamily: "Nexa-Heavy"
  },
  input_label: {
    fontFamily: "Nexa-Heavy"
  },
  phone_label: {
    marginTop: 8,
    color: "white",
    textShadowColor: "#003f00",
    textShadowRadius: 1,
    textShadowOffset: {width: 3, height: 3}
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
    textAlign: "center"
  }
});

export default Login;

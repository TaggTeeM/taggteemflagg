import React, { useState, useEffect } from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";

import { Booking } from "../types/BookingTypes";
import { useAuth } from '../context/AuthContext';

import taggteem_logo from '../assets/taggteem_logo.jpg';

type RootStackParamList = {
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
  
  type BecomeADriverScreenNavigationProp = StackNavigationProp<RootStackParamList, "BecomeADriver">;
  
  type Props = {
    navigation: BecomeADriverScreenNavigationProp;
  };
  
  const BecomeADriver: React.FC<Props> = ({ navigation }) => {
    const { authState } = useAuth();
    const [error, setError] = useState<string>('');

    const handleSignUp = () => {
        if (!authState.isLoggedIn || authState.loggedInUser === null || authState.loggedInUser === undefined) {
            navigation.navigate("Login");

            return;
        }

        const userInternalId = authState.loggedInUser.id;

        // Call the API endpoint
        fetch('http://10.0.2.2:3000/api/driver-signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userInternalId }), // Send userInternalId as payload
        })
        .then(response => response.json()) // assuming server responds with json
        .then(data => {
            if (data.success) {  // Assuming the API sends back a success field
                authState.loggedInUser!.driver = { online: data.online, approved: data.approved };

                navigation.navigate("BecomeADriverConfirmation");
            } else {
                setError(`Failed to sign up: [${data.errorCode}] ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            setError('Failed to sign up. Please check your network connection and try again.');
        });
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.logoContainer}>
                <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.text}>
                This is sample text and needs to be changed. As you can see from the image above, driving for Flagg is one of the best things ever and will solve all your problems. It will pass all your classes and clean your house. All claims contained herein are not legally binding.
            </Text>
            {error !== '' && <Text style={styles.errortext}>{error}</Text>}
            <Button title="Sign Me Up!" onPress={handleSignUp} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        width: 350,
        height: 450,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "black",
        marginBottom: 20, // spacing below the logo
    },
    logo: {
        width: 250,  // specify desired width
        alignSelf: 'center', // centers the logo horizontally within its container
        flex: 1,
    },
    container: {
        flex: 1,
    },
    contentContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
    },
    image: {
        width: 300,
        height: 200,
        marginBottom: 20,
    },
    errortext: {
        color: 'tomato'
    },
    text: {
        width: 350,
        marginBottom: 20,
        textAlign: 'justify',
    }
});

export default BecomeADriver;

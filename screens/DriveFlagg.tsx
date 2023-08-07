import React from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";

import { useAuth } from "../context/AuthContext";
import { Booking } from "../types/BookingTypes";

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
  };
  
  type BecomeADriverConfirmationScreenNavigationProp = StackNavigationProp<RootStackParamList, "BecomeADriverConfirmation">;
  
  type Props = {
    navigation: BecomeADriverConfirmationScreenNavigationProp;
  };
  
  const DriveFlagg: React.FC<Props> = ({ navigation }) => {
    const { authState } = useAuth();

    const handleSignUp = () => {
        navigation.navigate("Dashboard");
    };

    if (!authState?.loggedInUser?.driver?.approved) {
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.logoContainer}>
                    <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
                </View>
                
                <Text style={styles.title_text}>Under Review!</Text>
                <Text>Thank you for your interest in driving with Flagg. Your application is currently under review. We will contact you as soon as we make our decision.</Text>
                
                <Button title="Back" onPress={handleSignUp} />
            </ScrollView>
        );
    } else {
        return (
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <Text>&lt;&lt;&lt;MAP VIEW HERE&gt;&gt;&gt;</Text>
            </ScrollView>
        );
    }
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
    title_text: {
        fontSize: 18,
        fontWeight: "bold"
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
    textTitle: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold"
    },
    text: {
        width: 350,
        marginBottom: 20,
        textAlign: 'justify',
    }
});

export default DriveFlagg;

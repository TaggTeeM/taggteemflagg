import React from 'react';
import { View, Text, Button, Image, StyleSheet, ScrollView } from 'react-native';
import { StackNavigationProp } from "@react-navigation/stack";

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
    DriveFlagg: undefined;
  };
  
  type BecomeADriverConfirmationScreenNavigationProp = StackNavigationProp<RootStackParamList, "BecomeADriverConfirmation">;
  
  type Props = {
    navigation: BecomeADriverConfirmationScreenNavigationProp;
  };
  
  const BecomeADriverConfirmation: React.FC<Props> = ({ navigation }) => {
    const handleSignUp = () => {
        navigation.navigate("Dashboard")
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.logoContainer}>
                <Image source={taggteem_logo} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={styles.textTitle}>Congratulations!</Text>
            <Text style={styles.text}>
                This is sample text and needs to be changed. You are now signed up to be approved as a Flagg driver. We will be in touch for further information.
            </Text>
            <Button title="Back" onPress={handleSignUp} />
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

export default BecomeADriverConfirmation;

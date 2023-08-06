import React, { useContext, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

type RootStackParamList = {
    Login: undefined;
    ResetPassword: undefined;
    SignUp: undefined;
    Dashboard: undefined;
  };
  
  type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
  
  type Props = {
    navigation: LoginScreenNavigationProp;
  };
  
  
const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { authState, logout } = useAuth();
  
  const [firstName, setFirstName] = useState(authState.loggedInUser?.firstName || '');
  const [lastName, setLastName] = useState(authState.loggedInUser?.lastName || '');
  const [email, setEmail] = useState(authState.loggedInUser?.email || '');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      {authState.isLoggedIn && (
        <>
          <Text style={styles.text}>Welcome, User!</Text>
          <TextInput
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />
      <TextInput
        placeholder="Last Name"
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <Button title="Save Profile" onPress={() => { /* save profile code here */ }} />
          <Button
            title="Log Out"
            onPress={() => {
              logout();
              navigation.replace('Login');
            }}
          />
        </>
      )}
      {!authState.isLoggedIn && (
        <Text style={styles.text}>Please log in to view your profile.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
  },
});

export default ProfileScreen;

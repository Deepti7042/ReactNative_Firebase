import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, StyleSheet, View, Alert, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const App = () => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);

  // Handle authentication state changes
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        setAuthenticated(false);
      }
    });
    return subscriber; // Unsubscribe on unmount
  }, []);

  // Sign in with phone number
  const signIn = async (phoneNumber) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Confirm OTP
  const confirmOTP = async (code) => {
    try {
      await confirm.confirm(code);
      setConfirm(null);
      Alert.alert('Success', 'Phone number verified!');
    } catch (error) {
      Alert.alert('Error', 'Invalid code. Please try again.');
    }
  };

  // Authenticated Screen
  const Authenticated = () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome!</Text>
      <Text style={styles.text}>You are authenticated.</Text>
      <Button title="Logout" onPress={() => auth().signOut()} />
    </SafeAreaView>
  );

  // OTP Screen
  const OTPScreen = () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      <Button title="Confirm OTP" onPress={() => confirmOTP(otp)} />
    </SafeAreaView>
  );

  // Phone Number Screen
  const PhoneNumber = () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Firebase Phone Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Mobile Number"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />
      <TouchableOpacity style={styles.button} onPress={() => signIn(mobile)}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );

  // Render Screens Based on State
  if (authenticated) return <Authenticated />;
  if (confirm) return <OTPScreen />;
  return <PhoneNumber />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
  input: {
    height: 50,
    width: '80%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    width: '80%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;

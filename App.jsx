import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, StyleSheet, View, Alert, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

// PhoneNumberInput Component for handling phone number input
const PhoneNumberInput = ({ onSendOTP }) => {
  const [localNumber, setLocalNumber] = useState(''); // Local state for phone number
  const inputRef = useRef(null); // Ref to maintain focus

  return (
    <>
      {/* Phone Number Input */}
      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Enter Mobile Number (e.g., +1XXXXXXXXXX)"
        keyboardType="phone-pad"
        value={localNumber}
        onChangeText={(text) => {
          // Allow only valid characters: + and digits
          const formattedText = text.replace(/[^0-9+]/g, '');
          setLocalNumber(formattedText);
        }}
        maxLength={15} // Restrict input length to 15 characters
        returnKeyType="done"
      />

      {/* Send OTP Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (/^\+\d{1,3}\d{10}$/.test(localNumber)) {
            onSendOTP(localNumber); // Send OTP only when valid
          } else {
            Alert.alert('Error', 'Please enter a valid phone number with country code.');
          }
        }}
      >
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>
    </>
  );
};

const App = () => {
  const [mobile, setMobile] = useState(''); // State for submitted phone number
  const [otp, setOtp] = useState(''); // OTP input
  const [confirm, setConfirm] = useState(null); // Firebase confirmation object
  const [authenticated, setAuthenticated] = useState(false);

  // Handle authentication state changes
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setAuthenticated(!!user);
    });
    return subscriber; // Cleanup subscription
  }, []);

  // Sign in with phone number
  const signIn = async (phoneNumber) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert('OTP Sent', 'An OTP has been sent to your phone.');
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
  const PhoneNumberScreen = () => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Firebase Phone Login</Text>
      <PhoneNumberInput
        onSendOTP={(number) => {
          setMobile(number); // Update state with valid phone number
          signIn(number); // Trigger Firebase OTP logic
        }}
      />
      {mobile !== '' && (
        <Text style={styles.text}>Phone Number Submitted: {mobile}</Text>
      )}
    </SafeAreaView>
  );

  // Render Screens Based on State
  if (authenticated) return <Authenticated />;
  if (confirm) return <OTPScreen />;
  return <PhoneNumberScreen />;
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
    marginTop: 20,
    color: '#333',
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
    fontSize: 16,
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

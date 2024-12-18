import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, StyleSheet, View, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const Login = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [confirm, setConfirm] = useState(null); // Stores Firebase confirmation object
  const [otp, setOtp] = useState(''); // OTP input state

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Home'); // Redirect to Home if authenticated
      }
    });
    return subscriber; // Cleanup subscription
  }, [navigation]);

  // Sign in with phone number
  const signIn = async (phoneNumber) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation); // Save confirmation object for OTP verification
      Alert.alert('OTP Sent', 'An OTP has been sent to your phone.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Confirm OTP
  const confirmOtpCode = async () => {
    try {
      await confirm.confirm(otp); // Verify OTP with Firebase
      Alert.alert('Success', 'Phone number verified!');
      navigation.replace('Home'); // Redirect to Home after successful verification
    } catch (error) {
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    }
  };

  // OTP Screen
  if (confirm) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.title, { marginBottom: 40 }]}>Verify OTP</Text> {/* Adjusted spacing */}
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="numeric"
            value={otp}
            onChangeText={setOtp}
            maxLength={6} // Restrict OTP input to 6 digits
          />
          <TouchableOpacity style={styles.button} onPress={confirmOtpCode}>
            <Text style={styles.buttonText}>Confirm OTP</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Phone Number Screen
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to Quotyyy</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Mobile Number (e.g., +1XXXXXXXXXX)"
          keyboardType="phone-pad"
          value={mobile}
          onChangeText={(text) => setMobile(text.replace(/[^0-9+]/g, ''))}
        />
        <TouchableOpacity style={styles.button} onPress={() => signIn(mobile)}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1A5465',
    padding: 16,
  },
  card: {
    width: '90%',
    padding: 30, // Increased padding for more space
    backgroundColor: '#F8EFEF',
    borderRadius: 15, // More rounded corners
    elevation: 6, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 80, // Added extra margin for spacing
    marginTop: 30,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20, // Space below the input
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20, // Space below the button
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Login;

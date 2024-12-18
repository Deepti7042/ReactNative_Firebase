import React, { useState, useEffect } from 'react';
import { SafeAreaView, TextInput, TouchableOpacity, Text, StyleSheet, View, Alert, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const Login = ({ navigation }) => {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [confirm, setConfirm] = useState(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        navigation.replace('Home'); // Redirect to Home if authenticated
      }
    });
    return subscriber; // Cleanup subscription
  }, [navigation]);

  const signIn = async (phoneNumber) => {
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);
      Alert.alert('OTP Sent', 'An OTP has been sent to your phone.');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const confirmOTP = async (code) => {
    try {
      await confirm.confirm(code);
      Alert.alert('Success', 'Phone number verified!');
    } catch (error) {
      Alert.alert('Error', 'Invalid code. Please try again.');
    }
  };

  if (confirm) {
    return (
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
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Firebase Phone Login</Text>
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
    </SafeAreaView>
  );
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

export default Login;

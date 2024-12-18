import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import auth from '@react-native-firebase/auth';

const LogoutScreen = ({ navigation }) => {
  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => navigation.replace('Login')) // Directly navigate to the Login screen
      .catch((error) => console.error('Logout Error:', error));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>You are about to log out.</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
});

export default LogoutScreen;

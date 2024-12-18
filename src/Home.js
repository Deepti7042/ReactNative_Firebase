import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Button, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const Home = ({ navigation }) => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchQuote = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=happiness', {
        headers: { 'X-Api-Key': 'egRdlyqvIF5PmfdBq0VIDQ==DeDRi6lOr4KDWIiP' },
      });
      const data = await response.json();
      if (data.length > 0) {
        setQuote(data[0].quote);
        setAuthor(data[0].author);
      } else {
        setQuote('No quote available.');
        setAuthor('');
      }
    } catch (error) {
      setQuote('Failed to fetch the quote.');
      setAuthor('');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => navigation.replace('Login'))
      .catch((error) => Alert.alert('Error', error.message));
  };

  useEffect(() => {
    fetchQuote();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoutContainer}>
        <Button title="Logout" onPress={handleLogout} />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.quote}>"{quote}"</Text>
          {author && <Text style={styles.author}>- {author}</Text>}
          <Button title="Fetch New Quote" onPress={fetchQuote} />
        </>
      )}
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
  logoutContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
  },
  quote: {
    fontSize: 20,
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 10,
  },
  author: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default Home;

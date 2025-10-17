import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Image,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const buttonScale = new Animated.Value(1);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Introdu un email și o parolă!');
      return;
    }
  
    try {
      const response = await fetch('http://192.168.1.2:3000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json(); // ✅ doar o singură dată
      if (response.ok) {
        console.log('Autentificat:', data);
        navigation.navigate('Home', { email: data.user.email }); // ✅ trimite corect emailul
      } else {
        setError(data.message || 'Eroare la autentificare!');
      }
    } catch (error) {
      console.error(error);
      setError('Eroare la conectarea cu serverul.');
    }
  };
  
  

  const animateButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

        <Image
          source={require('../assets/images/revenue-i1.png')}
          style={styles.image}
          resizeMode="contain"
        />

        <Text style={styles.header}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              animateButtonPress();
              handleLogin();
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.registerText}>
          Don’t have an account?{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Register')}>
            Sign up
          </Text>
        </Text>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
  image: {
    width: 260,
    height: 260,
    marginBottom: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5C3A21',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#F9F5F2',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DCC5B2',
    color: '#3A2A1C',
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#8B593E',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
    shadowColor: '#8B593E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  registerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#6F4E37',
  },
  linkText: {
    color: '#8B593E',
    fontWeight: '500',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, StatusBar, ImageBackground, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';


// Ecranul pentru inregistrare utilizator
export default function RegisterScreen({ navigation }) {
  // Starea pentru email, parola, eroare si nume
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  // Functia apelata cand utilizatorul apasa pe butonul "Inregistreaza-te"
  const handleRegister = async () => {
    // Verifica daca emailul si parola sunt completate
    if (!email || !password) {
      Alert.alert('Eroare', 'Introdu un email si o parola!');
      return;
    }
  
    try {
      // Trimite datele catre serverul backend pentru a crea un cont nou
      const response = await fetch('http://192.168.1.2:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      // Daca raspunsul e OK, afiseaza mesaj de succes si redirectioneaza spre login
      if (response.ok) {
        Alert.alert('Succes', 'Contul a fost creat cu succes!');
        navigation.navigate('Login');
      } else {
        Alert.alert('Eroare', data.message || 'A aparut o eroare!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Eroare', 'Conexiunea la server a esuat.');
    }
  };
  

  return (
    // Fundal cu imagine si layout responsiv pentru tastatura
    <ImageBackground source={require('../assets/images/b-image.jpg')} style={styles.background}>
      <KeyboardAvoidingView
          style={styles.overlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={60} // Offset daca exista header sau status bar
        >
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
    <View style={styles.container}>
          {/* Logo si titlu */}
          <Image source={require('../assets/images/logo_alb.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.title}>Creeaza un cont nou</Text>

          {/* Input pentru nume */}
          <TextInput
            style={styles.input}
            placeholder="Nume complet"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />

          {/* Input pentru email */}
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          {/* Input pentru parola */}
          <TextInput
            style={styles.input}
            placeholder="Parola"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          {/* Afisare eroare daca exista */}
          {error && <Text style={styles.errorText}>{error}</Text>}

          {/* Buton de inregistrare */}
          <TouchableOpacity style={styles.button} onPress={handleRegister} activeOpacity={0.9}>
            <Text style={styles.buttonText}>Inregistreaza-te</Text>
          </TouchableOpacity>

          {/* Link catre ecranul de login */}
          <Text style={styles.footerText}>
            Ai deja un cont?{' '}
            <Text style={styles.linkText} onPress={() => navigation.navigate('Login')}>Autentifica-te</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  </ImageBackground>
  );
}


// Stilurile pentru componentele vizuale
const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 28, 28, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(30,30,30,0.95)',
    padding: 24,
    borderRadius: 20,
  },
  logo: {
    width: 250,
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 24,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#1e1e1e',
    marginVertical: 10,
    borderRadius: 12,
    color: 'white',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  errorText: {
    color: '#FF6B6B',
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#8B593E',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#aaa',
  },
  linkText: {
    color: '#F0A04B',
    fontWeight: '500',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 20,
  },
});

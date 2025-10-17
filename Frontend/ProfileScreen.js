// ProfileScreen modernizat cu tema coffee, stil aerisit si culori consistente
import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Image,
  Alert,
  ImageBackground,
} from 'react-native';

export default function ProfileScreen() {
  const route = useRoute();
  const emailFromParams = route?.params?.email || ''; // obținut din navigation

  const [email, setEmail] = useState(emailFromParams); // acum merge corect
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [errors, setErrors] = useState({}); // asta era lipsă sau prea jos

  const navigation = useNavigation();

  
  

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return;
  
      try {
        const response = await fetch(`http://192.168.1.2:3000/api/users/${encodeURIComponent(email.toLowerCase())}`);
        const data = await response.json();
        console.log('📦 Date primite din API:', data);
  
        if (response.ok) {
          setName(data.name || '');
          setBirthdate(data.birthdate || '');
          setAge(data.age || '');
          setLocation(data.location || '');
          setOccupation(data.occupation || '');
          setBio(data.bio || '');
          setProfileImage(data.profileImage || null);
        } else {
          console.warn('Răspuns invalid de la server:', data);
        }
      } catch (error) {
        console.error('Eroare la preluarea profilului:', error);
      }
    };
  
    fetchProfile();
  }, [email]);
  
  
  
  
  
  

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidDate = (dateStr) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateStr)) return false;
    const date = new Date(dateStr);
    return !isNaN(date.getTime()) && date.getFullYear() > 1900;
  };
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // folosește asta
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        base64: true,
      });
  
      if (!result.canceled && result.assets?.length > 0) {
        const selectedImage = result.assets[0];
        setProfileImage(selectedImage.uri);
      }
    } catch (error) {
      console.error('Eroare la selectarea imaginii:', error);
    }
  };
  
  
  
  const handleSaveProfile = async () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = 'Numele este obligatoriu.';
    if (!email.trim()) newErrors.email = 'Emailul este obligatoriu.';
    else if (!isValidEmail(email)) newErrors.email = 'Emailul nu este valid.';
    if (!birthdate.trim()) newErrors.birthdate = 'Data nașterii este obligatorie.';
    else if (!isValidDate(birthdate)) newErrors.birthdate = 'Data nu este validă. Format: YYYY-MM-DD';
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch(`http://192.168.1.2:3000/api/users/${email}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            birthdate,
            age,
            location,
            occupation,
            bio,
            profileImage,
          }),
        });
  
        const data = await response.json();
        if (response.ok) {
          Alert.alert('Succes', 'Profilul a fost salvat!');
        } else {
          Alert.alert('Eroare', data.message || 'A apărut o eroare!');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Eroare', 'Nu s-a putut salva profilul.');
      }
    }
  };
  

  return (
    <ImageBackground
      source={require('../assets/images/b-image.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.avatarContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : { uri: 'https://i.pravatar.cc/100' }}
          style={styles.avatar}
        />
        <Text style={styles.changePhoto} onPress={pickImage}>Încarcă din galerie</Text>
        </View>

        <Text style={styles.header}>Profilul Meu</Text>

        <TextInput
          style={styles.input}
          placeholder="Nume complet *"
          placeholderTextColor="#9A8478"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErrors((prev) => ({ ...prev, name: '' }));
          }}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email *"
          placeholderTextColor="#9A8478"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: '' }));
          }}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Data nașterii * (ex: 2000-05-10)"
          placeholderTextColor="#9A8478"
          value={birthdate}
          onChangeText={(text) => {
            setBirthdate(text);
            setErrors((prev) => ({ ...prev, birthdate: '' }));
          }}
        />
        {errors.birthdate && <Text style={styles.errorText}>{errors.birthdate}</Text>}

        {age !== '' && (
          <View style={styles.ageContainer}>
            <Text style={styles.ageText}>Vârstă:</Text>
            <Text style={styles.ageValue}>{age} ani</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Locație"
          placeholderTextColor="#9A8478"
          value={location}
          onChangeText={setLocation}
        />

        <TextInput
          style={styles.input}
          placeholder="Ocupație / Nivel educațional"
          placeholderTextColor="#9A8478"
          value={occupation}
          onChangeText={setOccupation}
        />

        <TextInput
          style={[styles.input, styles.bioInput]}
          placeholder="Despre mine"
          placeholderTextColor="#9A8478"
          multiline
          numberOfLines={4}
          value={bio}
          onChangeText={setBio}
        />

        <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
          <Text style={styles.buttonText}>Salvează Profil</Text>
        </TouchableOpacity>

        <View style={styles.archiveCard}>
          <Text style={styles.docsTitle}>📂 Arhiva CV-uri</Text>

          <Text style={styles.docFile}>Accesează toate CV-urile tale salvate</Text>

          <TouchableOpacity
            style={styles.archiveButton}
            onPress={() => navigation.navigate('Archive')}
          >
          <Text style={styles.archiveButtonText}>Vezi arhiva</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.archiveCard}>
          <Text style={styles.docsTitle}>📂 Arhiva Scrisori</Text>

          <Text style={styles.docFile}>Accesează toate scrisorile tale salvate</Text>

          <TouchableOpacity
            style={styles.archiveButton}
            onPress={() => navigation.navigate('ArchiveCL')}
          >
          <Text style={styles.archiveButtonText}>Vezi arhiva</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'rgba(255,248,243,0.9)',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    alignItems: 'center',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ccc',
  },
  changePhoto: {
    color: '#8B593E',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A3428',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5D3B7',
    color: '#4A3428',
    fontSize: 16,
    marginVertical: 8,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  ageContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 10,
  },
  ageText: {
    color: '#4A3428',
    fontSize: 16,
    marginRight: 6,
  },
  ageValue: {
    color: '#4A3428',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    width: '100%',
    color: '#D32F2F',
    fontSize: 14,
    marginTop: -5,
    marginBottom: 8,
    paddingLeft: 4,
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
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  docsContainer: {
    width: '100%',
    marginTop: 40,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#E5D3B7',
    borderWidth: 1,
  },
  docsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A3428',
    marginBottom: 15,
  },
  docItem: {
    marginBottom: 20,
  },
  docLabel: {
    color: '#4A3428',
    fontSize: 16,
    marginBottom: 4,
  },
  docFile: {
    color: '#7c5e4c',
    fontSize: 14,
    marginBottom: 8,
  },
  docButton: {
    backgroundColor: '#8B593E',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    width: '50%',
  },
  docButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  archiveCard: {
    width: '100%',
    marginTop: 40,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderColor: '#E5D3B7',
    borderWidth: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  archiveButton: {
    backgroundColor: '#8B593E',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 10,
  },
  archiveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  
});
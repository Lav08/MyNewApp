// ✅ HomeScreen.js complet, modern, aerisit, cu iconuri si carduri + HelpBot animat jos

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import { MaterialIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';


export default function HomeScreen({ navigation, route }) {
  const { email, profileImage, name } = route?.params || {};
  const [today, setToday] = useState('');
  const [botAnim] = useState(new Animated.Value(0));
  const [userData, setUserData] = useState({ email, profileImage, name });

  



  
  const encodedEmail = encodeURIComponent(email);
  
  useEffect(() => {
    const fetchUserData = async () => {
      if (!email) {
        console.warn('Emailul nu a fost primit în route.params!');
        return;
      }
  
      try {
        const response = await fetch(`http://192.168.1.2:3000/api/users/${encodeURIComponent(email)}`);
        const data = await response.json();
  
        if (data && data._id) {
          setUserData(data);
        } else {
          console.warn('Răspuns invalid de la server:', data);
        }
      } catch (error) {
        console.error('Eroare la preluarea datelor userului:', error);
      }
    };
  
    fetchUserData();
  }, [email]); //  ascultăm emailul deja extras
  
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  


  const Card = ({ icon, title, subtitle, onPress }) => (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.icon}>{icon}</View>
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{title}</Text>
        {subtitle && <Text style={styles.cardSubtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../assets/images/b-image.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <LinearGradient colors={["#7A4E2B", "#C39A7B"]} style={styles.userBar}>
            <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile', { email: userData.email.toLowerCase() })}            >
              <Image
                source={{ uri: userData?.profileImage || 'https://i.pravatar.cc/100' }}
                style={styles.avatar}
              />
            </TouchableOpacity>




              <View>
                <Text style={styles.welcome}>Bine ai venit</Text>
                <Text style={styles.username}>
                  {userData?.name ? capitalize(userData.name) : capitalize(email.split('@')[0])}
                </Text>

                <Text style={styles.date}>{today}</Text>
              </View>
            </View>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../assets/images/logo1.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>

          <View style={styles.grid}>
            <Card
              icon={<Feather name="file-text" size={24} color="#4A3428" />}
              title="Creare CV"
              onPress={() => navigation.navigate('Cv')}
            />
           <Card
              icon={<MaterialIcons name="edit" size={24} color="#4A3428" />}
              title="Scrisoare de intenție"
              onPress={() => navigation.navigate('Scrisoare')}
            />

            <Card
              icon={<MaterialIcons name="work-outline" size={24} color="#4A3428" />}
              title="Platforma de joburi"
              onPress={() => navigation.navigate('Jobs')}
            />
            
            <Card
              icon={<Ionicons name="chatbubbles-outline" size={24} color="#4A3428" />}
              title="Pregătire interviu"
              onPress={() => navigation.navigate('ChatBot')}
            />
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Help')}
            activeOpacity={0.8}
          >
  <Animated.View style={[styles.helpBot, { transform: [{ translateY: botAnim }] }]}>
    <Ionicons name="help-circle" size={32} color="#4A3428" />
    <Text style={styles.helpText}>Ai nevoie de ajutor? Sunt aici pentru tine!</Text>
  </Animated.View>
</TouchableOpacity>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 248, 243, 0.4)',
  },
  container: {
    padding: 24,
  },
  userBar: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    marginHorizontal: -24,
    marginTop: -24,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 60,
    height: 70,
    borderRadius: 60,
    backgroundColor: '#ccc',
    
  },
  welcome: {
    fontSize: 16,
    color: '#FFF',
  },
  username: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
  },
  date: {
    fontSize: 14,
    color: '#f5e9e2',
    marginTop: 2,
  },
  logoWrapper: {
    backgroundColor: '#fff',
    padding: 3,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.30,
    shadowRadius: 10,
    elevation: 10,
  },
  logo: {
    width: 60,
    height: 60,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#ffffff',
    width: '48%',
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  icon: {
    marginBottom: 10,
  },
  cardTextContainer: {},
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A3428',
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#7c5e4c',
  },
  helpBot: {
    marginTop: 60,
    padding: 16,
    backgroundColor: '#B58863',
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  helpText: {
    color: '#4A3428',
    fontSize: 14,
    fontWeight: '500',
  },
});

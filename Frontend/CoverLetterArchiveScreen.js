// Importuri necesare pentru afisare lista, actiuni locale, PDF, partajare si WebView
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function CoverLetterArchiveScreen() {
  // State pentru lista de scrisori si pentru scrisoarea selectata pentru preview
  const [letters, setLetters] = useState([]);
  const [preview, setPreview] = useState(null);

  //  La montare componenta, incarca toate scrisorile salvate local
  useEffect(() => {
    const loadLetters = async () => {
      const data = await AsyncStorage.getItem('coverLetters');
      setLetters(data ? JSON.parse(data) : []);
    };
    loadLetters();
  }, []);

  // Functie care genereaza PDF din scrisoare si permite sharing
  const handleDownload = async (item) => {
    const html = `
      <html><head><meta charset="UTF-8"></head><body>${item.html}</body></html>
    `;
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Eroare', 'Partajarea nu este disponibilă pe acest dispozitiv.');
    }
  };

  // Functie care sterge o scrisoare dupa confirmare
  const handleDelete = async (id) => {
    Alert.alert('Confirmare', 'Ștergi această scrisoare?', [
      { text: 'Anulează', style: 'cancel' },
      {
        text: 'Șterge',
        style: 'destructive',
        onPress: async () => {
          const newLetters = letters.filter((item) => item.id !== id);
          setLetters(newLetters);
          await AsyncStorage.setItem('coverLetters', JSON.stringify(newLetters));
        }
      }
    ]);
  };

  // Daca exista o scrisoare selectata pentru preview → afiseaza WebView cu buton de descarcare
  return preview ? (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => setPreview(null)} style={{ marginTop: 60, marginLeft: 20 }}>
        <Text style={{ color: '#8B593E' }}>← Înapoi la arhivă</Text>
      </TouchableOpacity>
      <WebView originWhitelist={['*']} source={{ html: preview.html }} style={{ flex: 1 }} />
      <TouchableOpacity onPress={() => handleDownload(preview)} style={styles.downloadButton}>
        <Text style={styles.downloadButtonText}>⬇️ Descarcă PDF</Text>
      </TouchableOpacity>
    </View>
  ) : (
    // Daca nu este preview activ, afiseaza lista de scrisori sau mesaj ca nu exista
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>📁 Arhivă Scrisori de Intenție</Text>
      {letters.length === 0 ? (
        <Text style={{ marginTop: 20 }}>Nu ai salvat nicio scrisoare.</Text>
      ) : (
        <FlatList
          data={letters}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {/*  Header-ul fiecarei scrisori din lista */}
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.name || 'Fără nume'}</Text>
                <Text style={styles.job}>{item.jobTitle || 'Fără funcție'}</Text>
                <Text style={styles.date}>{item.date || 'Fără dată'}</Text>
              </View>

              {/* 🔸 Butoane de actiune pentru fiecare scrisoare: Vezi, Descarca, Sterge */}
              <View style={styles.actions}>
                <TouchableOpacity onPress={() => setPreview(item)} style={[styles.button, styles.buttonView]}>
                  <Text style={[styles.buttonText, styles.buttonViewText]}>👁️ Vezi</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDownload(item)} style={styles.button}>
                  <Text style={styles.buttonText}>⬇️ Descarcă</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(item.id)} style={[styles.button, styles.deleteButton]}>
                  <Text style={[styles.buttonText, styles.deleteButtonText]}>🗑️ Șterge</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

// Stilizare pentru lista, carduri, actiuni si preview
const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8B593E',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B593E',
  },
  job: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#faeee3',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#8B593E',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ffe6e6',
  },
  deleteButtonText: {
    color: '#cc0000',
  },
  downloadButton: {
    margin: 10,
    backgroundColor: '#8B593E',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  downloadButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonView: {
    backgroundColor: '#e8f5e9',
  },
  buttonViewText: {
    color: '#4a774f',
  },
});

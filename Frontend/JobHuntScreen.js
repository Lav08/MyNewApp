// JobHuntScreen.js – Pagina de cautare joburi cu UI stilizat + joburi implicite pentru studenti

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';

// Componenta principala pentru ecranul de cautare joburi
export default function JobHuntScreen({ navigation }) {
  // Stari pentru input, lista de joburi si incarcarea datelor
  const [query, setQuery] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Functie pentru incarcare automata la deschidere: joburi pentru studenti
  const fetchInitialJobs = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=9319af90&app_key=72c603aa72501f725846fedc4a3d0f76&what=internship'
      );
      const data = await response.json();
      setJobs(data.results || []);
    } catch (error) {
      console.error('Eroare la incarcarea joburilor pentru studenti:', error);
    } finally {
      setLoading(false);
    }
  };

  // Functie pentru cautarea personalizata dupa cuvant cheie (query)
  const fetchJobs = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=9319af90&app_key=72c603aa72501f725846fedc4a3d0f76&what=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setJobs(data.results || []);
    } catch (error) {
      console.error('Eroare la preluarea joburilor:', error);
    } finally {
      setLoading(false);
    }
  };

  // La montarea ecranului, se incarca automat joburile initiale
  useEffect(() => {
    fetchInitialJobs();
  }, []);

  // Interfata principala
  return (
    <View style={styles.container}>
      {/* Titlu si subtitlu */}
      <Text style={styles.title}>🔍 Cautare Joburi</Text>
      <Text style={styles.subtitle}>📄 Oferte actuale:</Text>

      {/* Input cautare + buton cu lupa */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Cauta un job (ex: frontend, marketing)"
          value={query}
          onChangeText={setQuery}
        />
        <TouchableOpacity onPress={fetchJobs} style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Loader sau lista cu joburi */}
      {loading ? (
        <ActivityIndicator size="large" color="#7C4A33" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            // Fiecare card de job + buton "Aplica"
            <TouchableOpacity onPress={() => navigation.navigate('JobDetails', { job: item })}>
              <View style={styles.jobCard}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <Text style={styles.company}>{item.company.display_name}</Text>
                <Text style={styles.location}>{item.location.display_name}</Text>
                <TouchableOpacity
                  style={styles.applyButton}
                  onPress={() => Linking.openURL(item.redirect_url)}
                >
                  <Text style={styles.applyButtonText}>Aplica</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
}

// Stiluri vizuale pentru componenta
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F3',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#4A3428',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4A3428',
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#7C4A33',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jobCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A3428',
  },
  company: {
    color: '#7C4A33',
    marginTop: 4,
  },
  location: {
    color: '#A0846A',
    fontStyle: 'italic',
    marginTop: 2,
  },
  link: {
    color: '#B58863',
    fontWeight: 'bold',
    marginTop: 10,
  },
  applyButton: {
    marginTop: 10,
    backgroundColor: '#28a745',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

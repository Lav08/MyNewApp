import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

// Ecranul de detalii pentru un job selectat din lista
export default function JobDetailsScreen({ route }) {
  const { job } = route.params; // preia obiectul job transmis prin navigatie

  return (
    <View style={styles.container}>
      {/* Titlu job */}
      <Text style={styles.title}>{job.title}</Text>

      {/* Nume companie */}
      <Text style={styles.company}>{job.company.display_name}</Text>

      {/* Locatie job */}
      <Text style={styles.location}>{job.location.display_name}</Text>

      {/* Descriere job (daca exista) */}
      {job.description && <Text style={styles.description}>{job.description}</Text>}

      {/* Buton care deschide link-ul extern pentru aplicare */}
      <TouchableOpacity
        style={styles.applyButton}
        onPress={() => Linking.openURL(job.redirect_url)}
      >
        <Text style={styles.applyButtonText}>Aplica pe site</Text>
      </TouchableOpacity>
    </View>
  );
}

// Stiluri vizuale pentru componenta
const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF8F3',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#4A3428',
    marginBottom: 8,
  },
  company: {
    fontSize: 16,
    color: '#7C4A33',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#A0846A',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: '#3a2e28',
    marginBottom: 20,
  },
  applyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

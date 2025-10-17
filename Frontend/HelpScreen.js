import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function HelpScreen() {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const faqs = [
    {
      question: 'Este aplicația gratuită?',
      answer: 'Da, aplicația este gratuită pentru toți studenții autentificați cu email instituțional.',
    },
    {
      question: 'Pot salva sau exporta CV-ul?',
      answer: 'Da, CV-ul și scrisoarea de intenție pot fi exportate în format PDF.',
    },
    {
      question: 'Datele mele sunt în siguranță?',
      answer: 'Absolut. Respectăm regulamentele GDPR și nu stocăm informații fără consimțământ.',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📘 Ghid de utilizare</Text>

      <Text style={styles.sectionTitle}>🔹 Funcționalități principale</Text>
      <View style={styles.card}>
        <Feather name="file-text" size={22} color="#4A3428" />
        <Text style={styles.cardText}>Creare CV rapid și profesional.</Text>
      </View>
      <View style={styles.card}>
        <MaterialIcons name="edit" size={22} color="#4A3428" />
        <Text style={styles.cardText}>Scrisori de intenție generate de AI.</Text>
      </View>
      <View style={styles.card}>
        <MaterialIcons name="work-outline" size={22} color="#4A3428" />
        <Text style={styles.cardText}>Recomandări personalizate de joburi.</Text>
      </View>
      <View style={styles.card}>
        <Ionicons name="chatbubbles-outline" size={22} color="#4A3428" />
        <Text style={styles.cardText}>Pregătire pentru interviuri prin AI Chat.</Text>
      </View>

      <Text style={styles.sectionTitle}>❓ Întrebări frecvente</Text>
      {faqs.map((item, index) => (
        <TouchableOpacity key={index} onPress={() => toggleExpand(index)} style={styles.faqItem}>
          <View style={styles.faqHeader}>
            <Text style={styles.faqQ}>{item.question}</Text>
            <Ionicons
              name={expandedIndex === index ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#4A3428"
            />
          </View>
          {expandedIndex === index && <Text style={styles.faqA}>{item.answer}</Text>}
        </TouchableOpacity>
      ))}

      <Text style={styles.sectionTitle}>📩 Asistență</Text>
      <Text style={styles.supportText}>Ai nevoie de ajutor suplimentar?</Text>
      <TouchableOpacity style={styles.contactBtn}>
        <Ionicons name="mail" size={18} color="#fff" />
        <Text style={styles.contactText}>Contactează-ne</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#FFF8F3',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#4A3428',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A3428',
    marginVertical: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#4A3428',
  },
  faqItem: {
    marginBottom: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  faqQ: {
    fontWeight: '600',
    color: '#4A3428',
    fontSize: 15,
  },
  faqA: {
    marginTop: 8,
    color: '#7A4E2B',
    fontSize: 14,
  },
  supportText: {
    fontSize: 14,
    color: '#4A3428',
    marginBottom: 8,
  },
  contactBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B58863',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  contactText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '600',
  },
});

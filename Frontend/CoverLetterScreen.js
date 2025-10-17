import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { WebView } from 'react-native-webview';
//Mergem pe aceeasi logica ca si la CV
export default function CoverLetterScreen() {
  const [form, setForm] = useState({
    gender: '',
    name: '',
    jobTitle: '',
    company: '',
    contactName: '',
    personalDescription: '',
    objective: '',
    whyCompany: '',
    email: '',
    phone: '',
  });

  const [tone, setTone] = useState('formala');
  const [generatedText, setGeneratedText] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);

  const generateCoverLetter = () => {
    const {
      gender, name, jobTitle, company, contactName,
      personalDescription, objective, whyCompany, email, phone
    } = form;

    const cleanName = contactName.trim().replace(/\b(\w+)\s+\1\b/gi, '$1');
const greeting = `Stimat(ă)${cleanName ? ` ${cleanName}` : ' reprezentant al echipei de recrutare'}`;


    const pronounPhrase = gender === 'feminin'
      ? 'o candidată motivată și implicată'
      : 'un candidat motivat și implicat';

    const today = new Date().toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });

    let letter = '';

    if (tone === 'formala') {
      letter = `
<html><head><meta charset="UTF-8"></head><body style="font-family:Georgia,serif;margin:0;padding:0">
<div style="max-width:750px;margin:auto;border:1px solid #ccc;border-radius:12px;overflow:hidden">
  <div style="background:#003399;color:#fff;padding:20px">
    <h2 style="margin:0">${name.toUpperCase()}</h2>
  

  </div>
  <div style="padding:30px">
    <p><b>${company}</b></p>
    <p>${today}</p>
    <p>${greeting},</p>
    <p>Subsemnat${gender === 'feminin' ? 'a' : 'ul'} <b>${name}</b>, doresc să îmi exprim interesul față de poziția de <b>${jobTitle}</b> în cadrul companiei <b>${company}</b>.</p>
    <p>În calitate de ${pronounPhrase}, consider că experiența mea profesională și dorința de a contribui activ la dezvoltarea companiei sunt elemente care mă recomandă pentru acest post.</p>
    ${personalDescription ? `<p>${personalDescription}</p>` : ''}
    ${objective ? `<p>Obiectivul meu profesional este: ${objective}</p>` : ''}
    ${whyCompany ? `<p>Apreciez activitatea companiei <b>${company}</b> și sunt atras${gender === 'feminin' ? 'ă' : ''} de valorile și perspectivele de dezvoltare oferite. ${whyCompany}</p>` : ''}
    <p>Aștept cu deosebit interes posibilitatea de a discuta detalii suplimentare în cadrul unui interviu.</p>
    <p>Cu stimă,<br/><b>${name}</b></p>
  </div>
  <div style="background:#f9f9f9;padding:20px;text-align:center;color:#333;border-top:1px solid #ccc">
    <p style="margin:0">${name}</p>
    <p style="margin:0">${email} • ${phone}</p>
  </div>
</div></body></html>`;
    } else {
      letter = `
<html><head><meta charset="UTF-8"></head><body style="font-family:Segoe UI,sans-serif;margin:0;padding:0">
<div style="max-width:750px;margin:auto;border:1px solid #ccc;border-radius:12px;overflow:hidden">
  <div style="background:#f58b00;color:#fff;padding:20px">
    <h2 style="margin:0">${name.toUpperCase()}</h2>
   
  </div>
  <div style="padding:30px">
    <p><b>${company}</b></p>
    <p>${today}</p>
    <p>Bună ziua${contactName ? `, ${contactName}` : ''},</p>
    <p>Sunt ${pronounPhrase}, în căutarea unei noi provocări profesionale, și aș fi încântat${gender === 'feminin' ? 'ă' : ''} să mă alătur echipei <b>${company}</b> în calitate de <b>${jobTitle}</b>.</p>
    ${personalDescription ? `<p>${personalDescription}</p>` : ''}
    ${objective ? `<p>Scopul meu este să ${objective.toLowerCase()}, iar compania dumneavoastră mi se pare locul ideal pentru a-mi atinge acest obiectiv.</p>` : ''}
    ${whyCompany ? `<p>Ce m-a atras la compania <b>${company}</b> este: ${whyCompany}</p>` : ''}
    <p>Vă mulțumesc pentru timpul acordat și sper să discutăm mai multe în cadrul unui interviu.</p>
    <p>Toate cele bune,<br/><b>${name}</b></p>
  </div>
  <div style="background:#fff3e6;padding:20px;text-align:center;color:#333;border-top:1px solid #ccc">
    <p style="margin:0">${name}</p>
    <p style="margin:0">${email} • ${phone}</p>
  </div>
</div></body></html>`;
    }

    setGeneratedText(letter);
    setPreviewVisible(true);
  };

  const handleDownload = async () => {
    const html = `
    <html>
      <head>
        <style>
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { font-family: Arial; padding: 40px; line-height: 1.6; background: #ffffff; }
        </style>
      </head>
      <body>${generatedText}</body>
    </html>`;

    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Eroare', 'Partajarea nu este disponibilă pe acest dispozitiv.');
    }
  };

  const handleSaveToArchive = async () => {
    try {
      if (!generatedText.trim()) {
        Alert.alert('Eroare', 'Te rugăm să generezi mai întâi scrisoarea.');
        return;
      }

      const id = Date.now().toString();
      const today = new Date().toLocaleDateString('ro-RO');
      const item = {
        id,
        date: today,
        name: form.name,
        jobTitle: form.jobTitle,
        company: form.company,
        html: generatedText,
      };

      const existing = await AsyncStorage.getItem('coverLetters');
      const parsed = existing ? JSON.parse(existing) : [];
      parsed.unshift(item);

      await AsyncStorage.setItem('coverLetters', JSON.stringify(parsed));
      Alert.alert('Succes', 'Scrisoarea a fost salvată în arhivă.');
    } catch (error) {
      Alert.alert('Eroare', 'Nu s-a putut salva scrisoarea.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>✉️ Scrisoare de intenție</Text>

          {/* Selectare tonul scrisorii */}
          <View style={styles.switchRow}>
            <TouchableOpacity onPress={() => setTone('formala')} style={[styles.switchBtn, tone === 'formala' && styles.activeSwitch]}>
              <Text style={tone === 'formala' ? styles.activeText : styles.inactiveText}>Formală</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTone('moderna')} style={[styles.switchBtn, tone === 'moderna' && styles.activeSwitch]}>
              <Text style={tone === 'moderna' ? styles.activeText : styles.inactiveText}>Modernă</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Gen:</Text>
          <View style={styles.switchRow}>
            <TouchableOpacity
              onPress={() => setForm({ ...form, gender: 'feminin' })}
              style={[styles.switchBtn, form.gender === 'feminin' && styles.activeSwitch]}
            >
              <Text style={form.gender === 'feminin' ? styles.activeText : styles.inactiveText}>Femeie</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setForm({ ...form, gender: 'masculin' })}
              style={[styles.switchBtn, form.gender === 'masculin' && styles.activeSwitch]}
            >
              <Text style={form.gender === 'masculin' ? styles.activeText : styles.inactiveText}>Bărbat</Text>
            </TouchableOpacity>
          </View>
  
          <TextInput
            placeholder="Numele complet"
            value={form.name}
            onChangeText={(v) => setForm({ ...form, name: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Funcția dorită"
            value={form.jobTitle}
            onChangeText={(v) => setForm({ ...form, jobTitle: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Compania țintă"
            value={form.company}
            onChangeText={(v) => setForm({ ...form, company: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Cui te adresezi(nume)"
            value={form.contactName}
            onChangeText={(v) => setForm({ ...form, contactName: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Descriere personală"
            value={form.personalDescription}
            onChangeText={(v) => setForm({ ...form, personalDescription: v })}
            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
            multiline
          />
          <TextInput
            placeholder="Obiective profesionale"
            value={form.objective}
            onChangeText={(v) => setForm({ ...form, objective: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="De ce această companie?"
            value={form.whyCompany}
            onChangeText={(v) => setForm({ ...form, whyCompany: v })}
            style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
            multiline
          />
  
          <TextInput
            placeholder="Email"
            value={form.email}
            onChangeText={(v) => setForm({ ...form, email: v })}
            style={styles.input}
          />
          <TextInput
            placeholder="Telefon"
            value={form.phone}
            onChangeText={(v) => setForm({ ...form, phone: v })}
            style={styles.input}
            keyboardType="phone-pad"
          />
  

          <TouchableOpacity onPress={generateCoverLetter} style={styles.button}>
            <Text style={styles.buttonText}>📄 Generează scrisoarea</Text>
          </TouchableOpacity>

          {previewVisible && (
  <Modal visible={true} animationType="slide">
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 120 }}>
      <WebView originWhitelist={['*']} source={{ html: generatedText }} style={{ flex: 1, marginBottom: 20 }} />
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 6, marginBottom: 24 }}>
        
        <TouchableOpacity onPress={() => setPreviewVisible(false)} style={styles.backBtn}>
          <Text style={styles.backText}>⏪ Înapoi</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSaveToArchive} style={styles.saveBtn}>
          <Text style={styles.saveText}>💾 Salvează</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDownload} style={styles.downloadBtn}>
          <Text style={styles.downloadText}>⬇️ PDF</Text>
        </TouchableOpacity>

      </View>
    </View>
  </Modal>
)}

        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003399',
    marginBottom: 20,
  },
  label: {
    marginTop: 14,
    marginBottom: 6,
    fontWeight: 'bold',
    color: '#003399',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  switchBtn: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    padding: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeSwitch: {
    backgroundColor: '#003399',
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#333',
  },
  button: {
    backgroundColor: '#003399',
    padding: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  backBtn: {
    backgroundColor: '#FFEBEE', // roșu pastel (închis)
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  backText: {
    color: '#D32F2F', // roșu intens
    fontWeight: '600',
  },
  
  saveBtn: {
    backgroundColor: '#E6F4EA', // verde pastel
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  saveText: {
    color: '#2E7D32', // verde închis
    fontWeight: '600',
  },
  
  downloadBtn: {
    backgroundColor: '#FBE9E7', // bej deschis
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  downloadText: {
    color: '#6D4C41', // maro
    fontWeight: '600',
  },
  
});

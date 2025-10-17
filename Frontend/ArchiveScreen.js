//  Importuri esentiale pentru functionalitate, navigare, stiluri si utilitare
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { loadCVs, deleteCV } from './storage'; // functii de lucru cu AsyncStorage
import { WebView } from 'react-native-webview';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export default function ArchiveScreen() {
  const navigation = useNavigation();

  // State pentru lista CV-urilor si CV-ul selectat pentru preview
  const [cvList, setCvList] = useState([]);
  const [preview, setPreview] = useState(null);

  // Incarca automat CV-urile cand ecranul devine activ
  useEffect(() => {
    const fetch = async () => {
      const data = await loadCVs();
      setCvList(data);
    };
    const unsubscribe = navigation.addListener('focus', fetch);
    return unsubscribe;
  }, [navigation]);

  // Functie pentru a genera HTML-ul CV-ului in format Europass-like
  const generateHTML = (form) => {
    const safe = (v) => (v ? v : '');

    // Imaginea de profil (base64)
    const imageTag = form.photo
      ? `<img src="data:image/jpeg;base64,${form.photo}" width="140" height="140" style="border-radius:70px;margin-bottom:20px;object-fit:cover" />`
      : '';

    // Sectiunea educatie
    const educationHtml = form.educationList?.map((e) => `
      <div style="margin-bottom:20px;padding-left:10px;border-left:3px solid #003399">
        <p style="margin:0"><span style="color:#003399; font-weight:bold;">●</span> ${safe(e.dateFrom)} – ${safe(e.dateTo)}</p>
        <p style="margin:2px 0"><b>${safe(e.level)}</b> – ${safe(e.specialization)}</p>
        <p style="margin:2px 0">${safe(e.institution)}</p>
      </div>
    `).join('') || '';

    // Sectiunea experienta profesionala
    const experienceHtml = form.experienceList?.map((e) => `
      <div style="margin-bottom:20px;padding-left:10px;border-left:3px solid #003399">
        <p style="margin:0"><span style="color:#003399; font-weight:bold;">●</span> ${safe(e.dateFrom)} – ${safe(e.dateTo)} (${safe(e.location)})</p>
        <p style="margin:2px 0"><b>${safe(e.position)}</b> la ${safe(e.company)}</p>
        <p style="margin:2px 0">${safe(e.responsibilities)}</p>
      </div>
    `).join('') || '';

    // Competente lingvistice
    const languageHtml = form.languageTable?.map(lang => `
      <tr>
        <td>${safe(lang.name)}</td>
        <td>${safe(lang.listen)}</td>
        <td>${safe(lang.read)}</td>
        <td>${safe(lang.speak)}</td>
        <td>${safe(lang.write)}</td>
      </tr>
    `).join('') || '';

    // Competente digitale
    const digitalSkillsHtml = form.selectedSkills?.map(skill => `<li>${safe(skill)}</li>`).join('') || '';

    // HTML complet final
    return `
    <html>
    <head>
      <style>
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background: #ffffff;
        }
        .sidebar {
          background: #003399;
          width: 30%;
          padding: 20px;
          color: #ffffff;
          text-align: center;
        }
        .content {
          width: 70%;
          padding: 30px;
        }
      </style>
    </head>
    <body>
      <div style="display:flex;min-height:100vh">
        <div class="sidebar">
          ${imageTag}
          <h2>${safe(form.name)}</h2>
          <hr style="border:0;height:1px;background:#ffffff;margin:10px 0" />
          <p><b>Data nașterii:</b><br/>${safe(form.dob)}</p>
          <p><b>Gen:</b><br/>${safe(form.gender)}</p>
          <p><b>Naționalitate:</b><br/>${safe(form.nationality)}</p>
          <p><b>Telefon:</b><br/>${safe(form.phone)}</p>
          <p><b>Email:</b><br/>${safe(form.email)}</p>
          <p><b>LinkedIn:</b><br/>${safe(form.linkedin)}</p>
          <p><b>Adresă:</b><br/>${safe(form.address)}</p>
        </div>
        <div class="content">
          <h3 style="color:#003399">DESPRE MINE</h3>
          <p>${safe(form.about)}</p>

          <h3 style="color:#003399">DOMENIU VIZAT</h3>
          <p><b>Funcție dorită:</b> ${safe(form.jobTitle)}</p>
          <p><b>Domeniu:</b> ${safe(form.workDomain)}</p>
          <p><b>Tip job:</b> ${safe(form.jobType)}</p>
          <p><b>Disponibilitate:</b> ${safe(form.availability)}</p>
          <p><b>Obiectiv profesional:</b> ${safe(form.objective)}</p>

          <h3 style="color:#003399">EDUCAȚIE ȘI FORMARE</h3>
          ${educationHtml}

          <h3 style="color:#003399">EXPERIENȚĂ PROFESIONALĂ</h3>
          ${experienceHtml}

          <h3 style="color:#003399">COMPETENȚE LINGVISTICE</h3>
          <p><b>Limba maternă:</b> ${safe(form.nativeLanguage)}</p>
          <table border="1" style="font-size:12px;border-collapse:collapse;width:100%;margin-bottom:30px">
            <tr style="background:#e6e6e6">
              <th>Limbă</th>
              <th>Ascultare</th>
              <th>Citire</th>
              <th>Vorbire</th>
              <th>Scriere</th>
            </tr>
            ${languageHtml}
          </table>

          <h3 style="color:#003399">COMPETENȚE DIGITALE</h3>
          <ul>${digitalSkillsHtml}</ul>

          <h3 style="color:#003399">COMUNICARE</h3>
          <p>${safe(form.communication)}</p>

          <h3 style="color:#003399">CERTIFICĂRI</h3>
          <p>${safe(form.certifications)}</p>

          <h3 style="color:#003399">PROIECTE</h3>
          <p>${safe(form.projectDescription) || '<span style="color:#888">Fără descriere</span>'}</p>
          ${form.projectLink ? `<p><b>Link proiect:</b> <a href="${form.projectLink}">${form.projectLink}</a></p>` : ''}
        </div>
      </div>
    </body>
    </html>
    `;
  };

  // Genereaza PDF si incearca sa-l partajeze
  const handleDownload = async (item) => {
    const html = generateHTML(item.data);
    const { uri } = await Print.printToFileAsync({ html });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Eroare', 'Partajarea nu este disponibilă pe acest dispozitiv.');
    }
  };

  // Sterge un CV dupa confirmare
  const handleDelete = async (id) => {
    Alert.alert('Confirmare', 'Ștergi acest CV?', [
      { text: 'Anulează', style: 'cancel' },
      {
        text: 'Șterge',
        style: 'destructive',
        onPress: async () => {
          await deleteCV(id);
          const data = await loadCVs();
          setCvList(data);
        }
      }
    ]);
  };

  // Vizualizare PDF WebView sau lista CV-uri
  return preview ? (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => setPreview(null)} style={{ marginTop: 60, marginLeft: 20 }}>
        <Text style={{ color: '#003399' }}>← Înapoi la arhivă</Text>
      </TouchableOpacity>
      <WebView originWhitelist={['*']} source={{ html: generateHTML(preview.data) }} style={{ flex: 1 }} />
      <TouchableOpacity onPress={() => handleDownload(preview)} style={styles.downloadButton}>
        <Text style={styles.downloadButtonText}>⬇️ Descarcă PDF</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={styles.title}>📂 Arhivă CV-uri</Text>
      {cvList.length === 0 ? (
        <Text style={{ marginTop: 20 }}>Nu există CV-uri salvate.</Text>
      ) : (
        <FlatList
          data={cvList}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.name}>{item.data.name || 'Fără nume'}</Text>
                <Text style={styles.job}>{item.data.jobTitle || 'Fără funcție'}</Text>
                <Text style={styles.email}>{item.data.email || 'Fără email'}</Text>
              </View>
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


const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003399',
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
    color: '#003399',
  },
  job: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#555',
  },
  email: {
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
    backgroundColor: '#e6f0ff',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#003399',
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
    backgroundColor: '#003399',
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
    backgroundColor: '#d9f2e6', // culoare deschisă verde
  },
  
});

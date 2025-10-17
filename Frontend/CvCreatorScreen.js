//  CvCreatorScreen.js – Pagina principală pentru completare CV Europass

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { saveCV } from './storage';
import { Picker } from '@react-native-picker/picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as ImagePicker from 'expo-image-picker';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback } from 'react-native';

export default function CvCreatorScreen() {
  const navigation = useNavigation();

  const handleSaveCV = async () => {
    try {
      await saveCV(form);
      alert('✅ CV-ul a fost salvat cu succes în arhivă!');
    } catch (e) {
      alert('❌ Eroare la salvarea CV-ului');
      console.error(e);
    }
  };
  
  // STATE GENERAL: formularul și pașii
  const [step, setStep] = useState(0); // pasul curent
  const [form, setForm] = useState({
    name: '', dob: '', nationality: '',nativeLanguage: '', gender: '', address: '', phone: '', email: '', linkedin: '',
    about: '', jobTitle: '', workDomain: '', jobType: '', availability: '', objective: '',
    skills: '', certifications: '',projectDescription: '',projectLink: '', communication: '', photo: '',selectedSkills: [],
  });
  const [jobTypeModalVisible, setJobTypeModalVisible] = useState(false);
const [availabilityModalVisible, setAvailabilityModalVisible] = useState(false);

  

  //  EDUCATIE si LIMBI STRAINE – liste dinamice
  const [educationList, setEducationList] = useState([
    {
      level: '',
      institution: '',
      specialization: '',
      dateFrom: '',
      dateTo: '',
    }
  ]);
  const [experienceList, setExperienceList] = useState([
    {
      position: '',
      company: '',
      location: '',
      dateFrom: '',
      dateTo: '',
      responsibilities: '',
    }
  ]);
  
  const [languageTable, setLanguageTable] = useState([
    { name: '', listen: '', read: '', speak: '', write: '' },
  ]);
  const digitalSkillsOptions = [
    'Microsoft Word',
    'Microsoft Excel',
    'PowerPoint',
    'Google Docs / Drive',
    'HTML / CSS',
    'JavaScript',
    'Git / GitHub',
    'VS Code',
    'Canva',
    'Figma',
  ];
  
  const [previewVisible, setPreviewVisible] = useState(false); // control pentru vizualizarea modalului

  //  FUNCTII DE UPDATE PENTRU FORMULAR
  const handleChange = (field, value) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const updateLang = (index, field, value) => {
    const updated = [...languageTable];
    updated[index][field] = value;
    setLanguageTable(updated);
  };

  const addLanguage = () => {
    setLanguageTable([...languageTable, { name: '', listen: '', read: '', speak: '', write: '' }]);
  };

  const updateEducation = (index, field, value) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  const addEducation = () => {
    setEducationList([...educationList, { dateFrom: '', dateTo: '', degree: '', institution: '', location: '', subjects: '' }]);
  };
  const removeEducation = (index) => {
    const updated = [...educationList];
    updated.splice(index, 1); // elimina elementul la pozitia data
    setEducationList(updated);
  };
  
  const updateExperience = (index, field, value) => {
    const updated = [...experienceList];
    updated[index][field] = value;
    setExperienceList(updated);
  };
  
  const addExperience = () => {
    setExperienceList([
      ...experienceList,
      {
        position: '',
        company: '',
        location: '',
        dateFrom: '',
        dateTo: '',
        responsibilities: '',
      },
    ]);
  };
  
  const removeExperience = (index) => {
    if (experienceList.length === 1) return;
    const updated = [...experienceList];
    updated.splice(index, 1);
    setExperienceList(updated);
  };
    

  // FOTO – selectare din galerie
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });
    if (!result.canceled)
      setForm(prev => ({ ...prev, photo: result.assets[0].base64 }));
  };

  //  GENERARE HTML PENTRU PREVIEW ȘI PDF
  const generateHTML = () => {
    const safe = (v) => (v ? v : '');
  
    const imageTag = form.photo
      ? `<img src="data:image/jpeg;base64,${form.photo}" width="140" height="140" style="border-radius:70px;margin-bottom:20px;object-fit:cover" />`
      : '';
  
    const educationHtml = educationList.map((e) => `
      <div style="margin-bottom:20px;padding-left:10px;border-left:3px solid #003399">
        <p style="margin:0"><span style="color:#003399; font-weight:bold;">●</span> ${safe(e.dateFrom)} – ${safe(e.dateTo)}</p>
        <p style="margin:2px 0"><b>${safe(e.level)}</b> – ${safe(e.specialization)}</p>
        <p style="margin:2px 0">${safe(e.institution)}</p>
      </div>
    `).join('');
  
    const experienceHtml = experienceList.map((e) => `
      <div style="margin-bottom:20px;padding-left:10px;border-left:3px solid #003399">
        <p style="margin:0"><span style="color:#003399; font-weight:bold;">●</span> ${safe(e.dateFrom)} – ${safe(e.dateTo)} (${safe(e.location)})</p>
        <p style="margin:2px 0"><b>${safe(e.position)}</b> la ${safe(e.company)}</p>
        <p style="margin:2px 0">${safe(e.responsibilities)}</p>
      </div>
    `).join('');
  
    const languageHtml = languageTable.map(lang => `
      <tr>
        <td>${safe(lang.name)}</td>
        <td>${safe(lang.listen)}</td>
        <td>${safe(lang.read)}</td>
        <td>${safe(lang.speak)}</td>
        <td>${safe(lang.write)}</td>
      </tr>
    `).join('');
  
    const digitalSkillsHtml = form.selectedSkills.map(skill => `<li>${safe(skill)}</li>`).join('');
  
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
                <ul style="margin-bottom:30px">
                  ${digitalSkillsHtml}
                </ul>

                <h3 style="color:#003399">COMUNICARE</h3>
                <p>${safe(form.communication)}</p>

                <h3 style="color:#003399">CERTIFICĂRI</h3>
                <p>${safe(form.certifications)}</p>

                <h3 style="color:#003399">PROIECTE</h3>
                <p>${safe(form.projectDescription) || '<span style="color:#888">Fără descriere</span>'}</p>
                ${form.projectLink ? `<p><b>Link proiect:</b> <a href="${form.projectLink}" style="color:#003399;text-decoration:underline">${form.projectLink}</a></p>` : ''}
              </div>
            </div>
          </body>
        </html>
`;  };    

  //  GENERARE PDF + SHARING
  const handleGenerate = async () => {
    const html = generateHTML();
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  // FUNCTIE CARE REDA FORMULARUL PAS CU PAS
  const renderStep = () => {
    switch (step) {
      case 0:
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>📋 Informații personale</Text>

      <View style={styles.photoContainer}>
  <TouchableOpacity onPress={pickImage} style={styles.photoCircle}>
    {form.photo ? (
      <Image
        source={{ uri: `data:image/jpeg;base64,${form.photo}` }}
        style={styles.photoImage}
      />
    ) : (
      <Text style={styles.photoText}>Încarcați fotografia</Text>
    )}
  </TouchableOpacity>
</View>


      {/* Fiecare input este legat de state */}
      <TextInput
        placeholder="Nume complet"
        value={form.name}
        onChangeText={(v) => handleChange('name', v)}
        style={styles.input}
      />

      <TextInput
        placeholder="Despre mine"
        value={form.about}
        onChangeText={(v) => handleChange('about', v)}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <TextInput
        placeholder="Data nașterii (ex: dd/mm/yy )"
        value={form.dob}
        onChangeText={(v) => handleChange('dob', v)}
        style={styles.input}
      />

      <TextInput
        placeholder="Naționalitate"
        value={form.nationality}
        onChangeText={(v) => handleChange('nationality', v)}
        style={styles.input}
      />

      {/* Sex */}
      <Picker
        selectedValue={form.gender}
        onValueChange={(v) => handleChange('gender', v)}
        style={styles.picker}
      >
        <Picker.Item label="Selectează sexul" value="" />
        <Picker.Item label="Feminin" value="Feminin" />
        <Picker.Item label="Masculin" value="Masculin" />
        <Picker.Item label="Altul" value="Altul" />
      </Picker>

      <TextInput
        placeholder="Adresă"
        value={form.address}
        onChangeText={(v) => handleChange('address', v)}
        style={styles.input}
      />

      <TextInput
        placeholder="Telefon"
        value={form.phone}
        onChangeText={(v) => handleChange('phone', v)}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={form.email}
        onChangeText={(v) => handleChange('email', v)}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="LinkedIn"
        value={form.linkedin}
        onChangeText={(v) => handleChange('linkedin', v)}
        style={styles.input}
        autoCapitalize="none"
      />
    </View>

        );
        case 1:
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>🎯 Domeniu vizat</Text>

      <View style={styles.cardCompact}>
        <TextInput
          placeholder="Funcția dorită (ex: Junior Developer)"
          value={form.jobTitle}
          onChangeText={(v) => handleChange('jobTitle', v)}
          style={styles.inputCompact}
        />

        <TextInput
          placeholder="Domeniu (ex: IT, Educație, Finanțe)"
          value={form.workDomain}
          onChangeText={(v) => handleChange('workDomain', v)}
          style={styles.inputCompact}
        />

        {/* Dropdown Tip job */}
        <TouchableOpacity onPress={() => setJobTypeModalVisible(true)} style={styles.dropdownBtn}>
          <Text style={styles.dropdownText}>{form.jobType || 'Tip job dorit'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setAvailabilityModalVisible(true)} style={styles.dropdownBtn}>
          <Text style={styles.dropdownText}>{form.availability || 'Disponibilitate'}</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Scurt obiectiv profesional"
          value={form.objective}
          onChangeText={(v) => handleChange('objective', v)}
          style={[styles.inputCompact, { height: 60 }]}
          multiline
        />
      </View>

      {/* Modal pentru Tip job */}
      <Modal visible={jobTypeModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {['Full-time', 'Part-time', 'Internship', 'Freelance / Proiect'].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  handleChange('jobType', item);
                  setJobTypeModalVisible(false);
                }}
                style={styles.modalItem}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setJobTypeModalVisible(false)}>
              <Text style={styles.closeModal}>Anulează</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal pentru Disponibilitate */}
      <Modal visible={availabilityModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {['Local', 'Remote', 'Relocare', 'Hibrid'].map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => {
                  handleChange('availability', item);
                  setAvailabilityModalVisible(false);
                }}
                style={styles.modalItem}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setAvailabilityModalVisible(false)}>
              <Text style={styles.closeModal}>Anulează</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );


        
          case 2:
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>🎓 Educație & Formare</Text>

      {educationList.map((entry, i) => (
        <View
          key={`edu-${i}`}
          style={{
            marginBottom: 20,
            padding: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 6,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Nivel de studii #{i + 1}
          </Text>

          <TextInput
            placeholder="Nivel (ex: Liceu, Licență, Masterat)"
            value={entry.level}
            onChangeText={(v) => updateEducation(i, 'level', v)}
            style={styles.input}
          />

          <TextInput
            placeholder="Numele instituției"
            value={entry.institution}
            onChangeText={(v) => updateEducation(i, 'institution', v)}
            style={styles.input}
          />

          <TextInput
            placeholder="Specializarea"
            value={entry.specialization}
            onChangeText={(v) => updateEducation(i, 'specialization', v)}
            style={styles.input}
          />

          <TextInput
            placeholder="Data început (ex: 2019)"
            value={entry.dateFrom}
            onChangeText={(v) => updateEducation(i, 'dateFrom', v)}
            style={styles.input}
          />

          <TextInput
            placeholder="Data finalizare (ex: 2023)"
            value={entry.dateTo}
            onChangeText={(v) => updateEducation(i, 'dateTo', v)}
            style={styles.input}
          />

          {/*  Buton de stergere, doar daca exista mai mult de 1 */}
          {educationList.length > 1 && (
            <TouchableOpacity
              onPress={() => removeEducation(i)}
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#ffdddd',
                paddingVertical: 6,
                paddingHorizontal: 10,
                borderRadius: 4,
                marginTop: 6,
              }}
            >
              <Text style={{ color: '#cc0000', fontWeight: 'bold' }}>🗑️ Șterge</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity onPress={addEducation}>
        <Text style={styles.link}>➕ Adaugă nivel de studii</Text>
      </TouchableOpacity>
    </View>
  );

  case 3:
  return (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>💼 Experiență profesională</Text>

      {experienceList.map((entry, i) => (
        <View key={`exp-${i}`} style={{
          marginBottom: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 6,
          backgroundColor: '#f9f9f9',
        }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Loc de muncă #{i + 1}
          </Text>

          <TextInput
            placeholder="Poziție ocupată"
            value={entry.position}
            onChangeText={(v) => updateExperience(i, 'position', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Companie"
            value={entry.company}
            onChangeText={(v) => updateExperience(i, 'company', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Locație"
            value={entry.location}
            onChangeText={(v) => updateExperience(i, 'location', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Data început"
            value={entry.dateFrom}
            onChangeText={(v) => updateExperience(i, 'dateFrom', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Data finalizare"
            value={entry.dateTo}
            onChangeText={(v) => updateExperience(i, 'dateTo', v)}
            style={styles.input}
          />
          <TextInput
            placeholder="Responsabilități"
            value={entry.responsibilities}
            onChangeText={(v) => updateExperience(i, 'responsibilities', v)}
            style={styles.input}
            multiline
          />
          {experienceList.length > 1 && (
            <TouchableOpacity onPress={() => removeExperience(i)} style={styles.deleteBtn}>
            <Text style={styles.deleteText}>🗑️ Șterge</Text>
            </TouchableOpacity>
          )}
          </View>
      ))}

      <TouchableOpacity onPress={addExperience}>
        <Text style={styles.link}>➕ Adaugă experiență</Text>
      </TouchableOpacity>
    </View>
  );

          
  case 4:
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>🌍 Limbi străine</Text>
  
        {/* Limbă maternă */}
        <Text style={{ marginBottom: 6, fontWeight: 'bold', color: '#003399' }}>Limba maternă</Text>
        <TextInput
          placeholder="Ex: Română"
          value={form.nativeLanguage}
          onChangeText={(v) => handleChange('nativeLanguage', v)}
          style={styles.input}
        />
  
        {/* Alte limbi */}
        <Text style={{ marginTop: 20, marginBottom: 6, fontWeight: 'bold', color: '#003399' }}>Alte limbi cunoscute</Text>
        {languageTable.map((lang, i) => (
          <View key={`lang-${i}`} style={styles.langRow}>
            <TextInput
              placeholder="Limbă"
              value={lang.name}
              onChangeText={(v) => updateLang(i, 'name', v)}
              style={styles.input}
            />
            {['listen', 'read', 'speak', 'write'].map((skill) => (
              <Picker
                key={`${i}-${skill}`}
                selectedValue={lang[skill]}
                onValueChange={(v) => updateLang(i, skill, v)}
                style={styles.picker}
              >
                <Picker.Item label={`Nivel ${skill}`} value="" />
                <Picker.Item label="A1" value="A1" />
                <Picker.Item label="A2" value="A2" />
                <Picker.Item label="B1" value="B1" />
                <Picker.Item label="B2" value="B2" />
                <Picker.Item label="C1" value="C1" />
                <Picker.Item label="C2" value="C2" />
              </Picker>
            ))}
          </View>
        ))}
  
        <TouchableOpacity onPress={addLanguage}>
          <Text style={styles.link}>➕ Adaugă limbă</Text>
        </TouchableOpacity>
      </View>
    );
  
    case 5:
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>🧠 Competențe & proiecte</Text>
    
          {/* Competențe digitale */}
          <Text style={{ fontWeight: 'bold', marginBottom: 6 }}> Competențe digitale</Text>
<View style={{ marginBottom: 16 }}>
  {digitalSkillsOptions.map((skill) => (
    <TouchableOpacity
      key={skill}
      onPress={() => {
        const exists = form.selectedSkills.includes(skill);
        const updated = exists
          ? form.selectedSkills.filter((s) => s !== skill)
          : [...form.selectedSkills, skill];
        handleChange('selectedSkills', updated);
      }}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      }}
    >
      <View style={{
        width: 20,
        height: 20,
        marginRight: 10,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#003399',
        backgroundColor: form.selectedSkills.includes(skill) ? '#003399' : '#fff',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {form.selectedSkills.includes(skill) && (
          <Text style={{ color: '#fff', fontSize: 12 }}>✓</Text>
        )}
      </View>
      <Text>{skill}</Text>
    </TouchableOpacity>
  ))}
</View>
    
          {/* Abilitati de comunicare */}
          <Text style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 4 }}> Comunicare</Text>
          <TextInput
            placeholder="Ex: Prezentare clară, lucru în echipă, negociere, leadership"
            value={form.communication}
            onChangeText={(v) => handleChange('communication', v)}
            style={styles.input}
          />
    
          {/* Certificări */}
          <Text style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 4 }}> Certificări</Text>
          <TextInput
            placeholder="Ex: ECDL, Google Digital Garage, Cisco, Coursera, etc."
            value={form.certifications}
            onChangeText={(v) => handleChange('certifications', v)}
            style={styles.input}
          />
    
          {/* Proiecte personale */}
          <Text style={{ fontWeight: 'bold', marginTop: 16, marginBottom: 4 }}> Descriere proiect personal</Text>
          <TextInput
            placeholder="Ex: Am dezvoltat o aplicație mobilă pentru planificare financiară..."
            value={form.projectDescription}
            onChangeText={(v) => handleChange('projectDescription', v)}
            style={[styles.input, { minHeight: 60 }]}
            multiline
          />
    
          <Text style={{ fontWeight: 'bold', marginTop: 10, marginBottom: 4 }}>Link către proiect (GitHub / demo)</Text>
          <TextInput
            placeholder="https://github.com/utilizator/proiect"
            value={form.projectLink}
            onChangeText={(v) => handleChange('projectLink', v)}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="url"
          />


  <TouchableOpacity onPress={handleSaveCV} style={styles.navButton}>
    <Text style={styles.navButtonText}>💾 Salvează acest CV</Text>
  </TouchableOpacity>

        </View>
      );
     
      default:
        return null;
    }
  };

  // UI PRINCIPAL
  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {renderStep()}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 30 }}>
              {step > 0 && (
                <TouchableOpacity onPress={() => setStep(step - 1)} style={styles.navButton}>
                  <Text style={styles.navButtonText}>← Înapoi</Text>
                </TouchableOpacity>
              )}
              {step < 5 ? (
                <TouchableOpacity onPress={() => setStep(step + 1)} style={styles.navButton}>
                  <Text style={styles.navButtonText}>Pasul următor →</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => setPreviewVisible(true)} style={styles.navButton}>
                  <Text style={styles.navButtonText}>👁️ Previzualizează CV</Text>
                </TouchableOpacity>
              )}
            </View>
    
            {/* MODAL PREVIEW CV */}
            <Modal visible={previewVisible} animationType="slide">
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => setPreviewVisible(false)} style={{ marginTop: 80, marginLeft: 20 }}>
                  <Text style={{ fontSize: 16, color: '#003399' }}>← Înapoi la editare CV</Text>
                </TouchableOpacity>
                <WebView originWhitelist={['*']} source={{ html: generateHTML() }} style={{ flex: 1 }} />
                <TouchableOpacity onPress={handleGenerate} style={[styles.navButton, { margin: 10 }]}>
                  <Text style={styles.navButtonText}>💾 Generează CV PDF</Text>
                </TouchableOpacity>
              </View>
            </Modal>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
}

// STILIZARE
const styles = StyleSheet.create({
  input: { backgroundColor: '#fff', marginVertical: 6, padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#ccc' },

  stepTitle: { fontSize: 18, fontWeight: 'bold', color: '#003399', marginBottom: 10 },

  navButton: { backgroundColor: '#003399', padding: 14, borderRadius: 6, alignItems: 'center', marginTop: 10 },

  navButtonText: { color: '#fff', fontWeight: 'bold' },

  picker: { backgroundColor: '#f0f0f0', marginVertical: 4 },

  langRow: { marginBottom: 20 },

  link: { color: '#003399', fontSize: 14, marginBottom: 10 },

  stepContainer: { marginBottom: 40 },

  deleteBtn: {alignSelf: 'flex-end',backgroundColor: '#ffdddd',paddingVertical: 6,paddingHorizontal: 10,borderRadius: 4,marginTop: 6,},

  deleteText: { color: '#cc0000', fontWeight: 'bold' },

  cardCompact: { marginBottom: 20, padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, backgroundColor: '#f5f5f5', gap: 8 },

  inputCompact: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 10, borderRadius: 6, borderWidth: 1, borderColor: '#ccc', fontSize: 14 },

  dropdownBtn: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 10, marginVertical: 6, backgroundColor: '#fff' },

  dropdownText: { fontSize: 14, color: '#333' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },

  modalContent: { width: '80%', backgroundColor: '#fff', borderRadius: 10, padding: 20 },

  modalItem: { paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' },

  closeModal: { marginTop: 10, textAlign: 'center', color: '#003399', fontWeight: 'bold' },

  previewPhoto: { width: 100, height: 100, borderRadius: 50, alignSelf: 'center', marginVertical: 10, borderWidth: 2, borderColor: '#003399' },

  photoContainer: { alignItems: 'center', marginVertical: 20 },

  photoCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 2, borderColor: '#003399' },

  photoImage: { width: '100%', height: '100%', resizeMode: 'cover' },

  photoText: { color: '#003399', fontSize: 14, textAlign: 'center', whiteSpace: 'pre-line' },
});
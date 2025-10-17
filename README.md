# Aplicație mobilă pentru sprijinul dezvoltării carierei studenților
## Scopul proiectului

Această aplicație mobilă a fost dezvoltată ca parte a lucrării de licență la specializarea Informatica.  
Scopul proiectului este de a oferi studenților un instrument complet pentru dezvoltarea carierei, care integrează funcționalități de generare CV-uri, redactare automată a scrisorilor de intenție, recomandări de joburi prin API extern și pregătire pentru interviuri asistată de AI.

## Arhitectura aplicației

Aplicația este dezvoltată în **React Native (Expo)** pentru partea de client și utilizează un **backend Node.js + Express**, conectat la o bază de date **MongoDB Atlas**.

Structura principală:
- **Frontend:** /Frontend – conține ecranele (Login, Home, Profile, CV Creator etc.)
- **Backend:** /Backend – conține modelele, rutele și logica API-ului
- **Bază de date:** MongoDB Atlas (colecția `myapp.users`)

## Funcționalități principale

- Autentificare și profil utilizator (cu salvarea datelor în MongoDB)
- Generare CV (cu preview și export PDF)
- Generare automată a scrisorii de intenție (personalizată după gen)
- Recomandări de joburi prin API-ul Adzuna
- Chatbot AI pentru pregătirea la interviu
- Arhivare pentru CV-uri și scrisori de intenție

## Tehnologii utilizate

- React Native (Expo)
- Node.js + Express
- MongoDB Atlas
- React Navigation
- PDF-Lib (pentru generarea PDF-urilor)
- Adzuna API (recomandări joburi)

## Licență

Acest proiect a fost realizat ca parte a **lucrării de licență** la Universitatea de Vest din Timișoara, Facultatea de matematicǎ și informaticǎ, specializarea **Informaticǎ**.

Autor: Muntean Lavinia-Maria 


Anul universitar: 2024–2025



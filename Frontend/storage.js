import AsyncStorage from '@react-native-async-storage/async-storage';


// Functie pentru salvarea unui CV nou in lista locala
export const saveCV = async (form) => {
  try {
    // Se incearca obtinerea listei existente de CV-uri
    const all = await AsyncStorage.getItem('cv_list');
    
    // Daca exista, se parseaza; altfel, se initializeaza o lista goala
    const list = all ? JSON.parse(all) : [];
    
    // Se adauga un nou CV cu un id unic (timestamp)
    list.push({ id: Date.now(), data: form });
    
    // Se salveaza lista actualizata inapoi in storage
    await AsyncStorage.setItem('cv_list', JSON.stringify(list));
  } catch (e) {
    console.error('Eroare la salvare CV:', e);
  }
};


// Functie pentru incarcarea tuturor CV-urilor din storage
export const loadCVs = async () => {
  try {
    // Se preia lista din storage si se parseaza
    const all = await AsyncStorage.getItem('cv_list');
    return all ? JSON.parse(all) : [];
  } catch (e) {
    console.error('Eroare la incarcare CV-uri:', e);
    return [];
  }
};


// Functie pentru stergerea unui CV dupa id
export const deleteCV = async (id) => {
  // Se incarca toate CV-urile existente
  const all = await loadCVs();

  // Se filtreaza lista, eliminand CV-ul cu id-ul dat
  const filtered = all.filter((item) => item.id !== id);

  // Se salveaza lista actualizata fara acel CV
  await AsyncStorage.setItem('cv_list', JSON.stringify(filtered));
};

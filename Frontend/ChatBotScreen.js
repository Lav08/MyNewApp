// Importuri necesare pentru UI, animatii, tastatura si networking
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  SafeAreaView,
  Keyboard,
  ScrollView,
} from 'react-native';

// URL-ul API-ului local Ollama (pentru generare de raspunsuri AI)
const OLLAMA_API_URL = 'http://192.168.1.2:11434/api/generate';

export default function ChatBotScreen() {
  // State pentru lista de mesaje si inputul curent al utilizatorului
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Animatie fade-in pentru header
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Referinta pentru scroll automat catre ultimul mesaj
  const flatListRef = useRef(null);

  // Porneste animatia la montarea ecranului
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Trimite mesajul catre Ollama si afiseaza raspunsul AI-ului
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    Keyboard.dismiss();

    try {
      const response = await fetch(OLLAMA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama2',
          prompt: `Interviu AI: ${input}`,
          stream: false,
        }),
      });

      const data = await response.json();
      console.log('📦 Răspuns primit de la Ollama:', data);

      if (data.error) throw new Error(data.error);

      const botReply = data.response || 'Răspuns indisponibil.';
      setMessages((prev) => [...prev, { text: botReply.trim(), sender: 'bot' }]);

      // Scroll la ultimul mesaj dupa ce AI raspunde
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 300);
    } catch (error) {
      console.error('❌ Eroare la conectarea cu Ollama:', error.message);
      setMessages((prev) => [...prev, { text: `Eroare: ${error.message}`, sender: 'bot' }]);
    }
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={styles.container}>
          {/* Header cu logo si titlu, cu animatie */}
          <Animated.View style={[styles.chatHeader, { opacity: fadeAnim }]}> 
            <Image source={require('../assets/images/logo1.png')} style={styles.logo} />
            <Text style={styles.chatHeaderText}>Discuție cu AI-ul pentru interviuri</Text>
          </Animated.View>

          {/* Zona principala de chat */}
          <View style={styles.chatBox}>
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginVertical: 4,
                    alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                  }}
                >
                  {/* Avatar AI */}
                  {item.sender === 'bot' && (
                    <Image source={require('../assets/images/logo1.png')} style={styles.avatar} />
                  )}
                  {/* Mesaj vizual */}
                  <View style={[styles.message, item.sender === 'user' ? styles.user : styles.bot]}>
                    <Text style={styles.messageText}>{item.text}</Text>
                  </View>
                  {/* Avatar utilizator */}
                  {item.sender === 'user' && (
                    <Image source={require('../assets/images/userNS.png')} style={styles.avatar} />
                  )}
                </View>
              )}
              contentContainerStyle={{ padding: 16, flexGrow: 1, justifyContent: 'flex-end' }}
            />

            {/*  Zona de input si trimitere mesaj */}
            <View style={styles.inputWrapper}>
              <TextInput
                value={input}
                onChangeText={setInput}
                style={styles.input}
                placeholder="Întrreabă ceva pentru interviu..."
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
                <Text style={styles.sendText}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#E4D1C0',
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    alignItems: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#7C4A33',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    marginTop: 16,
    width: '95%',
  },
  logo: {
    width: 28,
    height: 28,
    marginRight: 8,
    borderRadius: 6,
  },
  chatHeaderText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  chatBox: {
    width: '95%',
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 3,
    shadowRadius: 6,
    elevation: 2,
  },
  message: {
    padding: 12,
    borderRadius: 18,
    marginVertical: 6,
    position: 'relative',
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderTopRightRadius: 0,
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#F1F0F0',
    borderTopLeftRadius: 0,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginHorizontal: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 0,
  },
  sendButton: {
    backgroundColor: '#7C4A33',
    borderRadius: 50,
    padding: 14,
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
